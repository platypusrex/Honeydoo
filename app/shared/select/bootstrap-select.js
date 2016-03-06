(function(){
    'use strict';

    var uid = 0;

    function nextUid() {
        return ++uid;
    }

    function isWindow(obj) {
        return obj && obj.window === obj;
    }

    function isString(value){return typeof value === 'string';}

    function isArrayLike(obj) {
        if (obj == null || isWindow(obj)) {
            return false;
        }

        var length = obj.length;

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return isString(obj) || Array.isArray(obj) || length === 0 ||
            typeof length === 'number' && length > 0 && (length - 1) in obj;
    }

    function createMap() {
        return Object.create(null);
    }

    function hashKey(obj, nextUidFn) {
        var objType = typeof obj,
            key;

        if (objType == 'function' || (objType == 'object' && obj !== null)) {
            if (typeof (key = obj.$$hashKey) == 'function') {
                key = obj.$$hashKey();
            } else if (key === undefined) {
                key = obj.$$hashKey = (nextUidFn || nextUid)();
            }
        } else {
            key = obj;
        }

        return objType + ':' + key;
    }

    function sortByGroup(array ,group, property) {
        var unknownGroup = [],
            i, j,
            resultArray = [];
        for(i = 0; i < group.length; i++) {
            for(j = 0; j < array.length;j ++) {
                if(!array[j][property]) {
                    unknownGroup.push(array[j]);
                } else if(array[j][property] === group[i]) {
                    resultArray.push(array[j]);
                }
            }
        }

        resultArray = resultArray.concat(unknownGroup);

        return resultArray;
    }

    function getBlockNodes(nodes) {
        var node = nodes[0];
        var endNode = nodes[nodes.length - 1];
        var blockNodes = [node];

        do {
            node = node.nextSibling;
            if (!node) break;
            blockNodes.push(node);
        } while (node !== endNode);

        return angular.element(blockNodes);
    }

    var getBlockStart = function(block) {
        return block.clone[0];
    };

    var getBlockEnd = function(block) {
        return block.clone[block.clone.length - 1];
    };

    var updateScope = function(scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength, group) {
        scope[valueIdentifier] = value;
        if (keyIdentifier) scope[keyIdentifier] = key;
        scope.$index = index;
        scope.$first = (index === 0);
        scope.$last = (index === (arrayLength - 1));
        scope.$middle = !(scope.$first || scope.$last);
        scope.$odd = !(scope.$even = (index&1) === 0);

        if(group) {
            scope.$group = group;
        }
    };

    var setElementIsolateScope = function(element, scope) {
        element.data('isolateScope', scope);
    };

    var contains = function(array, element) {
        var length = array.length,
            i;
        if(length === 0) {
            return false;
        }
        for(i = 0;i < length; i++) {
            if(deepEquals(element, array[i])) {
                return true;
            }
        }
        return false;
    };

    var indexOf = function(array, element) {
        var length = array.length,
            i;
        if(length === 0) {
            return -1;
        }
        for(i = 0; i < length; i++) {
            if(deepEquals(element, array[i])) {
                return i;
            }
        }
        return -1;
    };

    var filterTarget = function(target, parent, selector) {
        var elem = target,
            className, type = typeof selector;

        if(target == parent) {
            return null;
        } else {
            do {
                if(type === 'string') {
                    className = ' ' + elem.className + ' ';
                    if(elem.nodeType === 1 && className.replace(/[\t\r\n\f]/g, ' ').indexOf(selector) >= 0) {
                        return elem;
                    }
                } else {
                    if(elem == selector) {
                        return elem;
                    }
                }

            } while((elem = elem.parentNode) && elem != parent && elem.nodeType !== 9);

            return null;
        }

    };

    var getClassList = function(element) {
        var classList,
            className = element.className.replace(/[\t\r\n\f]/g, ' ').trim();
        classList = className.split(' ');
        for(var i = 0; i < classList.length; i++) {
            if(/\s+/.test(classList[i])) {
                classList.splice(i, 1);
                i--;
            }
        }
        return classList;

    };

    var hasClass = function(element, className) {
        var classList = getClassList(element);
        return classList.indexOf(className) !== -1;
    };

    var queryChildren = function(element, classList) {
        var children = element.children(),
            length = children.length,
            child,
            valid,
            classes;
        if(length > 0) {
            for(var i = 0; i < length; i++) {
                child = children.eq(i);
                valid = true;
                classes = getClassList(child[0]);
                if(classes.length > 0) {
                    for(var j = 0; j < classList.length; j++) {
                        if(classes.indexOf(classList[j]) === -1) {
                            valid = false;
                            break;
                        }
                    }
                }
                if(valid) {
                    return child;
                }
            }
        }
        return [];
    };

    var hasKeyword = function(element, keyword) {
        var childElements,
            index, length;
        if(element.text().toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
            return true;
        } else {
            childElements = element.children();
            length = childElements.length;
            for(index = 0; index < length; index++) {
                if(childElements.eq(index).text().toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                    return true;
                }
            }
            return false;
        }
    };

    function sibling( cur, dir ) {
        while ( (cur = cur[dir]) && cur.nodeType !== 1) {}
        return cur;
    }


    var jqLite = angular.element;
    var deepEquals = angular.equals;
    var deepCopy = angular.copy;
    var extend = angular.extend;
    var nyaBsSelect = angular.module('nya.bootstrap.select', []);

    nyaBsSelect.provider('nyaBsConfig', function() {

        var locale = null;
        var defaultText = {
            'en-us': {
                defaultNoneSelection: 'Nothing selected',
                noSearchResult: 'NO SEARCH RESULT',
                numberItemSelected: '%d item selected',
                selectAll: 'Select All',
                deselectAll: 'Deselect All'
            }
        };

        var interfaceText = deepCopy(defaultText);

        this.setLocalizedText = function(localeId, obj) {
            if(!localeId) {
                throw new Error('localeId must be a string formatted as languageId-countryId');
            }
            if(!interfaceText[localeId]) {
                interfaceText[localeId] = {};
            }
            interfaceText[localeId] = extend(interfaceText[localeId], obj);
        };

        this.useLocale = function(localeId) {
            locale = localeId;
        };

        this.$get = ['$locale', function($locale){
            var localizedText;
            if(locale) {
                localizedText = interfaceText[locale];
            } else {
                localizedText = interfaceText[$locale.id];
            }
            if(!localizedText) {
                localizedText = defaultText['en-us'];
            }
            return localizedText;
        }];

    });


    nyaBsSelect.controller('nyaBsSelectCtrl', function(){

        var self = this;

        self.keyIdentifier = null;
        self.valueIdentifier = null;

        self.isMultiple = false;
        self.onCollectionChange = function(){};
        self.setId = function(id) {
            self.id = id || 'id#' + Math.floor(Math.random() * 10000);
        };

    });
    nyaBsSelect.directive('nyaBsSelect', ['$parse', '$document', '$timeout', '$compile', 'nyaBsConfig', function ($parse, $document, $timeout, $compile, nyaBsConfig) {

        var DEFAULT_NONE_SELECTION = 'Nothing selected';

        var DROPDOWN_TOGGLE = '<button class="btn btn-default dropdown-toggle" type="button">' +
            '<span class="pull-left filter-option"></span>' +
            '<span class="pull-left special-title"></span>' +
            '&nbsp;' +
            '<span class="caret"></span>' +
            '</button>';

        var DROPDOWN_CONTAINER = '<div class="dropdown-menu open"></div>';

        var SEARCH_BOX = '<div class="bs-searchbox">' +
            '<input type="text" class="form-control">' +
            '</div>';

        var DROPDOWN_MENU = '<ul class="dropdown-menu inner"></ul>';

        var NO_SEARCH_RESULT = '<li class="no-search-result"><span>NO SEARCH RESULT</span></li>';

        var ACTIONS_BOX = '<div class="bs-actionsbox">' +
            '<div class="btn-group btn-group-sm btn-block">' +
            '<button class="actions-btn bs-select-all btn btn-default">SELECT ALL</button>' +
            '<button class="actions-btn bs-deselect-all btn btn-default">DESELECT ALL</button>' +
            '</div>' +
            '</div>';

        return {
            restrict: 'ECA',
            require: ['ngModel', 'nyaBsSelect'],
            controller: 'nyaBsSelectCtrl',
            compile: function nyaBsSelectCompile (tElement, tAttrs){


                tElement.addClass('btn-group');
                var getDefaultNoneSelectionContent = function(scope) {
                    // text node or jqLite element.
                    var content;

                    if(tAttrs.titleTpl) {
                        content = jqLite(tAttrs.titleTpl);
                    } else if(tAttrs.title) {
                        content = document.createTextNode(tAttrs.title);
                    } else if(localizedText.defaultNoneSelectionTpl){
                        content = jqLite(localizedText.defaultNoneSelectionTpl);
                    } else if(localizedText.defaultNoneSelection) {
                        content = document.createTextNode(localizedText.defaultNoneSelection);
                    } else {
                        content = document.createTextNode(DEFAULT_NONE_SELECTION);
                    }

                    if(scope && (tAttrs.titleTpl || localizedText.defaultNoneSelectionTpl)) {
                        return $compile(content)(scope);
                    }
                    return content;
                };

                var options = tElement.children(),
                    dropdownToggle = jqLite(DROPDOWN_TOGGLE),
                    dropdownContainer = jqLite(DROPDOWN_CONTAINER),
                    dropdownMenu = jqLite(DROPDOWN_MENU),
                    searchBox,
                    noSearchResult,
                    actionsBox,
                    classList,
                    length,
                    index,
                    liElement,
                    localizedText = nyaBsConfig,
                    isMultiple = typeof tAttrs.multiple !== 'undefined',
                    nyaBsOptionValue;

                classList = getClassList(tElement[0]);
                classList.forEach(function(className) {
                    if(/btn-(?:primary|info|success|warning|danger|inverse)/.test(className)) {
                        tElement.removeClass(className);
                        dropdownToggle.removeClass('btn-default');
                        dropdownToggle.addClass(className);
                    }

                    if(/btn-(?:lg|sm|xs)/.test(className)) {
                        tElement.removeClass(className);
                        dropdownToggle.addClass(className);
                    }

                    if(className === 'form-control') {
                        dropdownToggle.addClass(className);
                    }
                });

                dropdownMenu.append(options);

                length = options.length;
                for(index = 0; index < length; index++) {
                    liElement = options.eq(index);
                    if(liElement.hasClass('nya-bs-option') || liElement.attr('nya-bs-option')) {
                        liElement.find('a').attr('tabindex', '0');
                        nyaBsOptionValue = liElement.attr('value');
                        if(angular.isString(nyaBsOptionValue) && nyaBsOptionValue !== '') {
                            liElement.attr('data-value', nyaBsOptionValue);
                            liElement.removeAttr('value');
                        }
                    }
                }

                if(tAttrs.liveSearch === 'true') {
                    searchBox = jqLite(SEARCH_BOX);

                    if(tAttrs.noSearchTitle) {
                        NO_SEARCH_RESULT = NO_SEARCH_RESULT.replace('NO SEARCH RESULT', tAttrs.noSearchTitle);
                    } else if (tAttrs.noSearchTitleTpl) {
                        NO_SEARCH_RESULT = NO_SEARCH_RESULT.replace('NO SEARCH RESULT', tAttrs.noSearchTitleTpl);
                    }else {
                        if(localizedText.noSearchResultTpl) {
                            NO_SEARCH_RESULT = NO_SEARCH_RESULT.replace('NO SEARCH RESULT', localizedText.noSearchResultTpl);
                        } else if(localizedText.noSearchResult) {
                            NO_SEARCH_RESULT = NO_SEARCH_RESULT.replace('NO SEARCH RESULT', localizedText.noSearchResult);
                        }
                    }

                    noSearchResult = jqLite(NO_SEARCH_RESULT);
                    dropdownContainer.append(searchBox);
                    dropdownMenu.append(noSearchResult);
                }

                if (tAttrs.actionsBox === 'true' && isMultiple) {
                    if (localizedText.selectAllTpl) {
                        ACTIONS_BOX = ACTIONS_BOX.replace('SELECT ALL', localizedText.selectAllTpl);
                    } else if (localizedText.selectAll) {
                        ACTIONS_BOX = ACTIONS_BOX.replace('SELECT ALL', localizedText.selectAll);
                    }

                    if (localizedText.deselectAllTpl) {
                        ACTIONS_BOX = ACTIONS_BOX.replace('DESELECT ALL', localizedText.deselectAllTpl);
                    } else if (localizedText.selectAll) {
                        ACTIONS_BOX = ACTIONS_BOX.replace('DESELECT ALL', localizedText.deselectAll);
                    }

                    actionsBox = jqLite(ACTIONS_BOX);
                    dropdownContainer.append(actionsBox);
                }

                jqLite(dropdownToggle[0].querySelector('.special-title')).append(getDefaultNoneSelectionContent());

                dropdownContainer.append(dropdownMenu);

                tElement.append(dropdownToggle);
                tElement.append(dropdownContainer);

                return function nyaBsSelectLink ($scope, $element, $attrs, ctrls) {

                    var ngCtrl = ctrls[0],
                        nyaBsSelectCtrl = ctrls[1],
                        liHeight,
                        isDisabled = false,
                        previousTabIndex,
                        valueExpFn,
                        valueExpGetter = $parse(nyaBsSelectCtrl.valueExp),
                        isMultiple = typeof $attrs.multiple !== 'undefined';

                    var dropdownToggle = jqLite($element[0].querySelector('.dropdown-toggle')),
                        dropdownContainer = dropdownToggle.next(),
                        dropdownMenu = jqLite(dropdownContainer[0].querySelector('.dropdown-menu.inner')),
                        searchBox = jqLite(dropdownContainer[0].querySelector('.bs-searchbox')),
                        noSearchResult = jqLite(dropdownMenu[0].querySelector('.no-search-result')),
                        actionsBox = jqLite(dropdownContainer[0].querySelector('.bs-actionsbox'));

                    if(nyaBsSelectCtrl.valueExp) {
                        valueExpFn = function(scope, locals) {
                            return valueExpGetter(scope, locals);
                        };
                    }

                    nyaBsSelectCtrl.setId($element.attr('id'));

                    if (isMultiple) {
                        nyaBsSelectCtrl.isMultiple = true;

                        ngCtrl.$isEmpty = function(value) {
                            return !value || value.length === 0;
                        };
                    }
                    if(typeof $attrs.disabled !== 'undefined') {
                        $scope.$watch($attrs.disabled, function(disabled){
                            if(disabled) {
                                dropdownToggle.addClass('disabled');
                                dropdownToggle.attr('disabled', 'disabled');
                                previousTabIndex = dropdownToggle.attr('tabindex');
                                dropdownToggle.attr('tabindex', '-1');
                                isDisabled = true;
                            } else {
                                dropdownToggle.removeClass('disabled');
                                dropdownToggle.removeAttr('disabled');
                                if(previousTabIndex) {
                                    dropdownToggle.attr('tabindex', previousTabIndex);
                                } else {
                                    dropdownToggle.removeAttr('tabindex');
                                }
                                isDisabled = false;
                            }
                        });
                    }

                    nyaBsSelectCtrl.onCollectionChange = function (values) {
                        var valuesForSelect = [],
                            index,
                            length,
                            modelValue = ngCtrl.$modelValue;

                        if(!modelValue) {
                            return;
                        }

                        if(Array.isArray(values) && values.length > 0) {
                            if(valueExpFn) {
                                for(index = 0; index < values.length; index++) {
                                    valuesForSelect.push(valueExpFn($scope, values[index]));
                                }
                            } else {
                                for(index = 0; index < values.length; index++) {
                                    if(nyaBsSelectCtrl.valueIdentifier) {
                                        valuesForSelect.push(values[index][nyaBsSelectCtrl.valueIdentifier]);
                                    } else if(nyaBsSelectCtrl.keyIdentifier) {
                                        valuesForSelect.push(values[index][nyaBsSelectCtrl.keyIdentifier]);
                                    }
                                }

                            }

                            if(isMultiple) {
                                length = modelValue.length;
                                for(index = 0; index < modelValue.length; index++) {
                                    if(!contains(valuesForSelect, modelValue[index])) {
                                        modelValue.splice(index, 1);
                                        index--;
                                    }
                                }

                                if(length !== modelValue.length) {
                                    modelValue = deepCopy(modelValue);
                                }

                            } else {
                                if(!contains(valuesForSelect, modelValue)) {
                                    modelValue = valuesForSelect[0];
                                }
                            }

                        }

                        ngCtrl.$setViewValue(modelValue);

                        updateButtonContent();

                    };

                    dropdownMenu.on('click', function menuEventHandler (event) {
                        if(isDisabled) {
                            return;
                        }

                        if(jqLite(event.target).hasClass('dropdown-header')) {
                            return;
                        }
                        var nyaBsOptionNode = filterTarget(event.target, dropdownMenu[0], 'nya-bs-option'),
                            nyaBsOption;

                        if(nyaBsOptionNode !== null) {
                            nyaBsOption = jqLite(nyaBsOptionNode);
                            if(nyaBsOption.hasClass('disabled')) {
                                return;
                            }
                            selectOption(nyaBsOption);
                        }
                    });

                    var outClick = function(event) {
                        if(filterTarget(event.target, $element.parent()[0], $element[0]) === null) {
                            if($element.hasClass('open')) {
                                $element.triggerHandler('blur');
                            }
                            $element.removeClass('open');
                        }
                    };
                    $document.on('click', outClick);



                    dropdownToggle.on('blur', function() {
                        if(!$element.hasClass('open')) {
                            $element.triggerHandler('blur');
                        }
                    });
                    dropdownToggle.on('click', function() {
                        var nyaBsOptionNode;
                        $element.toggleClass('open');
                        if($element.hasClass('open') && typeof liHeight === 'undefined') {
                            calcMenuSize();
                        }
                        if($attrs.liveSearch === 'true' && $element.hasClass('open')) {
                            searchBox.children().eq(0)[0].focus();
                            nyaBsOptionNode = findFocus(true);
                            if(nyaBsOptionNode) {
                                dropdownMenu.children().removeClass('active');
                                jqLite(nyaBsOptionNode).addClass('active');
                            }
                        } else if($element.hasClass('open')) {
                            nyaBsOptionNode = findFocus(true);
                            if(nyaBsOptionNode) {
                                setFocus(nyaBsOptionNode);
                            }
                        }
                    });

                    if ($attrs.actionsBox === 'true' && isMultiple) {
                        actionsBox.find('button').eq(0).on('click', function () {
                            setAllOptions(true);
                        });
                        actionsBox.find('button').eq(1).on('click', function () {
                            setAllOptions(false);
                        });
                    }

                    if($attrs.liveSearch === 'true') {
                        searchBox.children().on('input', function(){

                            var searchKeyword = searchBox.children().val(),
                                found = 0,
                                options = dropdownMenu.children(),
                                length = options.length,
                                index,
                                option,
                                nyaBsOptionNode;

                            if(searchKeyword) {
                                for(index = 0; index < length; index++) {
                                    option = options.eq(index);
                                    if(option.hasClass('nya-bs-option')) {
                                        if(!hasKeyword(option.find('a'), searchKeyword)) {
                                            option.addClass('not-match');
                                        } else {
                                            option.removeClass('not-match');
                                            found++;
                                        }
                                    }
                                }

                                if(found === 0) {
                                    noSearchResult.addClass('show');
                                } else {
                                    noSearchResult.removeClass('show');
                                }
                            } else {
                                for(index = 0; index < length; index++) {
                                    option = options.eq(index);
                                    if(option.hasClass('nya-bs-option')) {
                                        option.removeClass('not-match');
                                    }
                                }
                                noSearchResult.removeClass('show');
                            }

                            nyaBsOptionNode = findFocus(true);

                            if(nyaBsOptionNode) {
                                options.removeClass('active');
                                jqLite(nyaBsOptionNode).addClass('active');
                            }

                        });
                    }

                    ngCtrl.$render = function() {
                        var modelValue = ngCtrl.$modelValue,
                            index,
                            bsOptionElements = dropdownMenu.children(),
                            length = bsOptionElements.length,
                            value;
                        if(typeof modelValue === 'undefined') {
                            // if modelValue is undefined. uncheck all option
                            for(index = 0; index < length; index++) {
                                if(bsOptionElements.eq(index).hasClass('nya-bs-option')) {
                                    bsOptionElements.eq(index).removeClass('selected');
                                }
                            }
                        } else {
                            for(index = 0; index < length; index++) {
                                if(bsOptionElements.eq(index).hasClass('nya-bs-option')) {

                                    value = getOptionValue(bsOptionElements.eq(index));
                                    if(isMultiple) {
                                        if(contains(modelValue, value)) {
                                            bsOptionElements.eq(index).addClass('selected');
                                        } else {
                                            bsOptionElements.eq(index).removeClass('selected');
                                        }
                                    } else {
                                        if(deepEquals(modelValue, value)) {
                                            bsOptionElements.eq(index).addClass('selected');
                                        } else {
                                            bsOptionElements.eq(index).removeClass('selected');
                                        }
                                    }

                                }
                            }
                        }
                        updateButtonContent();
                    };

                    $element.on('keydown', function(event){
                        var keyCode = event.keyCode;

                        if(keyCode !== 27 && keyCode !== 13 && keyCode !== 38 && keyCode !== 40) {
                            return;
                        }

                        event.preventDefault();
                        if(isDisabled) {
                            event.stopPropagation();
                            return;
                        }
                        var toggleButton = filterTarget(event.target, $element[0], dropdownToggle[0]),
                            menuContainer,
                            searchBoxContainer,
                            liElement,
                            nyaBsOptionNode;

                        if($attrs.liveSearch === 'true') {
                            searchBoxContainer = filterTarget(event.target, $element[0], searchBox[0]);
                        } else {
                            menuContainer = filterTarget(event.target, $element[0], dropdownContainer[0])
                        }

                        if(toggleButton) {


                            if((keyCode === 13 || keyCode === 38 || keyCode === 40) && !$element.hasClass('open')) {

                                event.stopPropagation();

                                $element.addClass('open');

                                if(typeof liHeight === 'undefined') {
                                    calcMenuSize();
                                }

                                if($attrs.liveSearch === 'true') {
                                    searchBox.children().eq(0)[0].focus();
                                    nyaBsOptionNode = findFocus(true);
                                    if(nyaBsOptionNode) {
                                        dropdownMenu.children().removeClass('active');
                                        jqLite(nyaBsOptionNode).addClass('active');
                                    }
                                } else {
                                    nyaBsOptionNode = findFocus(true);
                                    if(nyaBsOptionNode) {
                                        setFocus(nyaBsOptionNode);
                                    }
                                }
                            }
                        } else if(menuContainer) {

                            if(keyCode === 27) {
                                dropdownToggle[0].focus();
                                if($element.hasClass('open')) {
                                    $element.triggerHandler('blur');
                                }
                                $element.removeClass('open');
                                event.stopPropagation();

                            } else if(keyCode === 38) {
                                event.stopPropagation();
                                nyaBsOptionNode = findNextFocus(event.target.parentNode, 'previousSibling');
                                if(nyaBsOptionNode) {
                                    setFocus(nyaBsOptionNode);
                                } else {
                                    nyaBsOptionNode = findFocus(false);
                                    if(nyaBsOptionNode) {
                                        setFocus(nyaBsOptionNode);
                                    }
                                }
                            } else if(keyCode === 40) {
                                event.stopPropagation();
                                nyaBsOptionNode = findNextFocus(event.target.parentNode, 'nextSibling');
                                if(nyaBsOptionNode) {
                                    setFocus(nyaBsOptionNode);
                                } else {
                                    nyaBsOptionNode = findFocus(true);
                                    if(nyaBsOptionNode) {
                                        setFocus(nyaBsOptionNode);
                                    }
                                }
                            } else if(keyCode === 13) {
                                event.stopPropagation();
                                liElement = jqLite(event.target.parentNode);
                                if(liElement.hasClass('nya-bs-option')) {
                                    selectOption(liElement);
                                    if(!isMultiple) {
                                        dropdownToggle[0].focus();
                                    }
                                }
                            }
                        } else if(searchBoxContainer) {
                            if(keyCode === 27) {
                                dropdownToggle[0].focus();
                                $element.removeClass('open');
                                event.stopPropagation();
                            } else if(keyCode === 38) {
                                event.stopPropagation();

                                liElement = findActive();
                                if(liElement) {
                                    nyaBsOptionNode = findNextFocus(liElement[0], 'previousSibling');
                                    if(nyaBsOptionNode) {
                                        liElement.removeClass('active');
                                        jqLite(nyaBsOptionNode).addClass('active');
                                    } else {
                                        nyaBsOptionNode = findFocus(false);
                                        if(nyaBsOptionNode) {
                                            liElement.removeClass('active');
                                            jqLite(nyaBsOptionNode).addClass('active');
                                        }
                                    }
                                }

                            } else if(keyCode === 40) {
                                event.stopPropagation();

                                liElement = findActive();
                                if(liElement) {
                                    nyaBsOptionNode = findNextFocus(liElement[0], 'nextSibling');
                                    if(nyaBsOptionNode) {
                                        liElement.removeClass('active');
                                        jqLite(nyaBsOptionNode).addClass('active');
                                    } else {
                                        nyaBsOptionNode = findFocus(true);
                                        if(nyaBsOptionNode) {
                                            liElement.removeClass('active');
                                            jqLite(nyaBsOptionNode).addClass('active');
                                        }
                                    }
                                }
                            } else if(keyCode === 13) {
                                liElement = findActive();
                                if(liElement) {
                                    selectOption(liElement);
                                    if(!isMultiple) {
                                        dropdownToggle[0].focus();
                                    }
                                }
                            }
                        }
                    });

                    function findActive() {
                        var list = dropdownMenu.children(),
                            i, liElement,
                            length = list.length;
                        for(i = 0; i < length; i++) {
                            liElement = list.eq(i);
                            if(liElement.hasClass('active') && liElement.hasClass('nya-bs-option') && !liElement.hasClass('not-match')) {
                                return liElement;
                            }
                        }
                        return null;
                    }

                    function setFocus(elem) {
                        var childList = elem.childNodes,
                            length = childList.length,
                            child;
                        for(var i = 0; i < length; i++) {
                            child = childList[i];
                            if(child.nodeType === 1 && child.tagName.toLowerCase() === 'a') {
                                child.focus();
                                break;
                            }
                        }
                    }

                    function findFocus(fromFirst) {
                        var firstLiElement;
                        if(fromFirst) {
                            firstLiElement = dropdownMenu.children().eq(0);
                        } else {
                            firstLiElement = dropdownMenu.children().eq(dropdownMenu.children().length - 1);
                        }

                        for(var i = 0; i < dropdownMenu.children().length; i++) {
                            var childElement = dropdownMenu.children().eq(i);
                            if (!childElement.hasClass('not-match') && childElement.hasClass('selected')) {
                                return dropdownMenu.children().eq(i)[0];
                            }
                        }

                        if(firstLiElement.hasClass('nya-bs-option') && !firstLiElement.hasClass('disabled') && !firstLiElement.hasClass('not-match')) {
                            return firstLiElement[0];
                        } else {
                            if(fromFirst) {
                                return findNextFocus(firstLiElement[0], 'nextSibling');
                            } else {
                                return findNextFocus(firstLiElement[0], 'previousSibling');
                            }
                        }
                    }

                    function findNextFocus(from, direction) {
                        if(from && !hasClass(from, 'nya-bs-option')) {
                            return;
                        }
                        var next = from;
                        while ((next = sibling(next, direction)) && next.nodeType) {
                            if(hasClass(next,'nya-bs-option') && !hasClass(next, 'disabled') && !hasClass(next, 'not-match')) {
                                return next
                            }
                        }
                        return null;
                    }

                    function setAllOptions(selectAll) {
                        if (!isMultiple || isDisabled)
                            return;

                        var liElements,
                            wv,
                            viewValue;

                        liElements = dropdownMenu.find('li');
                        if (liElements.length > 0) {
                            wv = ngCtrl.$viewValue;
                            viewValue = Array.isArray(wv) ? deepCopy(wv) : [];

                            for (var i = 0; i < liElements.length; i++) {
                                var nyaBsOption = jqLite(liElements[i]);
                                if (nyaBsOption.hasClass('disabled'))
                                    continue;

                                var value, index;
                                value = getOptionValue(nyaBsOption);

                                if (typeof value !== 'undefined') {
                                    index = indexOf(viewValue, value);
                                    if (selectAll && index == -1) {
                                        // check element
                                        viewValue.push(value);
                                        nyaBsOption.addClass('selected');
                                    } else if (!selectAll && index != -1) {
                                        // uncheck element
                                        viewValue.splice(index, 1);
                                        nyaBsOption.removeClass('selected');
                                    }
                                }
                            }
                            ngCtrl.$setViewValue(viewValue);
                            $scope.$digest();

                            updateButtonContent();
                        }
                    }

                    function selectOption(nyaBsOption) {
                        var value,
                            viewValue,
                            wv = ngCtrl.$viewValue,
                            index;

                        value = getOptionValue(nyaBsOption);

                        if(typeof value !== 'undefined') {
                            if(isMultiple) {
                                viewValue = Array.isArray(wv) ? deepCopy(wv) : [];
                                index = indexOf(viewValue, value);
                                if(index === -1) {
                                    viewValue.push(value);
                                    nyaBsOption.addClass('selected');

                                } else {
                                    viewValue.splice(index, 1);
                                    nyaBsOption.removeClass('selected');

                                }

                            } else {
                                dropdownMenu.children().removeClass('selected');
                                viewValue = value;
                                nyaBsOption.addClass('selected');

                            }
                        }
                        ngCtrl.$setViewValue(viewValue);
                        $scope.$digest();

                        if(!isMultiple) {
                            if($element.hasClass('open')) {
                                $element.triggerHandler('blur');
                            }
                            $element.removeClass('open');
                            dropdownToggle[0].focus();
                        }
                        updateButtonContent();
                    }

                    function getOptionValue(nyaBsOption) {
                        var scopeOfOption;
                        if(valueExpFn) {
                            scopeOfOption = nyaBsOption.data('isolateScope');
                            return valueExpFn(scopeOfOption);
                        } else {
                            if(nyaBsSelectCtrl.valueIdentifier || nyaBsSelectCtrl.keyIdentifier) {
                                scopeOfOption = nyaBsOption.data('isolateScope');
                                return scopeOfOption[nyaBsSelectCtrl.valueIdentifier] || scopeOfOption[nyaBsSelectCtrl.keyIdentifier];
                            } else {
                                return nyaBsOption.attr('data-value');
                            }
                        }

                    }

                    function getOptionText(nyaBsOption) {
                        var item = nyaBsOption.find('a');
                        if(item.children().length === 0 || item.children().eq(0).hasClass('check-mark')) {
                            return item[0].firstChild.cloneNode(false);
                        } else {
                            return item.children().eq(0)[0].cloneNode(true);
                        }
                    }

                    function updateButtonContent() {
                        var viewValue = ngCtrl.$viewValue;
                        $element.triggerHandler('change');

                        var filterOption = jqLite(dropdownToggle[0].querySelector('.filter-option'));
                        var specialTitle = jqLite(dropdownToggle[0].querySelector('.special-title'));
                        if(typeof viewValue === 'undefined') {
                            dropdownToggle.addClass('show-special-title');
                            filterOption.empty();
                            return;
                        }
                        if(isMultiple && viewValue.length === 0) {
                            dropdownToggle.addClass('show-special-title');
                            filterOption.empty();
                        } else {
                            dropdownToggle.removeClass('show-special-title');
                            $timeout(function() {

                                var bsOptionElements = dropdownMenu.children(),
                                    value,
                                    nyaBsOption,
                                    index,
                                    length = bsOptionElements.length,
                                    optionTitle,
                                    selection = [],
                                    match,
                                    count;

                                if(isMultiple && $attrs.selectedTextFormat === 'count') {
                                    count = 1;
                                } else if(isMultiple && $attrs.selectedTextFormat && (match = $attrs.selectedTextFormat.match(/\s*count\s*>\s*(\d+)\s*/))) {
                                    count = parseInt(match[1], 10);
                                }

                                if((typeof count !== 'undefined') && viewValue.length > count) {
                                    filterOption.empty();
                                    if(localizedText.numberItemSelectedTpl) {
                                        filterOption.append(jqLite(localizedText.numberItemSelectedTpl.replace('%d', viewValue.length)));
                                    } else if(localizedText.numberItemSelected) {
                                        filterOption.append(document.createTextNode(localizedText.numberItemSelected.replace('%d', viewValue.length)));
                                    } else {
                                        filterOption.append(document.createTextNode(viewValue.length + ' items selected'));
                                    }
                                    return;
                                }

                                for(index = 0; index < length; index++) {
                                    nyaBsOption = bsOptionElements.eq(index);
                                    if(nyaBsOption.hasClass('nya-bs-option')) {

                                        value = getOptionValue(nyaBsOption);

                                        if(isMultiple) {
                                            if(Array.isArray(viewValue) && contains(viewValue, value)) {
                                                optionTitle = nyaBsOption.attr('title');
                                                if(optionTitle) {
                                                    selection.push(document.createTextNode(optionTitle));
                                                } else {
                                                    selection.push(getOptionText(nyaBsOption));
                                                }

                                            }
                                        } else {
                                            if(deepEquals(viewValue, value)) {
                                                optionTitle = nyaBsOption.attr('title');
                                                if(optionTitle) {
                                                    selection.push(document.createTextNode(optionTitle));
                                                } else {
                                                    selection.push(getOptionText(nyaBsOption));
                                                }
                                            }
                                        }

                                    }
                                }

                                if(selection.length === 0) {
                                    filterOption.empty();
                                    dropdownToggle.addClass('show-special-title');
                                } else if(selection.length === 1) {
                                    dropdownToggle.removeClass('show-special-title');
                                    filterOption.empty();
                                    filterOption.append(selection[0]);
                                } else {
                                    dropdownToggle.removeClass('show-special-title');
                                    filterOption.empty();
                                    for(index = 0; index < selection.length; index++) {
                                        filterOption.append(selection[index]);
                                        if(index < selection.length -1) {
                                            filterOption.append(document.createTextNode(', '));
                                        }
                                    }
                                }

                            });
                        }

                    }

                    function calcMenuSize(){

                        var liElements = dropdownMenu.find('li'),
                            length = liElements.length,
                            liElement,
                            i;
                        for(i = 0; i < length; i++) {
                            liElement = liElements.eq(i);
                            if(liElement.hasClass('nya-bs-option') || liElement.attr('nya-bs-option')) {
                                liHeight = liElement[0].clientHeight;
                                break;
                            }
                        }

                        if(/\d+/.test($attrs.size)) {
                            var dropdownSize = parseInt($attrs.size, 10);
                            dropdownMenu.css('max-height', (dropdownSize * liHeight) + 'px');
                            dropdownMenu.css('overflow-y', 'auto');
                        }

                    }

                    $scope.$on('$destroy', function() {
                        dropdownMenu.off();
                        dropdownToggle.off();
                        if (searchBox.off) searchBox.off();
                        $document.off('click', outClick);

                    });

                };
            }
        };
    }]);

    nyaBsSelect.directive('nyaBsOption', ['$parse', function($parse){

        var BS_OPTION_REGEX = /^\s*(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/;

        return {
            restrict: 'A',
            transclude: 'element',
            priority: 1000,
            terminal: true,
            require: ['^nyaBsSelect', '^ngModel'],
            compile: function nyaBsOptionCompile (tElement, tAttrs) {

                var expression = tAttrs.nyaBsOption;
                var nyaBsOptionEndComment = document.createComment(' end nyaBsOption: ' + expression + ' ');
                var match = expression.match(BS_OPTION_REGEX);

                if(!match) {
                    throw new Error('invalid expression');
                }

                var valueExp = tAttrs.value,
                    valueExpGetter = valueExp ? $parse(valueExp) : null;

                var valueIdentifier = match[3] || match[1],
                    keyIdentifier = match[2],
                    collectionExp = match[4],
                    groupByExpGetter = match[5] ? $parse(match[5]) : null,
                    trackByExp = match[6];

                var trackByIdArrayFn,
                    trackByIdObjFn,
                    trackByIdExpFn,
                    trackByExpGetter;
                var hashFnLocals = {$id: hashKey};
                var groupByFn, locals = {};

                if(trackByExp) {
                    trackByExpGetter = $parse(trackByExp);
                } else {
                    trackByIdArrayFn = function(key, value) {
                        return hashKey(value);
                    };
                    trackByIdObjFn = function(key) {
                        return key;
                    };
                }
                return function nyaBsOptionLink($scope, $element, $attr, ctrls, $transclude) {

                    var nyaBsSelectCtrl = ctrls[0],
                        ngCtrl = ctrls[1],
                        valueExpFn,
                        valueExpLocals = {};

                    if(trackByExpGetter) {
                        trackByIdExpFn = function(key, value, index) {
                            if (keyIdentifier) {
                                hashFnLocals[keyIdentifier] = key;
                            }
                            hashFnLocals[valueIdentifier] = value;
                            hashFnLocals.$index = index;
                            return trackByExpGetter($scope, hashFnLocals);
                        };
                    }

                    if(groupByExpGetter) {
                        groupByFn = function(key, value) {
                            if(keyIdentifier) {
                                locals[keyIdentifier] = key;
                            }
                            locals[valueIdentifier] = value;
                            return groupByExpGetter($scope, locals);
                        }
                    }

                    if(keyIdentifier) {
                        nyaBsSelectCtrl.keyIdentifier = keyIdentifier;
                    }
                    if(valueIdentifier) {
                        nyaBsSelectCtrl.valueIdentifier = valueIdentifier;
                    }

                    if(valueExpGetter) {
                        nyaBsSelectCtrl.valueExp = valueExp;
                        valueExpFn = function(key, value) {
                            if(keyIdentifier) {
                                valueExpLocals[keyIdentifier] = key;
                            }
                            valueExpLocals[valueIdentifier] = value;
                            return valueExpGetter($scope, valueExpLocals);
                        }

                    }

                    var lastBlockMap = createMap();

                    if($attr.deepWatch === 'true') {
                        $scope.$watch(collectionExp, nyaBsOptionAction, true);
                    } else {
                        $scope.$watchCollection(collectionExp, nyaBsOptionAction);
                    }

                    function nyaBsOptionAction(collection) {
                        var index,

                            previousNode = $element[0],

                            key, value,
                            trackById,
                            trackByIdFn,
                            collectionKeys,
                            collectionLength,
                            nextBlockMap = createMap(),
                            nextBlockOrder,
                            block,
                            groupName,
                            nextNode,
                            group,
                            lastGroup,

                            removedClone,

                            values = [],
                            valueObj;

                        if(groupByFn) {
                            group = [];
                        }

                        if(isArrayLike(collection)) {
                            collectionKeys = collection;
                            trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
                        } else {
                            trackByIdFn = trackByIdExpFn || trackByIdObjFn;
                            collectionKeys = [];
                            for (var itemKey in collection) {
                                if (collection.hasOwnProperty(itemKey) && itemKey.charAt(0) != '$') {
                                    collectionKeys.push(itemKey);
                                }
                            }
                            collectionKeys.sort();
                        }
                        collectionLength = collectionKeys.length;
                        nextBlockOrder = new Array(collectionLength);

                        for(index = 0; index < collectionLength; index++) {
                            key = (collection === collectionKeys) ? index : collectionKeys[index];
                            value = collection[key];
                            trackById = trackByIdFn(key, value, index);

                            valueObj = {};
                            if(keyIdentifier) {
                                valueObj[keyIdentifier] = key;
                            }

                            valueObj[valueIdentifier] = value;
                            values.push(valueObj);

                            if(groupByFn) {
                                groupName = groupByFn(key, value);
                                if(group.indexOf(groupName) === -1 && groupName) {
                                    group.push(groupName);
                                }
                            }

                            if(lastBlockMap[trackById]) {
                                block = lastBlockMap[trackById];
                                delete lastBlockMap[trackById];

                                if(groupByFn) {
                                    block.group = groupName;
                                }
                                block.key = key;
                                block.value = value;

                                nextBlockMap[trackById] = block;
                                nextBlockOrder[index] = block;
                            } else if(nextBlockMap[trackById]) {
                                nextBlockOrder.forEach(function(block) {
                                    if(block && block.scope) {
                                        lastBlockMap[block.id] = block;
                                    }
                                });
                                throw new Error("Duplicates in a select are not allowed. Use 'track by' expression to specify unique keys.");
                            } else {
                                nextBlockOrder[index] = {id: trackById, scope: undefined, clone: undefined, key: key, value: value};
                                nextBlockMap[trackById] = true;
                                if(groupName) {
                                    nextBlockOrder[index].group = groupName;
                                }
                            }
                        }

                        if(group && group.length > 0) {

                            nextBlockOrder = sortByGroup(nextBlockOrder, group, 'group');
                        }

                        for( var blockKey in lastBlockMap) {
                            block = lastBlockMap[blockKey];
                            removedClone = getBlockNodes(block.clone);
                            removedClone.removeData('isolateScope');
                            removedClone.remove();
                            block.scope.$destroy();
                        }

                        for(index = 0; index < collectionLength; index++) {
                            block = nextBlockOrder[index];
                            if(block.scope) {
                                nextNode = previousNode;
                                if(getBlockStart(block) != nextNode) {
                                    jqLite(previousNode).after(block.clone);
                                }
                                previousNode = getBlockEnd(block);

                                updateScope(block.scope, index, valueIdentifier, block.value, keyIdentifier, block.key, collectionLength, block.group);
                            } else {
                                $transclude(function nyaBsOptionTransclude(clone, scope) {
                                    setElementIsolateScope(clone, scope);
                                    block.scope = scope;

                                    var endNode = nyaBsOptionEndComment.cloneNode(false);
                                    clone[clone.length++] = endNode;

                                    jqLite(previousNode).after(clone);

                                    clone.addClass('nya-bs-option');

                                    if(valueExpFn) {
                                        value = valueExpFn(block.key, block.value);
                                    } else {
                                        value = block.value || block.key;
                                    }

                                    if(nyaBsSelectCtrl.isMultiple) {
                                        if(Array.isArray(ngCtrl.$modelValue) && contains(ngCtrl.$modelValue, value)) {
                                            clone.addClass('selected');
                                        }
                                    } else {
                                        if(deepEquals(value, ngCtrl.$modelValue)) {
                                            clone.addClass('selected');
                                        }
                                    }

                                    previousNode = endNode;
                                    block.clone = clone;
                                    nextBlockMap[block.id] = block;
                                    updateScope(block.scope, index, valueIdentifier, block.value, keyIdentifier, block.key, collectionLength, block.group);
                                });

                            }

                            if(group) {
                                if(!lastGroup || lastGroup !== block.group) {
                                    block.clone.addClass('first-in-group');
                                } else {
                                    block.clone.removeClass('first-in-group');
                                }

                                lastGroup = block.group;

                                block.clone.addClass('group-item');
                            }
                        }

                        lastBlockMap = nextBlockMap;

                        nyaBsSelectCtrl.onCollectionChange(values);
                    }
                };
            }
        }
    }]);


})();