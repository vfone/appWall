angular.module("appWall").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){

        $locationProvider.html5Mode(true);
        //TODO:set loading method/template name, now is only loading more button avaiable, should consider other loading method, such as pagination to call different template in routes.js
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