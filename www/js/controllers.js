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

.controller('LoginCtrl', function($scope, $stateParams) {

  $scope.loginWithKakao = function () {
    
    KakaoTalk.login(
        function (result) {
          alert('Success login!');
          alert(result.accessToken);
          alert(result.id);
          alert(result.nickname);
          alert(result.profile_image);
          alert(result.thumbnail_image);
        },
        function (message) {
          alert('Error login!');
          alert(message);
        }
    );
    
  };
})

.controller('MydiaryCtrl', function($scope, $stateParams, $http, $localstorage) {

  //var uu = window.device.uuid;

  $scope.checkState = function(){

      $scope.uuid = $localstorage.get('uuid');
      $scope.token = $localstorage.get('db_token');


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
