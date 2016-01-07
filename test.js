var test = require('tape');
var xpath2css = require('./index');

test('convert', function(assert) {
  var actual, expected;

  actual = xpath2css('/HTML/HEAD/TITLE');
  expected = 'HTML > HEAD > TITLE';
  assert.equal(actual, expected, 'should handle upper case');

  actual = xpath2css('/html/head/title');
  expected = 'html > head > title';
  assert.equal(actual, expected, 'should handle lower case');

  actual = xpath2css('/HTML/BODY/DIV[@id=\'menu\']/NAV/UL[5]');
  expected = 'HTML > BODY > DIV#menu > NAV > UL:nth-of-type(5)';
  assert.equal(actual, expected);

  actual = xpath2css('//div[@id="foo"][2]/span[@class="bar"]//a[contains(@class, "baz")]//img[1]');
  expected = 'div#foo:nth-of-type(2) > span.bar a[class*=baz] img:first-of-type';
  assert.equal(actual, expected);

  assert.end();
});
