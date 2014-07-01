/**
 * Model that defines a container.
 * Containers are represented by petridishes, test tubes and microtiterplates.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'underscore',
	'models/container-content'
], function(_, ContainerContent) {

	var defaults = {
		content: null,
		type: '', //Can be 'petridish', 'testtube', 'microtiterplate'
		maxConcentration: 11, //11 is tube default
		maxBiomass: 10.1 //10.1 is tube default
	};
	
	function Container(options) {
		if(typeof options == 'string' || options instanceof String) {
			_.extend(this, defaults);
			this.name = options;
			return;
		}

		defaults.content = new ContainerContent();

		_.extend(this, defaults, options);
	}

	Container.prototype = {
		addContent: addContent,
		getContent: getContent,
		isFull: isFull,
		isEmpty: isEmpty,
		hasContent: hasContent,
		hasPlaceFor: hasPlaceFor,
		clone: clone
	};
	
	return Container;

	/**
	 * @param content: {
	 *		genes: [],
	 *		microorganisms: []
	 * }
	 */
	function addContent(content) {
		this.content.addContent(content);
	}

	function getContent() {
		return this.content;
	}

	function isFull() {
		return this.content.totalLogConcentration >= this.maxConcentration;
	}

	function isEmpty() {
		return (this.content === null || this.content.isEmpty());
	}

	function hasContent() {
		return (this.content.genes.length > 0 || (this.content.microorganisms.length > 0 && this.content.totalLogConcentration > 0) || this.content.other.length > 0);
	}

	function hasPlaceFor(content) {
		var contentTotalConcentration = 0;
		for(i = 0; i < content.microorganisms.length; i++) {
			contentTotalConcentration += content.microorganisms[i].logConcentration;
		}
		return (contentTotalConcentration + this.content.totalLogConcentration <= this.maxConcentration);
	}

	function clone() {
		var cloned;

		cloned = new Container({
			content: this.content.clone(),
			type: this.type,
			maxConcentration: this.maxConcentration
		});

		return cloned;
	}
});
