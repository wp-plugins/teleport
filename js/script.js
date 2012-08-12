jQuery(function($) {
	
	var data = {
		action: 'teleport',
		postid: Teleport.postid,
		type: Teleport.type,
		front_id: Teleport.front_id,
		cururl: $(window).attr('location').href
	};
	$.post(Teleport.ajaxurl, data, function(html) {
		$('body').append(html);
		teleport_init();
	});

	function teleport_init() {
		var overlay = $("#teleport_overlay");
		var teleport = $("#teleport");
		var teleporter = $("#teleporter");

		teleporter.on("mouseenter", function(e) {
			var front = $(".teleport_front"); 
			var back = $(".teleport_back");
			if(!back.is('.teleport_mouseover')) {
				front.css('z-index', '999990').stop().hide('fade', 'fast', function(){
					back.css({
						opacity: '0',
						zIndex: "999991"
					}).animate({
						opacity: '1',
						height: 'show'
					}, 300, 'easeInCubic');
				});
			}
			back.addClass("teleport_mouseover");
		}).on("mouseleave", function(e) {
			var front = $(".teleport_front"); 
			var back = $(".teleport_back");
			back.removeClass('teleport_mouseover');
			back.css("z-index", "999990").stop().hide('fade', 'fast', function(){
				front.css("z-index", "999991").stop().show('scale', 'fast', function(){
					front.animate({rotate: '+=360deg'});
				});
			});
		});

		$(".teleport_back").on("click", function(e, el){
			if(teleporter.is('.teleport_open')) {
				window.location = $(this).data('url');
			}
		});

		$(".teleport_button").on("click", function(e, el){
			if(teleporter.is('.teleport_open')) {
				window.location = $(this).children('.teleport_icon').data('url');
			}
		}).on("mouseenter", function() {
			$(this).addClass('teleport_pressed');
		}).on("mouseleave", function() {
			$(this).removeClass('teleport_pressed');
		});

		 $(window).on("keydown", function(e) {
				if(!$(e.target).is('input, textarea')) {
					if(e.which == 87) {
						if(teleporter.is(".teleport_open")) {
							if($("#teleport_icon_teleporter").is('.teleport_login')) {
								teleport_press("teleporter", 87);
							} else {
								var btn = $(".teleport_button");
								if(btn.length > 0) {
									btn.animate({
										marginTop: "5px",
										marginLeft: "-25px"
									}, 200, function(){
										$(".teleport_button").removeClass('teleport_open').hide();
									});
									setTimeout(function(){
										jQuery("#teleporter").removeClass('teleport_open').hide('scale', 'fast', function(){
											teleport.hide();
										});
									}, 200);
								} else {
									teleporter.removeClass('teleport_open').hide('scale', 'fast');		
								}
								overlay.fadeOut(500);
							}
					} else {
							teleport.show();
							teleporter.addClass('teleport_open').show('scale', 'fast', function(){
								$("#teleport_third").show().animate({
									marginLeft: "100px"
								}, 200);
								$("#teleport_first").show().animate({
									marginTop: "170px"
								}, 200);
								$("#teleport_fourth").show().animate({
									marginLeft: "-150px"
								}, 200);
								$("#teleport_second").show().animate({
									marginLeft: "80px",
									marginTop: "120px"
								}, 200);
								$("#teleport_fifth").show().animate({
									marginLeft: "-130px",
									marginTop: "120px"
								}, 200);
							});
							overlay.fadeIn(500, function(){
								var teleport_icon_teleporter = $("#teleport_icon_teleporter");
								if(teleport_icon_teleporter.is('.teleport_login')) {
									teleport_icon_teleporter.fadeOut('fast', function() {
										$(this).addClass('teleport_login_icon').fadeIn('fast');
									});
								}
							});
						}
					} else if(e.which == 27) {
						 if(teleporter.is('.teleport_open')) {
							var btn = $(".teleport_button");
							if(btn.length > 0) {
								btn.animate({
									marginTop: "5px",
									marginLeft: "-25px"
								}, 200, function(){
									btn.removeClass('teleport_open').hide();
								});
								setTimeout(function(){
									jQuery("#teleporter").removeClass('teleport_open').hide('scale', 'fast', function(){
										teleport.hide();
									});
								}, 200);
							} else {
								teleporter.removeClass('teleport_open').hide('scale', 'fast');		
							}
							overlay.fadeOut(500);
							teleport.hide();
						 }
					} else if(e.which == 81) {
						teleport_press("teleport_fourth", e.which);
					} else if(e.which == 65) {
						teleport_press("teleport_fifth", e.which);
					} else if(e.which == 69) {
						teleport_press("teleport_third", e.which);
					} else if(e.which == 68) {
						teleport_press("teleport_second", e.which);
					} else if(e.which == 83) {
						teleport_press("teleport_first", e.which);
					}
				}
		});        
	}
});

function teleport_press(name, key) {
	if(jQuery("#teleporter").is('.teleport_open')) {
		var btn = jQuery("#" + name);
		var url = btn.children('.teleport_icon, .teleport_front, .teleport_login').data('url');
		btn.addClass('teleport_pressed');
		jQuery(window).on("keyup", function(e){
			if(e.which == key) {
				btn.removeClass('teleport_pressed');
				window.location = url;
			}
		});
	}
}
