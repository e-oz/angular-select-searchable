'use strict';

angular.module('jm-select-searchable', [])
  .directive('jmSelectSearchable', function ($timeout) {
    return {
      template: '<div>\
      <style>.jm-select-searchable-caret-btn{margin: 0 -5px; padding: 0; border: none; background-color: #fff;}\
       .jm-select-searchable-items-list{position: absolute; top: 100%; left: 0; z-index: 1000; float: left; min-width: 230px;}\
       .jm-select-searchable-list-item{overflow: hidden;}\
       .jm-select-searchable-select-input{overflow: hidden;}\
      </style>\
                   <div class="form-control jm-select-searchable-select-input" ng-class="selectInputClass" ng-click="switchMenu()" ng-disabled="ngDisabled">\
                     <button type="button" class="pull-right text-center jm-select-searchable-caret-btn" ng-class="caretButtonClass" ng-hide="show_list" tabindex="-1" ng-disabled="ngDisabled">\
                       <span class="caret"></span>\
                     </button>\
                     <button type="button" class="pull-right text-center dropup jm-select-searchable-caret-btn" ng-class="caretButtonClass" ng-show="show_list" tabindex="-1">\
                       <span class="caret"></span>\
                     </button>\
                     {{ getItemString(currentObject) }}\
                   </div>\
                     <div ng-show="show_list" class="dropdown">\
                         <div class="jm-select-searchable-items-list">\
                             <div ng-show="show_list" class="input-group">\
                                 <input class="form-control" id="jmSelectSearchableInput{{$id}}" ng-class="searchInputClass" ng-model="search" ng-blur="blurHide()" placeholder="{{searchPlaceholder}}"/>\
                                 <span ng-hide="hideSearchIcon" class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>\
                             </div>\
                             <ul ng-if="objects.length" class="dropdown-menu col-sm-12" ng-show="search" style="display: block;">\
                                 <li ng-repeat="object in objects | filter:search | orderBy:variantsOrderBy | limitTo:listLength track by $index">\
                                     <a  class="jm-select-searchable-list-item" tabindex="-1" href="" ng-click="setObject(object)">{{ getItemString(object) }}</a>\
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
        modelField: '@',
        hideSearchIcon: '@',
        searchPlaceholder: '@'
      },
      compile: function (element, tAttrs) {
        tAttrs.printAttrs = tAttrs.printAttrs.replace(/{{/g, '[[');
        tAttrs.printAttrs = tAttrs.printAttrs.replace(/}}/g, ']]');
        if (!tAttrs.listLength) {
          tAttrs.listLength = 10;
        }
      },
      controller: function ($scope, $interpolate) {
        var objectsLengthWatcher = false;

        function setCurrentObj() {
          angular.forEach($scope.objects, function (item) {
            if (item[$scope.modelField] == $scope.ngModel) {
              $scope.currentObject = item;
            }
          });
        }

        function setValueFromModel() {
          if (!$scope.ngModel) {
            $scope.currentObject = undefined;
            return false;
          }
          if ($scope.modelField) {
            if ($scope.objects && $scope.objects.length) {
              setCurrentObj();
            }
            if (!objectsLengthWatcher) {
              objectsLengthWatcher = $scope.$watch('objects.length', function (nv) {
                if (!nv) {
                  return false;
                }
                setCurrentObj();
              }, true);
            }
          }
          else {
            $scope.currentObject = $scope.ngModel;
          }
        }

        if ($scope.ngModel) {
          setValueFromModel();
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
            $timeout($scope.ngChange);
          }
        };

        $scope.$watch('ngDisabled', function (newValue) {
          if (newValue) {
            $scope.show_list = false;
          }
        });

        $scope.$watch('ngModel', setValueFromModel, true);

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
          }, 200);
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
