'use strict';

angular.module('courierApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },
    {
      'title': 'Beacons',
      'link': '/beacons'
    },
    {
      'title': 'Agents',
      'link': '/agents'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
        if($location.path() === "/beacons"){
            $scope.activetab="beacons";
        }else{
            $scope.activetab="agent";
        }
      return route === $location.path();
    };
  });
