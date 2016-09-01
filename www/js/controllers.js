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

.controller('LoginCtrl', function($scope, $stateParams, $http, $localstorage, $commonFunction, $loginFunction, SERVER_AUTH) {

  $scope.loginWithKakao = function () {
    
    KakaoTalk.login(
        function (result) {

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
              alert('Success login!');

            } else {
              alert('옹알옹알 로그인 정보 통신 에러입니다. Result Code\n' + res_l.resultcode + '\n' + res_l.message);
            }

          });
        },
        function (message) {
          alert('Error login!\n'+message);
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

            // 네이버 로그인 access token 통신
            var get_naver_new_access_token = $loginFunction.getNaverNewAccessToken(param['code'], state);
            get_naver_new_access_token.then(function(res_t){

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
                    new_auth_data.refreshToken = res_t.refresh_token;

                    // 로그인 정보 DB 추출 통신
                    var set_login_info = $loginFunction.setLoginInfo(new_auth_data);
                    set_login_info.then(function(res_l){

                      if(res_l.resultcode == "00") {

                        var db_auth_data = res_l.response;
                        db_auth_data.accessToken = res_t.access_token;
                        db_auth_data.refreshToken = res_t.refresh_token;
                        db_auth_data.loginTime = new Date().getTime();

                        //alert("Login ID : " + db_auth_data.loginId + "\n이름 : " + db_auth_data.name + "\n별명 : " + db_auth_data.nickname + "\n이메일 : " + db_auth_data.email + "\n프로필사진 주소 : " + db_auth_data.profile_image);
                        $localstorage.setObject("auth_data", db_auth_data);
                        alert('Success login!');


                      } else {                  //if(res_l.resultcode == "00") {
                        alert('옹알옹알 로그인 정보 통신 에러입니다. Result Code');
                      }                         //if(res_l.resultcode == "00") {

                    });                     //set_login_info.then(function(res_l){

                  } else {              //if(res_p.resultcode === "00") {
                    alert("네이버 프로필 조회 에러!!!\n에러 : " + res_p.message);
                  }                     //if(res_p.resultcode === "00") {

                });                 //get_naver_profile.then(function(res_p) {

              } else {          //if(res_t.access_token) {
                alert("네이버 로그인 에러!!!\n에러코드 : " + res_t.error + "\n에러메세지 : " + res_t.error_description);
              }                 //if(res_t.access_token) {

            });             //get_naver_new_access_token.then(function(res_t){

          } else {      //if (param['code']) {
            alert("네이버 로그인 에러!!!\n에러코드 : " + param['error'] + "\n에러메세지 : " + param['error_description']);
          }             //if (param['code']) {


        } else {    //if (state === param['state']) {
            alert("네이버 로그인 에러!!!\nState Code 불일치");
        }           //if (state === param['state']) {

      }   //if(domain === "www.ongrongr.com") {

    }   //function successLogin(event) {

  } //$scope.loginWithNaver = function ()

  $scope.loginWithFacebook = function () {

    var fbLoginSuccess = function (res_t) {
      alert("UserInfo: " + JSON.stringify(res_t, null, 2));

      var user_id = res_t.authResponse.userID;
      var access_token = res_t.authResponse.accessToken;

      facebookConnectPlugin.api(
        user_id + "/?fields=id,email,first_name,last_name,gender,age_range",
        ['public_profile', 'email'],
        function (res_f) {
          //alert(JSON.stringify(res_f));

          var new_auth_data = {};
          new_auth_data.loginType = "facebook";
          new_auth_data.id = res_f.id;
          new_auth_data.loginId = "f_" + res_f.id;
          new_auth_data.name = res_f.last_name + res_f.first_name;
          new_auth_data.nickname = res_f.first_name;
          new_auth_data.profile_image = "http://graph.facebook.com/" + res_f.id + "/picture?type=large";
          new_auth_data.email = res_f.email;
          new_auth_data.accessToken = access_token;
          new_auth_data.refreshToken = '';

          // 로그인 정보 DB 추출 통신
          var set_login_info = $loginFunction.setLoginInfo(new_auth_data);
          set_login_info.then(function(res_l){

            if(res_l.resultcode == "00") {

              var db_auth_data = res_l.response;
              db_auth_data.accessToken = access_token;
              db_auth_data.refreshToken = "";
              db_auth_data.loginTime = new Date().getTime();

              //alert("Login ID : " + db_auth_data.loginId + "\n이름 : " + db_auth_data.name + "\n별명 : " + db_auth_data.nickname + "\n이메일 : " + db_auth_data.email + "\n프로필사진 주소 : " + db_auth_data.profile_image + "\nAccess Token : " + db_auth_data.accessToken);
              $localstorage.setObject("auth_data", db_auth_data);
              alert('Success login!');

            } else {
              alert('옹알옹알 로그인 정보 통신 에러입니다. Result Code\n' + res_l.resultcode + '\n' + res_l.message);
            }

          });



        },
        function (error) {
            alert("Failed: " + error);
        }
      );

    }


    facebookConnectPlugin.login(['public_profile', 'email'], fbLoginSuccess,
      function loginError (error) {
        alert(error);
      }
    );

    /*
    alert('페이스북 통신');
    var req = 
    {
        method: 'POST',
        url: "http://www.ongrongr.com/ionic/bbs/test.php"
    }

    $http(req).then(function(res) {
      alert('페이스북 통신 성공');
    }, function(){
      alert('실패');
    });
    */
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
