// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $http, $localstorage, $loginFunction, SERVER_AUTH, $ionicPopup, $authService) {
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

    $authService.checkServerToken();
/*
    // SH. 서버와 통신하는 constant KEY
    var server_key = SERVER_AUTH.KEY;

    // SH. uuid 저장
    var uuid = window.device.uuid;
    $localstorage.set('uuid', uuid);

    var check_server_token = $loginFunction.checkServerToken();
    check_server_token.then(function(res_server){

      if(res_server.resultcode == "00") {
        $localstorage.set('server_token', res_server.response.token);
      } else {
        alert('초기화 통신 에러입니다. \nResult Code : ' + res_server + '\nMessage : ' + res_server.message);
        navigator.app.exitApp();
      }

    });
*/
    // SH. 백그라운드로 있다가 다시 실행될 때
    // 30분이상 되었으면 로그인 세션 관리 문제로 재실행 함
    var start_time = new Date().getTime();

    $ionicPlatform.on('resume', function() {

      var resume_time = new Date().getTime();

      //30분이상 resume상태이면 재실행
      if((resume_time - start_time)/1000 > 1800) {
        document.location.href = 'index.html';
      }

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
