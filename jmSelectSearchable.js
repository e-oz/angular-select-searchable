'use strict';

angular.module('jm-select-searchable', [])
  .directive('jmSelectSearchable', function ($timeout) {
    return {
      template: '<div>\
                   <div class="form-control" ng-class="selectInputClass" style="overflow: hidden;" ng-click="switchMenu()" ng-disabled="ngDisabled">\
                     <button type="button" class="pull-right text-center" ng-class="caretButtonClass" ng-hide="show_list" tabindex="-1" ng-disabled="ngDisabled" style="margin: 0 -5px; padding: 0; border: none; background-color: #fff;">\
                       <span class="caret"></span>\
                     </button>\
                     <button type="button" class="pull-right text-center dropup" ng-class="caretButtonClass" ng-show="show_list" tabindex="-1" style="margin: 0 -5px; padding: 0; border: none; background-color: #fff;">\
                       <span class="caret"></span>\
                     </button>\
                     {{ getItemString(currentObject) }}\
                   </div>\
                     <div ng-show="show_list" class="dropdown">\
                         <div style="position: absolute; top: 100%; left: 0; z-index: 1000; float: left;">\
                             <div ng-show="show_list" class="input-group">\
                                 <input class="form-control" id="jmSelectSearchableInput{{$id}}" ng-class="searchInputClass" ng-model="search" ng-blur="blurHide()" placeholder="Введите данные для поиска"/>\
                                 <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>\
                             </div>\
                             <ul class="dropdown-menu col-sm-12" ng-show="search" style="display: block;">\
                                 <li ng-repeat="object in objects | filter:search | orderBy:variantsOrderBy | limitTo:listLength">\
                                     <a  style="overflow: hidden;" tabindex="-1" href="" ng-click="setObject(object)">{{ getItemString(object) }}</a>\
                                 </li>\
                             </ul>\
                         </div>\
                     </div>\
                 </div>',
      restrict: 'AE',
      scope: {
        objects: "=",
        ngModel: "=",
        ngChange: "&",
        printAttrs: "@",
        variantsOrderBy: '@orderBy',
        ngDisabled: '=',
        selectInputClass: '@',
        searchInputClass: '@',
        caretButtonClass: '@',
        listLength: '@',
        modelField: '@'
      },
      compile: function (element, tAttrs) {
        tAttrs.printAttrs = tAttrs.printAttrs.replace(/{{/g, '[[');
        tAttrs.printAttrs = tAttrs.printAttrs.replace(/}}/g, ']]');
        if (!tAttrs.listLength) {
          tAttrs.listLength = 10;
        }
      },
      controller: function ($scope, $interpolate) {
        if ($scope.ngModel) {
          if ($scope.modelField) {
            var s = {};
            s[$scope.modelField] = $scope.ngModel;
            $scope.currentObject = _.find($scope.objects, s);
          }
          else {
            $scope.currentObject = $scope.ngModel;
          }
        }
        $scope.setObject = function (object) {
          $scope.currentObject = object;
          if ($scope.modelField) {
            $scope.ngModel = object[$scope.modelField];
          }
          else {
            $scope.ngModel = object;
          }
          $scope.show_list = false;
          $scope.search = '';
          if (angular.isFunction($scope.ngChange)) {
            $scope.ngChange();
          }
        };

        $scope.$watch('ngDisabled', function (newValue) {
          if (newValue) {
            $scope.show_list = false;
          }
        });

        $scope.switchMenu = function () {
          if ($scope.ngDisabled) {
            return false;
          }
          $scope.show_list = !$scope.show_list;
          $timeout(function () {
            if ($scope.show_list) {
              var inputBox = $('#jmSelectSearchableInput' + $scope.$id);
              if (inputBox) {
                inputBox.focus();
              }
            }
          }, 50);
        };

        $scope.blurHide = function () {
          $timeout(function () {
            $scope.show_list = false;
          }, 500);
        };

        $scope.getItemString = function (item) {
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
