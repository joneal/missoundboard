// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('samtec-highlight-text', [])
        .directive('samtecHighlightText', samtecHighlightText);

    samtecHighlightText.$inject = ['$interpolate'];

    // Searches the inner text for the search term (samtecHighlightText), and replaces that text
    // with a <span> that is highlighted.
    function samtecHighlightText($interpolate) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var term = attrs.samtecHighlightText,
                    text = $interpolate(element.text())(scope),
                    flags = attrs.samtecHighlightFlags || 'gi',
                    watcher = scope.$watch(term, function (term) {
                        var allTerms = term.split(' ');

                        text = text.replace(getRegExp('<span class="highlight">', 'g'), '');
                        text = text.replace(getRegExp('</span>', 'g'), '');

                        // Have to add tildes and pipes, and then replace with the actual span tags later.  
                        // This is needed because it will try to highlight the text in the span tags on each subsequent keyword of multiple keywords.
                        _.each(allTerms, function (t) {
                            if (t.length > 0) {
                                text = text.replace(getRegExp(t, flags), '~~~$&|||');
                            }
                        });

                        text = text.replace(getRegExp('~~~', 'g'), '<span class="highlight">');
                        text = text.replace(getRegExp('|||', 'g'), '</span>');

                        element.html(text);
                    });

                element.on('$destroy', function () { watcher(); });

                function sanitize(term) {
                    if (!term) {
                        return term;
                    }
                    return term.replace(/[\\\^\$\*\+\?\.\(\)\|\{\}\[\]]/g, '\\$&');
                }

                function getRegExp(text, flags) {
                    var str = sanitize(text);
                    if (flags.indexOf('^') > -1) {
                        str = '^' + str;
                    }
                    if (flags.indexOf('$') > -1) {
                        str += '$';
                    }
                    return new RegExp(str, flags.replace(/[\$\^]/g, ''));
                }
            }
        };
    }
})();