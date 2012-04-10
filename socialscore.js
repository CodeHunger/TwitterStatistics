socialScore = new Object();
socialScore.amountOfDataLoaded = 0;
socialScore.contact_factor = 0;            
socialScore.hashtag_factor =0;
socialScore.retweet_factor = 0;
socialScore.numberOfMentionedPeople = 0;
socialScore.friends = 0;
socialScore.followers=0;
socialScore.retweet_reach = 0;
socialScore.callback = function (){
	//window.console.log ("No callback set for social score");
}

socialScore.addMentions = function (mentions, allMentions){
	for (mentionIndex in mentions){              
		var mention = mentions[mentionIndex];
		if (allMentions.hasOwnProperty(mention.screen_name)) {
			allMentions[mention.screen_name].count ++;
		}                                       
		else{
			allMentions[mention.screen_name] = {count:1, screen_name:mention.screen_name};
	  }
	}
}      
socialScore.addHashtag = function (hashtags, allHashtags){   
	for (hashIndex in hashtags){              
		var hash = hashtags[hashIndex];
		if (allHashtags.hasOwnProperty(hash.text)) {
			allHashtags[hash.text].count ++;
		}                                       
		else
			allHashtags[hash.text] = {count:1, text:hash.text};
	}    
}      

socialScore.toArray = function (hash){
	var a = [];
	for (item in hash){              
		a.push (hash[item]);
    }                       
	return a;
} 

socialScore.sortFunction = function(a,b ){
	if (a.count == b.count) return 0;
	else if (a.count < b.count ) return 1;
	else return -1;
}
socialScore.setPercentage = function(id, factor) {
	$(id).html ((factor * 100).toFixed(2));
}  

socialScore.setValue= function (id, val) {
	$(id).html (val.toFixed(2));
}
   
socialScore.hashtagToLI = function (hash){ 
	//window.console.log (hash);
	return "<li><strong>" +hash.text + "</strong> " + hash.count + "</li>";
}      


socialScore.mentionToLI = function (mention){ 
	//window.console.log (mention);
	return "<li><strong>" +mention.screen_name + "</strong> " + mention.count + "</li>";
}

socialScore.saveDiv =function (number, divideBy){
	return divideBy != 0 ? number/divideBy:0;
}

socialScore.savePercentage =function (number, divideBy){
	return (socialScore.saveDiv (number, divideBy) *100).toFixed(2);
}

socialScore.timelineFetched = function (t) {         
	var numberOfTweets = t.length;
	var numberOfHashtags = 0;
	var numberOfMentions = 0;
	var ownRetweetCount = 0;
	var numberOfOtherTweetRetweeted = 0;
	var numberOfOwnTweets = 0;
	var numberOfOwnTweetsWithoutMention = 0;
	var numberOfTweetsRetweeted = 0;
	var numberOfReplies = 0;
	var mostPopularTweet = null;
	var seekContact = 0;

	var allMentions = new Object();
	var allHashtags = new Object();
	 
	//window.console.log ("Aantal tweets");
	//window.console.log (t.length);
	for (tweetIndex in t){
		var tweet = t[tweetIndex];		

		var isOriginalTweet = true;
		if (tweet.retweet_count > 0){
			if (tweet.retweeted_status && tweet.retweeted_status.user){
				numberOfOtherTweetRetweeted ++;                        
				isOriginalTweet=false;
			}
			else {      
				if(!mostPopularTweet || mostPopularTweet.retweet_count < tweet.retweet_count) {
					mostPopularTweet = tweet;
				}
				ownRetweetCount += tweet.retweet_count;				
				numberOfTweetsRetweeted ++;
			}				
		}

        if (isOriginalTweet){
			if (tweet.entities && tweet.entities.hashtags && tweet.entities.hashtags.length > 0) {
				socialScore.addHashtag (tweet.entities.hashtags, allHashtags);
				numberOfHashtags ++;
			}
			if (tweet.entities && tweet.entities.user_mentions && tweet.entities.user_mentions.length > 0) {
				numberOfMentions ++;           
				numberOfOwnTweetsWithoutMention --;
				
				socialScore.addMentions (tweet.entities.user_mentions, allMentions);
				if (!tweet.in_reply_to_user_id_str) 
					seekContact ++;
			}     
			if (tweet.in_reply_to_user_id_str){
				numberOfReplies ++;
			}
			numberOfOwnTweets ++;	    	
			numberOfOwnTweetsWithoutMention ++;
		}		                         
		
	}                           
	              


	// setPercentage ("#mention_percentage", saveDiv(numberOfMentions,numberOfOwnTweets));

	socialScore.mentionFactor = socialScore.saveDiv(numberOfMentions,numberOfOwnTweets) ;
	socialScore.mentionPercentage = socialScore.savePercentage(numberOfMentions,numberOfOwnTweets) ;
	socialScore.hashtagFactor = socialScore.saveDiv(numberOfHashtags,numberOfOwnTweets); 
	socialScore.hashtagPercentage = socialScore.savePercentage(numberOfHashtags,numberOfOwnTweets); 

    socialScore.retweetOthersFactor = socialScore.saveDiv(numberOfOtherTweetRetweeted,numberOfTweets);
    socialScore.retweetOthersPercentage = socialScore.savePercentage(numberOfOtherTweetRetweeted,numberOfTweets);

    socialScore.retweetAllFactor = socialScore.saveDiv(numberOfTweetsRetweeted,numberOfOwnTweets);
    socialScore.retweetAllPercentage = socialScore.savePercentage(numberOfTweetsRetweeted,numberOfOwnTweets);

    socialScore.seekContactFactor = socialScore.saveDiv(seekContact,numberOfOwnTweets);

    socialScore.retweetsOfUserReach= socialScore.saveDiv(ownRetweetCount, numberOfTweetsRetweeted);
    socialScore.retweetsOfUserPercentage = socialScore.savePercentage(numberOfTweetsRetweeted,numberOfOwnTweets);
    socialScore.retweetsOfUserFactor = socialScore.saveDiv(numberOfTweetsRetweeted,numberOfOwnTweets);

	// 
	// setPercentage ("#retweet_change", saveDiv(numberOfTweetsRetweeted,numberOfOwnTweets));
	// setPercentage ("#retweet_others_percentage", saveDiv(numberOfOtherTweetRetweeted,numberOfTweets));
	// 
	// setValue ("#retweet_amount", saveDiv(ownRetweetCount, numberOfTweetsRetweeted));
	//         
	// window.console.log ("Tweets without mention are retweeted: " + saveDiv(ownRetweetCount,numberOfOwnTweetsWithoutMention) );
	// window.console.log ("mostPopularTweet");

	if (mostPopularTweet)
	{
		socialScore.mostPopularTweet = mostPopularTweet.text; 
		socialScore.mostPopularTweetNumberRetweets = mostPopularTweet.retweet_count; 		
    }                                                                                
	else {
		socialScore.mostPopularTweet = ""; 
		socialScore.mostPopularTweetNumberRetweets = 0; 		
		
	}

	
	// Format mentions
	var mentions = socialScore.toArray (allMentions);
	var sortedMentions = mentions.sort (socialScore.sortFunction);
	socialScore.numberOfMentioned = mentions.length;
	
    socialScore.mostMentioned = [];
	var currentMention = 0;
	while (currentMention != sortedMentions.length && currentMention < 3){       
		var m = sortedMentions[currentMention];
		socialScore.mostMentioned.push ({
			image: "http://api.twitter.com/1/users/profile_image?screen_name=" + m.screen_name  + "&size=bigger",
			name: m.screen_name,
			mentions: m.count
		});       
		currentMention++;
	}
	
	var hashTags = socialScore.toArray (allHashtags);
	var sortedHashtags = hashTags.sort (socialScore.sortFunction);
	socialScore.mostHashtagged = [];
	var currentHashtag = 0;
	while (currentHashtag != sortedHashtags.length&& currentHashtag <3){
		var h = sortedHashtags[currentHashtag];
		socialScore.mostHashtagged.push (h.text);
		currentHashtag ++;
	}

	socialScore.amountOfDataLoaded ++;
	socialScore.ifReadyCalculateSocialScore();

}      

socialScore.profileFetched = function (data){
	var user = data[0];
	$("#user_followers").html(user.followers_count);
	$("#user_friends").html(user.friends_count);


	socialScore.follows = user.friends_count;
	socialScore.followers=user.followers_count;

    socialScore.amountOfDataLoaded ++;
	socialScore.ifReadyCalculateSocialScore();

}                     
socialScore.ifReadyCalculateSocialScore = function () {
	if (socialScore.amountOfDataLoaded == 2){		
		socialScore.score = socialScore.socialScore (
			socialScore.seekContactFactor,
			socialScore.hashtagFactor,
			socialScore.retweetsOfUserFactor,
			socialScore.numberOfMentioned,
			socialScore.follows,
			socialScore.followers,
			socialScore.retweetsOfUserReach
			).toFixed(0);
    	socialScore.callback ();
	}
}

socialScore.socialScore = function (contact_factor, hashtag_factor, retweet_factor,  numberOfMentionPeople, friends, followers, retweet_reach){
	// Participatie score
	// 1/ Zoekt actief contact (5% optimaal) (30)
	// 2/ Gebruikt regelmatig maar niet te vaak een hashtag (25%) 10
	// 3/ Retweet kans 15% optimaal (15)
	// 4/ Totaal aantal gementionede 50 is optimaal 	(30)
	// 5/ Verhouding tussen vrienden en volgers  (15) 1:4 is optimaal
	
	
	var totalScore = 0;
	var MAX_HASHTAG_SCORE = 10;
	var OPTIMAL_HASHTAG_FACTOR = 0.20;
	var hash_tag_score = Math.sin ((hashtag_factor/OPTIMAL_HASHTAG_FACTOR) * Math.PI/2  ) * MAX_HASHTAG_SCORE;   
	if (hash_tag_score < 0) hash_tag_score = 0;

	var MAX_CONTACT_SCORE = 15;
	var contact_score = (contact_factor / 0.05) * MAX_CONTACT_SCORE;
	if (contact_score > MAX_CONTACT_SCORE) contact_score = MAX_CONTACT_SCORE;

	var MAX_RETWEET_SCORE = 15;	
	var retweet_score = (retweet_factor / 0.15) * MAX_RETWEET_SCORE;
	if (retweet_score >MAX_RETWEET_SCORE ) retweet_score = MAX_RETWEET_SCORE;


	var MAX_RETWEET_REACH_SCORE = 15;	
	var retweet_reach_score = (retweet_reach / 5) * MAX_RETWEET_REACH_SCORE;
	if (retweet_reach_score >MAX_RETWEET_REACH_SCORE ) retweet_reach_score = MAX_RETWEET_REACH_SCORE;


	var MAX_MENTION_SCORE = 30;
	var mention_score=(numberOfMentionPeople	/50 )* MAX_MENTION_SCORE;
	if (mention_score > MAX_MENTION_SCORE) mention_score = MAX_MENTION_SCORE;  
	
	var MAX_FRIENDS_FOLLOWERS = 15;
	var friend_score = 0;
	if (friends < 20 || followers == 0) 
		friend_score = 0;		
	else if (followers > 600){ 
		friend_score = MAX_FRIENDS_FOLLOWERS;
	}
	else{
		friend_score = (MAX_FRIENDS_FOLLOWERS/4)  * (followers/friends) ;
		if (friend_score > MAX_FRIENDS_FOLLOWERS) friend_score = MAX_FRIENDS_FOLLOWERS;
	}

		
	totalScore = hash_tag_score + contact_score + retweet_score + mention_score + friend_score + retweet_reach_score;
	return totalScore;
}            

socialScore.collectTweets = function (t){
  $('#user_input').removeClass('loading');
	//window.console.log (t.length)
	socialScore.totalTweets = socialScore.totalTweets.concat (t); 		
	//window.console.log (socialScore.totalTweets.length)

	socialScore.totalPagesFetched ++;
	                                               
   	if (socialScore.totalPagesFetched == 3){
		socialScore.timelineFetched (socialScore.totalTweets);
	}
}



socialScore.calculate =function(twitterName, callbackFunction){
  twitterName = twitterName.replace("@", "");
	socialScore.amountOfDataLoaded = 0;      
	socialScore.userName = twitterName;
    socialScore.callback = callbackFunction;
	socialScore.totalTweets = [];
	socialScore.totalPagesFetched =0;
  location.hash = twitterName;
//	$("#results").hide();
	
	$.getJSON ("http://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name="+ 
		twitterName
		+"&count=1000&page=1&json&callback=?", socialScore.collectTweets);

	$.getJSON ("http://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name="+ 
			twitterName
			+"&count=1000&page=2&json&callback=?", socialScore.collectTweets);

	$.getJSON ("http://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name="+ 
			twitterName
			+"&count=1000&page=3&json&callback=?", socialScore.collectTweets);
  
  //loadded();
		
   // image			http://api.twitter.com/1/users/profile_image/:screen_name.format
   // https://api.twitter.com/1/users/lookup.json?screen_name=twitterapi,twitter&include_entities=true
	$("#user_avatar").html ("<img src='http://api.twitter.com/1/users/profile_image?screen_name=" + twitterName + "&size=bigger'/>");
	$.getJSON ("https://api.twitter.com/1/users/lookup.json?screen_name="+ twitterName + "&callback=?", socialScore.profileFetched);

}                



