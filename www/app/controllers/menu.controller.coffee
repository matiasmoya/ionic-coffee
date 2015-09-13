(->
  MenuController = ($scope, $rootScope) ->

  MenuController
    .$inject = ['$scope', '$rootScope']

  angular
    .module 'myapp.controllers.menu', []
    .controller 'MenuCtrl', MenuController
)()
