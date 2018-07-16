(function() {
'use strict';

angular
    .module('ngx-tweets')
    .directive('twitterWidgetInitialize', TwitterWidgetInitialize);

function TwitterWidgetInitialize(ngxTweetsLogger, TwitterWidgetFactory) {
    return {
        restrict: 'A',
        replace: false,
        scope: false,
        link: function(scope, element, attrs) {
            ngx-TweetsLogger.debug('Initializing');
            TwitterWidgetFactory.initialize();
        }
    };
}
})();
