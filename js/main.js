(function($) {
	// Old code.
	// var hash = location.hash.substring(1);
	// var $anchor = $("a[name='"+ hash +"']");
	// $(window).data('currentAnchor', $anchor);
	// Scroll the anchor in previous focus.
	// $.scrollTo($anchor, 0, {offset: {top: -1}});
	// updateNavbar();

	// When some link with a href starting with the # is clicked.
	$("a[href^='#']").click(function(e) {
		e.preventDefault();
		var hash = $(e.target).attr("href");
		if(!hash) hash = "";
		hash = hash.substring(1);

		$(window).data('scrollToActive', true);
		$.scrollTo("a[name='"+ hash +"']", 500, {
			axis : 'y',
			offset: {top: 0},
			onAfter: function() {
				$(window).data('scrollToActive', false);
				updateCurrentAnchor();
				updateNavbar();
			}
		});
	});

	function updateCurrentAnchor() {
		if($(window).data('scrollToActive') != true) {
			var scrollTop = $(window).scrollTop();
			var navbarHeight = $("body > .navbar").height();
			// Remember the previous anchor for comparison.
			var $previousAnchor = $(window).data('currentAnchor');
			var $currentAnchor = null;
			// Loop though anchors to see which is the last above the viewport.
			$("a[name]").each(function() {
				var offsetTop = $(this).offset().top;
				if(scrollTop - offsetTop + navbarHeight >= 0) {
					$currentAnchor = $(this);
				}
			});
			// Update the anchor.
			$(window).data('currentAnchor', $currentAnchor);
			if($previousAnchor && $currentAnchor && ($previousAnchor == null || !$previousAnchor.is($currentAnchor))) {
				if(history.pushState) { // check if the browser supports the pushState
					// Update the hash.
					history.pushState({}, "", "#"+$currentAnchor.attr("name"));
				}
				updateNavbar();
			}
		}
	}

	function adjustPageHeights() {
		var $previousAnchor = $(window).data('currentAnchor');
		// Make sure that a page is always as high as the window.
		var windowHeight = $(window).height();
		$(".page").css("min-height", windowHeight);
		updateCurrentAnchor();
		var $currentAnchor = $(window).data('currentAnchor');
		// If the current anchor has changed due to an ajustment in page height ..
		if($previousAnchor && !$previousAnchor.is($currentAnchor)) {
			$(window).data('scrollToActive', true);
			// Scroll to the previousAnchor.
			$.scrollTo($previousAnchor, 0, {
				axis : 'y',
				offset: { top: 0 },
				onAfter: function() {
					$(window).data('scrollToActive', false);
					updateCurrentAnchor();
				}
			});
		}
	}

	// Update the class on the navbar, based on the current anchor.
	function updateNavbar() {
		// Get the current anchor from the window's data.
		var $currentAnchor = $(window).data('currentAnchor');
		// What is the color for the navbar?
		var navbarColor = $currentAnchor.data("navbar-color");
		// Update the navbar classes.
		$("body > .navbar").removeClass("white blue marine black").addClass(navbarColor);
	}
	
	document.body.addEventListener('gesturechange', function() {
		document.title = "!!";
	});
	$(window).data('scrollToActive', false);
	$(window).scroll(updateCurrentAnchor);
	$(window).resize(adjustPageHeights).resize();
})(jQuery);
