$(function(){

	// mouse over
	$('.img_ovr').hover(function(){
		$(this).attr('src', $(this).attr('src').replace(/_off/ig, '_on'));
	}, function(){
		$(this).attr('src', $(this).attr('src').replace(/_on/ig, '_off'));
	});

	$('.alpha_ovr').hover(function(){
		$(this).stop(false, true).animate({'opacity':0.7}, 500);
	}, function(){
		$(this).stop(false, true).animate({'opacity':1.0}, 500);
	});

	// pagetop fadeInOut
	$(window).scroll(function() {
		var scrolly = $(this).scrollTop();
		if (scrolly == 0) {
			$('.pagetop').fadeOut('fast');
		} else {
			$('.pagetop').fadeIn();
		}
	});

	// pagelink scroll
	$('a[href^=#]').click(function(){
		var Hash = $(this.hash);
		if ($(Hash).offset()) {
			var HashOffset = $(Hash).offset().top;
			$('html,body').animate({scrollTop: HashOffset}, 1000);
		}
		return false;
	});

	// side menu
	$('header .link_menu').on('click',function(){
	  if($('header .link_menu').hasClass('off')){
	    $('header .link_menu').removeClass('off');
			$('header .link_menu').removeClass('icon-icn_menu');
			$('header .link_menu').addClass('icon-icn_cross');
	    $('#side').animate({'marginLeft':'246px'},200).addClass('on');
			$('#content').animate({'paddingLeft':'246px'},200);

			// $('#login .close').on('click',function(){
			// 	$('#login').animate({'marginLeft':'0px'},200);
			// 	$('.submenu .link_login').addClass('off');
			// });

	  }else{
	    $('header .link_menu').addClass('off');
			$('header .link_menu').removeClass('icon-icn_cross');
			$('header .link_menu').addClass('icon-icn_menu');
	    $('#side').animate({'marginLeft':'0px'},200);
			$('#content').animate({'paddingLeft':'0px'},200);
	  }
	});

	// side menu accordion
	$('#side .parent_link').click(function(){
			$(this).next('ul').slideToggle(500);
			$(this).toggleClass('open');
	});


});
