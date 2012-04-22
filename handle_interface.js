    /* data */
    var USER_NAME = 'SOWIJS'
    var USER_FOLLOWING = '23'
    var USER_FOLLOWERS = '253'
    var USER_IMAGE = 'img/profile.jpg'
    
    var MOST_POPULAIR_TWEET_MESSAGE = 'Wees wijs met sowijs!'
    var MOST_POPULAIR_TWEET_RETWEET = 23
    
    var STATISTICS_SOCIAL = '23'
    var STATISTICS_SOCIAL_OF_MAX = 0.2; /*0 = minimum, 1 = max*/
    var STATISTICS_INFORMER = '52'
    var STATISTICS_INFORMER_OF_MAX = 0.5; /*0 = minimum, 1 = max*/
    var STATISTICS_RETWEETED = '61'
    var STATISTICS_RETWEETED_OF_MAX = 0.6; /*0 = minimum, 1 = max*/
    
    
    var FRIENDS = [{image:'img/profile.jpg', name:'Jackohoogeveen', mentions:9},
                   {image:'img/profile.jpg', name:'Jarallax', mentions:7},
                   {image:'img/profile.jpg', name:'linux', mentions:2}];
    
    // var HASHTAGS = ['mtnw','jarallax','nextweb']
    
    var RETWEET_RETWEETS = '5%';
    var RETWEET_RETWEETED = '12,8%';
    var RETWEET_AMOUNT = '1,5x';
    
    var SOCIAL_SCORE = '8,9';
    
    setValues = function(){
      $('#user_name').html(socialScore.userName);
      $('#user_image').attr ("src", "http://api.twitter.com/1/users/profile_image?screen_name="+ socialScore.userName + "&size=bigger");
		
      $('#following_amount').html(socialScore.follows);
      $('#followers_amount').html(socialScore.followers);
      $('#most_populair_tweet_message').html(socialScore.mostPopularTweet);
      $('#most_populair_tweet_retweet').html(socialScore.mostPopularTweetNumberRetweets);

      $('#statistics_social').html(socialScore.mentionPercentage + '%');
      STATISTICS_SOCIAL = socialScore.mentionPercentage;
	    STATISTICS_SOCIAL_OF_MAX = socialScore.mentionFactor;
	
      $('#statistics_informer').html(socialScore.hashtagPercentage + '%');
	    STATISTICS_INFORMER = socialScore.hashtagPercentage;
	    STATISTICS_INFORMER_OF_MAX = socialScore.hashtagFactor;

      $('#statistics_retweeted').html(socialScore.retweetAllPercentage + '%');
	    STATISTICS_RETWEETED = socialScore.retweetAllPercentage
	    STATISTICS_RETWEETED_OF_MAX = socialScore.retweetAllFactor;
		
      $('#social_score').html(socialScore.score);
      $('#retweet_retweets').html(socialScore.retweetOthersPercentage);
      $('#retweet_retweeted').html(socialScore.retweetsOfUserPercentage);
      $('#retweet_amount').html(socialScore.retweetsOfReach);

	  
      FRIENDS = socialScore.mostMentioned;
	  HASHTAGS = socialScore.mostHashtagged;
	  window.console.log (HASHTAGS);
      
      var mentions_html = ''
      for(var i =0; i < FRIENDS.length; i++) {
        mentions_html += '<a target="_blank" href="#' + FRIENDS[i].name + '"><li><img src="' + FRIENDS[i].image + '" width="80" height="80"/>@' + FRIENDS[i].name + '<span>' + FRIENDS[i].mentions + ' times</span></li></a>';
      }
      
      var HASHTAGS_html = '';
      for(var i =0; i < HASHTAGS.length; i++) {
        HASHTAGS_html += '<li><a href="https://twitter.com/#!/search/%23' + HASHTAGS[i] + '">#' + HASHTAGS[i] + '</a></li>'
      }
      
      console.log(HASHTAGS_html);
      
      $('#mentions').html(mentions_html);
      $('#hastags').html(HASHTAGS_html);
      
    }
    
    zoomOut = function(){
      $('.score').animate({fontSize: '40px'},200, zoomIn);
    }
    
    zoomIn = function(){
      $('.score').animate({fontSize: '50px'},200, zoomOut);
    }
    
    init = function(){
      zoomOut();
      $('#user_input').focus(function(event){
        if($('#user_input').attr('value') == 'Username'){
          $('#user_input').attr('value', '');
        }
      }); 
      
      $('#search_button').click(function(event){
        $('#user_input').addClass('loading');
        event.preventDefault();
        //loadded();
		    socialScore.calculate ($('#user_input').val(), loadded);

		 
      });   

      if(location.hash){
        console.log(location.hash.replace('#',''));
        $('#user_input').addClass('loading');
        socialScore.calculate(location.hash.replace('#',''), loadded);
        $('#user_input').val(location.hash.replace('#',''));
      }
		$('#user_input').focus();
    }
    
    TARGET_HEIGT = '1200';
    
    
    
    var BAR_MAX_SIZE = 300;
    var BAR_MIN_SIZE = 110;
    var bar_diff = BAR_MAX_SIZE - BAR_MIN_SIZE
    
    
    loadded = function(){
      setValues();
      
      var jarallax = new Jarallax('none');
      
      var body_height = $(window).height();
      var body_difference = TARGET_HEIGT - body_height;
      //console.log(body_difference);
      $('body').css('height',body_height);
      
      
      jarallax.addAnimation('body',[{progress:'0', backgroundPositionY:'0px', height:body_height, style:{easing:'easeOut'}, event:{animating:update, complete:isComplete}},
                                    {progress:'10', backgroundPositionY:'-800px', height:TARGET_HEIGT}]);
      
      jarallax.addAnimation('.mountains, footer',[{progress:'0', bottom:'0px', style:{easing:'easeOut'}},
                                          {progress:'10', bottom:-body_difference}]);
                                          
      jarallax.addAnimation('.sun, .sun2',[{progress:'0', height:'276px', bottom:'0px', marginLeft:'81px', style:{easing:'easeOut'}},
                                    {progress:'10', height:'376px', bottom:-(body_difference - 850), marginLeft:'-522px'}])

      jarallax.addAnimation('.sun2',[{progress:'0', opacity:'1', style:{easing:'easeOut'}},
                                    {progress:'10', opacity:'0'}])

      jarallax.addAnimation('.logo',[{progress:'0', opacity:'1'},
                                     {progress:'2', opacity:'0'},
                                     {progress:'8', opacity:'0', top:'73px', marginLeft:'244px'},
                                     {progress:'10', opacity:'1', top:'73px', marginLeft:'244px'}]);
      

      
      jarallax.addAnimation('h1',[{progress:'0', top:'75px', style:{easing:'easeOut'}},
                                     {progress:'5', top:'15px'}]);
                                     
      jarallax.addAnimation('.search_container',[{progress:'0', top:'280px', style:{easing:'easeOut'}},
                                                 {progress:'5', top:'130px'}]);
                                                 
      jarallax.addAnimation('.profile',[{progress:'0', display:'block', opacity:'0'},
                                     {progress:'10', display:'block', opacity:'0'},
                                     {progress:'20', display:'block', opacity:'1'},
                                     {progress:'100', display:'block', opacity:'1'}]);
                                     
      
      jarallax.addAnimation('.icon_quote.head',[{progress:'15', left:'421px', top:'35px'},
                                                {progress:'20', left:'421px', top:'145px'},
                                                {progress:'30', left:'683px', top:'145px'}]);
                                                
      jarallax.addAnimation('h3.populair, .line1',[{progress:'0', opacity:'0'},
                                           {progress:'30', opacity:'0'},
                                           {progress:'35', opacity:'1'}]);
                      
      jarallax.addAnimation('.populair_container',[{progress:'0', opacity:'0'},
                                                     {progress:'35', opacity:'0'},
                                                     {progress:'45', opacity:'1'}]);
      
      jarallax.addAnimation('.icon_graph.head',[{progress:'15', left:'421px', top:'35px'},
                                                {progress:'20', left:'421px', top:'145px'},
                                                {progress:'25', left:'421px', top:'332px'},
                                                {progress:'35', left:'880px', top:'332px'}]);
                                                
      jarallax.addAnimation('h3.statistics, .line2',[{progress:'0', opacity:'0'},
                                             {progress:'35', opacity:'0'},
                                             {progress:'40', opacity:'1'}]);
                                                
      jarallax.addAnimation('.statistics_container',[{progress:'0', opacity:'0'},
                                                     {progress:'40', opacity:'0'},
                                                     {progress:'50', opacity:'1'}]);
                                                     
                                     
      
      
      jarallax.addAnimation('#bar1',[{progress:'0', width:BAR_MIN_SIZE + 'px'},
                                     {progress:'50', width:BAR_MIN_SIZE + 'px', style:{easing:'easeOut'}},
                                     {progress:'60', width:(bar_diff * STATISTICS_SOCIAL_OF_MAX + BAR_MIN_SIZE)  + 'px'}]);
                                     
      jarallax.addAnimation('#bar2',[{progress:'0', width:BAR_MIN_SIZE + 'px'},
                                     {progress:'55', width:BAR_MIN_SIZE + 'px', style:{easing:'easeOut'}},
                                     {progress:'65', width:(bar_diff * STATISTICS_INFORMER_OF_MAX + BAR_MIN_SIZE) + 'px'}]);
                                     
      jarallax.addAnimation('#bar3',[{progress:'0', width:BAR_MIN_SIZE + 'px'},
                                     {progress:'60', width:BAR_MIN_SIZE + 'px', style:{easing:'easeOut'}},
                                     {progress:'70', width:(bar_diff * STATISTICS_RETWEETED_OF_MAX + BAR_MIN_SIZE) + 'px'}]);
                                     
      
      jarallax.addCounter({selector:'#statistics_social',
                              startNumber:0,
                              endNumber:STATISTICS_SOCIAL,
                              decimals:2,
                              startProgress:'50',
                              endProgress:'60',
                              postCharakter:'%'});
                              
      jarallax.addCounter({selector:'#statistics_informer',
                              startNumber:0,
                              endNumber:STATISTICS_INFORMER,
                              decimals:2,
                              startProgress:'55',
                              endProgress:'65',
                              postCharakter:'%'});
                             
      jarallax.addCounter({selector:'#statistics_retweeted',
                              startNumber:0,
                              endNumber:STATISTICS_RETWEETED,
                              decimals:2,
                              startProgress:'60',
                              endProgress:'70',
                              postCharakter:'%'});
      
      jarallax.addAnimation('.line3, .line4, .line5, .hastags_container, .mentions_container, .retweet_container, .mentions, .hastags, .retweet, .icon_mention.head, .icon_hash.head, .icon_retweet.head',
          [{progress:'0', opacity:'0'},
           {progress:'70', opacity:'0'},
           {progress:'85', opacity:'1'}]);
                                     
      
      if(jarallax.progress > 0.9) {
        jarallax.setProgress(10/85)
        jarallax.jumpToProgress('100%', 4000, 60, true);
      }else{
        jarallax.jumpToProgress('100%', 8000, 60, true);
      }
    }
    
    update = function(event){
      //console.log($('body').css('height'));
    }
    
    isComplete = function(event){
      //console.log(isComplete);
    }
