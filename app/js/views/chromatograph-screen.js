/**
 * Backbone view controller for the chromatograph screen view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'flot',
	'globals',
	'text!../../templates/chromatograph-screen.html'
], function($, _, Backbone, Flot, Globals, chromatographScreenViewTemplate) {
	var view = Backbone.View.extend({
		template: _.template(chromatographScreenViewTemplate),
		initialize: function(options) {
			this.viewID = options.viewID;
		},
		close: function() {
			this.unbindEvents();
			this.$el.html('');
		},
		updateSubviewElements: function() {
		},
		render: function() {
			this.renderTemplate();
			this.bindEvents();

			updateDisplay();

			return this;
		},
		renderTemplate: function() {
			var variables = {
				title: 'Kromatograf skærm'
			};
			this.$el.html(this.template(variables));

			Globals.topMenuView.toggleBackLink(true);


		},
		bindEvents: function() {
			var view = this,
				plot;

			plot = $.plot($(".fermentor-graph"), view.getPlotData(), {
				xaxes: [{
					min: 0,
					max: 60 * 4
				}],
				yaxes: [{
					min: 0,
					max: 20
				}, {
					min: 0,
					max: 1,
					position: 'right'
				}],
				legend: {
					show: true
				}
			});

			this.graphIntervalID = window.setInterval(function() {
				plot.setData(view.getPlotData());
				plot.draw();
			}, 200); //We just need to keep it faster than the fermentor dt

			this.$el.on('click', '#fermentor-phup-btn', this, phUp);
			this.$el.on('click', '#fermentor-phdown-btn', this, phDown);
			this.$el.on('click', '#fermentor-tempup-btn', this, tempUp);
			this.$el.on('click', '#fermentor-tempdown-btn', this, tempDown);
			this.$el.on('click', '#fermentor-start-btn', this, toggleFermentor);

			this.displayInterval = setInterval(updateFunction(this), 1000);
		},
		unbindEvents: function() {
			this.$el.off('click', '#fermentor-phup-btn', phUp);
			this.$el.off('click', '#fermentor-phdown-btn', phDown);
			this.$el.off('click', '#fermentor-tempup-btn', tempUp);
			this.$el.off('click', '#fermentor-tempdown-btn', tempDown);
			this.$el.off('click', '#fermentor-start-btn', toggleFermentor);

			clearInterval(this.graphIntervalID);
			clearInterval(this.displayInterval);
		},
		getPlotData: getPlotData
	});
	
	return view;

	/* GRAPH MANIPULATION */
	function getPlotData() {
		var fermentor = Globals.lab.get('fermentor'),
			substrate = fermentor.attributes.substrate,
			biomass = fermentor.attributes.biomass,
			product = fermentor.attributes.product,
			substratePlot = [],
			biomassPlot = [],
			productPlot = [],
			data, i;

		for(i = 0; i < substrate.length; i++) {
			substratePlot[i] = [i, substrate[i]];
			biomassPlot[i] = [i, biomass[i]];
			productPlot[i] = [i, product[i]];
		}

		data = [{
			data: substratePlot,
			yaxis: 1,
			label: 'Substrat',
			color: '#ff301b'
		}, {
			data: biomassPlot,
			yaxis: 1,
			label: 'Biomasse',
			color: '#29db32'
		}, {
			data: productPlot,
			yaxis: 2,
			label: 'Produkt',
			color: '#0d12f9'
		}];

		/*if(data[0].data.length > 1) {
			console.log('------ GRAPH DATA');
			console.log(data);	
		}*/

		return data;
	}

	function phUp(event) {
		var fermentor = Globals.lab.get('fermentor');
		fermentor.phUp();
		updateDisplay();
	}

	function phDown(event) {
		var fermentor = Globals.lab.get('fermentor');
		fermentor.phDown();
		updateDisplay();
	}

	function tempUp(event) {
		var fermentor = Globals.lab.get('fermentor');
		fermentor.tempUp();
		updateDisplay();
	}

	function tempDown(event) {
		var fermentor = Globals.lab.get('fermentor');
		fermentor.tempDown();
		updateDisplay();
	}

	function toggleFermentor(event) {
		var fermentor = Globals.lab.get('fermentor'),
			$this = $(this);
		fermentor.toggle();
		$this.removeClass('running');
		if(fermentor.attributes.running) {
			$this.addClass('running');
			$this.html('Stop');
		}
		else {
			$this.html('Start');
		}
	}

	function updateDisplay() {
		var fermentor = Globals.lab.get('fermentor'),
			hours = Math.round(fermentor.get('time') / 60),
			minutes = fermentor.get('time') - hours;

		if(hours < 10) {
			hours = 0 + '' + hours;
		}
		if(minutes < 10) {
			minutes = 0 + '' + minutes;
		}

		$('#fermentor-ph').html(fermentor.get('ph').toFixed(1));
		$('#fermentor-temp').html(fermentor.get('temperature').toFixed(1));
		$('#fermentor-time').html(hours + ':' + minutes);
	}

	function updateFunction(view) {
		var returnFunction = function(event) {
			updateDisplay();
		};
		return returnFunction;
	}
});