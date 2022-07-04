
function set_colorbox() {
	jQuery("a.fb_iframe").colorbox({
	    onComplete: function(){

	    },
	    opacity: 0.5,
	    iframe: true,
	    width: '90%',
	    height: '850px'
	});
}
jQuery(function(){
	set_colorbox();
	
})

