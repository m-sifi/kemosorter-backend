const JapariLibrary = require('./japari-library');
const Category = require('./models/category');
const Character = require('./models/character');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const similarity = require('string-similarity');
const parseInfo  = require('infobox-parser');
const _ = require('underscore');

function chunk (arr, len) {
    var chunks = [],
        i = 0,
        n = arr.length;
  
    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    }
  
    return chunks;
}

async function retriveNexonGameFriends() {
    let response = await JapariLibrary.request({
        action: 'query',
        list: 'categorymembers',
        cmtitle: 'Category: Nexon Game Friends',
        cmlimit: 500,

        format: 'json',
        formatversion: 2
    });
    let chunks = chunk(response.query.categorymembers, 50);
    let promises = [];
    let results;

    _.each(chunks, chunk => {
        promises.push(
            JapariLibrary.request({
                action: 'query',
                pageids: chunk.map(page => page['pageid']).join('|'),
                prop: 'revisions',
                rvprop: 'content',

                format: 'json',
                formatversion: 2
            })
        );
    });

    response = await Promise.all(promises);
    response = [].concat
                .apply([], response)
                .map(resp => resp.query.pages);
    response = [].concat.apply([], response);
    results = response.map(page => {
        let revision = page.revisions[0].content;
        let parsedRevision = parseInfo(revision);

        return {
            id: revision.match(/[0-9]{5}/)[0],
            name: page.title,
            translation: parsedRevision.general.envoice1
        }
    });

    chunks = chunk( results.map(info => `File:${info.id}_0010.ogg`), 50);
    promises = [];

    _.each(chunks, chunk => {
        promises.push(
            JapariLibrary.request({
                action: 'query',
                titles: chunk.join('|'),
                prop: 'imageinfo',
                iiprop: 'url',

                format: 'json',
                formatversion: 2
            })
        );
    });

    response = await Promise.all(promises);
    response = [].concat
        .apply([], response)
        .map(resp => resp.query.pages);
    response = [].concat.apply([], response);

    for(var i = 0; i < results.length; i++) {
        let result = results[i];
        let tmp = _.find(response, resp => resp.title.includes(result.id));
        result.audio = tmp.imageinfo[0].url;
        delete(result.id);
    };
    return results;
}

async function main() {
    dotenv.config();
    console.log('Begining Sync from with Japari Wiki..');
    console.log('Connecting to database..');
    await mongoose.connect(process.env.DATABASE_URL);

    const category = await Category.findOne({ name: 'Nexon Game Friends' });
    const characters = await Character.find({ categories: category });

    console.log('Retrieving data from Japari Wiki..');
    const wiki = await retriveNexonGameFriends();
    const wikiIndex = wiki.map(char => char.name);

    console.log('Updaing Characters');
    for(var i = 0; i < characters.length; i++) {
        let character = characters[i];
        let introduction = _.find(wiki, char => char.name == similarity.findBestMatch(character.name, wikiIndex).bestMatch.target);
        
        console.log(`Update Progress: ${((i + 1) / characters.length) * 100}% ${i + 1}/${characters.length} (${character.name})`);
        await Character.findByIdAndUpdate(character._id, { introduction: introduction });
    }
}

main()
.catch(console.error)
.then(process.exit);