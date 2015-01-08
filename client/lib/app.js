
angular.module('appWall', ['angular-meteor', 'ui.router']);
Meteor.startup(function(){
    angular.bootstrap(document, ['appWall']);
});


