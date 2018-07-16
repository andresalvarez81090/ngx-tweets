(function() {
'use strict';

angular
    .module('ngx-tweets')
    .factory('ngx-TweetsLogger', ngx-TweetsLogger);

function ngxTweetsLogger($log, ngxTweetsLogVerbose) {
    var noop = function() {};

    var verboseCall = function verboseCall(call) {
        if (ngx-TweetsLogVerbose === true) {
            return call;
        }
        return noop;
    };

    return {
        'log': verboseCall($log.log),
        'debug': verboseCall($log.debug),
        'info': verboseCall($log.info),
        'warn': $log.warn,
        'error': $log.error
    };
}
})();
