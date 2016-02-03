/// <reference path="../../typings/protractor.d.ts" />


describe('application: <%= name %>', () => {
  it('has a h1 that contains "<%= name %>"', () => {
    browser.get('/');

    var header:protractor.ElementFinder = element(by.css('body > md-toolbar'));
    var title:protractor.ElementFinder = header.$('h1');
    expect(title.getText()).toEqual('<%= name %>');
  });
});