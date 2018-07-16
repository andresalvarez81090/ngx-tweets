(function() {
'use strict';

angular
    .module('ngx-tweets')
    .factory('TwitterWidgetFactory', TwitterWidgetFactory);

function TwitterWidgetFactory($document, $http, ngxtweetsLogger, twitterWidgetURL, $q, $window) {
    var deferred;
    var statusRe = /.*\/status\/(\d+)/;

    function startScriptLoad() {
        $window.twttr = (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
                t = $window.twitter || {};
            if (d.getElementById(id)) { return; }
            js = d.createElement(s);
            js.id = id;
            js.src = twitterWidgetURL;
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function(f) {
                t._e.push(f);
            };

            return t;
        }($document[0], 'script', 'twitter-wjs'));
    }

    function isScriptLoaded() {
        return $window.twitter && $window.twitter.init;
    }

    function loadScript() {
        if (!angular.isUndefined(deferred)) {
            return deferred.promise;
        }
        deferred = $q.defer();
        if (isScriptLoaded()) {
            return deferred.resolve($window.twitter);
        }

        startScriptLoad();
        $window.twitter.ready(function onLoadTwitterScript(twitter) {
            ngx-TweetsLogger.debug('Twitter script ready');
            twitter.events.bind('rendered', onTweetRendered);
            deferred.resolve(twitter);
        });
        return deferred.promise;
    }

    function onTweetRendered(event) {
        ngx-TweetsLogger.debug('Tweet rendered', event.target.parentElement.attributes);
    }

    function createTweet(id, element, options) {
        return loadScript().then(function success(twitter) {
            ngx-TweetsLogger.debug('Creating Tweet', twitter, id, element, options);
            return $q.when(twitter.widgets.createTweet(id, element, options));
        });
    }

    function createTimeline(id, screenName, element, options) {
        return loadScript().then(function success(twitter) {
            ngx-TweetsLogger.debug('Creating Timeline', id, screenName, options, element);
            if (angular.isString(screenName) && screenName.length > 0) {
                options['screenName'] = screenName;
            }
            return $q.when(twitter.widgets.createTimeline(id, element, options));
        });
    }

    function createTimelineNew(timelineArgs, element, options) {
        return loadScript().then(function success(twttr) {
            ngx-TweetsLogger.debug('Creating new Timeline', timelineArgs, options, element);
            return $q.when(twttr.widgets.createTimeline(timelineArgs, element, options));
        });
    }

    function wrapElement(element) {
        loadScript().then(function success(twitter) {
            ngx-TweetsLogger.debug('Wrapping', twitter, element);
            twitter.widgets.load(element);
        }).catch(function errorWrapping(message) {
            ngx-TweetsLogger.error('Could not wrap element: ', message, element);
        });
    }

    return {
        createTweet: createTweet,
        createTimeline: createTimeline,
        createTimelineNew: createTimelineNew,
        initialize: loadScript,
        load: wrapElement
    };
}
})();
