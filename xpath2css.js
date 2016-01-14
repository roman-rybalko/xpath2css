#!/usr/bin/env node

var xpath2css = require('./index');

if (!process.argv[2])
	console.log('USAGE: ' + process.argv[1] + ' <xpath>');
else
	console.log(xpath2css(process.argv[2]));
