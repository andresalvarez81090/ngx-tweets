/**
 * Various production configuration settings.
 */
(function() {
'use strict';

angular
    .module('ngx-tweets')
    .config(prodConfig);

function prodConfig($provide) {
    $provide.decorator('ngx-TweetsLogVerbose', function($delegate) {
        return false;
    });
}
})();
