/// <reference path="../../typings/karma.d.ts" />

'use strict';

describe('app', () => {
  it('creates an angular app named "<%= name %>"', () => {
    expect(() => { angular.module('<%= name %>'); }).not.toThrow();
  });
});