/// <reference path="../../../../typings/protractor.d.ts" />

'use strict';

describe('Component: <%= name %>', () => {

  it('has a message that contains "Component: <%= name %>"', () => {
    browser.get('/test.component?component=<%= prefix ? prefix + "-" : "" %><%= directiveElementName %>');

    var message:protractor.ElementFinder = element(by.binding('<%= nameCamel %>Ctrl.message'));
    expect(message.getText()).toEqual('Component: <%= name %>');
  });
});