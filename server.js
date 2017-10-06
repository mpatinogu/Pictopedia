var http = require('http');
var express = require('express');
var app = express();
var Twitter = require('twitter');
var config = require('./config');
var client = new Twitter(config);

app.set('port', 5450 );


console.log(__dirname + '/public');
//Store all CSS in css folder.
app.use(express.static(__dirname + '/public/css/'));
//Store all JS in js folder.
app.use(express.static(__dirname + '/public/js/'));
//Store all Images in img folder.
app.use(express.static(__dirname + '/public/img/'));
//Store all Fonts in font folder.
app.use(express.static(__dirname + '/public/css/font/'));

app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
  //It will find and locate index.html 
});


app.get('/searchTweets',function(req,res){
    const s=req.query.q;
    console.log(req.query.q);
    client.get('search/tweets', {q:`from:pictoline AND ${s}`,tweet_mode:'extended'}, function(error, tweets, response) {
        if (error){
          console.error('An error: ', error);
          res.send(error);
        }
        var contentResults="";
        var imgContent="";
        if(tweets.statuses.length>0){
            tweets.statuses.forEach(function(item) {
                
                if(item.extended_entities && item.extended_entities.media){
                    imgContent='<img class="img-responsive center-block" src="'+item.extended_entities.media[0].media_url+'">';
                }
                else{
                    imgContent='';
                }
                
              contentResults += `<div class="row">
                                    <div class="col-md-12">
                                        <div class="panel panel-default">
                                            <div class="panel-body">
                                            <p>${item.full_text}</p>
                                            ${imgContent}
                                        </div>
                                    </div>
                                </div>
                            </div>`;

            });
        }
        else{
            contentResults="No se encontraron resultados para "+s;
        }
                  
        
        res.send(contentResults);
    });
});


//server.listen(5450);
http.createServer(app).listen(app.get('port'),
  function(){
    console.log("Express server listening on port " + app.get('port'));
});




module.exports = app;
//console.log("server listening on 1185");