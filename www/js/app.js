// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $http, $localstorage, $loginFunction, SERVER_AUTH) {
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

    var check_server_token = $loginFunction.checkServerToken();
    check_server_token.then(function(res_server){

      if(res_server.resultcode == "00") {
        $localstorage.set('server_token', res_server.response.token);

        checkLoginSession();
      } else {
        alert('초기화 통신 에러입니다. \nResult Code : ' + res_server + '\nMessage : ' + res_server.message);
        navigator.app.exitApp();
      }

    });

    // SH. 백그라운드로 있다가 다시 실행될 때
    // server_token 갱신
    $ionicPlatform.on('resume', function() {

      var re_check_server_token = $loginFunction.checkServerToken();
      re_check_server_token.then(function(res_server){

        if(res_server.resultcode == "00") {
          $localstorage.set('server_token', res_server.response.token);
          
          checkLoginSession();
        } else {
          alert('초기화 통신 에러입니다. \nResult Code : ' + res_server + '\nMessage : ' + res_server.message);
          navigator.app.exitApp();
        }

      });


    });

  });

  // 로그인 세션 체크후 세션 갱신
  function checkLoginSession() {

    var auth_data = $localstorage.getObject("auth_data");
    var now_time = new Date().getTime();

    if( (now_time - auth_data.loginTime)/1000 > 3599) {      

      if(auth_data.loginType === "kakao"){

        KakaoTalk.session(
            function (result) {
              //alert('Success session!');


              var new_auth_data = {};
              new_auth_data.loginType = "kakao";
              new_auth_data.id = result.id;
              new_auth_data.loginId = "k_" + result.id;
              new_auth_data.name = result.nickname;
              new_auth_data.nickname = result.nickname;
              new_auth_data.profile_image = result.profile_image;
              new_auth_data.email = '';
              new_auth_data.accessToken = result.accessToken;
              new_auth_data.refreshToken = '';

              //alert("Login ID : " + new_auth_data.loginId + "\n이름 : " + new_auth_data.name + "\n별명 : " + new_auth_data.nickname + "\n이메일 : " + new_auth_data.email + "\n프로필사진 주소 : " + new_auth_data.profile_image);
              // 로그인 정보 DB 추출 통신
              var set_login_info = $loginFunction.setLoginInfo(new_auth_data);
              set_login_info.then(function(res_l){

                if(res_l.resultcode == "00") {

                  var db_auth_data = res_l.response;
                  db_auth_data.accessToken = result.accessToken;
                  db_auth_data.refreshToken = "";
                  db_auth_data.loginTime = new Date().getTime();

                  //alert("Login ID : " + db_auth_data.loginId + "\n이름 : " + db_auth_data.name + "\n별명 : " + db_auth_data.nickname + "\n이메일 : " + db_auth_data.email + "\n프로필사진 주소 : " + db_auth_data.profile_image + "\nAccess Token : " + db_auth_data.accessToken);
                  $localstorage.setObject("auth_data", db_auth_data);


                } else {
                  alert('옹알옹알 로그인 정보 통신 에러입니다. Result Code\n' + res_l.resultcode + '\n' + res_l.message);
                }

              });

            },
            function (message) {
              alert('Error session!');
            }
        );


      } else if (auth_data.loginType === "naver") {

        // 로그인 access token 갱신 통신
        var get_naver_re_access_token = $loginFunction.getNaverReAccessToken(auth_data.refreshToken);
        get_naver_re_access_token.then(function(res_t) {

          if(res_t.access_token) {

            // 네이버 프로필 정보 통신
            var get_naver_profile = $loginFunction.getNaverProfile(res_t.access_token);
            get_naver_profile.then(function(res_p) {

              if(res_p.resultcode === "00") {

                var new_auth_data = {};
                new_auth_data.loginType = "naver";
                new_auth_data.id = res_p.response.id;
                new_auth_data.loginId = "n_" + res_p.response.id;
                new_auth_data.name = res_p.response.name;
                new_auth_data.nickname = res_p.response.nickname;
                new_auth_data.profile_image = res_p.response.profile_image;
                new_auth_data.email = res_p.response.email;
                new_auth_data.accessToken = res_t.access_token;
                new_auth_data.refreshToken = auth_data.refreshToken;

                // 로그인 정보 DB 추출 통신
                var set_login_info = $loginFunction.setLoginInfo(new_auth_data);
                set_login_info.then(function(res_l){

                  if(res_l.resultcode == "00") {

                    var db_auth_data = res_l.response;
                    db_auth_data.accessToken = res_t.access_token;
                    db_auth_data.refreshToken = auth_data.refreshToken;
                    db_auth_data.loginTime = new Date().getTime();

                    //alert("Login ID : " + db_auth_data.loginId + "\n이름 : " + db_auth_data.name + "\n별명 : " + db_auth_data.nickname + "\n이메일 : " + db_auth_data.email + "\n프로필사진 주소 : " + db_auth_data.profile_image);
                    $localstorage.setObject("auth_data", db_auth_data);


                  } else {
                    alert('옹알옹알 로그인 정보 통신 에러입니다. Result Code');
                  }

                });

              } else {
                alert("네이버 프로필 조회 에러!!!\n에러 : " + res_p.message);
              }

            });

          } else {
            alert("네이버 Access Token 갱신 에러!!!\n에러코드 : " + res_t.error + "\n에러메세지 : " + res_t.error_description);
          }

        });

      } else if (auth_data.loginType === "facebook") {

      } else {

      }

    } //if( (now_time - auth_data.loginTime)/1000 > 1) {

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
