angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicHistory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.devWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);


})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('LoginCtrl', function($scope, $stateParams, $http, $localstorage, $commonFunction, SERVER_AUTH) {

  $scope.loginWithKakao = function () {
    
    KakaoTalk.login(
        function (result) {

          alert('Success login!');

          var auth_data = {};
          auth_data.loginType = "kakao";
          auth_data.id = result.id;
          auth_data.loginId = "k_" + result.id;
          auth_data.name = result.nickname;
          auth_data.nickname = result.nickname;
          auth_data.profile_image = result.profile_image;
          auth_data.email = '';
          auth_data.accessToken = result.accessToken;
          auth_data.refreshToken = '';

          checkLoginInfo(auth_data);

        },
        function (message) {
          alert('Error login!');
          alert(message);
        }
    );
    
  }

  $scope.loginWithNaver = function () {

    var state = $commonFunction.getUniqToken();
    var authorize_url = SERVER_AUTH.NAVER.AUTHORIZE_URL + "?client_id=" + SERVER_AUTH.NAVER.CLIENT_ID + "&response_type=code&redirect_uri=" + encodeURIComponent(SERVER_AUTH.NAVER.REDIRECT_URL) + "&state=" + state;

//    alert(authorize_url);

    var ref = cordova.InAppBrowser.open(authorize_url, '_blank', 'location=no');

    ref.addEventListener('loadstop', successLogin );

    function successLogin(event) {
      var domain = $commonFunction.getDomain(event.url);

      if(domain === "www.ongrongr.com") {
        var param = $commonFunction.getParam(event.url);
        ref.close();

        if (state === param['state']) {

          if (param['code']) {
            getNaverAccessToken(param['code']);
          } else {
            alert("네이버 로그인 에러!!!\n에러코드 : " + param['error'] + "\n에러메세지 : " + param['error_description']);
          }


        } else {
            alert("네이버 로그인 에러!!!\nState Code 불일치");
        }

      }

    }

    function getNaverAccessToken(code) {

      var token_url = SERVER_AUTH.NAVER.TOKEN_URL + "?grant_type=authorization_code&client_id=" + SERVER_AUTH.NAVER.CLIENT_ID + "&client_secret=" + SERVER_AUTH.NAVER.CLIENT_SECRET + "&code=" + code + "&state=" + state;
//            alert('네이버 로그인 코드받기');

      var req = 
      {
          method: 'GET',
          url: token_url
      }

      $http(req).
      success(function(data) 
      {
        
        if(data.access_token) {
          getNaverProfile(data.access_token, data.refresh_token);
        } else {
          alert("네이버 로그인 에러!!!\n에러코드 : " + data.error + "\n에러메세지 : " + data.error_description);
        }


      }).
      error(function(data) 
      {
        alert('네이버 통신 에러입니다. access token 조회');
      });

    }


    function getNaverProfile(access_token, refresh_token) {
      var req = 
      {
          method: 'GET',
          url: SERVER_AUTH.NAVER.PROFILE_URL,
          headers: {
            Authorization : "Bearer " + access_token
          }
      }

      $http(req).
      success(function(data) 
      {

        if(data.resultcode == 00) {

          var auth_data = {};
          auth_data.loginType = "naver";
          auth_data.id = data.response.id;
          auth_data.loginId = "n_" + data.response.id;
          auth_data.name = data.response.name;
          auth_data.nickname = data.response.nickname;
          auth_data.profile_image = data.response.profile_image;
          auth_data.email = data.response.email;
          auth_data.accessToken = access_token;
          auth_data.refreshToken = refresh_token;

          checkLoginInfo(auth_data);

        } else {
          alert("네이버 로그인 에러!!!\n에러코드 : " + data.error + "\n에러메세지 : " + data.error_description);
        }
      }).
      error(function(data) 
      {
        alert('네이버 통신 에러입니다. 프로필 조회');
      });
    }


  } //$scope.loginWithNaver = function ()

  var checkLoginInfo = function(auth_data) {
//  $scope.checkLoginInfo = function() {

    var uuid = $localstorage.get('uuid');
    var server_key = SERVER_AUTH.KEY;
    var server_token = $localstorage.get('server_token');

    if(server_key && server_token) {

      var req = 
      {
          method: 'POST',
          url: "http://www.ongrongr.com/ionic/bbs/check_login_info.php",
          data: {
            uuid : uuid,
            server_key : server_key,
            server_token : server_token,
            auth_data : auth_data
          }
      }

      $http(req).
      success(function(data) 
      {
        if(data.resultcode == 00) {

          alert('로그인 성공');

          var db_auth_data = data.response;
          db_auth_data.accessToken = auth_data.accessToken;
          db_auth_data.refreshToken = auth_data.refreshToken;
          db_auth_data.loginTime = new Date().getTime();

          $localstorage.setObject("auth_data", db_auth_data);

        } else {
          alert('통신 에러입니다. Result Code');
        }


      }).
      error(function(data) 
      {
        alert('통신 에러입니다. 진짜 통신 안됨');
      });



    }

  }


})

.controller('MydiaryCtrl', function($scope, $stateParams, $http, $localstorage) {

  //var uu = window.device.uuid;

  $scope.checkState = function(){

      $scope.uuid = $localstorage.get('uuid');
      $scope.token = $localstorage.get('server_token');

      $scope.auth_data = $localstorage.getObject("auth_data");


/*
    var req = 
    {
        method: 'POST',
        url: "http://www.ongrongr.com/ionic/bbs/first.check.php",
        data: {uuid : window.device.uuid}
    }

    $http(req).
    success(function(data) 
    {
      alert('성공');
      $scope.uuid = data.response.uuid;
      $scope.token = data.response.token;

      //alert(data.response.uuid);
    }).
    error(function(data) 
    {
      alert('에러');
    });
*/
  };

})


.controller('PlaylistCtrl', function($scope, $stateParams) {
});
