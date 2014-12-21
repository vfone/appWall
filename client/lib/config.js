
var config = angular.module('appWall');

config.factory('settingFactory', function() {
    var apisettingfactory = {};
    apisettingfactory.getUA = function(){
        var ua='android';
        if(!navigator.userAgent.match(/Android/i) && !navigator.userAgent.match(/iPhone/i) && !navigator.userAgent.match(/iPad/i) ){
         ua = 'android';
         }
        else if (navigator.userAgent.match(/Android/i)){
            ua = 'android';
        }
         else{
         ua = encodeURIComponent(navigator.userAgent);
         }
        return ua;
    };
    apisettingfactory.getSessionID=function(){
        var sessionID = '';
        var mask = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for(var i = 8; i>0; --i){
            sessionID += mask[Math.round(Math.random()*(mask.length-1))];
        }
        return sessionID;
    };
    apisettingfactory.UA = apisettingfactory.getUA();
    //apisettingfactory.id = '737';
    //apisettingfactory.password = 'ETOIPP0N8L5OTQK2TGQDA46QTR';

    apisettingfactory.siteID = '6840';
    apisettingfactory.isWeb = true; //true(default) = web based application, false = run on device as app
    apisettingfactory.isDevEnv = false; //true = call proxy on localhost, false(default) = call live proxy
    apisettingfactory.spotId = 0; //spotId enable additional campaigns response info
    apisettingfactory.isInfiniteLoad = false; //true = always call api to replace localstorage data, false(default) = only load from API once per session
    apisettingfactory.hideCasino = true; //true(default) = filter out card & casino apps
    console.log(apisettingfactory.UA);
    if(apisettingfactory.UA === 'android'){
        apisettingfactory.CasinoCatID = '&categoryId=10,11,12,13,14,15,2,3,4,5,6,7,8,16,18,19,20,21,22,23,24,25,26,28,29,30,31,32'; //12 cards & casino
    }
    else{
        apisettingfactory.CasinoCatID = '&categoryId=35,36,37,38,39,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77'; //40,41,42 card, casino, dice
    }

    if(apisettingfactory.isDevEnv){
        apisettingfactory.proxyURL = "http://127.0.0.1/crossoverWP.php?url=";
    }
    else{
        apisettingfactory.proxyURL = 'http://54.252.184.234/crossoverWP.php?url=';
    }
    apisettingfactory.placementId = 1; //not sure what this parameter does
    apisettingfactory.loadSize = 200; //TODO: this param should be in backend web service
    apisettingfactory.loadSize = 12; //initially display 12 campaigns
    apisettingfactory.bufferSize = 6; //each time will load 6 extra campaigns
    apisettingfactory.timeStamp = new Date().getTime();
    apisettingfactory.validPeriod = 15 * 60 * 1000; //initial local data valid for about 15mins


    apisettingfactory.appiaURL = '&sessionId='+apisettingfactory.getSessionID()+'&siteId='+apisettingfactory.siteID+'&userAgentHeader='+apisettingfactory.UA+'&placementId='+apisettingfactory.placementId+'&totalCampaignsRequested='+apisettingfactory.loadSize;
    if(apisettingfactory.hideCasino){
            apisettingfactory.appiaURL += apisettingfactory.CasinoCatID;
    }
    if(apisettingfactory.isWeb){
        apisettingfactory.apiURL = apisettingfactory.proxyURL + encodeURIComponent(apisettingfactory.appiaURL); //if calling from server level, needs proxy to address cross domain
    }
    else{
        apisettingfactory.apiURL = apisettingfactory.appiaURL;
    }
    return apisettingfactory;
});

