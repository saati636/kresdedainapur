(function($){

	/*-----------------------------------------
	    	Responsive Menu
	 -------------------------------------------*/

 	window.selectnav=function(){"use strict";var a=function(a,b){function l(a){var b;a||(a=window.event),a.target?b=a.target:a.srcElement&&(b=a.srcElement),b.nodeType===3&&(b=b.parentNode),b.value&&(window.location.href=b.value)}function m(a){var b=a.nodeName.toLowerCase();return b==="ul"||b==="ol"}function n(a){for(var b=1;document.getElementById("selectnav"+b);b++);return a?"selectnav"+b:"selectnav"+(b-1)}function o(a){i++;var b=a.children.length,c="",k="",l=i-1;if(!b)return;if(l){while(l--)k+=g;k+=" "}for(var p=0;p<b;p++){var q=a.children[p].children[0],r=q.innerText||q.textContent,s="";d&&(s=q.className.search(d)!==-1||q.parentElement.className.search(d)!==-1?j:""),e&&!s&&(s=q.href===document.URL?j:""),c+='<option value="'+q.href+'" '+s+">"+k+r+"</option>";if(f){var t=a.children[p].children[1];t&&m(t)&&(c+=o(t))}}return i===1&&h&&(c='<option value="">'+h+"</option>"+c),i===1&&(c='<select class="selectnav" id="'+n(!0)+'">'+c+"</select>"),i--,c}a=document.getElementById(a);if(!a)return;if(!m(a))return;document.documentElement.className+=" js";var c=b||{},d=c.activeclass||"active",e=typeof c.autoselect=="boolean"?c.autoselect:!0,f=typeof c.nested=="boolean"?c.nested:!0,g=c.indent||"→",h=c.label||"- Navigation -",i=0,j=" selected ";a.insertAdjacentHTML("afterend",o(a));var k=document.getElementById(n());return k.addEventListener&&k.addEventListener("change",l),k.attachEvent&&k.attachEvent("onchange",l),k};return function(b,c){a(b,c)}}();

    $('#menu section').children('ul').attr('id', 'tiny');

	selectnav('tiny', {
		label: '--- Navigation --- ',
		indent: '-'
	});
	
	/*-----------------------------------------
	    	FLICKR PLUGIN
	 -------------------------------------------*/

	$.fn.jflickrfeed = function(settings, callback) {
	settings = $.extend(true, {
	  flickrbase: 'http://api.flickr.com/services/feeds/',
	  feedapi: 'photos_public.gne',
	  limit: 20,
	  qstrings: {
	    lang: 'en-us',
	    format: 'json',
	    jsoncallback: '?'
	  },
	  cleanDescription: true,
	  useTemplate: true,
	  itemTemplate: '',
	  itemCallback: function(){}
	}, settings);

	var url = settings.flickrbase + settings.feedapi + '?';
	var first = true;

	for(var key in settings.qstrings){
	  if(!first)
	    url += '&';
	  url += key + '=' + settings.qstrings[key];
	  first = false;
	}

	return $(this).each(function(){
	  var $container = $(this);
	  var container = this;
	  $.getJSON(url, function(data){
	    $.each(data.items, function(i,item){
	      if(i < settings.limit){
	      
	        // Clean out the Flickr Description
	        if(settings.cleanDescription){
	          var regex = /<p>(.*?)<\/p>/g;
	          var input = item.description;
	          if(regex.test(input)) {
	            item.description = input.match(regex)[2]
	            if(item.description!=undefined)
	              item.description = item.description.replace('<p>','').replace('</p>','');
	          }
	        }
	        
	        // Add Image Sizes
	        // http://www.flickr.com/services/api/misc.urls.html
	        item['image_s'] = item.media.m.replace('_m', '_s');
	        item['image_t'] = item.media.m.replace('_m', '_t');
	        item['image_m'] = item.media.m.replace('_m', '_m');
	        item['image'] = item.media.m.replace('_m', '');
	        item['image_b'] = item.media.m.replace('_m', '_b');
	        delete item.media;
	        
	        // Use Template
	        if(settings.useTemplate){
	          var template = settings.itemTemplate;
	          for(var key in item){
	            var rgx = new RegExp('{{' + key + '}}', 'g');
	            template = template.replace(rgx, item[key]);
	          }
	          $container.append(template)
	        }
	        
	        //itemCallback
	        settings.itemCallback.call(container, item);
	      }
	    });
	    if($.isFunction(callback)){
	      callback.call(container, data);
	    }
	  });
	});
	}

	/*-----------------------------------------
	    	TWITTER PLUGIN
	 -------------------------------------------*/

	$.fn.twitter = function(username, count, callback){
	
		var $twitHolder = $(this);
		var tHr = '';
	
		$.getJSON("https://api.twitter.com/1/statuses/user_timeline.json?screen_name="+username+"&count="+count+"&callback=?",
			 function(data){

			  $.each(data, function(i,item){
			  
				if(i==0) $twitHolder.empty();

          		$twitHolder.append('<div class="twit">' + clean(item.text) + '</div>');

				});

			 	callback();

		});

	};

	function timeAgo(dateString) {
        var rightNow = new Date();
        var then = new Date(dateString);
         
        if ($.browser.msie) {
            // IE can't parse these crazy Ruby dates
            then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
        }
 
        var diff = rightNow - then;
 
        var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;
 
        if (isNaN(diff) || diff < 0) {
            return ""; // return blank string if unknown
        }
 
        if (diff < second * 2) {
            // within 2 seconds
            return "right now";
        }
 
        if (diff < minute) {
            return Math.floor(diff / second) + " seconds ago";
        }
 
        if (diff < minute * 2) {
            return "1 minute ago";
        }
 
        if (diff < hour) {
            return Math.floor(diff / minute) + " minutes ago";
        }
 
        if (diff < hour * 2) {
            return "1 hour ago";
        }
 
        if (diff < day) {
            return  Math.floor(diff / hour) + " hours ago";
        }
 
        if (diff > day && diff < day * 2) {
            return "yesterday";
        }
 
        if (diff < day * 365) {
            return Math.floor(diff / day) + " days ago";
        }
 
        else {
            return "over a year ago";
        }
    }
	  
	function link(tweet) {
        return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
          var http = m2.match(/w/) ? 'http://' : '';
          return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
        });
    };
	
	function at(tweet){
		return tweet.replace(/\B[@@]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
        });
	}
	
	function list(tweet){
        return tweet.replace(/\B[@@]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
        });
	
	}
	
	function hash(tweet){
        return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
          return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
        });
	
	}
	
	function clean(tweet){
        return hash(at(list(link(tweet))));
	}
	
	/*-----------------------------------------
	    	Initialize Flex Slider Carousels
	 -------------------------------------------*/

	$('html').removeClass('no-js');

	$('.rotator').each(function(){

		if($(this).parent().hasClass('news') || $(this).parent().hasClass('tour')) {

			$(this).flexslider({
				animation: 'slide',
				animationLoop: false,
				slideshow: false,
				smoothHeight: true,
				controlsContainer: $(this).parent().find('.arrows'),
				keyboard: false,
				controlNav: false,
				video:true
			});

		} else if($(this).parent().hasClass('event')) {

			$(this).flexslider({
				animation: 'slide',
				animationLoop: false,
				slideshow: false,
				smoothHeight: true,
				controlsContainer: $(this).parent().find('.arrows'),
				keyboard: false,
				controlNav: false,
				itemWidth:163
			});

		}

	});

	/*-----------------------------------------
	    	Initialize Homepage Slider
	 -------------------------------------------*/

	if($('#homeSlider').length > 0) {

		var hIndex = 0;
		var $hCap = $('#homeSlider').find('.captions').children('li'), $hSlides, $hPrev, $hNext;

		$('#homeSlider').flexslider({
			animation: 'slide',
			animationLoop: true,
			slideshow: true,
			slideshowSpeed: 7000,
			smoothHeight: false,

			controlsContainer: $('#homeSlider').find('.thumbs'),
			keyboard: true,
			controlNav: false,
			start: function(e){

				$hPrev = $('#homeSlider').find('.flex-prev');
				$hNext = $('#homeSlider').find('.flex-next');
				$hSlides = $('#homeSlider').find('.slides').children('li');

				$hPrev.append('<img src="' + $hSlides.eq(e.count).data('thumb') + '" />');
				$hNext.append('<img src="' + $hSlides.eq(hIndex+2).data('thumb') + '" />');

				$hPrev = $hPrev.find('img');
				$hNext = $hNext.find('img');

			},
			before: function(e){

				$hCap.eq(hIndex).fadeOut(200);

				var prev = hIndex - 1 < 0 ? e.count-1 : hIndex - 1;
				var next = hIndex + 1 > e.count-1 ? 0 : hIndex + 1;

				hIndex = e.data('flexslider').animatingTo;
				$hCap.eq(hIndex).fadeIn(500);

				changeThumbs(prev, next);

			}
		});

		function changeThumbs(prev, next){
			$hPrev.prop('src', $hSlides.eq(prev).data('thumb'));
			$hNext.prop('src', $hSlides.eq(next+2).data('thumb'));
		}

	}

	/*-----------------------------------------
	    	Styled Select for Custom Forms
	 -------------------------------------------*/

	jQuery.fn.styledSelect = function(options) {
		var isFF2 = jQuery.browser.mozilla && jQuery.browser.version.indexOf('1.8.')==0;
		var prefs = {
			coverClass : 'select-replace-cover',
			innerClass : 'select-replace',
			adjustPosition : { top:0, left:0 },
			selectOpacity : 0
			}
		if (options) jQuery.extend(prefs,options);
		return this.each( function() {
			if (isFF2) return false;
			var selElm = jQuery(this);
			selElm.wrap('<span><'+'/span>');
			selElm.after('<span><'+'/span>');
			var selReplace = selElm.next();
			var selCover = selElm.parent();
			selElm.css({
				'opacity':prefs.selectOpacity,
				'visibility':'visible',
				'position':'absolute',
				'top':0,
				'left':0,
				'display':'inline',
				'z-index':1
				});
			selCover.addClass(prefs.coverClass).css({
				'display':'inline-block',
				'position':'relative',
				'top':prefs.adjustPosition.top,
				'left':prefs.adjustPosition.left,
				'z-index':0,
				'vertical-align':'middle',
				'text-align':'left'
				});
			selReplace.addClass(prefs.innerClass).css({
				'display':'block',
				'white-space':'nowrap'
				});

			selElm.bind('change',function() {
				jQuery(this).next().text(this.options[this.selectedIndex].text);
				}).bind('resize',function() {
				jQuery(this).parent().width( jQuery(this).width()+'px' );
				});
			selElm.trigger('change').trigger('resize');
		});
	}

	$('.searchCourse select').styledSelect();

	/*-----------------------------------------
	    	Input Replacement
	 -------------------------------------------*/

	$('input, textarea').each(function(){
	
		if(!$(this).hasClass('submit') && $(this).attr('id') != 'submit' && $(this).attr('id') != 'contactSubmit'){
			$(this).attr('data-value', $(this).val())
				.focus(function(){
					$(this).addClass('focusInput');
					if($(this).val() == $(this).attr('data-value')){
						$(this).val('');
					} else {
						$(this).select();
					}
				})
				.blur(function(){
					$(this).removeClass('focusInput');
					if($(this).val() == ''){
						$(this).val($(this).attr('data-value'));
					}
				});
		}
		
	});

	/*-----------------------------------------
	    	Grayscale pictures effect
	 -------------------------------------------*/

	$('.grayColor').each(function(){
		$(this).append('<img class="overlay" src="' + $(this).children('img').data('color') + '" alt="" />');
	});

	/*-----------------------------------------
	    	Submenus
	 -------------------------------------------*/

	$('#menu').find('ul.clearfix').children('li').hover(function(){
		$(this).find('ul.sub-menu').stop().slideDown(150);
	}, function(){
		$(this).find('ul.sub-menu').stop().slideUp(100);
	});

	/*-----------------------------------------
	    	Flickr
	 -------------------------------------------*/

	$('.flickrList').each(function(){

		$(this).jflickrfeed({
			limit: $(this).data('no'),
			qstrings: {
				id: $(this).data('id')
			},
		itemTemplate: 
			'<a target="_blank" href="{{link}}"><img class="imgFrame" src="{{image_t}}" alt="{{title}}" /></a>'
		});

	});

	/*-----------------------------------------
	    	Twitter
	 -------------------------------------------*/

	$('.twitterList').twitter($('.twitterList').data('user'), 10, function(){
		var $twitts = $('.twitterList').children('.twit');
		var i = 0;
		if($twitts.eq(i).height() > 50)
			$twitts.eq(i).css('marginTop', -10)
		setInterval(function(){
			$twitts.eq(i).fadeOut(200);
			i = ++i == $twitts.length ? 0 : i;
			$twitts.eq(i).delay(200).fadeIn(200);
			if($twitts.eq(i).height() > 50) 
				$twitts.eq(i).css('marginTop', -10);
			else
				$twitts.eq(i).css('marginTop', 0);
		}, 5000);
	});

	/*-----------------------------------------
	    	Contact Form Handler
	 -------------------------------------------*/

	if($('#contact').length > 0){
	
		var $name = $('#contactName');
		var $email = $('#contactMail');
		var $message = $('#contactMessage');
		var $error = $('#contactError');
		var $success = $('#contactSuccess');

		$('#contactSubmit').click(function(){
			
			var ok = true;
			var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

			if($name.val().length < 3 || $name.val() == $name.data('value')){
				showError($name);
				ok = false;
			}
			
			if($email.val() == '' || $email.val() == $email.data('value') || !emailReg.test($email.val())){
				showError($email);
				ok = false;
			}
			
			if($message.val().length < 5 || $message.val() == $message.data('value')){
				showError($message);
				ok = false;
			}
			
			function showError($input){
				$input.val($input.data('value'));
				$input.addClass('contactErrorBorder');
				$error.fadeIn();
			}
			
			if(ok){
			
				$('#contact').fadeOut();

				$.ajax({
					type: 'POST',
					url: 'contact-form.php',
					data: 'name=' + $name.val() + '&email=' + $email.val() + '&message=' + $message.val(),
					success: function(){
						$success.fadeIn();
					}
				});
				
			}
			
			return false;
		
		});
		
		$name.focus(function(){resetError($(this))});
		$email.focus(function(){resetError($(this))});
		$message.focus(function(){resetError($(this))});

		function resetError($input){
			$input.removeClass('contactErrorBorder');
			$error.fadeOut();
		}
	
	}

	/*-----------------------------------------
	    	Toggles & Accordions
	 -------------------------------------------*/

	$('.toggleInfo a').click(function(){
		if(!$(this).hasClass('opened')){
			$(this).addClass('opened');
			$(this).parent().children('div').stop().slideDown(150);
		} else {
			$(this).removeClass('opened');
			$(this).parent().children('div').stop().slideUp(150);
		}
		return false;
	});

	$('.accordion').each(function(){

		$(this).data('tabs', $(this).children('div.box'));
		$(this).data('sel', $($(this).data('tabs')).eq(0));
		$($(this).data('sel')).addClass('opened');
		$($(this).data('sel')).find('.boxInfo').slideDown(0);

		$(this).children('div.box').click(function(){	

			$sel = $($(this).parent().data('sel'));
			$tabs = $($(this).parent().data('tabs'));

			$sel.removeClass('opened');
			$sel.find('.boxInfo').stop().slideUp(150);

			$(this).parent().data('sel', $tabs.eq($(this).index()));
			$sel = $($(this).parent().data('sel'));

			$sel.addClass('opened');
			$sel.find('.boxInfo').slideDown(0);

			return false;

		})

	});

	/*-----------------------------------------
	    	Blog Comments Trick
	 -------------------------------------------*/

	 $('.comment').find('ul li').each(function(){
	 	$(this).parent().parent().children('.first').append('<span class="cline1"></span>');
	 	$(this).append('<span class="cline2"></span>');
	 	if($(this).index() < $(this).parent().children('li').length-1 && $(this).parent().children('li').length > 1)
	 		$(this).append('<span class="cline1 cline3"></span>');
	 });

	/*-----------------------------------------
	    	Posts Rotator Widget
	 -------------------------------------------*/

	 $('.blogPost').find('.tabs').children('li').append('<span class="arrow13"></span>');

	 $selTabsPosts = $('.blogPost').find('.tabs').children('li').eq(0);
	 $selContentPosts = $('.blogPost').find('.content').children('li').eq(0);
	 $contentPosts = $('.blogPost').find('.content').children('li');

	 $('.blogPost').find('.tabs').find('a').click(function(){

	 	$selTabsPosts.removeClass('selected');
	 	$selTabsPosts = $(this).parent();
	 	$selTabsPosts.addClass('selected');

	 	$selContentPosts.stop().fadeOut(150);
	 	$selContentPosts = $contentPosts.eq($selTabsPosts.index());
	 	$selContentPosts.stop().delay(150).fadeIn(200);

	 	return false;

	 });
	  
	
})(jQuery);