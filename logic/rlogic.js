var config = require('../config.json'),
    request = require('request'),
    parse = require('./parse.js');

var random = {
  "url": "",
  "method": "GET",
  "params": {
    "jsonrpc": "2.0",
    "method": "generateIntegers",
    "params": {
        "apiKey": `${config.info.rapi}`,
        "n": 1,
        "min": 1,
        "max": 100,
        "replacement": true
    },
    "id": 1
  }
}

function rng(msg){
  request(random, function(err,res,body){
    if (err) {console.log(err)};
    console.log(res);
    console.log("++++++++++++++")
    console.log(body);
  })
}


module.exports = {
  rng: rng,
}
