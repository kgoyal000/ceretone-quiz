$(document).ready(function(){
	function validateEmail($email) {
	  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	  return emailReg.test( $email );
	}


	$('.privacy__popup--btn').on('click' ,function(e){
		e.preventDefault();
		$('.privacy__popup').fadeIn(300);
		$("body,html").css("overflow-y" ,"hidden");
	});
	$('.privacy__popup .btn>a').on("click" ,function(e){
		e.preventDefault();
		$(this).closest('.privacy__popup').fadeOut(300);
		$('body,html').css("overflow-y" ,"initial");
	});


	$('.both__ears--btn').on('click' ,function(e){
		e.preventDefault();
		$('.both__ears--popup').fadeIn(300);
		$('body,html').css("overflow-y" ,"hidden");
	});

	$('.dont__hear--btn').on('click' ,function(e){
		e.preventDefault();
		$('.dont__hear--popup').fadeIn(300);
		$('body,html').css("overflow-y" ,"hidden");
	});


	$('.dont__hear--popup .try__again').on("click" ,function(e){
		e.preventDefault();
		location.reload();
	});


	$(".both__ears--popup .restart").on('click' ,function(e){
		e.preventDefault();
		location.reload();
	});

	$(".both__ears--popup .continue, .both__ears--popup .back ").on('click' ,function(e){
		e.preventDefault();
		$('.both__ears--popup').fadeOut(300);
		$('body,html').css("overflow-y" ,"initial");
	});

	$('.calculate__popup--btn').on("click" ,function(e){
		e.preventDefault();
		$('.calculate__popup').fadeIn(300);
		$('body,html').css("overflow-y" ,"hidden");
	});


	$('.calculate__popup .btn>a').on('click' ,function(e){
		e.preventDefault();
		$(this).closest('.calculate__popup').fadeOut(300);
		$('body,html').css("overflow-y" ,"initial");
	});


	$('.lower__btn').on('click' ,function(e){
		e.preventDefault();
		$('.popup__adjust').fadeIn(300);
		$('body,html').css("overflow-y"  ,"hidden");
	});

	$('.audio__bar--controls>a:nth-child(1)').on('click' ,function(e){
		e.preventDefault();
		let currVal = $(this).closest(".step").find(".audio__bar>input").val()*100;
		if (currVal != 0) {
			currVal = +currVal - 10;
		}
		$(this).closest('.step').find(".audio__bar svg stop").attr("offset" , currVal + "%");
		$(this).closest('.step').find("audio")[0].volume = currVal/100;
		$(this).closest(".step").find(".audio__bar>input").val(currVal/100);
	});
	$('.audio__bar--controls>a:nth-child(2)').on('click' ,function(e){
		e.preventDefault();
		let currVal = $(this).closest(".step").find(".audio__bar>input").val()*100;
		if (currVal != 100) {
			currVal = +currVal + 10;
		}
		$(this).closest('.step').find(".audio__bar svg stop").attr("offset" , currVal + "%");
		$(this).closest('.step').find("audio")[0].volume = currVal/100;
		$(this).closest(".step").find(".audio__bar>input").val(currVal/100);
	});


	$('.main__questions--form .fields .validate').on('input , change' ,function(){
		let errors = 0;
		$('.main__questions--form .validate').each(function(index,elem){
			if ($(elem).hasClass('regular')) {
				if ($(elem).val().length < 2) {
					errors++;
				}
			}
			if ($(elem).hasClass('email')) {
				if ($(elem).val().length == 0 ||  !validateEmail($(elem).val())) {
					errors++;
				}
			}

			if ($(elem).hasClass('checkbox')) {
				if ($(elem).prop("checked") == false) {
					errors++;
				}
			}
		});
		if (errors == 0) {
			$('.main__questions--form  .btn>a').removeClass('disabled');
		} else {
			$('.main__questions--form  .btn>a').addClass('disabled');
		}
	});


	$('.step .btn>a.regular-btn').on('click' ,function(e){
		e.preventDefault();
		$('audio').each(function(index,elem){
			$(elem)[0].pause();
		});
		if (allowClick == true) {
			if ($('.step.current').next().length) {
				allowClick = false;
				$('.step.current').removeClass("visible");
				setTimeout(function(){
					$('.step.current').css('display' ,"none");
					$('.step.current').removeClass("current").next(".step").addClass('current').css("display" ,"block");
					setTimeout(function(){
						$('.step.current').addClass("visible");
						allowClick = true;
					}, 40);
					if ($('.step.current .start__play').length) {
						$('.step.current .start__play')[0].currentTime = 0;
						$('.step.current .start__play')[0].play();
						$('.step.current .start__play')[0].volume = 1;
					}
					if ($('.step.current .volume__switcher--audio').length) {
						$('.step.current .volume__switcher--audio')[0].currentTime = 0;
						$('.step.current .volume__switcher--audio')[0].play();
						$('.step.current .volume__switcher--audio')[0].volume = $('.step.current .audio__bar>input').val();
					}
					let imageId = $('.step.current').attr("data-image");
					$('.top__l').attr("src" , "img/prods/" + imageId + "_1.webp");
					$('.top__r').attr("src" , "img/prods/" + imageId + "_2.webp");
					$('.top__r2').attr("src" , "img/prods/" + imageId + "_3.webp");

					initProgress($('.step.current').attr("data-value"));
				}, 500);
			}
		}

	});
	let allowClick = true;
	$('.top__part>a , .back__btn>a').on('click' ,function(e){
		e.preventDefault();
		if (allowClick == true) {
			if ($('.step.current').prev().length) {
				$('audio').each(function(index,elem){
					$(elem)[0].pause();
				});
				allowClick = false;
				$('.step.current').removeClass("visible")
				setTimeout(function(){
					$('.step.current').css('display' ,"none");
					$('.step.current').removeClass("current").prev(".step").addClass('current').css("display" ,"block");
					setTimeout(function(){
						$('.step.current').addClass("visible");
						allowClick = true;
					}, 40);
					if ($('.step.current .start__play').length) {
						$('.step.current .start__play')[0].currentTime = 0;
						$('.step.current .start__play')[0].play();
						$('.step.current .start__play')[0].volume = 1;
					}
					if ($('.step.current .volume__switcher--audio').length) {
						$('.step.current .volume__switcher--audio')[0].currentTime = 0;
						$('.step.current .volume__switcher--audio')[0].play();
						$('.step.current .volume__switcher--audio')[0].volume = $('.step.current .audio__bar>input').val();
					}
					let imageId = $('.step.current').attr("data-image");
					$('.top__l').attr("src" , "img/prods/" + imageId + "_1.webp");
					$('.top__r').attr("src" , "img/prods/" + imageId + "_2.webp");
					$('.top__r2').attr("src" , "img/prods/" + imageId + "_3.webp");
					initProgress($('.step.current').attr("data-value"));
				}, 500);
			}
		}
	});


	function initProgress(value){
		$('.top__part .bar .active').css("width" ,value + "%");
	}


	$(".group__dropdown>a").on("click" ,function(e){
		e.preventDefault();
		if ($(this).hasClass("opened")) {
			$(this).removeClass("opened");
			$(this).closest('.group__dropdown').find(".drop").fadeOut(300);
		} else {
			$('.group__dropdown>a').removeClass('opened');
			$('.group__dropdown .drop').fadeOut(300);
			$(this).addClass("opened");
			$(this).closest('.group__dropdown').find(".drop").fadeIn(300);
		}
	});

	$(document).click(function(event) { 
	  var $target = $(event.target);
	  if(!$target.closest('.group__dropdown').length) {
	  	$('.group__dropdown>a').removeClass('opened');
	  	$('.group__dropdown .drop').fadeOut(300);
	  }        
	});

	$('.group__dropdown .drop ul li a').on('click' ,function(e){
		e.preventDefault();
		$(this).closest(".drop").fadeOut(300);
		$(this).closest('ul').find(".current").removeClass('current');
		$(this).addClass('current');
		$(this).closest('.group__dropdown').find(">input").val($(this).text());
		$(this).closest('.group__dropdown').find(">a").removeClass('opened');
		$(this).closest('.group__dropdown').find(">a>span").text($(this).text());
	});

	$('.plates__ .elem').on('click' ,function(e){
		e.preventDefault();
		if ($(this).hasClass('current')) {
			$(this).removeClass('current');
			$(this).closest('.plates__').find('input').val("");
		} else {
			$(this).closest('.plates__').find('.current').removeClass('current');
			$(this).addClass('current');
			$(this).closest('.plates__').find('input').val($(this).text().trim());
		}

		if ($(this).closest('.plates__').find('.current').length != 0) {
			$(this).closest('.step').find('.btn>a').removeClass('disabled');
		} else {
			$(this).closest('.step').find('.btn>a').addClass('disabled');			
		}
	});


	$('.popup__adjust ul li a').on('click' ,function(e){
		e.preventDefault();
		if (!$(this).hasClass('current')) {
			$(this).closest("ul").find(".current").removeClass('current');
			$(this).addClass('current');
			$('.picked__box .el').css('display' ,'none');
			$('.picked__box .el[data-el='+ $(this).attr("data-el") +']').fadeIn(300);
		}
	});


	$('.open__volume--popup').on("click" ,function(e){
		e.preventDefault();
		$('.popup__adjust').fadeIn(300);
		$('body,html').css("overflow-y"  ,"hidden");
	});

	$('.popup__adjust .btn>a').on('click' ,function(e){
		e.preventDefault();
		$('.popup__adjust').fadeOut(300);
		$('body,html').css("overflow-y"  ,"initial");
	});
});