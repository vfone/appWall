angular.module("appWall").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){

        $locationProvider.html5Mode(true);
        //TODO:template and controller should NOT be dynamic since one app will only using single template at moment. So, no need to pass global variables from config.js but adding more rules underneath $stateProvider if route required.
        var tempName = 'appwalllist';
        var ctrlName = 'appWallCtrl';

        $stateProvider
            .state('/', {
                url: '/',
                template: UiRouter.template(tempName),
                controller: ctrlName
            });

        $urlRouterProvider.otherwise("/");
    }]);