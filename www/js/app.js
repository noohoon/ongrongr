// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $http, $localstorage) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // uuid/db_token 초기화 통신
    // 앱실행후 무조건 새로운 토큰으로 새로 생성

    var uuid = window.device.uuid;
    $localstorage.set('uuid', uuid);  //기기id

    var req = 
    {
        method: 'POST',
        url: "http://www.ongrongr.com/ionic/bbs/first.check.php",
        data: {uuid : uuid}
    }

    $http(req).
    success(function(data) 
    {
      if(data.resultcode == 00) {
        $localstorage.set('db_token', data.response.token);
      } else {
        alert('초기화 통신 에러입니다.');
        navigator.app.exitApp();
      }


    }).
    error(function(data) 
    {
      alert('초기화 통신 에러입니다.');
      navigator.app.exitApp();
    });
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.tabs', {
    url: '/tabs',
    views: {
      'menuContent': {
        templateUrl: 'templates/tabs.html'
      }
    }
  })

  .state('app.tabs.mydiary', {
    url: '/mydiary',
    views: {
      'mydiary': {
        templateUrl: 'templates/mydiary.html',
        controller: 'MydiaryCtrl'
      }
    }
  })

  .state('app.tabs.neighbordiary', {
    url: '/neighbordiary',
    views: {
      'neighbordiary': {
        templateUrl: 'templates/neighbordiary.html'
      }
    }
  })

  .state('app.tabs.hotdeal', {
    url: '/hotdeal',
    views: {
      'hotdeal': {
        templateUrl: 'templates/hotdeal.html'
      }
    }
  })

  .state('app.tabs.community', {
    url: '/community',
    views: {
      'community': {
        templateUrl: 'templates/community.html'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/tabs/mydiary');
});
