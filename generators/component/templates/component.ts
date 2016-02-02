/// <reference path="../../../typings/dev.d.ts" />

'use strict';

module ComponentControllers {
  export class <%= name %> {
    public message:string;

    constructor() {
      'ngInject';
      this.message = "Component: <%= name %>";
    }
  }
}

(() => {
  var app:ng.IModule = angular.module('<%= appName %>');
  app.directive('<%= prefix %><%= name %>', () => {
    return {
      templateUrl: 'components/<%= name %>/<%= name %>.html',
      restrict: 'E',
      controller: ComponentControllers.<%= name %>,
      controllerAs: '<%= nameCamel %>Ctrl',
      bindToController: true
    }
  });
})();