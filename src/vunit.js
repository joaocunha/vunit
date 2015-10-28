/*!
 * @license MIT
 * @preserve
 *
 * vUnit.js: A vanilla JS alternative for vh and vw CSS units.
 * Version: 0.2.0
 * https://github.com/joaocunha/v-unit/
 *
 * @author João Cunha - joao@joaocunha.net - twitter.com/joaocunha
 */

;(function(win, doc, undefined) {
	'use strict';

	win.vUnit = function (options) {
		// Just an alias for easier readability (and to preserve `this` context)
		var vunit = this;

		// For extending the options
		var opts = options || {};

		vunit.options = {
			// The ID for the appended stylesheet
			stylesheetId: opts.stylesheetId || 'v-unit-stylesheet',

			// The interval between each check in miliseconds
			viewportObserverInterval: opts.viewportObserverInterval || 100,

			// The CSS rules to be vUnit'd
			CSSMap: opts.CSSMap || null,

			// onResize callback
			onResize: opts.onResize || function() {}
		};

		// Stores the viewport dimensions so the observer can check against it and update it.
		vunit.viewportSize = {
			height: 0,
			width: 0
		};

		/**
		 * @function init
		 * Triggers the execution of vUnit and wraps its main logic.
		 *
		 * It sets an observer to check if the viewport dimensions changed, running on an interval
		 * based on the viewportObserverInterval option. If the dimensions have changed, it creates
		 * an stylesheet, adds the calculated CSS rules to it and append it to the head.
		 *
		 * The observer is a cross-device event-less solution to keep track of everything that
		 * would trigger a resize on the viewport:
		 *
		 *  - Window resizing on desktop;
		 *  - Orientation changing on mobile;
		 *  - Scrollbars appearing/disappearing on desktop;
		 *  - Navigation bars appearing/disappearing on mobile;
		 *  - Zooming on mobile and desktop;
		 *  - Download bar on desktop;
		 *  - Password saving prompt on desktop;
		 *  - Etc.
		 *
		 * @returns {Function|Boolean} The observer function or false if no CSSMap was passed.
		 */
		vunit.init = function() {
			// We need a CSSMap to know what rules to create. Duh!
			if (opts.CSSMap) {

				// We pass a self-invoking function that returns itself to the setInterval method
				// so we can execute the first iteration immediately. This helps preventing FOUC.
				return win.setInterval((function viewportObserver() {

					if (viewportHasChanged()) {
						var stylesheet = createStylesheet();
						var CSSRules = createCSSRules();

						appendCSSRulesToStylesheet(CSSRules, stylesheet);
						appendStylesheetOnHead(stylesheet);
						vunit.options.onResize(vunit.viewportSize);
					}

					return viewportObserver;
				})(), vunit.options.viewportObserverInterval);
			} else {
				// Stops execution if no CSS rules were passed
				// TODO: raise an exception
				return false;
			}
		};

		/**
		 * @function viewportHasChanged
		 * Checks if the viewport dimensions have changed since the last checking.
		 *
		 * This checking is very inexpensive, so it allows to regenerate the CSS rules only when
		 * it's needed.
		 *
		 * @returns {Boolean} Wether the dimensions changed or not.
		 */
		var viewportHasChanged = function() {
			var currentViewportSize = calculateViewportSize();
			var differentHeight = (currentViewportSize.height !== vunit.viewportSize.height);
			var differentWidth = (currentViewportSize.width !== vunit.viewportSize.width);

			// Updates the global variable for future checking
			vunit.viewportSize = currentViewportSize;

			return (differentHeight || differentWidth);
		};

		/**
		 * @function createStylesheet
		 * Creates an empty stylesheet that will hold the v-unit rules.
		 *
		 * @returns {HTMLStyleElement} An empty stylesheet element.
		 */
		var createStylesheet = function() {
			var stylesheet = doc.createElement('style');

			stylesheet.setAttribute('rel', 'stylesheet');
			stylesheet.setAttribute('type', 'text/css');
			stylesheet.setAttribute('media', 'screen');
			stylesheet.setAttribute('id', vunit.options.stylesheetId);

			return stylesheet;
		};

		/**
		 * @function createCSSRules
		 * Create CSS rules based on the viewport dimensions.
		 *
		 * It loops through a map of CSS properties and creates rules ranging from 1 to 100 percent
		 * of its size.
		 *
		 * We used to Math.round() the values, but then we can't stack two .vw50 elements side by
		 * side on odd viewport widths. If we use Math.floor, we end up with a 1px gap. On the other
		 * hand, if we use pixel decimals (no round or floor), the browsers ajusts the width
		 * properly.
		 *
		 * Example:
		 * .vw1   {width: 20px;}
		 * .vw2   {width: 40px;}
		 *         ...
		 * .vw100 {width: 2000px;}
		 * .vh1   {height: 5px;}
		 * .vh2   {height: 10px;}
		 *         ...
		 * .vh100 {height: 500px;}
		 *
		 * @returns {String} The concatenated CSS rules in string format.
		 */
		var createCSSRules = function() {
			var computedHeight = (vunit.viewportSize.height / 100);
			var computedWidth = (vunit.viewportSize.width / 100);
			var vmin = Math.min(computedWidth, computedHeight);
			var vmax = Math.max(computedWidth, computedHeight);
			var map = vunit.options.CSSMap;
			var CSSRules = '';
			var value = 0;

			// Loop through all selectors passed on the CSSMap option
			for (var selector in map) {
				var property = map[selector].property;

				// Adds rules from className1 to className100 to the stylesheet
				for (var range = 1; range <= 100; range++) {

					// Checks what to base the value on (viewport width/height or vmin/vmax)
					switch (map[selector].reference) {
						case 'vw':
							value = computedWidth * range;
							break;
						case 'vh':
							value = computedHeight * range;
							break;
						case 'vmin':
							value = vmin * range;
							break;
						case 'vmax':
							value = vmax * range;
							break;
					}

					// Barebones templating syntax
					var CSSRuleTemplate = '_SELECTOR__RANGE_{_PROPERTY_:_VALUE_px}\n';

					CSSRules += CSSRuleTemplate.replace('_SELECTOR_', selector)
                                     .replace('_RANGE_', range)
                                     .replace('_PROPERTY_', property)
                                     .replace('_VALUE_', value);
				}
			}

			return CSSRules;
		};

		/**
		 * @function appendCSSRulesToStylesheet
		 * Appends the created CSS rules (string) to the empty stylesheet.
		 *
		 * @param {String} CSSRules A string containing all the calculated CSS rules.
		 * @param {HTMLStyleElement} stylesheet An empty stylesheet object to hold the rules.
		 */
		var appendCSSRulesToStylesheet = function(CSSRules, stylesheet) {
			// IE < 8 checking
			if (stylesheet.styleSheet) {
				stylesheet.styleSheet.cssText = CSSRules;
			} else {
				stylesheet.appendChild(doc.createTextNode(CSSRules));
			}
		};

		/**
		 * @function appendStylesheetOnHead
		 * Appends the stylesheet to the <head> element once the CSS rules are created.
		 *
		 * @param {HTMLStyleElement} stylesheet A populated stylesheet object.
		 */
		var appendStylesheetOnHead = function(stylesheet) {
			// Borrowed head detection from restyle.js - thanks, Andrea!
			// https://github.com/WebReflection/restyle/blob/master/src/restyle.js
			var head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;

			// Grabs the previous stylesheet
			var legacyStylesheet = doc.getElementById(vunit.options.stylesheetId);

			// Removes the previous stylesheet from the head, if any
			if (legacyStylesheet) {
				head.removeChild(legacyStylesheet);
			}

			// Add the new stylesheet to the head
			head.appendChild(stylesheet);
		};

		/**
		 * @function calculateViewportSize
		 * Calculates the size of the viewport.
		 *
		 * @returns {Object} An object containing the dimensions of the viewport.
		 *
		 * Example:
		 * return {
		 *     width: 768,
		 *     height: 1024
		 * }
		 */
		var calculateViewportSize = function() {
			var viewportSize = {
				height: doc.documentElement.clientHeight,
				width: doc.documentElement.clientWidth
			};

			return viewportSize;
		};
	};
})(window, document);
