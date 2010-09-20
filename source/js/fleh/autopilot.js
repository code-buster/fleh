Fleh.Autopilot = Class.create(
		{
			max: null,
			
			homeUrl: null,
			
			enabled: false,
			
			init: function()
			{
				if (window.location.href.indexOf('autopilot=0')>-1) {
					console.log('autopilot disabled via url');
					jQuery.cookie('autopilot', '0');
				} else if (window.location.href.indexOf('autopilot=1')>-1) {
					console.log('autopilot enabled via url');
					jQuery.cookie('autopilot', '1');
					this.enabled = true;
				} else if (jQuery.cookie('autopilot')==1) {
					console.log('autopilot enabled via cookie');
					this.enabled = true;
				}
				if (!this.enabled) {
					return;
				}
				var match;
				if (match = window.location.href.match(/^http:\/\/fliplife.com\/companies\/(\d)$/)) {
					// übersicht activities
					// aktiven Job finden und dahin wechseln
					this.findCurrentActivityAndSwitch();
					
				} else if (match = window.location.href.match(/^http:\/\/fliplife.com\/companies\/(\d)\/projects\/(\d+)$/)) {
					// activity
					this.handleActivity(match[2]);
				}
			},
			
			findCurrentActivityAndSwitch: function()
			{
				var current, link, href;
				current = $('ul.activities li.orange');
				if (!current.length) {
					// keine aktiven Jobs
					return;
				}
				current = $(current[0]);
				link = current.find('div.proceed a');
				if (!link.length) {
					// Fehler, keinen Link gefunden
					return;
				}
				link = $(link[0])[0];
				href = link.href;
				window.location.href = href;
			},
			
			handleActivity: function(id)
			{
				var container = jQuery('#activityActionContainer');
				
				if (container.find('#timeSlider.busy').length) {
					console.log('you are busy doing this project.');
					
				} else if (container.find('#timeSlider').length) {
					// find max energy value, set and submit
					var meter = $(container.find('#timeSlider .meter')[0]);
					var max = meter.attr('data-max');
					var input = jQuery('#fe-amount');
					input.val(max);
					input.val(1);
					var form = jQuery('#submitForm');
					// form.submit();
					
				} else if (container.find('.unable').length) {
					console.log('project done.');
					
				} else if (container.find('.busy').length) {
					console.log('you are busy.');
					
				} else {
					console.log('???');
					
				}			
			}
		}
);
