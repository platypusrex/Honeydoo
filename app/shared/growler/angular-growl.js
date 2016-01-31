/**
 * angular-growl-v2 - v0.5.3 - 2014-04-03
 * http://janstevens.github.io/angular-growl-2
 * Copyright (c) 2014 Marco Rinck,Jan Stevens; Licensed MIT
 */
angular.module('angular-growl', []);
angular.module('angular-growl').directive('growl', [
    '$rootScope',
    '$sce',
    function ($rootScope, $sce) {
        'use strict';
        return {
            restrict: 'A',
            template: '<div ng-class="{growl: !inlineMessage}">' + ' <div class="growl-item alert" ng-repeat="message in messages" ng-class="computeClasses(message)">' + '   <button type="button" class="close" ng-click="deleteMessage(message)" ng-show="!message.disableCloseButton">&times;</button>' + '       <div ng-switch="message.enableHtml">' + '           <div ng-switch-when="true" ng-bind-html="message.text"></div>' + '           <div ng-switch-default ng-bind="message.text"></div>' + '       </div>' + ' </div>' + '</div>',
            replace: false,
            scope: {
                reference: '@',
                inline: '@'
            },
            controller: [
                '$scope',
                '$timeout',
                'growl',
                function ($scope, $timeout, growl) {
                    var onlyUnique = growl.onlyUnique();
                    $scope.messages = [];
                    var referenceId = $scope.reference || 0;
                    $scope.inlineMessage = $scope.inline || growl.inlineMessages();
                    function addMessage(message) {
                        if (message.enableHtml) {
                            message.text = $sce.trustAsHtml(message.text);
                        }
                        $scope.messages.push(message);
                        if (message.ttl && message.ttl !== -1) {
                            $timeout(function () {
                                $scope.deleteMessage(message);
                            }, message.ttl);
                        }
                    }
                    $rootScope.$on('growlMessage', function (event, message) {
                        var found;
                        if (parseInt(referenceId, 10) === parseInt(message.referenceId, 10)) {
                            if (onlyUnique) {
                                angular.forEach($scope.messages, function (msg) {
                                    if (message.text === msg.text && message.severity === msg.severity) {
                                        found = true;
                                    }
                                });
                                if (!found) {
                                    addMessage(message);
                                }
                            } else {
                                addMessage(message);
                            }
                        }
                    });
                    $scope.deleteMessage = function (message) {
                        var index = $scope.messages.indexOf(message);
                        if (index > -1) {
                            $scope.messages.splice(index, 1);
                        }
                    };
                    $scope.computeClasses = function (message) {
                        return {
                            'alert-success': message.severity === 'success',
                            'alert-error': message.severity === 'error',
                            'alert-danger': message.severity === 'error',
                            'alert-info': message.severity === 'info',
                            'alert-warning': message.severity === 'warn'
                        };
                    };
                }
            ]
        };
    }
]);
angular.module('angular-growl').provider('growl', function () {
    'use strict';
    var _ttl = {
        success: null,
        error: null,
        warning: null,
        info: null
    }, _enableHtml = false, _messagesKey = 'messages', _messageTextKey = 'text', _messageSeverityKey = 'severity', _onlyUniqueMessages = true, _messageVariableKey = 'variables', _referenceId = 0, _inline = false, _disableCloseButton = false;
    this.globalTimeToLive = function (ttl) {
        if (typeof ttl === 'object') {
            for (var k in ttl) {
                if (ttl.hasOwnProperty(k)) {
                    _ttl[k] = ttl[k];
                }
            }
        } else {
            for (var severity in _ttl) {
                if (_ttl.hasOwnProperty(severity)) {
                    _ttl[severity] = ttl;
                }
            }
        }
    };
    this.globalEnableHtml = function (enableHtml) {
        _enableHtml = enableHtml;
    };
    this.globalDisableCloseButton = function (disableCloseButton) {
        _disableCloseButton = disableCloseButton;
    };
    this.messageVariableKey = function (messageVariableKey) {
        _messageVariableKey = messageVariableKey;
    };
    this.globalInlineMessages = function (inline) {
        _inline = inline;
    };
    this.messagesKey = function (messagesKey) {
        _messagesKey = messagesKey;
    };
    this.messageTextKey = function (messageTextKey) {
        _messageTextKey = messageTextKey;
    };
    this.messageSeverityKey = function (messageSeverityKey) {
        _messageSeverityKey = messageSeverityKey;
    };
    this.onlyUniqueMessages = function (onlyUniqueMessages) {
        _onlyUniqueMessages = onlyUniqueMessages;
    };
    this.serverMessagesInterceptor = [
        '$q',
        'growl',
        function ($q, growl) {
            function checkResponse(response) {
                if (response.data[_messagesKey] && response.data[_messagesKey].length > 0) {
                    growl.addServerMessages(response.data[_messagesKey]);
                }
            }
            function success(response) {
                checkResponse(response);
                return response;
            }
            function error(response) {
                checkResponse(response);
                return $q.reject(response);
            }
            return function (promise) {
                return promise.then(success, error);
            };
        }
    ];
    this.$get = [
        '$rootScope',
        '$filter',
        function ($rootScope, $filter) {
            var translate;
            try {
                translate = $filter('translate');
            } catch (e) {
            }
            function broadcastMessage(message) {
                if (translate) {
                    message.text = translate(message.text, message.variables);
                }
                $rootScope.$broadcast('growlMessage', message);
            }
            function sendMessage(text, config, severity) {
                var _config = config || {}, message;
                message = {
                    text: text,
                    severity: severity,
                    ttl: _config.ttl || _ttl[severity],
                    enableHtml: _config.enableHtml || _enableHtml,
                    variables: _config.variables || {},
                    disableCloseButton: _config.disableCloseButton || _disableCloseButton,
                    referenceId: _config.referenceId || _referenceId
                };
                broadcastMessage(message);
            }
            function warning(text, config) {
                sendMessage(text, config, 'warn');
            }
            function error(text, config) {
                sendMessage(text, config, 'error');
            }
            function info(text, config) {
                sendMessage(text, config, 'info');
            }
            function success(text, config) {
                sendMessage(text, config, 'success');
            }
            function addServerMessages(messages) {
                var i, message, severity, length;
                length = messages.length;
                for (i = 0; i < length; i++) {
                    message = messages[i];
                    if (message[_messageTextKey]) {
                        if (message[_messageSeverityKey]) {
                            switch (message[_messageSeverityKey]) {
                                case 'warn':
                                    severity = 'warn';
                                    break;
                                case 'success':
                                    severity = 'success';
                                    break;
                                case 'info':
                                    severity = 'info';
                                    break;
                                case 'error':
                                    severity = 'error';
                                    break;
                            }
                        } else {
                            severity = 'error';
                        }
                        var config = {};
                        config.variables = message[_messageVariableKey] || {};
                        sendMessage(message[_messageTextKey], config, severity);
                    }
                }
            }
            function onlyUnique() {
                return _onlyUniqueMessages;
            }
            function inlineMessages() {
                return _inline;
            }
            return {
                warning: warning,
                error: error,
                info: info,
                success: success,
                addServerMessages: addServerMessages,
                onlyUnique: onlyUnique,
                inlineMessages: inlineMessages
            };
        }
    ];
});