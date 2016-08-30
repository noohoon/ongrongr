angular.module('starter.services', [])

.constant('LOGININFO', {
  LOGIN_DATA : {}
})

.constant('SERVER_AUTH', {
  KEY : "287bb64051ec0f5664b1088d9ad5690c",
  NAVER : {
    CLIENT_ID : 'J_4XJrvomzG0JapSDpMi',
    CLIENT_SECRET : 'rPqMTGvdCL',
    REDIRECT_URL : 'http://www.ongrongr.com/ionic/bbs/naver_redirect_url.php',
    AUTHORIZE_URL : 'https://nid.naver.com/oauth2.0/authorize',
    TOKEN_URL : 'https://nid.naver.com/oauth2.0/token',
    PROFILE_URL : 'https://openapi.naver.com/v1/nid/me'
  }
})

//localStorage 사용을 위한 셋팅
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key,value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key,value) {
      $window.localStorage[key] = JSON.stringify(value);      
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }

}])

.factory('$loginFunction', function($http, $localstorage, SERVER_AUTH) {

  return {

    // 서버와 첫번째 동신하고 권한 토큰을 리시브하는 function
    checkServerToken: function() {

      var req = 
      {
          method: 'POST',
          url: "http://www.ongrongr.com/ionic/bbs/check_first.php",
          data: {
            uuid : $localstorage.get('uuid'),
            server_key : SERVER_AUTH.KEY
          }
      }

      return $http(req).then(function(res) {
        return res.data;
      });

    },


    getNaverNewAccessToken: function(code, state) {

      var token_url = SERVER_AUTH.NAVER.TOKEN_URL + "?grant_type=authorization_code&client_id=" + SERVER_AUTH.NAVER.CLIENT_ID + "&client_secret=" + SERVER_AUTH.NAVER.CLIENT_SECRET + "&code=" + code + "&state=" + state;

      var req = 
      {
          method: 'GET',
          url: token_url
      }

      return $http(req).then(function(res) {

        return res.data;

      });


    },  //getNaverNewAccessToken: function(code, state) {

    getNaverReAccessToken: function(refresh_token) {
      var token_url = SERVER_AUTH.NAVER.TOKEN_URL + "?grant_type=refresh_token&client_id=" + SERVER_AUTH.NAVER.CLIENT_ID + "&client_secret=" + SERVER_AUTH.NAVER.CLIENT_SECRET + "&refresh_token=" + refresh_token;

      var req = 
      {
          method: 'GET',
          url: token_url
      }

      return $http(req).then(function(res) {

        return res.data;

      });
    },  //getNaverReAccessToken: function(refresh_token) {

    getNaverProfile: function(access_token) {

      var req = 
      {
          method: 'GET',
          url: SERVER_AUTH.NAVER.PROFILE_URL,
          headers: {
            Authorization : "Bearer " + access_token
          }
      }

      return $http(req).then(function(res) {

        return res.data;

      });

    }, //getNaverProfile: function(access_token) {


    setLoginInfo: function(auth_data) {

      var uuid = $localstorage.get('uuid');
      var server_key = SERVER_AUTH.KEY;
      var server_token = $localstorage.get('server_token');

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

      return $http(req).then(function(res) {

        return res.data;

      });

    } //getNaverProfile: function(access_token) {

  } //return {

})

.factory('$commonFunction', function() {
  return {

    // 주소의 도메인 추출
    getDomain: function(address) {
      var domain = address;
      var pattern = /^http:\/\/([a-z0-9-_\.]*)[\/\?]/i;
      domain = domain.match(pattern);
      domain = domain[1];
      return domain;
    },

    // 주소의 get 변수를 추출 자바스크립트 변수화
    getParam: function(address) {
      var params = {};
      var queryString = (address+"").substring(1);
      var regex = /([^#?&=]+)=([^&]*)/g;
      var match;
      while ((match = regex.exec(queryString)) !== null) {
        params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
      }

      return params;
    },
/*
    getNaverAccessToken: function(code, state) {
      var result = {};

      var token_url = SERVER_AUTH.NAVER.TOKEN_URL + "?grant_type=authorization_code&client_id=" + SERVER_AUTH.NAVER.CLIENT_ID + "&client_secret=" + SERVER_AUTH.NAVER.CLIENT_SECRET + "&code=" + code + "&state=" + state;

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

          result.resultcode = "00";
          result.message = "access token 조회 성공";
          result.response.access_token = data.access_token;
          result.response.refresh_token = data.refresh_token;
          return result;


        } else {
          result.resultcode = "01";
          result.message = "네이버 access token 조회 에러!!! 에러코드 : " + data.error + " 에러메세지 : " + data.error_description;
          return result;
        }
      }).
      error(function(data) 
      {
        result.resultcode = "01";
        result.message = "네이버 access token 조회시 통신 에러입니다.";
        return result;
      });


    },
    
    getNaverProfile: function(access_token, refresh_token) {

        var result = {};

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

            result.resultcode = "00";
            result.message = "프로필 조회 성공";
            result.response = auth_data;
            return result;

          } else {
            result.resultcode = "01";
            result.message = "네이버 프로필 조회시 출력 에러입니다.";
            return result;
          }
        }).
        error(function(data) 
        {
          result.resultcode = "01";
          result.message = "네이버 프로필 조회 통신 에러입니다.";
          return result;
        });
      },

      checkLoginInfo: function(auth_data) {

        var result = {};
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

              var db_auth_data = data.response;
              db_auth_data.accessToken = auth_data.accessToken;
              db_auth_data.refreshToken = auth_data.refreshToken;
              db_auth_data.loginTime = new Date().getTime();

              $localstorage.setObject("auth_data", db_auth_data);

              result.resultcode = "00";
              result.message = "로그인 성공";
              return result;

            } else {
              result.resultcode = "01";
              result.message = "옹알옹알 로그인 체크시 출력 에러입니다.";
              return result;
            }


          }).
          error(function(data) 
          {
            result.resultcode = "01";
            result.message = "옹알옹알 로그인 조회 통신 에러입니다.";
            return result;

          });



        }


      },
*/
    /**
     * SH.
     * 네이버 ID로 로그인에 필요한 state값 추출
     * 네이버 로그인 자바스트립트 라이브러리에서 가지고 옴
     * oauth 2.0 spec 의 state 값 자동 생성
    */
    getUniqToken: function() {
      var stat_str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8); return v.toString(16); });
      return stat_str;
    }

  }

});