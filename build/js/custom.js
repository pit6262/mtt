
$(window).on('load', function(){
	$('body').removeClass('loaded');
});

$(function(){

	/* Burger */
	/* ---------------------------------------------- */

	$(".toggle-menu").on('click',function(){
		$(this).toggleClass("open");
		$('.main-menu').toggleClass('open')
	});

	$('.anchor').on("click", function(e){
		var anchor = $(this);
		$('html, body').stop().animate({
		  scrollTop: $(anchor.attr('href')).offset().top - 50
		}, 600);
		e.preventDefault();
		$('.main-menu').removeClass('open')
		$(".toggle-menu").removeClass('open')
	});


	/* Forms  */
	/* ---------------------------------------------- */
	$('.form-input').focus(function(){
		var label = $(this).prev('.label');
		var value = $(this).val();

		if(value == ''){
			label.stop().css({ 'top': '.3rem', });
			$(this).parent().addClass('focus')
		} else {
			label.css({ 'top': '.3rem' });

		}
	}).blur(function(){
		var label = $(this).prev('.label');
		var value = $(this).val();
		var full = value.replace(/\+7\(\d{3}\) \d{3} \d{4}/g, "")=="" ? true: false;
		if ($(this).hasClass('tel')) {
		    if(value == '' || !full){
		      label.stop().css({ 'top': '1.3rem', });
		      $(this).parent().removeClass('focus')
		    }
		   } else {
		   	 if(value == ''){
		      label.stop().css({ 'top': '1.3rem', });
		      $(this).parent().removeClass('focus')
		    }
		   }

	});

	var sliderValue = [1, 17, 33, 65];
	 $( "#range" ).slider({
		range: 'max',
		min: 1,
		max: 65,
		value: 0,
		step: 1,
		slide: function( event, ui ) {
           if( sliderValue.indexOf(ui.value)===-1 ) return false;
           
        }
	});

	// $( "#range" ).val( $( "#slider-range-max" ).slider( "value" ) );



	/* Plugins */
	/* ---------------------------------------------- */

	/* Styler */
	if($('.styler').length){
		$('.styler').styler({
			singleSelectzIndex: '5',
			selectVisibleOptions: '7',
		});
	};


});