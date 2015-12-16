var app = angular.module('jwtApp', ['ui.router', 'restangular']);

function prettyPrintJson(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

function decodeToken(token) {
  var parts, header, claim, signature;
  token = token || '';
  parts = token.split('.');
  if (parts.length === 3) {
    header = parts[0];
    claim = parts[1];
    signature = parts[2];
    header = JSON.parse(decodeURIComponent(escape(atob(header))));
    claim = JSON.parse(decodeURIComponent(escape(atob(claim))));
  }

  return {
    header: header,
    claim: claim,
    signature: signature
  }
}

app.factory('Login', loginFactory)

app.config(function($stateProvider, $locationProvider, $httpProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  $httpProvider.interceptors.push('authInterceptor');
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('logout', {
      url: '/logout',
      templateUrl: 'templates/logout.html',
      controller: 'LogoutCtrl'
    })
    .state('logs', {
      url: '/logs',
      templateUrl: 'templates/logs.html',
      controller: 'LogsCtrl',
      resolve: {
        logs: function(Restangular) {
          return Restangular.all('api/logs').getList();
        }
      }
    })
    .state('token', {
      url: '/token',
      templateUrl: 'templates/token.html',
      controller: 'TokenCtrl'
    })
    .state('otherwise', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })
});

app
  .controller('HomeCtrl', homeCtrl)
  .controller('TokenCtrl', tokenCtrl)
  .controller('LogsCtrl', logsCtrl)
  .controller('LoginCtrl', loginCtrl)
  .controller('LogoutCtrl', logoutCtrl)
  .controller('NavLoginCtrl', navLoginLinkCtrl)
  .factory('authInterceptor', authInterceptor);


app.run(function($rootScope, $state){
  $rootScope.$on('$stateChangeError',
    function(event, toState, toParams, fromState, fromParams, error) {
      if (error.status === 401) {
        $state.go('login');
      }
    });
})


function loginFactory($window) {
  var isLoggedIn;
  if($window.localStorage.token){
    isLoggedIn = true;
  }
  return {
    isLoggedIn: isLoggedIn
  };
}

function tokenCtrl($scope, $window, $sce) {
  var token = $window.localStorage.token;
  token = decodeToken(token);
  $scope.token = $sce.trustAsHtml(prettyPrintJson(token));
}

function homeCtrl($scope){
  //
}

function logsCtrl($scope, logs) {
  $scope.logs = logs;
}

function navLoginLinkCtrl($scope, Login) {
  $scope.state = Login;
}

function loginCtrl($scope, $window, $state, Restangular, Login) {

  var user = Restangular.all('api/authenticate');

  $scope.login = function(credentials) {

    user.post(credentials)
      .then(function(response) {
        $window.localStorage.token = response.token;
        Login.isLoggedIn = true;
        $state.go('home');
      }, function(err) {
        $scope.error = {
          show: true,
          message: err.data
        }
      });

  }

}

function logoutCtrl($window, Login){

  $window.localStorage.removeItem('token');
  Login.isLoggedIn = false;

}

function authInterceptor($window) {

  return {
    request: function(config) {

      if ($window.localStorage.token) {

        config.headers.Authorization = 'Bearer ' + $window.localStorage.token;

      }

      return config;

    }
  }

}
