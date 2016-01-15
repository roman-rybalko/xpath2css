var test = require('tape');
var xpath2css = require('./index');

test('basic', function(assert) {
	var actual, expected;

	actual = xpath2css('/HTML/HEAD/TITLE');
	expected = 'HTML > HEAD > TITLE';
	assert.equal(actual, expected, 'child, upper case');

	actual = xpath2css('//html//head//title');
	expected = 'html head title';
	assert.equal(actual, expected, 'descendant, lower case');

	assert.end();
});

test('converting', function(assert) {
	var actual, expected;

	actual = xpath2css("/HTML/BODY/DIV[@id='menu']/NAV/UL[5]");
	expected = "HTML > BODY > DIV[id='menu'] > NAV > UL:nth-of-type(5)";
	assert.equal(actual, expected, 'attribute, index (nth-of-type)');

	actual = xpath2css("//NAV/*[5]");
	expected = "NAV > *:nth-child(5)";
	assert.equal(actual, expected, 'index (nth-child)');

	actual = xpath2css("//x[position() = 5 and a = 'b']");
	expected = "x:nth-of-type(5)[a='b']";
	assert.equal(actual, expected, 'index "position() = n"');

	actual = xpath2css('//div[contains(@id, foo )]/ span [ contains ( @class , \' bar\' ) ] //a[contains(@class, "baz ")]//img');
	expected = 'div[id*=foo] > span[class*=\' bar\'] a[class*="baz "] img';
	assert.equal(actual, expected, '"contains" clause, spaces');

	actual = xpath2css('//*[starts-with(@data-id, " test ")]');
	expected = '*[data-id^=" test "]';
	assert.equal(actual, expected, '"starts-with" clause, spaces');

	actual = xpath2css('//*[ends-with(@data-test , "test")]');
	expected = '*[data-test$="test"]';
	assert.equal(actual, expected, '"ends-with" clause, spaces');

	actual = xpath2css('//*[ends-with(@data-test , "test") and @data-x = "xx"]');
	expected = '*[data-test$="test"][data-x="xx"]';
	assert.equal(actual, expected, '"and" clause');

	actual = xpath2css('//*[contains(text(), "substring")]');
	expected = '*:contains("substring")';
	assert.equal(actual, expected, '"contains(text(), ...)" clause');

	actual = xpath2css('//x[@a="1"]/.[@b="2"]');
	expected = 'x[a="1"][b="2"]';
	assert.equal(actual, expected, '"./" (self) clause');

	actual = xpath2css('//A[contains(@href, "www.example.com/test/") and contains(@href, "test=value")]');
	expected = 'A[href*="www.example.com/test/"][href*="test=value"]';
	assert.equal(actual, expected, 'multiple "contains"');

	actual = xpath2css('//A[starts-with(@href, "www.example.com/test/") and starts-with(@href, "test=value")]');
	expected = 'A[href^="www.example.com/test/"][href^="test=value"]';
	assert.equal(actual, expected, 'multiple "starts-with"');

	actual = xpath2css('//A[ends-with(@href, "www.example.com/test/") and ends-with(@href, "test=value")]');
	expected = 'A[href$="www.example.com/test/"][href$="test=value"]';
	assert.equal(actual, expected, 'multiple "ends-with"');

	actual = xpath2css('//DIV[contains(text(), "x") and contains(@class, \'bold\')]');
	expected = 'DIV:contains("x")[class*=\'bold\']';
	assert.equal(actual, expected, 'contains(text(), ...) and contains(@attr, ...)');

	actual = xpath2css('   //  x  [  42  ]   ');
	expected = 'x:eq(41)';
	assert.equal(actual, expected, 'index (eq), spaces');

	assert.end();
});

test('escaping', function(assert) {
	var actual, expected;

	actual = xpath2css('//x[@a = "a string with special chars and clauses like: \\\'::\\\', \\" and \\", \' or \', \', /, //, /////, /.., [, ], (, ) and @"]');
	expected = 'x[a="a string with special chars and clauses like: \\\'::\\\', \\" and \\", \' or \', \', /, //, /////, /.., [, ], (, ) and @"]';
	assert.equal(actual, expected, 'special chars & clauses');

	actual = xpath2css('//x[contains(text(), "//x[a=\'1\']")]');
	expected = 'x:contains("//x[a=\'1\']")';
	assert.equal(actual, expected, 'special chars & clauses, "contains(text(), ...)"');

	actual = xpath2css('//x[contains(text(), unquoted-string)]');
	expected = 'x:contains(unquoted-string)';
	assert.equal(actual, expected, 'unquoted string');

	assert.end();
});

test('comments', function(assert) {
	var actual, expected;

	actual = xpath2css('//x[ (: a comment with special chars and clauses like: \\\'::\\\', \\" and \\", \' or \', \', /, //, /////, /.., [, ], (, ) and @ :) a = 1 ]');
	expected = 'x[a=1]';
	assert.equal(actual, expected, 'XPATH 2.0 comment');

	actual = xpath2css('//x[a = 1 and "comment #1 with special chars and clauses like: \\\'::\\\', \\" and \\", \' or \', \', /, //, /////, /.., [, ], (, ) and @"]');
	expected = 'x[a=1]';
	assert.equal(actual, expected, 'always-true-string comment #1');

	actual = xpath2css('//x[ "comment #2 with special chars and clauses like: \\\'::\\\', \\" and \\", \' or \', \', /, //, /////, /.., [, ], (, ) and @" and a = "2"]');
	expected = 'x[a="2"]';
	assert.equal(actual, expected, 'always-true-string comment #2');

	assert.end();
});
