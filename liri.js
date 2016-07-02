
var keys = require("./keys.js");

var fs = require("fs");


function showTwitter(data){
	var Twitter = require("twitter");

	var twitterKeys = keys.twitterKeys;
	console.log(twitterKeys["consumer_key"]);
}

function showSpotify(data, text){
	// console.log(text);
	var spotify = require('spotify');

	if (typeof data === "undefined"){

		spotify.search({ type: 'track', query: "What's my age again" }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    }
		    else{
		    	var query = data.tracks.items[0];

		    	console.log("\nArtist(s): " + query.artists[0].name);
		    	console.log("Song Name: " + query.name);
		    	console.log("Preview Link: " + query.external_urls.spotify);
		    }
		});
	}
	else if (text === true){

		spotify.search({ type: 'track', query: data }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    }
		    else{
		    	var query = data.tracks.items[0];

		    	console.log("\nArtist(s): " + query.artists[0].name);
		    	console.log("Song Name: " + query.name);
		    	console.log("Preview Link: " + query.external_urls.spotify);
		    }
		});
	}
	else{
		
		var nodeArgs = process.argv;
		var songName = "";
		for (var i = 3; i <nodeArgs.length; i++){
			if (i > 3 && i < nodeArgs.length){
				songName = songName + " " + nodeArgs[i];
			}
			else{
				songName = songName + nodeArgs[i];
			}
		}

		spotify.search({ type: 'track', query: songName }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    }
		    else{
		    	var query = data.tracks.items[0];

		    	console.log("\nArtist(s): " + query.artists[0].name);
		    	console.log("Song Name: " + query.name);
		    	console.log("Preview Link: " + query.external_urls.spotify);
		    }
		});
	}
}

function showMovie(data){
	var request = require("request");

	if (typeof data === "undefined"){

		var nodeArgs = process.argv;

		var movieName = "";

		var backUpMovie = "Mr. + Nobody";

		for (var i = 3; i <nodeArgs.length; i++){
			if (i > 3 && i < nodeArgs.length){
				movieName = movieName + "+" + nodeArgs[i];
			}
			else{
				movieName = movieName + nodeArgs[i];
			}
		}

		if (movieName == " "){
			var queryUrl = 'http://www.omdbapi.com/?t=' + movieName +'&y=&plot=short&r=json&tomatoes=true';
		}else{
			var queryUrl = 'http://www.omdbapi.com/?t=' + backUpMovie +'&y=&plot=short&r=json&tomatoes=true';
		}
	}
	else{
		var movie = data.split(" ");
		var movieName = "";

		for (var i = 0; i < movie.length; i++){
			if (i > 0 && i < movie.length){
				movieName = movieName + "+" + movie[i];
			}
			else{
				movieName = movieName + movie[i];
			}
		}

		var queryUrl = 'http://www.omdbapi.com/?t=' + movieName +'&y=&plot=short&r=json&tomatoes=true';
	}


	request(queryUrl, function (error, response, body) {

		if (!error && response.statusCode == 200) {
			console.log("\nTitle: " + JSON.parse(body)["Title"]);
			console.log("Release Year: " + JSON.parse(body)["Year"]);
			console.log("IMDB rating: " + JSON.parse(body)["imdbRating"]);
			console.log("Country: " + JSON.parse(body)["Country"]);
			console.log("Language: " + JSON.parse(body)["Language"]);
			console.log("Plot: " + JSON.parse(body)["Plot"]);
			console.log("Actors: " + JSON.parse(body)["Actors"]);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
			console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
		}
	});
}

function extractText(str){
	var ret = "";

	if ( /"/.test( str ) ){
	ret = str.match( /"(.*?)"/ )[1];
	} else {
	ret = str;
	}

	return ret;
}

function showText(data){

	fs.readFile("random.txt", "utf8", function(error,data){
		var dataArr = data.split(',');
		var typeRequest = dataArr[0];
		var newString = extractText(dataArr[1]);

		if (typeRequest == "my-tweets"){
			showTwitter(data);
		}
		else if(typeRequest == "spotify-this-song"){
			console.log("spotifying");
			showSpotify(newString, true);
		}
		else if(typeRequest == "movie-this"){
			showMovie(newString);
		}
		else{
			console.log("Error: Check random.txt synthax");
		}
	});
}

function main(){
	var typeRequest = process.argv[2];
	var data = process.argv[3];


	if (typeRequest == "my-tweets"){
		showTwitter(data);
	}
	else if(typeRequest == "spotify-this-song"){
		console.log("will spotify song");
		showSpotify(data);
	}
	else if(typeRequest == "movie-this"){
		showMovie();
	}
	else if (typeRequest == "do-what-it-says"){
		showText(data);
	}
	else{
		console.log("Not a proper request");
	}
}
main();