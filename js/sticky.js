(function($) {

  var $headerHeight = $('#header').outerHeight() + 34;	
  var $extraHeight = ($('#wpadminbar').length > 0) ? 28 : 0; //admin bar
  
  $(window).load(function(){
   	 $headerHeight = $('#header').outerHeight() + 34;	
     $extraHeight = ($('#wpadminbar').length > 0) ? 28 : 0; //admin bar
  });
 
  $.fn.extend({
    stickyMojo: function(options) {

      var settings = $.extend({
        'footerID': '',
        'contentID': '',
        'orientation': $(this).css('float')
      }, options);

      var sticky = {
        'el': $(this),  
        'stickyLeft': $(settings.contentID).outerWidth() + $(settings.contentID).offset.left,
        'stickyTop2': $(this).offset().top,
        'stickyHeight': $(this).outerHeight(true),
        'contentHeight': $(settings.contentID).outerHeight(true),
        'win': $(window),
        'breakPoint': $(this).outerWidth(true) + $(settings.contentID).outerWidth(true),
        'marg': parseInt($(this).css('margin-top'), 10)
      };

      var errors = checkSettings();
      cacheElements();

      return this.each(function() {
        buildSticky();
      });

      function buildSticky() { 
        if (!errors.length) {
          sticky.el.css('left', sticky.stickyLeft);

          sticky.win.bind({
            'scroll': stick,
            'resize': function() {
              sticky.el.css('left', sticky.stickyLeft);
              sticky.contentHeight = $(settings.contentID).outerHeight(true);
              sticky.stickyHeight =  sticky.el.outerHeight(true);

              stick();
              toLiveOrDie();
            }
          });
          
          $(window).load(toLiveOrDie);
          
        } else {
          if (console && console.warn) {
            console.warn(errors);
          } else {
            alert(errors);
          }
        }
      }
	  
	  //destroy sticky sidebar if the sidebar is shorter than the content area
	  function toLiveOrDie(){
	  	if(parseInt($('#sidebar').height()) + 50 >= parseInt($('#post-area').height())) {
      	 	sticky.win.unbind('scroll', stick);
      	 	sticky.el.removeClass('fixed-sidebar');
      	 	sticky.el.css({
      	 		'position':'relative',
      	 		'top' : 0,
      	 		'margin-left' : 0,
      	 		'bottom' : 0
      	 	});
      	 }
      	 else {
      	 	sticky.win.unbind('scroll', stick);
      	 	sticky.win.bind('scroll', stick);
      	 	sticky.el.addClass('fixed-sidebar');
      	 }
	  }
	  
      // Caches the footer and content elements into jquery objects
      function cacheElements() {
        settings.footerID = $(settings.footerID);
        settings.contentID = $(settings.contentID);
      }

      //  Calcualtes the limits top and bottom limits for the sidebar
      function calculateLimits() {
        return {
          limit: settings.footerID.offset().top - sticky.stickyHeight - $headerHeight - $extraHeight,
          windowTop: sticky.win.scrollTop(),
          stickyTop: sticky.stickyTop2 - sticky.marg - $headerHeight - $extraHeight
        }
      }

      // Sets sidebar to fixed position
      function setFixedSidebar() {
        sticky.el.css({
          position: 'fixed',
          top: $headerHeight + $extraHeight,
          bottom : 'auto'
        });
      }

      // Determines the sidebar orientation and sets margins accordingly
      function checkOrientation() {
        if (settings.orientation === "left") {
          settings.contentID.css('margin-left', sticky.el.outerWidth(true));
        } else {
          sticky.el.css('margin-left', settings.contentID.outerWidth(true));
        }
      }

      // sets sidebar to a static positioned element
      function setStaticSidebar() {
        sticky.el.css({
          'position': 'static',
          'margin-left': '0px',
          'bottom' : 'auto'
        });
        settings.contentID.css('margin-left', '0px');
      }

      // initiated to stop the sidebar from intersecting the footer
      function setLimitedSidebar(diff) {

        sticky.el.css({
          position: 'absolute',
          top: 'auto',
          bottom  : -38
        });
      }

      //determines whether sidebar should stick and applies appropriate settings to make it stick
      function stick() {
        var tops = calculateLimits();
        var hitBreakPoint = tops.stickyTop < tops.windowTop && (sticky.win.width() >= sticky.breakPoint);
		$headerHeight = $('#header').outerHeight() + 34;	
		
        if (hitBreakPoint) {
          setFixedSidebar();
          checkOrientation();
        } else {
          setStaticSidebar();
        }
        if (tops.limit < tops.windowTop) {
          var diff = tops.limit - tops.windowTop;
          setLimitedSidebar(diff);
        }

      }

      // verifies that all settings are correct
      function checkSettings() {
        var errors = [];
        for (var key in settings) {
          if (!settings[key]) {
            errors.push(settings[key]);
          }
        }
        ieVersion() && errors.push("NO IE 7");
        return errors;
      }

      function ieVersion() {
        if(document.querySelector) {
          return false;
        }
        else {
          return true;
        }
      }
    }
  });
})(jQuery);
