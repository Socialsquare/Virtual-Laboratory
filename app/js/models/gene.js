/**
 * Model that defines a gene.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'underscore',
	'models/dnaelement'
], function(_, DNAElement) {

	var defaults = {
		dnaElements: []
	};
	
	function Gene(dnaElements) {
		if(dnaElements.length > 0) {
			this.dnaElements = dnaElements;
		}
	}

	Gene.prototype = {
		equals: equals,
		clone: clone
	};
	
	return Gene;

	function equals(gene) {
		var same = true,
			i = 0;
		while(same === true && i < this.dnaElements.length) {
			if(!this.dnaElements[i].equals(gene[i])) {
				same = false;
			}
			i++;
		}
		return same;
	}

	function clone() {
		var dnaElements = [],
			cloned, i;
		for(i = 0; i < this.dnaElements; i++) {
			dnaElements.push(this.dnaElements[i].clone());
		}
		cloned = new Gene({
			dnaElements: dnaElements
		});
		return cloned;
	}
});
