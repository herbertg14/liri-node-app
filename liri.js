//access key.js
var keys = require("./keys.js");


//to read and write to files
var fs = require("fs");

//access the twitter API
function showTwitter(data){
	var Twitter = require('twitter');
	
	//Authenticate the user
	console.log(keys.twitterKeys["consumer_key"]);
	var client = new Twitter({
		consumer_key: keys.twitterKeys["consumer_key"],
		consumer_secret: keys.twitterKeys["consumer_secret"],
		access_token_key: keys.twitterKeys["access_token_key"],
		access_token_secret: keys.twitterKeys["access_token_secret"]
	});
	 
	//print to the console up to 20 tweets 
	client.get('statuses/user_timeline', function(error, tweets, response){
	  if (!error) {

	    for (var tweet = 0; tweet < tweets.length; tweet++){
	    	console.log("User: " + tweets[tweet].user.screen_name);
	    	console.log("Time Created: " + tweets[tweet].created_at);
	    	console.log("Text: " + tweets[tweet].text + "\n");
	    }
	  }
	});
}

//access the spotify API
function showSpotify(data, text){

	var spotify = require('spotify');

	//When there is no user input default to What's my age again
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
	//when accessing information for random.txt
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
	//when there is user input 
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

//access omdb
function showMovie(data){
	var request = require("request");

	//if not grabbing data from random.txt
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

		//if there is user input
		if (movieName == " "){
			var queryUrl = 'http://www.omdbapi.com/?t=' + movieName +'&y=&plot=short&r=json&tomatoes=true';
		}
		//if there is not user input
		else{
			var queryUrl = 'http://www.omdbapi.com/?t=' + backUpMovie +'&y=&plot=short&r=json&tomatoes=true';
		}
	}
	//grabbing data from random.txt
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

	//access omdb and print to the terminal movie info
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

//extract strings within strings
function extractText(str){
	var ret = "";

	if ( /"/.test( str ) ){
	ret = str.match( /"(.*?)"/ )[1];
	} else {
	ret = str;
	}

	return ret;
}

//access random.txt
function showText(data){

	//read the file
	fs.readFile("random.txt", "utf8", function(error,data){
		var dataArr = data.split(',');
		var typeRequest = dataArr[0];
		var newString = extractText(dataArr[1]);

		//if user requests tweets
		if (typeRequest == "my-tweets"){
			showTwitter(data);
		}
		//if user request music stats 
		else if(typeRequest == "spotify-this-song"){
			console.log("spotifying");
			showSpotify(newString, true);
		}
		//if user request movie stats
		else if(typeRequest == "movie-this"){
			showMovie(newString);
		}
		//wrong input
		else{
			console.log("Error: Check random.txt synthax");
		}
	});
}


//main function
function main(){
	var typeRequest = process.argv[2];
	var data = process.argv[3];

	//if user request tweets
	if (typeRequest == "my-tweets"){
		showTwitter(data);
	}
	//if user request music stats
	else if(typeRequest == "spotify-this-song"){
		console.log("will spotify song");
		showSpotify(data);
	}
	//if user request movie stats
	else if(typeRequest == "movie-this"){
		showMovie();
	}
	//if user request random.txt
	else if (typeRequest == "do-what-it-says"){
		showText(data);
	}
	//improper input
	else{
		console.log("Not a proper request");
	}
}
main();