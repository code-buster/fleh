
var Fleh = new Class({

	Implements: Events,

	/**
	 * @var Fleh.Autopilot
	 */
	fa: null,

	/**
	 * @var Fleh.Values
	 */
	fv: null,

	/**
	 * @var Fleh.Log
	 */
	log: null,

	/**
	 * @var Fleh.Worker
	 */
	worker: null,

	/**
	 * @var storageName
	 */
	storageName: 'fleh',

	initialize: function(){
		this.fv = new Fleh.Values(this);
		this.fa = new Fleh.Autopilot(this);
		this.log = new Fleh.Log();
		this.createControls();
		this.setWorkerForCurrentUrl();
		this.startWorker();
		this.startAutopilot();
	},

	createControls: function(){
		var hook, fleh, dragHandle, savedPosition;
		hook = $('header');
		fleh = new Element('div', {
			'id': 'fleh'
		});
		dragHandle = new Element('div', {
			'id': 'fleh-drag-handle',
			'text': 'Fliplife Enhanced'
		});
		fleh.grab(dragHandle);
		fleh.grab(this.fa.control);
		fleh.grab(this.log.output);
		hook.grab(fleh);
		savedPosition = JSON.decode(window.localStorage.getItem('fleh-position'));
		if (savedPosition != null) {
			fleh.setStyles({
				'margin-left': savedPosition.x,
				'margin-top': savedPosition.y
			});
		}
		fleh.makeDraggable({
			handle: dragHandle,
			modifiers: {
				'x': 'margin-left',
				'y': 'margin-top'
			},
			onComplete: function(){
				window.localStorage.removeItem('fleh-position');
				window.localStorage.setItem('fleh-position', JSON.encode({
					'x': fleh.getStyle('margin-left'),
					'y': fleh.getStyle('margin-top')
				}));
			}.pass(fleh, this)
		});
	},

	setWorkerForCurrentUrl: function(){
		var url_current, url_project;
		url_current = this.fv.getCurrentUrl();
		url_project = '^' + this.fv.getCareerUrl() + '/projects/[0-9]+$';

		if (url_current == this.fv.getCareerUrl()) {
			this.worker = new Fleh.Worker.Career(this);

		} else if (url_current.match(url_project)) {
			this.worker = new Fleh.Worker.Project(this);

		} else {
			console.log('no match, no worker :-( (' + url_current + ').');
		}
	},

	startWorker: function(){
		if (!this.worker) {
			console.log('no worker set');
			return;
		}
		if (!this.worker.enhance) {
			console.log('no enhancements defined for worker');
			return;
		}
		this.worker.enhance();
	},

	startAutopilot: function(){
		if (!this.fa.isEnabled()) {
			return;
		}
		if (!this.worker) {
			console.log('no worker set. back to work.');
		} else if (!this.worker.autopilot) {
			console.log('no autopilot defined for worker.');
		} else {
			this.worker.autopilot();
			return;
		}
		// autopilot enabled, but don't know what to do
		// fallback: switch to career page
		if (this.fv.getCurrentUrl() != this.fv.getCareerUrl()) {
			Fleh.Tools.load(this.fv.getCareerUrl());
			return;
		}
		// reload every 60 seconds
		Fleh.Tools.reloadAfter(60);
	}

});
