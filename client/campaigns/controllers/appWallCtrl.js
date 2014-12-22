var appWall = angular.module('appWall');

appWall.controller('appWallCtrl', ['$scope', '$http',  'settingFactory',
    function($scope, $http, settingFactory){
        $scope.setLocalStorage = function(k,v){
            localStorage.setItem(k, v);
        };
        $scope.getLocalStorage = function(k){
            return localStorage.getItem(k);
        };
        $scope.removeLocalStorage = function(k){
            localStorage.removeItem(k);
        };
        $scope.clearLocalStorage = function(){
            localStorage.clear();
        };

        $scope.isOnline = navigator.onLine;
        $scope.validPeriod = settingFactory.validPeriod;
        $scope.siteID = settingFactory.siteID;
        $scope.placementId = settingFactory.placementId;
        $scope.UA = settingFactory.getUA();
        $scope.sessionid = settingFactory.getSessionID();
        $scope.getTimeStamp = new Date().getTime();
        $scope.loadSize = settingFactory.loadSize; //initially display 12 campaigns
        $scope.bufferSize = settingFactory.bufferSize; //each time will load 6 extra campaigns
        $scope.bufferTimes = 0;
        $scope.loadmoreHit = 0; //record for how many times loadmore button been hit
        $scope.apiURL = settingFactory.apiURL;
        $scope.adCampaigns = [];
        $scope.extraCampaigns = [];
        $scope.readyToRun = function(){
            if(navigator.onLine){
                $('.loadingView').slideUp(200);
                $('.appListView').fadeIn(200);
            }
        };
        $scope.showErrModal = function(){
            $('.loadingView').show();
            $('.appListView').hide();
            $('.errModal').show();
        };
        $scope.showEndofLoadingModal = function(){
            $(window).scrollTop(0);
            $('.loadingView').show();
            $('.appListView').hide();
            $('.EndofLoadingModal').show();
        };

        $scope.fetchData = function(apiURL, action){
            console.log("apiURL : " + apiURL);
            $http({method: 'GET', url: apiURL,
                format:'json'
            }).
                success(function(data) {
                    if(settingFactory.isWeb){
                        data = data.contents; //if calling from proxy, data has contents wraps campaigns data
                    }
                    console.log(data);
                    //workout  bufferTimes
                    $scope.bufferTimes = ~~((data.campaigns.length-$scope.loadSize)/$scope.bufferSize);

                    // this callback will be called asynchronously
                    // when the response is available
                    if(action === 'initLoad'){
                        $scope.setLocalStorage('allLoad', JSON.stringify(data.campaigns));
                        //update timeStamp in localStorage
                        $scope.setLocalStorage('timeStamp', $scope.getTimeStamp);
                        $scope.adCampaigns = data.campaigns.slice(0,$scope.loadSize);
                        //add to init list to localStorage
                        $scope.setLocalStorage('initLoad', JSON.stringify(data.campaigns.slice(0,$scope.loadSize)));

                        //add extra lists to localstorage
                        for (var i = 0; i < $scope.bufferTimes; i++){
                            var startIDX = $scope.loadSize + i*$scope.bufferSize;
                            var endIDX = startIDX + $scope.bufferSize;
                            $scope.setLocalStorage('extraLoad'+i, JSON.stringify(data.campaigns.slice(startIDX,endIDX)));
                        }
                        $scope.readyToRun();
                    }
                    else if(action === 'extraLoad'){
                        //add extra lists to localstorage
                        for (var i = 0; i < $scope.bufferTimes; i++){
                            var startIDX = i*$scope.bufferSize;
                            var endIDX = startIDX + $scope.bufferSize;
                            $scope.setLocalStorage('extraLoad'+i, JSON.stringify(data.campaigns.slice(startIDX,endIDX)));
                        }
                    }
                }).
                error(function() {
                    $scope.showErrModal();
                });
        };
        //detect if timeStamp from localStorage or add one otherwise
        if($scope.getLocalStorage('timeStamp')===null || $scope.getLocalStorage('initLoad')===null || $scope.getLocalStorage('allLoad')===null || (parseInt($scope.getLocalStorage('timeStamp'), 10))+ $scope.validPeriod < $scope.getTimeStamp){
            //first time use or local data expired
            //load data from api and store it to localStorage
            $scope.fetchData($scope.apiURL, 'initLoad');
        }
        else{
            //local data still valid
            $scope.adCampaigns = JSON.parse($scope.getLocalStorage('initLoad'));
            $scope.bufferTimes = ~~((JSON.parse($scope.getLocalStorage('allLoad')).length-$scope.loadSize)/$scope.bufferSize);
            $scope.readyToRun();
        }

        $scope.loadMore = function(){
            var fakeNavigator = {};
            for (var i in navigator) {
                fakeNavigator[i] = navigator[i];
            }
            fakeNavigator.onLine = true;
            navigator = fakeNavigator;

            $scope.isOnline = window.navigator.onLine;

            console.log("isOnline: " + $scope.isOnline);
            if(!$scope.isOnline) {
                $scope.showErrModal();
                return false;
            }
            console.log("$scope.bufferTimes: " + $scope.bufferTimes + "; $scope.loadmoreHit: " + $scope.loadmoreHit + "; isInfiniteLoad: " + settingFactory.isInfiniteLoad);
            if($scope.bufferTimes >0){
                var extra = $scope.getLocalStorage('extraLoad'+$scope.loadmoreHit);
                if(extra !== null){
                   //load extra campaign if data found from local storage
                   $scope.adCampaigns = $scope.adCampaigns.concat(JSON.parse(extra));
                }
                if($scope.loadmoreHit < $scope.bufferTimes-1)
                {
                    $scope.loadmoreHit ++;
                }
                else if($scope.loadmoreHit === $scope.bufferTimes-1){
                    if(settingFactory.isInfiniteLoad){
                        //app enabled infinite load
                        //1 hit left before reach buffer limit, add extra from live to local storage
                        //load some buffer data in advance
                        $scope.fetchData($scope.apiURL, 'extraLoad');
                        $scope.loadmoreHit = 0;
                    }else{
                        $scope.loadmoreHit ++;
                    }
                }
                else if($scope.loadmoreHit === $scope.bufferTimes){
                    $scope.showEndofLoadingModal();
                }
            }
            else{
                $scope.showEndofLoadingModal();
            }
        };
        $scope.reTry=function(){
            location.reload();
        };
        $scope.readyToRun=function(){
            $('.loadingView').hide();
            $('.appListView').show();
            $('.EndofLoadingModal').hide();
        };
        $scope.okThen = function(){
            $('.loadingView').hide();
            $('.appListView').show();
            $('.EndofLoadingModal').hide();
            $("#btn_load").hide();
        };
    }
]);

//replace image placeholder if data image source fails
appWall.directive('errSrc', function(){
   return{
       link: function(scope, element, attrs){
           element.bind('error', function(){
               if (attrs.src !=attrs.errSrc){
                   attrs.$set('src', attrs.errSrc);
               }
           })
       }
   }
});