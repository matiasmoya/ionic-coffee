angular
  .module('myapp', [
    'ionic'
    'myapp.api.constants'
    'myapp.routes'

    'myapp.controllers.app'
    'myapp.controllers.menu'
    'myapp.controllers.dashboard'
    'myapp.controllers.board'

    'myapp.services.messages'
  ])
  .run ($ionicPlatform, $rootScope, $ionicLoading) ->

    $rootScope.$on '$stateChangeStart', ->
      $ionicLoading.show {templateUrl: 'templates/directives/loading.html'}

    $rootScope.$on '$stateChangeSuccess', ->
      $ionicLoading.hide()

    $rootScope.viewDistance    = false
    $rootScope.currentLocation = []


    $ionicPlatform.ready ->
      if window.cordova and window.cordova.plugins and window.cordova.plugins.Keyboard
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar true
        cordova.plugins.Keyboard.disableScroll true
      if window.StatusBar
        StatusBar.styleLightContent()
      return
    return
