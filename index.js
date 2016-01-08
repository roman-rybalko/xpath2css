/**
 *
 * The simplest XPATH to CSS selector conversion tool.
 *
 * https://github.com/roman-rybalko/xpath2css
 *
 */

'use strict';

function xpath2css(xpath) {
	if (xpath.match(/\s+or\s+/))
		throw 'xpath2css: xpath "or" clause is not supported';  // ambiguous
	if (xpath.match(/::/))
		throw 'xpath2css: xpath axes (/axis::) are not supported';
	if (xpath.match(/\/\.\./))
		throw 'xpath2css: xpath parent (/..) clause is not supported';  // unsupported by css, see https://css-tricks.com/parent-selectors-in-css/
	if (xpath.match(/\/\/\./))
		throw 'xpath2css: xpath clause "//." is not supported';
	return xpath
		.replace(/\s+and\s+/g, '][')  // "and" clause
		.replace(/^\s+/, '')  // extra space
		.replace(/\s+$/, '')  // extra space
		.replace(/\s*\[\s*/g, '[')  // extra space
		.replace(/\s*\]\s*/g, ']')  // extra space
		.replace(/\s*\(\s*/g, '(')  // extra space
		.replace(/\s*\)\s*/g, ')')  // extra space
		.replace(/\s*(\/+)\s*/g, '$1')  // extra space
		.replace(/\s*,\s*/g, ',')  // extra space
		.replace(/\s*=\s*/g, '=')  // extra space
		.replace(/^\/+/, '')  // remove root "/" since it's irrelevant in css
		.replace(/\/\/+/g, '//')  // fix "////" "///" clauses
		.replace(/\[(\d+)\]/g, function(s,m1){return ':eq('+(m1-1)+')';})  // index
		.replace(/\/\./g, '')  // self (parent clause "/.." should be handled here)
		.replace(/\/\//g, ' ')  // descendant
		.replace(/\//g, ' > ')  // child
		.replace(/@/g, '')  // attribute
		.replace(/\[contains\(text\(\),(\S+?|"[^"]+?"|'[^']+?')\)\]/g, ':contains($1)')  // "contains(text(), ...)" clause (jQuery only)
		.replace(/contains\((\S+),(\S+?|"[^"]+?"|'[^']+?')\)/g, '$1*=$2')  // "contains" clause
		.replace(/starts\-with\((\S+),(\S+?|"[^"]+?"|'[^']+?')\)/g, '$1^=$2')  // "starts-with" clause
		.replace(/ends\-with\((\S+),(\S+?|"[^"]+?"|'[^']+?')\)/g, '$1\$=$2')  // "ends-with" clause
	;
}

module.exports = xpath2css;
