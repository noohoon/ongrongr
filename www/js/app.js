// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $http, $localstorage, SERVER_AUTH) {
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

    // SH. 서버와 통신하는 constant KEY
    var server_key = SERVER_AUTH.KEY;

    // SH. uuid 저장
    var uuid = window.device.uuid;
    $localstorage.set('uuid', uuid);


    checkServerSession(uuid, server_key);
    checkLoginSession();

    // SH. 백그라운드로 있다가 다시 실행될 때
    // server_token 갱신
    $ionicPlatform.on('resume', function() {
      checkServerSession(uuid, server_key);
      checkLoginSession();
    });

  });

  function checkLoginSession() {
    var auth_data = $localstorage.getObject("auth_data");
    var now_time = new Date().getTime();

    if( (now_time - auth_data.loginTime)/1000 > 3000) {

      if(auth_data.loginType === "kakao"){

        KakaoTalk.session(
            function (result) {
              alert('Success session!');
            },
            function (message) {
              alert('Error session!');
            }
        );


      } else if (auth_data.loginType === "naver") {
/*
        var token_url = SERVER_AUTH.NAVER.TOKEN_URL + "?grant_type=refresh_token&client_id=" + SERVER_AUTH.NAVER.CLIENT_ID + "&client_secret=" + SERVER_AUTH.NAVER.CLIENT_SECRET + "&refresh_token=" + auth_data.refreshToken;

        var req = 
        {
            method: 'GET',
            url: token_url
        }

        $http(req).
        success(function(data) 
        {
          
          if(data.access_token) {
            getNaverProfile(data.access_token, auth_data.refreshToken);
          } else {
            alert("네이버 로그인 에러!!!\n에러코드 : " + data.error + "\n에러메세지 : " + data.error_description);
          }


        }).
        error(function(data) 
        {
          alert('네이버 통신 에러입니다. access token 조회');
        });

*/
      } else if (auth_data.loginType === "facebook") {

      } else {

      }

    }


  }

  // 서버와 첫번째 동신하고 권한 토큰을 리시브하는 function
  function checkServerSession(uuid, server_key) {

    var req = 
    {
        method: 'POST',
        url: "http://www.ongrongr.com/ionic/bbs/check_first.php",
        data: {
          uuid : uuid,
          server_key : server_key
        }
    }

    $http(req).
    success(function(data) 
    {
      if(data.resultcode == 00) {
        $localstorage.set('server_token', data.response.token);
      } else {
        alert('초기화 통신 에러입니다. \nResult Code : ' + data.resultcode + '\nMessage : ' + data.message);
        navigator.app.exitApp();
      }


    }).
    error(function(data) 
    {
      alert('초기화 통신 에러입니다. 진짜 통신 안됨');
      navigator.app.exitApp();
    });


  }


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
