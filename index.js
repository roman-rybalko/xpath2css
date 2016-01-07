/**
 * The simplest XPATH to CSS selector conversion tool.
 *
 * https://github.com/roman-rybalko/xpath2css
 *
 */

'use strict';

function xpath2css(xpath) {
	return xpath
		.replace(/\[(\d+?)\]/g, function(s,m1){ return '['+(m1-1)+']'; })
		.replace(/^\/+/, '')
		.replace(/\/{2}/g, ' ')
		.replace(/\/+/g, ' > ')
		.replace(/@/g, '')
		.replace(/\[(\d+)\]/g, ':eq($1)')
		.replace(/^\s+/, '');
}

module.exports = xpath2css;
