var config = require('../config.json'),
    request = require('request'),
    parse = require('./parse.js'),
    curconn = '',
    playm = require('playmusic'),
    disp = null,
    alls = null;


var pm = new playm();

pm.init({email: `ayoungbl0d@gmail.com`, password: `Fireheart214!`}, function(err){
  if(err) {
    console.log(err)
  };
});

// pm.login({email: `${config.info.gpemail}`, password: `${config.info.gppass}`}, function(err, res){
//   if(err) {
//     console.log(err)
//   };
//   console.log(res);
// });



function getAll(msg) {
  pm.getAllTracks(function(err, library) {
    if(err) {
      console.log(err);
    }
      alls = library.data.items;
      playCurr(msg);
    });
}

function playCurr(msg) {
  const streamOptions = { seek: 0, volume: 1 };
  var cursong = alls.pop();
  var stream;
  var streamactual;
  pm.getStreamUrl(cursong.id, function(err, streamUrl){
    stream = streamUrl;
  });
  request(stream, function(err, res, body){
    console.log(body);
    // streamactual = body;
  })
  if(msg.member.voiceChannel){
    msg.member.voiceChannel.join()
    .then(function(connection){
      curconn = connection;
      if (disp == null){
        msg.channel.sendMessage(`Currently Playing: \"${cursong.title}\" by \"${cursong.artist}\"`);
      }
      disp = connection.playStream(streamactual, streamOptions);

      disp.on('end', () => {
        disp = null;
        console.log("success");
      })

      disp.on('error', (err) => {
        console.log(err)
        msg.channel.sendMessage("There was an error!");
      })
    })
  } else {
    msg.channel.sendMessage("You're not in a voice channel!");
  }
}

function clearq(msg){
  curconn = '';
  disp = null;
  getAll(msg);
  msg.channel.sendMessage("Clearing Queue");
}

module.exports = {
  getAll: getAll,
}
