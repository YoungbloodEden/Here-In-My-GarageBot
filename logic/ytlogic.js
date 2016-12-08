var config = require('../config.json'),
    ytdl = require('ytdl-core'),
    request = require('request'),
    search = [],
    searchname = [],
    main = require('../app.js'),
    client = '',
    jpd = false;

function base(passed, msg, clie){
  if (passed[0] == "\'"){
    return;
  } else {
    passed = passed.toLowerCase();
    var final = passed.replace(/\"/g, "").split(' ').join(',');
  }
  request(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${final}&maxResults=1&key=${config.info.apiKEY}`, function(err, res, body){
    var testbody = JSON.parse(body)
    console.log(testbody);
    console.log(testbody.snippet);
    console.log(testbody.id);
    // search.push(testbody.items[0].id.videoId);
    // searchname.push(testbody.items[0].snippet.title);
    // msg.channel.sendMessage("\"" +testbody.items[0].snippet.title + "\" has been added to queue.")
    // ytpb(msg, clie);
  })
}

function queue(msg){
  msg.channel.sendMessage("The current queue is: " + searchname)
  console.log(search);
}

function ytpb(msg, clie, conn){
  if (msg.member.voiceChannel){
    console.log('joining a channel line 44')
    msg.member.voiceChannel.join()
    .then(function(connection){
      queued(connection, msg);
    })
  } else {
    msg.channel.sendMessage("You're not in a voice channel!")
  }
}

function queued(conn, msg){
  if (search.length != 0){
    var streamOptions = { seek: 0, volume: 1 };
    var stream = ytdl(`https://www.youtube.com/watch?v=${search[0]}`, {filter: "audioonly"})
    msg.channel.sendMessage("Now playing: " + searchname[0]);
    var disp = conn.playStream(stream, streamOptions);
    disp.on('end', function(){
      console.log('line 62 is being hit kek')
      search.splice(0,1);
      searchname.splice(0,1);
      if (search.length == 0) {
        console.log(jpd, 'line 64');
        conn.disconnect();
        msg.channel.sendMessage("Queue empty. Disconnecting!");
      } else {

        // console.log("im being hit during ", search[0] )
        // console.log(jpd, 'line 68');
        // jpd = true;
        ytpb(msg, client, conn)
      }
    })
  } else {
    msg.channel.sendMessage("Queue empty. Disconnecting!");
  }
}

module.exports = {
  base: base,
  queue: queue,
}
