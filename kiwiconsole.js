var colors = require('colors');

exports.success = function (message) {
    console.log(`${'Info :'.green} ${message}`);    
}

exports.error = function (message) {
    console.log(`${'Error :'.red} ${message}`);   
}