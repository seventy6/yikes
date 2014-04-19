'use strict';

angular.module('yikeesApp')
    .controller('MainCtrl', function($scope, localStorageService) {

        var timerId;

        //default view
        $scope.editDetails = false;
        
        //get the local storage
        var preferencesInStore = localStorageService.get('preferences.firstTime');
        $scope.firstTime = preferencesInStore && preferencesInStore || true; //todosInStore.split('\n') || [];

        //get the local storage
        var todosInStore = localStorageService.get('todo');
        $scope.todo = todosInStore && todosInStore || []; //todosInStore.split('\n') || [];
        //todo
        var yikesInStore = localStorageService.get('myDate');
        $scope.myDate = yikesInStore && yikesInStore || [];
        //is it good or bad?
        var yikeTypeInStore = localStorageService.get('yikeType');
        $scope.yikeType = yikeTypeInStore && yikeTypeInStore || true; //todosInStore.split('\n') || [];
        
        //set the clock
        setUpDate();
        //create a fake event = New Years!
        if ($scope.myDate.length == 0 || $scope.todo == []) {
            $scope.todo = 'Happy New Year!';

            var currentDate = new Date(),
                newDate = new Date(Number(currentDate.getFullYear() + 1), 0, '01');
            //console.log('newDate', newDate.getFullYear()+', '+newDate.getMonth()+', '+newDate.getDate());
            //console.log('currentDate.getFullYear()', currentDate.getFullYear() + 1);
            $scope.myDate = newDate.getFullYear() + ',01,01';

            setUpDate();
        }

        $scope.addYike = function() {

            localStorageService.add('todo', $scope.todo);
            localStorageService.add('myDate', $scope.myDate);
            localStorageService.add('preferences.firstTime', false);
            localStorageService.add('yikeType', $scope.yikeType);
            //update clock
            setUpDate();
            //hide the form
            $scope.editDetails = false;
            //not a newbie
            $scope.firstTime = false;
        }

        //listeners for model changes
        // $scope.$watch('todo', function() {
        //     localStorageService.add('todo', $scope.todo);
        //     localStorageService.add('myDate', $scope.myDate);
        //     //update clock
        //     setUpDate();
        // }, true);

        // $scope.$watch('myDate', function() {

        //     //this would reset the todo
        //     //$scope.todo = '';
        //     localStorageService.add('todo', $scope.todo);
        //     localStorageService.add('myDate', $scope.myDate);
        //     //update clock
        //     setUpDate();
        // }, true);


        function setUpDate() {

            //destroy old clock
            window.clearInterval(timerId);

            timerId =
                countdown(
                    new Date($scope.myDate),
                    function(ts) {

                        $('#clock').html(ts.toHTML("em"));
                    },
                    //countdown.MILLENNIA |
                    //countdown.CENTURIES |
                    //countdown.DECADES |
                    countdown.YEARS |
                    countdown.MONTHS |
                    //countdown.WEEKS |
                    countdown.DAYS |
                    countdown.HOURS |
                    countdown.MINUTES |
                    countdown.SECONDS
            ); //countdown.MILLISECONDS
        }
    });