'use strict';

angular.module('aksiteApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'btford.socket-io',
    'ui.router',
    'ui.bootstrap',
    'angularFileUpload'
])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        $urlRouterProvider
            .otherwise('/');

        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('authInterceptor');
    })

    .factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
        return {
            // Add authorization token to headers
            request: function(config) {
                config.headers = config.headers || {};
                if($cookieStore.get('token')) {
                    config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
                }
                return config;
            },

            // Intercept 401s and redirect you to login
            responseError: function(response) {
                if(response.status === 401) {
                    $location.path('/login');
                    // remove any stale tokens
                    $cookieStore.remove('token');
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }
        };
    })

    .run(function($rootScope, $location, Auth) {
        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$stateChangeStart', function(event, next) {
            Auth.isLoggedInAsync(function(loggedIn) {
                if(next.authenticate && !loggedIn) {
                    $location.path('/login');
                }
            });
        });
    });

var myRenderer = new marked.Renderer();
if (typeof hljs != 'undefined') {
    myRenderer.code = function(code, lang, escaped) {
        if (lang && _.contains(hljs.listLanguages(), lang)) {
            try {
                code = hljs.highlight(lang, code).value;
            } catch (e) {}
        }

        return '<pre><code'
            + (lang
                ? ' class="hljs ' + this.options.langPrefix + lang + '"'
                : ' class="hljs"')
            + '>'
            + code
            + '\n</code></pre>\n';
    };
} else {
    console.log('hljs undefined');
}

marked.setOptions({
    renderer: myRenderer,
    highlight: function(code) {
        return hljs.highlightAuto(code).value;
    },
    gfm: true
});
