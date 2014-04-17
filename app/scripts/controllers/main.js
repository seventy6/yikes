'use strict';

angular.module('yikeesApp')
    .controller('MainCtrl', function($scope, localStorageService) {

        var timerId;
        //get the local storage
        var todosInStore = localStorageService.get('todo');
        $scope.todo = todosInStore && todosInStore || []; //todosInStore.split('\n') || [];
        //todo
        var yikesInStore = localStorageService.get('myDate');
        $scope.myDate = yikesInStore && yikesInStore || [];

        //create a fake event = New Years!
        if($scope.myDate.length == 0 || $scope.todo == []) {
          $scope.todo = 'Happy New Year!';

          var currentDate = new Date(),
              newDate = new Date(Number(currentDate.getFullYear() + 1), 0, '01');
              //console.log('newDate', newDate.getFullYear()+', '+newDate.getMonth()+', '+newDate.getDate());
          //console.log('currentDate.getFullYear()', currentDate.getFullYear() + 1);
          $scope.myDate = newDate.getFullYear()+',01,01';
        }

        //listeners for model changes
        $scope.$watch('todo', function() {
            localStorageService.add('todo', $scope.todo);
            localStorageService.add('myDate', $scope.myDate);
            //update clock
            setUpDate();
        }, true);

        $scope.$watch('myDate', function() {
          
            //this would reset the todo
            //$scope.todo = '';
            localStorageService.add('todo', $scope.todo);
            localStorageService.add('myDate', $scope.myDate);
            //update clock
            setUpDate();
        }, true);

        
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