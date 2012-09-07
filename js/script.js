(function(){
	jQuery(function($) {
		if($('body').is('.wp-admin')) {
			is_admin = true;
		} else {
			is_admin = false;
		}
		var data = {
			action: 'teleport',
			postid: Teleport.postid,
			type: Teleport.type,
			front_id: Teleport.front_id,
			admin: is_admin,
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
				teleporter.addClass("teleport_hover");
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
				if(teleporter.is(".teleport_hover")) {
					teleporter.removeClass("teleport_hover");
					var front = $(".teleport_front"); 
					var back = $(".teleport_back");
					back.removeClass('teleport_mouseover');
					back.css("z-index", "999990").stop().hide('fade', 'fast', function(){
						front.css("z-index", "999991").stop().show('scale', 'fast', function(){
							front.animate({rotate: '+=360deg'});
						});
					});
				}
			});

			$(".teleport_back").css("cursor", "pointer").on("click", function(e, el){
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

			overlay.on("click", function(e) {
				var e = jQuery.Event("keydown");
				e.which = 27; // # Some key code value
				overlay.trigger(e);
				e.preventDefault();
			});

			 $(window).on("keydown", function(e) {
					if(!$(e.target).is('input, textarea')) {
						if(e.which == 87) {
							if(teleporter.is(".teleport_open") && teleporter.is(".teleport_hover")) {
								var front = $(".teleport_front"); 
								var back = $(".teleport_back");
								back.removeClass('teleport_mouseover');
								back.css("z-index", "999990").stop().hide('fade', 'fast', function(){
									front.css("z-index", "999991").stop().show('scale', 'fast', function(){
										teleporter.removeClass("teleport_hover");
										front.animate({rotate: '+=360deg'}, function(){
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
											overlay.fadeOut(500, function(){
												teleport.hide();
											});		
										});
									});
								});
							} else if(teleporter.is(".teleport_open") && !teleporter.is(".teleport_hover")) {
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
								overlay.fadeOut(500, function(){
									teleport.hide();
								});
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
								overlay.fadeIn(500);
							}
						} else if(e.which == 27) {
							 if(teleporter.is('.teleport_open')) {
								teleporter.mouseleave();
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
								overlay.fadeOut(500, function(){
									teleport.hide();
								});
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
		var url = btn.children('.teleport_icon, .teleport_front').data('url');
		btn.addClass('teleport_pressed');
		jQuery(window).on("keyup", function(e){
			if(e.which == key) {
				btn.removeClass('teleport_pressed');
				window.location = url;
			}
		});
	}
}
})();
