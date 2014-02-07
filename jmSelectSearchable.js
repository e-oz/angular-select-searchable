'use strict';

angular.module('jm-select-searchable')
  .directive('jmSelectSearchable', function() {
               return {
                 templateUrl: 'views/selectSearchable.html',
                 restrict:    'AE',
                 scope:       {
                   objects:         "=",
                   ngModel:         "=",
                   ngChange:        "&",
                   printAttrs:      "@",
                   variantsOrderBy: '@orderBy',
                   ngDisabled:      '='
                 },
                 compile:     function(element, tAttrs) {
                   tAttrs.printAttrs = tAttrs.printAttrs.replace(/{{/g, '[[');
                   tAttrs.printAttrs = tAttrs.printAttrs.replace(/}}/g, ']]');
                 },
                 controller:  function($scope, $interpolate) {
                   $scope.setObject = function(object) {
                     $scope.ngModel = object;
                     $scope.show_list = false;
                     $scope.search = '';
                     if (angular.isFunction($scope.ngChange)) {
                       $scope.ngChange();
                     }
                   };

                   $scope.$watch('ngDisabled', function(newValue) {
                     if (newValue) {
                       $scope.show_list = false;
                     }
                   });

                   $scope.switchMenu = function() {
                     if ($scope.ngDisabled) {
                       return false;
                     }
                     $scope.show_list = !$scope.show_list;
                   };

                   $scope.getItemString = function(item) {
                     if (angular.isUndefined(item)) {
                       return '';
                     }
                     if (!$scope.printAttrs || !angular.isString($scope.printAttrs)) {
                       $scope.printAttrs = '{{ first_name }} {{ last_name }}';
                     }
                     else {
                       $scope.printAttrs = $scope.printAttrs.replace(/\[\[/g, '{{');
                       $scope.printAttrs = $scope.printAttrs.replace(/\]\]/g, '}}');
                     }
                     return $interpolate($scope.printAttrs)(item);
                   };
                 }
               };
             });
