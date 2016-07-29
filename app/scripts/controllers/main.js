'use strict';

angular.module('yikeesApp')
    .controller('MainCtrl', function($scope, localStorageService) {

        var timerId,
            //current version
            version = 1,
            //chrome
            chromeNotificationId = null;

        //default view
        $scope.editDetails = false;
        $scope.tense = 'present';
        $scope.yikeDateSeconds = '00';
        $scope.yikeActualDate = null;
        //stop backwards yikes.
        $scope.minDate = Date();

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
            $scope.yikeDateMinutes = Number(currentDate.getMinutes() + 5);
            $scope.yikeDateSeconds = String(currentDate.getSeconds());

            //console.log($scope.yikeDate, $scope.yikeDateHours, $scope.yikeDateMinutes, String($scope.yikeDateSeconds));

            setUpDate();
        }

        //setup time UI
        $('.consistant-popover').popover({
            'trigger': 'hover'
        });
        $('#timepicker3').timepicker({
            minuteStep: 5,
            showInputs: false,
            disableFocus: true,
            showMeridian: false,
            modalBackdrop:true,
            defaultTime: $scope.yikeDateHours + ':' + $scope.yikeDateMinutes
        }).on('changeTime.timepicker', function(e) {
            $scope.yikeDateMinutes = e.time.minutes;
            $scope.yikeDateHours = e.time.hours;            
        });
        $('#yikeDateInput').datepicker({
            'min-date' : 0//$scope.minDate
        });

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

            var _strOfEvent = 'todo:' + $scope.todo + '|h:' + $scope.yikeDate + '|h:' + $scope.yikeDateHours + '|m:' + $scope.yikeDateMinutes,
                _strOfEventEncoded = utf8_to_b64(_strOfEvent);
            // Usage:
            console.log('Shareable Encoded URL:', _strOfEvent, _strOfEventEncoded); // "4pyTIMOgIGxhIG1vZGU="
            console.log('Shareable Decoded URL:', _strOfEvent, b64_to_utf8(_strOfEventEncoded)); // "4pyTIMOgIGxhIG1vZGU="
            // b64_to_utf8('4pyTIMOgIGxhIG1vZGU='); // "✓ à la mode"

        }
        //track events
        $scope.$watch('yikeType', function(newValue, oldValue) {
            _gaq.push(['_trackEvent', 'yikeType', newValue]);
        });
        $scope.$watch('editDetails', function(newValue, oldValue) {
            _gaq.push(['_trackEvent', 'editDetails', newValue]);
        });
        //create the date instance        

        //need to move to utility function

        function utf8_to_b64(str) {
            return window.btoa(unescape(encodeURIComponent(str)));
        };

        function b64_to_utf8(str) {
            return decodeURIComponent(escape(window.atob(str)));
        };

        function setUpDate() {

            //destroy old clock
            window.clearInterval(timerId);
            //notifications
            //chrome.notifications.getAll(destroyNotifications)

            //store a reference the actual working date

            $scope.yikeActualDate = new Date($scope.yikeDate + ',' + $scope.yikeDateHours + ':' + $scope.yikeDateMinutes + ':' + $scope.yikeDateSeconds);
            console.log('$scope.$yikeActualDate', $scope.yikeActualDate);

            //create the clock
            timerId =
                countdown(
                    new Date($scope.yikeDate + ',' + $scope.yikeDateHours + ':' + $scope.yikeDateMinutes + ':' + $scope.yikeDateSeconds),
                    function(ts) {

                        //if (ts.minutes == 5 && ts.seconds == 45) {
                        createNotifications(ts);
                        //}

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
                    // //countdown.WEEKS |
                    countdown.DAYS |
                    countdown.HOURS |
                    countdown.MINUTES |
                    countdown.SECONDS
            ); //countdown.MILLISECONDS

            function createNotifications(ts) {

                //don't do notifications until it's set by the user
                if ($scope.firstTime) {
                    return;
                }

                //console.log('t', ts.years, ts.days,  ts.hours,  ts.minutes, ts.seconds, ts.value);

                //TODO: change to settings panel
                var _message = ' is going to end in the next 5 minutes!';
                //test to see if it matches
                if (ts.years == 0 && ts.days == 0 && ts.hours == 0 && ts.minutes == 0 && ts.seconds == 1) {
                    _message = ' has just ended!';
                    //console.log('EVENT ENDED');                    
                    clearNotificationStack();
                }
                //5 minute warning.
                if (ts.years == 0 && ts.days == 0 && ts.hours == 0 && ts.minutes == 2 && ts.seconds == 59 && ts.value < 0) {
                    //console.log('5 MINUTE WARNING', ts.value);
                    clearNotificationStack();
                } else {
                    //we're not interested in the non registered events...
                    return;
                }

                //console.log('SEND NOTIFICATION', timeer);
                var opt = {
                    type: "basic",
                    title: "Yikes!",
                    message: '"' + $scope.todo + '"' + _message,
                    iconUrl: "images/chrome-logo.png" //,
                    // buttons: [{
                    //     title: "View now!"
                    //     //iconUrl: "images/chrome-logo.png"
                    // }]
                }
                //create new notification with a auto generated id
                chrome.notifications.create('', opt, chromeNotificationCreationCallback);
                //new install clicked:
                //chrome.notifications.onButtonClicked.addListener(onButtonClicked);
                //chrome.notifications.onClicked.addListener(onClicked);

            };
            //create a new window

            function onClicked(event) {

                //remove all notifications
                chrome.notifications.clear(chromeNotificationId, destroyNotifications);
                //chrome.notifications.getAll(destroyNotifications)
                window.focus();
                this.cancel();

                // chrome.tabs.create(
                //   {
                //     url: 'chrome://newtab',
                //     active: true
                //   });
                //window.open("chrome-extension://lagbklomealkbhffdagchmalndhafanh/index.html#/", '_blank');  
            };
            // a new chromenotificationId is created here.

            function chromeNotificationCreationCallback(id) {
                chromeNotificationId = id;
            };
            //test for a notification and kill it if needed.

            function clearNotificationStack() {
                //clear the history
                if (chromeNotificationId !== null) {
                    console.log('clearNotificationStack: chromeNotificationId', chromeNotificationId);
                    chrome.notifications.clear(chromeNotificationId, destroyNotifications);
                    //clear the stack
                    chromeNotificationId = null;
                }
            };

            function destroyNotifications(wasCleared) {
                console.log('destroyNotifications', wasCleared);
            };

        };
    })
    .controller('SettingsCtrl', function($scope, localStorageService) {
        console.log('SettingsCtrl');
        // var timerId, 
        //   //current version
        //   version = 1;

        // //default view
        // $scope.editDetails = false;
        // $scope.tense = 'present';

        // //clear old versions:
        // //get the local storage
        // var versionInStore = localStorageService.get('version');
        //  if (!versionInStore || Number(versionInStore) < version) {
        //     localStorageService.clearAll();
        //     localStorageService.add('version', version);
        //  }
    });