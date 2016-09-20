angular.module("Samtec.Anduin.Installer.Web").run(["$templateCache", function($templateCache) {$templateCache.put("Home/ChildPanel.html","<div class=\"full-width-panel ag-shadow\">\r\n    <div class=\"full-width-center\">\r\n        <div ng-repeat=\"p in ChildData.Packages\">\r\n            {{p.Name}} {{p.Build}}\r\n        </div>\r\n    </div>\r\n</div>");
$templateCache.put("Home/Home.html","<div class=\"l-view grow\">\r\n    <div class=\"l-body grow\">\r\n        <ul class=\"nav nav-tabs\">\r\n            <li ng-class=\"{\'active\' : ActiveTab == 0, \'active-tab\' : ActiveTab == 0}\"><a ng-click=\"onStationsView();\">Stations</a></li>\r\n            <li ng-class=\"{\'active\' : ActiveTab == 1, \'active-tab\' : ActiveTab == 1}\"><a ng-click=\"onPackagesView();\">Packages</a></li>\r\n        </ul>\r\n        <div class=\"row grow\">\r\n            <div class=\"col-sm-12 grow\">\r\n                <div class=\"ag-samtec ag-shadow\" ag-grid=\"GridOptions\" style=\"height:calc(100% - 70px);\">\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n\r\n");
$templateCache.put("Login/Login.html","<div class=\"l-view login\">\r\n    <div class=\"l-body\">\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-4\"></div>\r\n            <div class=\"col-sm-4\">               \r\n                <div>\r\n                    <div style=\"margin-top:40px; margin-left: auto; margin-right: auto; text-align: center; vertical-align: middle;\">\r\n                        <div style=\"margin-bottom:10px;\" class=\"center-content\">\r\n                            <input type=\"text\" ng-model=\"User.Username\" placeholder=\"Username\"/><br/>\r\n                        </div>\r\n                        <div style=\"margin-bottom:10px;\" class=\"center-content\">\r\n                            <input type=\"password\" ng-model=\"User.Password\" placeholder=\"Password\"><br/>\r\n                        </div>\r\n                        <div class=\"center-content\">\r\n                            <button class=\"primary\" ng-click=\"onLoginClick();\">Login</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-sm-4\"></div>\r\n        </div>\r\n    </div>\r\n</div>");
$templateCache.put("Notification/MessageBox.html","<section class=\"l-modal\">\r\n    <div class=\"l-modal-heading\" ng-if=\"ShowTitle\">\r\n        <h1>{{Title}}</h1>\r\n    </div>\r\n    <div class=\"l-modal-body\">\r\n        <div ng-bind-html=\"Content\"></div>\r\n    </div>\r\n    <div class=\"l-modal-footer\">\r\n        <div class=\"buttons\">\r\n            <button samtec-focus=\"true\" keep-focus class=\"primary\" ng-click=\"onOk();\" ng-keypress=\"($event.which === 13)?onOk():0\">OK</button>\r\n        </div>\r\n    </div>\r\n</section>");
$templateCache.put("Notification/YesNoNotification.html","<section class=\"l-modal\">\r\n    <div class=\"l-modal-heading\" ng-if=\"ShowTitle\">\r\n        <h1>{{Title}}</h1>\r\n    </div>\r\n    <div class=\"l-modal-body\">\r\n        <div ng-bind-html=\"Content\"></div>\r\n    </div>\r\n    <div class=\"l-modal-footer\">\r\n        <div class=\"buttons\">\r\n            <button samtec-focus=\"true\" class=\"primary\" ng-click=\"onYes();\" ng-keypress=\"($event.which === 13)?onYes():0\">Yes</button>\r\n            <button class=\"default\" ng-click=\"onNo();\">No</button>\r\n        </div>\r\n    </div>\r\n</section>");
$templateCache.put("_directives/samtecBlocker/samtecBlocker.html","<div class=\"blockout\" ng-show=\"showBlocker()\">\r\n    <i class=\"fa fa-circle-o-notch fa-spin\"></i>\r\n</div>\r\n<div ng-transclude></div>");
$templateCache.put("_directives/samtecCheckbox/samtecCheckbox.html","<button type=\"button\" class=\"samtec-checkbox\" ng-class=\"{\'checked\': checked == true}\">\r\n    <span class=\"glyphicon\" ng-class=\"{\'glyphicon-ok\': checked == true}\"></span>\r\n</button>");
$templateCache.put("_directives/samtecNavigation/samtecNavigation.html","<div class=\"st-navigation nav\">\r\n    <button class=\"subheader collapsible hidden-sm hidden-md hidden-lg\" ng-click=\"showMenu = !showMenu\">\r\n        Menu\r\n    </button>\r\n    <ul class=\"sub-nav\">\r\n        <li ng-class=\"{ selected: isSelected(item) }\" ng-repeat=\"item in items\">\r\n            <a ng-href=\"{{ item.link }}{{ getUrlParams(item.useUrlParams) }}\" class=\"btn\" ng-class=\"{ selected: isSelected(item) }\">\r\n                <div class=\"swatch\" ng-style=\"{ \'background-color\': item.swatchColor }\"></div>\r\n                <span>{{ item.text }}</span>\r\n                <span class=\"quantity\" ng-show=\"item.quantity != null\">({{ item.quantity | number }})</span>\r\n            </a>\r\n        </li>\r\n    </ul>\r\n</div>");
$templateCache.put("_directives/samtecSearch/samtecSearch.html","<div class=\"st-search clearfix\" role=\"application\">\r\n    <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n        <tbody>\r\n            <tr>\r\n                <td class=\"searchTerm\" ng-class=\"{ narrow: showDates, wide: !showDates }\">\r\n                    <input type=\"text\" ng-model=\"searchTerm\" placeholder=\"{{placeholder}}\" ng-keydown=\"keyDownHandler($event)\" uib-typeahead=\"entry for entry in myTypeAheadEntries($viewValue)\" typeahead-focus-first=\"false\" typeahead-min-length=\"typeAheadMinLength\" />\r\n                </td>\r\n                <td class=\"dates\" ng-class=\"{ expanded: showDates, collapsed: !showDates }\" ng-show=\"showCalendar\">\r\n                    <input type=\"text\" ng-model=\"startDate\" samtec-focus=\"{{startDateOpened}}\" ng-disabled=\"!showDates\" ng-keydown=\"keyDownHandler($event)\" ng-change=\"startDateChangedHandler()\" uib-datepicker-popup=\"M/d/yyyy\" is-open=\"startDateOpened\" max-date=\"{{ maxDate }}\" datepicker-options=\"dateOptions\" ng-click=\"openStartDate($event)\" placeholder=\"Start Date\" show-weeks=\"false\" />\r\n                    <input type=\"text\" ng-model=\"endDate\" samtec-focus=\"{{endDateOpened}}\" ng-disabled=\"!showDates\" ng-keydown=\"keyDownHandler($event)\" uib-datepicker-popup=\"M/d/yyyy\" is-open=\"endDateOpened\" max-date=\"{{ maxDate }}\" datepicker-options=\"dateOptions\" ng-click=\"openEndDate($event)\" placeholder=\"End Date\" show-weeks=\"false\" />\r\n                </td>\r\n                <td class=\"button\" ng-if=\"showCalendar\">\r\n                    <button type=\"button\" class=\"btn calendar\" aria-label=\"Dates\" ng-click=\"toggleDates($event)\">\r\n                        <i class=\"fa fa-calendar\" ng-show=\"!showDates\"></i>\r\n                        <i class=\"fa fa-close\" ng-show=\"showDates\"></i>\r\n                    </button>\r\n                </td>\r\n                <td class=\"button\">\r\n                    <button class=\"btn primary search\" aria-label=\"Search\" ng-click=\"searchHandler($event)\">\r\n                        <i class=\"fa fa-search\"></i>\r\n                    </button>\r\n                </td>\r\n            </tr>\r\n        </tbody>\r\n    </table>\r\n</div>\r\n");}]);