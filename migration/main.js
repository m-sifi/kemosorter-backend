const Category = require("../app/models/category");
const Character = require("../app/models/character");
const Result = require("../app/models/result");

const fs = require("../app/utils/async-fs");
const mongoose = require("mongoose");
const vm = require("vm");
const _ = require("underscore");

async function import_category_data() {
    const SOURCE = await (async () => {
        vm.runInThisContext(await fs.readFile("migration/sorter_characters.js"));
        return ary_TitleData;
    })();

    let categories = [];

    for(var i = 0; i < SOURCE.length; i++) {
        let category_name = SOURCE[i];
        let category = new Category({ name: category_name });
        categories.push(category);
    }

    await Category.create(categories);

    return categories;
}

async function import_character_data(categories) {
    const SOURCE = await (async () => {
        vm.runInThisContext(await fs.readFile("migration/sorter_characters.js"));
        return {
            image_url: str_ImgPath,
            characters: ary_CharacterData
        };
    })();

    // let characters = [];
    let characters = {
        raw: []
    };

    for(var i = 0; i < SOURCE.characters.length; i++) {
        let character_data = SOURCE.characters[i]; // [ Random Integer, Name, [Categories], Image ]
        let character_category = [];

        for(var j = 0; j < categories.length; j++) {
            let tmp_character_category = character_data[2][j];
            if(tmp_character_category == 1) {
                character_category.push(categories[j]);
            }
        }

        let character = new Character ({
            name: character_data[1],
            image: str_ImgPath + character_data[3],
            categories: character_category,
        });

        characters.raw.push(character);
        characters[character.name] = character;
    }

    await Character.create(characters.raw);

    return characters;
}

async function import_results_data(characters) {
    const SOURCE = await(async () => {
        let tmp_data = JSON.parse(await fs.readFile("migration/sorter_data.json")).sorter_data;
        let tmp_results = JSON.parse(await fs.readFile("migration/sorter_results.json")).sorter_results;
        let sorter_data = {};

        for(var i = 0; i < tmp_data.length; i++) {
            let tmp = tmp_data[i];
            sorter_data[tmp.sorter_hash] = JSON.parse(tmp.character_data);
        }

        return {
            sorter_data: sorter_data,
            sorter_results: tmp_results
        }
    })();

    let sorter_results = { 
        raw: []   
    }

    for(var i = 0; i < SOURCE.sorter_results.length; i++) {
        let tmp = SOURCE.sorter_results[i];
        let tmp_data = SOURCE.sorter_data[tmp.sorter_hash];
        let tmp_result_data = [];

        tmp.results_data = JSON.parse(tmp.results_data);

        for(var j = 0; j < tmp.results_data.length; j++) {
            let index = tmp.results_data[j];

            // If any sorter results data contains an invalid/corrupt index
            if(index >= 0) {
                let character_name = tmp_data[index][0];
                let character = characters[character_name];

                // If for some reason a character could not be found, exclude it
                if(character) {
                    tmp_result_data.push(character);
                } else {
                    console.warn("[Warning] Result: Unable to find Character '" + character_name + "'");
                }
            }
        }

        if(_.compact(tmp_result_data).length > 0) {
            let result = new Result({
                name: tmp.results_sharable_url,
                data: tmp_result_data
            });

            sorter_results[result.name] = result;
            sorter_results.raw.push(result);
        } else {
            console.warn("[Warning] Result: Unable to save Result '" + tmp.results_sharable_url + "'");
        }
    }

    await Result.create(sorter_results.raw);
    
    return sorter_results;
}

async function run() {
    console.log("Importing Character Data from Kemofure Sorter");

    await mongoose.connect(process.env.DATABASE_URL);
    await mongoose.connection.dropDatabase();
    
    let category_data = await import_category_data();
    let character_data = await import_character_data(category_data);
    let results_data = await import_results_data(character_data);
}

require("dotenv").config();

run().then(() => console.log("Kemofure Sorter Data migrated successfully")).catch(console.error);

module.exports = run;