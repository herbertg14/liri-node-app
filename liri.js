
var keys = require("./keys.js");
var fs = require("fs");


function showTwitter(data){
	var Twitter = require("twitter");

	var twitterKeys = keys.twitterKeys;
	console.log(twitterKeys["consumer_key"]);
}

// function showSpotify(data){

// }

function showMovie(){
	var request = require("request");

	var nodeArgs = process.argv;

	var movieName = "";

	for (var i = 3; i <nodeArgs.length; i++){
		if (i > 3 && i < nodeArgs.length){
			movieName = movieName + "+" + nodeArgs[i];
		}
		else{
			movieName = movieName + nodeArgs[i];
		}
	}

	var queryUrl = 'http://www.omdbapi.com/?t=' + movieName +'&y=&plot=short&r=json';

	console.log(queryUrl);

	request(queryUrl, function (error, response, body) {

		// If the request is successful (i.e. if the response status code is 200)
		if (!error && response.statusCode == 200) {
			console.log(body);
			// Parse the body of the site and recover just the imdbRating
			// (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it). 
			console.log("Release Year: " + JSON.parse(body)["Year"])
		}
	});
}

function showText(data){



	fs.readFile("random.txt", "utf8", function(error,data){
		console.log(data);
		var dataArr = data.split(',');
		console.log(dataArr);
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
	}
	else if(typeRequest == "movie-this"){
		console.log("movie request");
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