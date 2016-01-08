var test = require('tape');
var xpath2css = require('./index');

test('basic', function(assert) {
	var actual, expected;

	actual = xpath2css('/HTML/HEAD/TITLE');
	expected = 'HTML > HEAD > TITLE';
	assert.equal(actual, expected, 'child, upper case');

	actual = xpath2css('/html/head/title');
	expected = 'html > head > title';
	assert.equal(actual, expected, 'child, lower case');

	actual = xpath2css("/HTML/BODY/DIV[@id='menu']/NAV/UL[5]");
	expected = "HTML > BODY > DIV[id='menu'] > NAV > UL:eq(4)";
	assert.equal(actual, expected, 'attribute, index');

	actual = xpath2css('//div[contains(@id, foo )][2]/ span [ contains ( @class , \' bar\' ) ] //a[contains(@class, "baz ")]//img[1]');
	expected = 'div[id*=foo]:eq(1) > span[class*=\' bar\'] a[class*="baz "] img:eq(0)';
	assert.equal(actual, expected, 'descendant, "contains" clause, spaces');

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

	assert.end();
});
