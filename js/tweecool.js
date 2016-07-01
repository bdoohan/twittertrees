/*Name : TweeCool
 *version: 1.9 
 *Description: Get the latest tweets from twitter.
 *Website: www.tweecool.com
 *Licence: No licence, feel free to do whatever you want.
 *Author: TweeCool
 */

// for tweecool
var wInner;
var stringy;

// setting up the map
var myMarkers = [];
var myLayer;
L.mapbox.accessToken = 'pk.eyJ1IjoiamFldmVlZGVlIiwiYSI6ImNpbmFxMmJ0MTBoa3p2OGtxbDAzZm5lMHIifQ.CIJDwn3mJ-kDaE8k0jUXpg';
var map = L.mapbox.map('map', 'mapbox.streets').setView([40.709112,-74.106226], 12);

//iterating through the trees
var whichTree = 0;

//set up the markers
var markerColor = "#24d20f";
var markerSize = "large";
var markerSymbol = "park";





//get the tweets from twitter
$.fn.extend({

 	tweecool : function(options) {


 		var defaults = {
 			username : 'jaeveedee',
 			limit : 1,
 			profile_image : false,
 			show_time : true,
 			show_media : false,
            show_media_size: 'thumb',  //values: small, large, thumb, medium 
            show_actions: false,
            action_reply_icon: '&crarr;',
            action_retweet_icon: '&prop;',
            action_favorite_icon: '&#10084',
            profile_img_url: 'profile', //Values: profile, tweet 
            show_retweeted_text: false //This will show the original tweet in order to avoid any truncated text, and also the "RT @tweecool:" is removed which helps with 140 character limit
        }
        var options = $.extend(defaults, options);

        function xTimeAgo(time) {
        	var nd = new Date();
        	//var gmtDate = Date.UTC(nd.getFullYear(), nd.getMonth(), nd.getDate(), nd.getHours(), nd.getMinutes(), nd.getMilliseconds());
        	var gmtDate = Date.parse(nd);
        	var tweetedTime = time * 1000; //convert seconds to milliseconds
        	var timeDiff = (gmtDate - tweetedTime) / 1000; //convert milliseconds to seconds
        	var second = 1, minute = 60, hour = 60 * 60, day = 60 * 60 * 24, week = 60 * 60 * 24 * 7, month = 60 * 60 * 24 * 30, year = 60 * 60 * 24 * 365;

        	if (timeDiff > second && timeDiff < minute) {
        		return Math.round(timeDiff / second) + " second"+(Math.round(timeDiff / second) > 1?'s':'')+" ago";
        	} else if (timeDiff >= minute && timeDiff < hour) {
        		return Math.round(timeDiff / minute) + " minute"+(Math.round(timeDiff / minute) > 1?'s':'')+" ago";
        	} else if (timeDiff >= hour && timeDiff < day) {
        		return Math.round(timeDiff / hour) + " hour"+(Math.round(timeDiff / hour) > 1?'s':'' )+" ago";
        	} else if (timeDiff >= day && timeDiff < week) {
        		return Math.round(timeDiff / day) + " day"+(Math.round(timeDiff / day) > 1 ?'s':'')+" ago";
        	} else if (timeDiff >= week && timeDiff < month) {
        		return Math.round(timeDiff / week) + " week"+(Math.round(timeDiff / week) > 1?'s':'')+" ago";
        	} else if (timeDiff >= month && timeDiff < year) {
        		return Math.round(timeDiff / month) + " month"+(Math.round(timeDiff / month) > 1 ?'s':'')+" ago";
        	} else {
        		return 'over a year ago';
        	}
        }
        return this.each(function() {
        	var o = options;
        	var wrapper = $(this);
        	wInner = wrapper;  //$('<ul>').appendTo(wrapper);
        	var urlpattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        	var usernamepattern = /@+(\w+)/ig;
        	var hashpattern = /#+(\w+)/ig;
        	var pIMG, media, timestamp, abox, mtext;

        	$.getJSON("http://tweecool.com/api/?screenname=" + o.username + "&count=" + o.limit, function(data) {
        		if (data.errors || data == null) {
        			if (data.errors) {
        				wrapper.html(data.errors);
        			} else {
        				wrapper.html('No tweets available 100.');
        			}
        			return false;
        		}
        		$.each(data.tweets, function(i, field) {
        			if (o.profile_image) {
        				if( o.profile_img_url == 'tweet' ){
        					pIMG = '<a href="https://twitter.com/' + o.username + '/status/'+field.id_str+'" target="_blank"><img src="' + data.user.profile_image_url + '" alt="' + o.username + '" /></a>';
        				} else {
        					pIMG = '<a href="https://twitter.com/' + o.username + '" target="_blank"><img src="' + data.user.profile_image_url + '" alt="' + o.username + '" /></a>';
        				}
        			} else {
        				pIMG = '';
        			}

        			if (o.show_time) {
        				timestamp = xTimeAgo(field.timestamp);
        			} else {
        				timestamp = '';
        			}

        			if (o.show_media && field.media_url){

        				media = '<a href="https://twitter.com/' + o.username + '/status/'+field.id_str+'" target="_blank"><img src="' + field.media_url + ':'+o.show_media_size+'" alt="' + o.username + '" class="media" /></a>';

        			} else {

        				media = '';

        			}

        			if( o.show_actions ){
        				abox = '<div class="action-box"><ul>';
        				abox += '<li class="ab_reply"><a title="Reply" href="https://twitter.com/intent/tweet?in_reply_to='+field.id_str+'">'+o.action_reply_icon+'</a></li>';
						abox += '<li class="ab_retweet"><a title="Retweet" href="https://twitter.com/intent/retweet?tweet_id='+field.id_str+'">'+o.action_retweet_icon+'</a>'+( field.retweet_count_f != '' ?'<span>'+field.retweet_count_f+'</span>':'' )+'</li>';
						abox += '<li class="ab_favorite"><a title="Favorite" href="https://twitter.com/intent/favorite?tweet_id='+field.id_str+'">'+o.action_favorite_icon+'</a>'+( field.favorite_count_f != '' ?'<span>'+field.favorite_count_f+'</span>':'' )+'</li>';
						abox += '</ul></div>';

					} else {
						abox = '';

					}

					if ( o.show_retweeted_text && field.retweeted_text ){

						mtext = field.retweeted_text;

					} else {

						mtext =  field.text;
					}

					wInner.append('<div class="tweets_txt">' + mtext.replace(urlpattern, '<a href="$1" target="_blank">$1</a>').replace(usernamepattern, '<a href="https://twitter.com/$1" target="_blank">@$1</a>').replace(hashpattern, '<a href="https://twitter.com/search?q=%23$1" target="_blank">#$1</a>') + media + ' <span>' + timestamp + '</span>' +abox+'</div>');
					//set the tweet text to html
					stringy = '<div class="tweets_txt">' + mtext.replace(urlpattern, '<a href="$1" target="_blank">$1</a>').replace(usernamepattern, '<a href="https://twitter.com/$1" target="_blank">@$1</a>').replace(hashpattern, '<a href="https://twitter.com/search?q=%23$1" target="_blank">#$1</a>') + media + ' <span>' + timestamp + '</span>' +abox+'</div>';
					
					//set the tweets to the array
					setTweets(stringy);
					
				});}).fail(function(jqxhr, textStatus, error) {
				//var err = textStatus + ', ' + error;
				wrapper.html('No tweets available 2');
			});

		});
	}
});




//run our tweet getting function
var getTweets = function(){

$('#tweecool').tweecool({
      //settings
      username : treeArray[whichTree][0], 
      limit : 1    
  });

}

//set the tweet text
var setTweets = function(theTweet) {

	//assign the tweet to the array spot
	treeArray[whichTree][2] = theTweet;


	//check if we've gotten all trees, if we have then set up the markers
	if (whichTree < (treeArray.length - 1)) {

		whichTree++; //move on to the next tree for next iteration
		getTweets(); //get the next set of tweets

	} else {

		//set up our markers
		setMarkers();

	}

}


//set up all the data for the markers
var setMarkers = function(){
	console.log("here");
	console.log(treeArray[0][0]);

	for (var i = 0; i < treeArray.length; i++) {

		myMarkers.push({
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [treeArray[i][1][0],treeArray[i][1][1]]
		},
		"properties": {
			"title": treeArray[i][0],
			"description": treeArray[i][2],
			"marker-color": markerColor,
			"marker-size": markerSize,
			"marker-symbol": markerSymbol
		}
	})
		
	};

	


	// myMarkers = [
	// {
	// 	"type": "Feature",
	// 	"geometry": {
	// 		"type": "Point",
	// 		"coordinates": [treeArray[0][1][0],treeArray[0][1][1]]
	// 	},
	// 	"properties": {
	// 		"title": treeArray[0][0],
	// 		"description": treeArray[0][2],
	// 		"marker-color": markerColor,
	// 		"marker-size": markerSize,
	// 		"marker-symbol": markerSymbol
	// 	}
	// },

	// {
	// 	"type": "Feature",
	// 	"geometry": {
	// 		"type": "Point",
	// 		"coordinates": [treeArray[1][1][0],treeArray[1][1][1]]
	// 	},
	// 	"properties": {
	// 		"title": treeArray[1][0],
	// 		"description": treeArray[1][2],
	// 		"marker-color": markerColor,
	// 		"marker-size": markerSize,
	// 		"marker-symbol": markerSymbol
	// 	}
	// },
	// {
	// 	"type": "Feature",
	// 	"geometry": {
	// 		"type": "Point",
	// 		"coordinates": [treeArray[2][1][0],treeArray[2][1][1]]
	// 	},
	// 	"properties": {
	// 		"title": treeArray[2][0],
	// 		"description": treeArray[2][2],
	// 		"marker-color": markerColor,
	// 		"marker-size": markerSize,
	// 		"marker-symbol": markerSymbol
	// 	}
	// },
	// {
	// 	"type": "Feature",
	// 	"geometry": {
	// 		"type": "Point",
	// 		"coordinates": [treeArray[3][1][0],treeArray[3][1][1]]
	// 	},
	// 	"properties": {
	// 		"title": treeArray[3][0],
	// 		"description": treeArray[3][2],
	// 		"marker-color": markerColor,
	// 		"marker-size": markerSize,
	// 		"marker-symbol": markerSymbol
	// 	}
	// },
	// {
	// 	"type": "Feature",
	// 	"geometry": {
	// 		"type": "Point",
	// 		"coordinates": [treeArray[4][1][0],treeArray[4][1][1]]
	// 	},
	// 	"properties": {
	// 		"title": treeArray[4][0],
	// 		"description": treeArray[4][2],
	// 		"marker-color": markerColor,
	// 		"marker-size": markerSize,
	// 		"marker-symbol": markerSymbol
	// 	}
	// }

	// ];




	myLayer = L.mapbox.featureLayer().setGeoJSON(myMarkers).addTo(map);

    map.fitBounds(myLayer.getBounds());

	

}

getTweets();







