'use strict';

angular.module('yikeesApp')
    .controller('MainCtrl', function($scope, localStorageService) {

        var timerId,
            //current version
            version = 1;

        //default view
        $scope.editDetails = false;
        $scope.tense = 'present';
        $scope.yikeDateSeconds = '00';

        //clear old versions:
        //get the local storage
        var versionInStore = localStorageService.get('version');
        if (!versionInStore || Number(versionInStore) < version) {
            localStorageService.clearAll();
            localStorageService.add('version', version);
        }

        //get the local storage
        var preferencesInStore = localStorageService.get('preferences.firstTime');
        $scope.firstTime = preferencesInStore && preferencesInStore || true; //todosInStore.split('\n') || [];
        if ($scope.firstTime == 'false') {
            $scope.firstTime = false;
        } else {
            //init the help interface
            $('.firstime-popover').popover({
                'trigger': 'hover'
            });
        }
        //get the local storage
        var todosInStore = localStorageService.get('todo');
        $scope.todo = todosInStore && todosInStore || []; //todosInStore.split('\n') || [];
        //todo
        var yikesDateInStore = localStorageService.get('yikeDate');
        $scope.yikeDate = yikesDateInStore && yikesDateInStore || [];
        //todo
        var yikesHourInStore = localStorageService.get('yikeDateHours');
        $scope.yikeDateHours = Number(yikesHourInStore) && Number(yikesHourInStore) || 12;
        //
        var yikesMinutesInStore = localStorageService.get('yikeDateMinutes');
        $scope.yikeDateMinutes = Number(yikesMinutesInStore) && Number(yikesMinutesInStore) || 1;
        //is it good or bad?
        var yikeTypeInStore = localStorageService.get('yikeType');
        $scope.yikeType = yikeTypeInStore && yikeTypeInStore || true; //todosInStore.split('\n') || [];
        if ($scope.yikeType == 'false') {
            $scope.yikeType = false;
        }
        //set the clock
        setUpDate();
        //create a fake event = New Years!
        if ($scope.yikeDate.length == 0 || $scope.todo == []) {
            $scope.todo = 'Create my first Yike!';

            var currentDate = new Date();
            //newDate = new Date(Number(currentDate.getFullYear()), 0, '01');
            //$scope.yikeDate+','+$scope.yikeDateHours+':'+$scope.yikeDateMinutes+':00'
            //console.log('newDate', newDate.getFullYear()+', '+newDate.getMonth()+', '+newDate.getDate());
            //console.log('currentDate.getFullYear()', currentDate.getFullYear() + 1);
            $scope.yikeDate = currentDate.getFullYear() + ',' + Number(currentDate.getMonth() + 1) + ',' + currentDate.getDate();
            $scope.yikeDateHours = currentDate.getHours();
            $scope.yikeDateMinutes = Number(currentDate.getMinutes() + 6);
            $scope.yikeDateSeconds = String(currentDate.getSeconds());

            console.log($scope.yikeDate, $scope.yikeDateHours, $scope.yikeDateMinutes, String($scope.yikeDateSeconds));

            setUpDate();
        }

        $scope.addYike = function() {

            //destroy first time UI
            $('.firstime-popover').popover('destroy')

            localStorageService.add('todo', $scope.todo);
            localStorageService.add('yikeDate', $scope.yikeDate);
            localStorageService.add('yikeDateHours', $scope.yikeDateHours);
            localStorageService.add('yikeDateMinutes', $scope.yikeDateMinutes);
            localStorageService.add('preferences.firstTime', false);
            localStorageService.add('yikeType', $scope.yikeType);
            //update clock
            setUpDate();
            //hide the form
            $scope.editDetails = false;
            //not a newbie
            $scope.firstTime = false;

            //track event
            _gaq.push(['_trackEvent', 'addYike']);
        }
        //track events
        $scope.$watch('yikeType', function(newValue, oldValue) {
            _gaq.push(['_trackEvent', 'yikeType', newValue]);
        });
        $scope.$watch('editDetails', function(newValue, oldValue) {
            _gaq.push(['_trackEvent', 'editDetails', newValue]);
        });
        //create the date instance

        function setUpDate() {

            //destroy old clock
            window.clearInterval(timerId);
            //notifications
            chrome.notifications.getAll(destroyNotifications)
            
            //chrome.notifications.clear('1', destroyNotifications);

            timerId =
                countdown(
                    new Date($scope.yikeDate + ',' + $scope.yikeDateHours + ':' + $scope.yikeDateMinutes + ':' + $scope.yikeDateSeconds),
                    function(ts) {

                        if (ts.minutes == 5 && ts.seconds == 45) {
                            createNotifications(ts.value);
                        }

                        //take a store of the html
                        var _copyHTML = $('#clock').html();
                        //hack for wierd 0 second issue with library
                        if (ts.seconds == 0) {
                            var re = /1 second/gi,
                                str = _copyHTML, //"<em>2 minutes</em>, and <em>1 seconds</em>",
                                _copyHTML = str.replace(re, "0 second");
                            $('#clock').html(_copyHTML);
                            //ignore this cycle
                            return;
                        }
                        //change the tense
                        if (!$scope.$$phase) {
                            if (ts.value > 0) {
                                $scope.$apply(function() {
                                    $scope.tense = 'past';
                                });
                            } else {
                                $scope.$apply(function() {
                                    $scope.tense = 'present';
                                });
                            }
                        }


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

            function createNotifications(timeer) {
                //console.log('SEND NOTIFICATION', timeer);
                var opt = {
                    type: "basic",
                    title: "Yikes!",
                    message: $scope.todo,
                    iconUrl: "images/chrome-logo.png"
                }
                chrome.notifications.create('1', opt, creationCallback);
            }

            function creationCallback(event) {
                console.log('creationCallback', event);
            }
            function destroyNotifications(wasCleared) {
                console.log('destroyNotifications', wasCleared);
            }
        }
    });