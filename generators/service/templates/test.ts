/// <reference path="../../../typings/karma.d.ts" />
/// <reference path="../../../src/services/<%= name %>.ts" />

'use strict';

describe('Service: <%= name %>', () => {
  var service:Services.<%= name %>;

  beforeEach(angular.mock.module("<%= appName %>"));
  beforeEach(angular.mock.inject(($injector:ng.auto.IInjectorService) => {
    service = <Services.<%= name %>> $injector.get('<%= nameCamel %>Service');
  }));

  it('creates an angular service named "<%= nameCamel %>Service"', () => {
    expect(service).toBeDefined();
  });
});