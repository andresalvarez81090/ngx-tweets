(function() {
'use strict';

angular
    .module('ngx-tweets')
    .directive('twitterWidget', TwitterWidget);

function TwitterWidget(ngxTweetsLogger, TwitterWidgetFactory) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            twitterWidgetId: '=',
            twitterWidgetOnRendered: '&',
            twitterWidgetOptions: '@'
        },
        template: '<div class="ngx-tweets-wrapper" ng-transclude></div>',
        link: function(scope, element, attrs) {
            scope.$watch('twitterWidgetId', function(newValue, oldValue) {
                ngx-TweetsLogger.debug('Linking', element, attrs);
                var twitterWidgetOptions = scope.$eval(attrs.twitterWidgetOptions);
                if (oldValue !== undefined && newValue !== oldValue) { //replacing, clear node.
                    angular.element(element[0]).empty();
                }
                if (!angular.isUndefined(scope.twitterWidgetId)) {
                    if (!angular.isString(scope.twitterWidgetId)) {
                        ngx-TweetsLogger.warn('twitterWidgetId should probably be a string due to loss of precision.');
                    }
                    TwitterWidgetFactory.createTweet(scope.twitterWidgetId, element[0], twitterWidgetOptions).then(function success(embed) {
                        ngx-TweetsLogger.debug('Created tweet widget: ', scope.twitterWidgetId, element);
                        scope.twitterWidgetOnRendered();
                    }).catch(function creationError(message) {
                        ngx-TweetsLogger.error('Could not create widget: ', message, element);
                    });
                } else {
                    TwitterWidgetFactory.load(element[0]);
                }
            });
        }
    };
}
})();
