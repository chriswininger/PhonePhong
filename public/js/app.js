(function () {
    var defaults = {
        mainVol: 0.5,
        osc1Vol: 0.9949676394462585,
        osc2Vol: 0.9949676394462585,
        osc1Freq: 440,
        osc2Freq: 1000,
        primaryOffset: 0.5,
        osc1MaxFreq: 3000,
        osc2MaxFreq: 10,
        primaryOffsetMax: 10,
        secondaryOffsetMax: 8,
        secondaryOffset: 1.0
    };
    var logicBoard = new PhonePhong.BoardLogic(new webkitAudioContext(), defaults);



    var phongPhone = angular.module('phongPhone', ['ngRoute', 'ngAnimate']).directive('ngY', function() {
        return function(scope, element, attrs) {
            scope.$watch(attrs.ngY, function(value) {
                element.attr('y', value);
            });
        };
    }).directive('ngX', function() {
        return function(scope, element, attrs) {
            scope.$watch(attrs.ngX, function(value) {
                element.attr('x', value);
            });
        };
    });


    phongPhone.config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/view-pad.html',
            controller: 'padController'
        }).when('/note-map', {
            templateUrl: 'views/view-map.html',
            controller: 'noteMapController'
        });
    });

    phongPhone.controller('padController', ['$scope', function ($scope) {
        var padUI = new PhonePhong.UI(logicBoard);

        $scope.pageClass = 'view-pad';

        //$('#phongUIGrid').on('swipe', function () {
          //  window.location.href='#/note-map';
        //});
    }]);

    phongPhone.controller('noteMapController', window.PhonePhong.UI.NoteMap);
})();
