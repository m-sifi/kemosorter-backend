const mwbot = require('mwbot');

const JapariLibrary = new mwbot({
    apiUrl: 'https://japari-library.com/w/api.php',
    verbose: true
});

JapariLibrary.setGlobalRequestOptions({
    format: 'json',
    formatversion: 2
});

module.exports = JapariLibrary;