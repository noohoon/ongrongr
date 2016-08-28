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