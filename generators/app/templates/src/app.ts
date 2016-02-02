/// <reference path="../typings/dev.d.ts" />

'use strict';

(() => {
  var app:ng.IModule = angular.module('<%= name %>', ['<%= name %>Templates', 'ngMaterial', 'ngRoute']);
  app.config(appConfig);

  function appConfig($mdThemingProvider:ng.material.IThemingProvider, $routeProvider:angular.route.IRouteProvider) {
    'ngInject';
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('orange');

    $routeProvider
      .otherwise('/');
  }
})();