/// <reference path="../../typings/dev.d.ts" />

'use strict';

module Services {
  export class <%= name %> {
    constructor() {
      'ngInject';
    }
  }
}

(() => {
  var app:ng.IModule = angular.module('<%= appName %>');
  app.service('<%= nameCamel %>Service', Services.<%= name %>);
})();

