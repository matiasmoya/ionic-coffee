angular
  .module 'myapp.routes', []
  .config ($stateProvider, $urlRouterProvider) ->
    $stateProvider
      .state 'app',
        url: '/app'
        abstract: true
        templateUrl: 'templates/menu/sidemenu.html'
        controller: 'AppCtrl'

      .state 'tab',
        url: '/tab'
        abstract: true
        templateUrl: 'templates/tabs.html'

      .state 'app.dash',
        url: '/dash'
        views: 'menuContent':
          templateUrl: 'templates/tab-dash.html'
          controller: 'DashCtrl as dashboard'

      .state 'app.board',
        url: '/board'
        views: 'menuContent':
          templateUrl: 'templates/board/index.html'
          controller: 'BoardCtrl as board'

    $urlRouterProvider.otherwise '/app/dash'
    return
