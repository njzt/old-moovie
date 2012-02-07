/*
---

name: OldMoovieEffect

description: Old movie effect.

license: MIT-style

authors:
- Pawel Suder

requires:
- Core/Class.Extras
- Core/Element.Dimensions

provides: 
- OldMoovieEffect
- OldMoovieComponent

...
*/

var OldMoovieEffect = new Class({
	Implements: Options,
	options: {
		lines: 1,
		scratches: 3,
		mask: true,
		interval: 100,
		imgDirPath: '',
		autoStart: true,
		container: null
	},

	initialize: function(areaElement, options) {
		this.setOptions(options);

		this.components = [];

		['lines', 'scratches', 'mask'].each(function(compName) {
			var i = 0 + this.options[compName];
			while (i--) {
				this.components.push(new OldMoovieComponent(compName, areaElement, this.options));
			}
		},
		this);

		if (this.options.autoStart) {
			this.start();
		}

	},

	start: function() {
		this.components.each(function(comp) {
			comp.start();
		});
	},

	stop: function() {
		this.components.each(function(comp) {
			comp.stop();
		});
	}

})

var OldMoovieComponent = new Class({
	Implements: Options,
	options: {
		interval: 100,
		imgDirPath: '',
		container: null
	},

	initialize: function(type, area, options) {

		this.setOptions(options);

		this.area = $(area);
		this.areaProps = this.area.retrieve('areaProps');

		if (!this.areaProps) {
			this.areaProps = {
				size: this.area.getSize(),
				pos: this.area.getPosition($(this.options.container))
			};
			this.area.store('areaProps', this.areaProps);
		}

		this['prepare' + type.capitalize() + 'Component']();
		this.element.inject(this.options.container);
	},

	start: function() {
		this.element.setStyle('display', 'block');
		this.intervalID = (function() {
			this.frameAction();
		}).periodical(this.options.interval, this);
	},

	stop: function() {
		clearInterval(this.intervalID);
		this.element.setStyle('display', 'none');
	},

	prepareLinesComponent: function() {
		this.element = new Element('span', {
			styles: {
				display: 'none',
				position: 'absolute',
				top: this.areaProps.pos.y + 'px',
				width: '1px',
				height: this.areaProps.size.y + 'px',
				background: '#ccc',
				zIndex: 99999
			}
		});

		this.frameAction = function() {
			this.element.setStyles({
				left: this.areaProps.pos.x + Number.random(0, this.areaProps.size.x) + 'px',
				opacity: (Number.random(0, 3) / 10)
			})
		};
	},

	prepareScratchesComponent: function() {

		var scratchesForArea = (this.area.retrieve('scratchesForArea'));
		this.area.store('scratchesForArea', scratchesForArea + 1)

		this.element = new Element('img', {
			// get one of 3 gif images
			src: this.options.imgDirPath + 'oldmovie-scratch-' + ((scratchesForArea % 3) + 1) + '.gif',
			styles: {
				display: 'none',
				position: 'absolute',
				zIndex: 99999
			}
		});

		this.frameAction = function() {
			this.element.setStyles({
				left: this.areaProps.pos.x + Number.random(0, this.areaProps.size.x) + 'px',
				top: this.areaProps.pos.y + Number.random(0, this.areaProps.size.y) + 'px',
				height: Number.random(3, 16) + 'px',
				width: Number.random(3, 16) + 'px',
				opacity: (Number.random(1, 5) / 10)
			})
		};
	},

	prepareMaskComponent: function() {
		this.element = new Element('img', {
			src: this.options.imgDirPath + 'oldmovie-radial-mask.png',
			styles: {
				display: 'none',
				position: 'absolute',
				top: this.areaProps.pos.y + 'px',
				left: this.areaProps.pos.x + 'px',
				height: this.areaProps.size.y + 'px',
				width: this.areaProps.size.x + 'px',
				opacity: 0.1,
				zIndex: 99999
			}
		});

		this.frameAction = function() {
			this.element.setStyles({
				opacity: (Number.random(1, 3) / 10)
			})
		}.bind(this);
	}

})

