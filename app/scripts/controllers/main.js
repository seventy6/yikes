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

          var currentDate = new Date();
          //console.log('currentDate.getFullYear()', currentDate.getFullYear() + 1);
          $scope.myDate = new Date(Number(currentDate.getFullYear() + 1), 0, 1);
        }

        $scope.$watch('todo', function() {
            localStorageService.add('todo', $scope.todo);
            localStorageService.add('myDate', $scope.myDate);
            //$scope.updateClock();
            setUpDate();
        }, true);

        $scope.$watch('myDate', function() {
            console.log('$scope.myDate', $scope.myDate)
            localStorageService.add('todo', $scope.todo);
            localStorageService.add('myDate', $scope.myDate);
            //$scope.updateClock();
            setUpDate();
        }, true);

        console.log('$scope.myDate', $scope.myDate, '$scope.todo', $scope.todo);
        // $scope.addTodo = function () {
        //   $scope.todo = $scope.todo;
        //   //$scope.todos.push($scope.todo + '_' + $scope.myDate);
        //   //$scope.todo = '';
        // };
        // $scope.removeTodo = function (index) {
        //       $scope.todos.splice(index, 1);
        // };
        // for (var i = 0; i < 10; i++) {
        //     console.log(var n = i; String('00' + n).slice(-2);)
        // };
        //create and set the clock
        $scope.timeDaysFirst = 0;
        $scope.timeDaysSecond = 0;
        $scope.timeHoursFirst = 0;
        $scope.timeHoursSecond = 0;
        $scope.timeMinutesFirst = 0;
        $scope.timeMinutesSecond = 0;                                
        $scope.timeSecondsFirst = 0;
        $scope.timeSecondsSecond = 0;

        function setUpDate() {

            //destroy old clock
            window.clearInterval(timerId);

            console.log(new Date($scope.myDate));//.getFullYear(), $scope.myDate.getMonth(), $scope.myDate.getDay());

            timerId =
                countdown(
                    new Date($scope.myDate),
                    function(ts) {
                        
                        console.log('ts', ts);
                        
                        if (!$scope.$$phase) {
                            $scope.$apply(function() {
                                $scope.timeDaysFirst = String('00' + ts.days).slice(-2).charAt(0);
                                $scope.timeDaysSecond = String(ts.days).slice(-1);
                                $scope.timeHoursFirst = String('0' + ts.hours).slice(-2).charAt(0);
                                $scope.timeHoursSecond = String(ts.hours).slice(-1);
                                $scope.timeMinutesFirst = String('0' + ts.minutes).slice(-2).charAt(0);
                                $scope.timeMinutesSecond = String(ts.minutes).slice(-1);
                                $scope.timeSecondsFirst = String('0' + ts.seconds).slice(-2).charAt(0);
                                $scope.timeSecondsSecond = String(ts.seconds).slice(-1);
                            });
                        }
                        //$('#clock').html('<ul class="flip "><li data-digit="0" class="flip-clock-active"><a href="#" class="flip-clock-before"><div class="down flip-clock-before"><div class="shadow"></div><div class="inn flip-clock-before">' + ts.days + '</div></div></a></li></ul><ul class="flip "><li data-digit="0" class="flip-clock-active"><a href="#" class="flip-clock-before"><div class="down flip-clock-before"><div class="shadow"></div><div class="inn flip-clock-before">' + ts.hours + '</div></div></a></li></ul><ul class="flip"><li class="flip-clock-active">' + ts.minutes + '</li></ul>' + '<ul class="flip"><li class="flip-clock-active">' + ts.seconds + '</li></ul>');
                        //document.getElementById('clock').innerHTML = ts.toHTML("li");
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
        //run for the first time
        setUpDate();

    });