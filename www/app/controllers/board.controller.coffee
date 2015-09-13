(->
  BoardController = ($scope, messageService) ->
    $scope.hideLoader  = false

    init = () =>
      vm = @
      vm.messages = ["Message from board controller","Another message from board controller"]
      activate()

    activate = () =>
      vm = @
      messageService
        .getMessages()
        .then (response) =>
          vm.messages = vm.messages.concat(response.data.messages)

    init()
    return

  BoardController
    .$inject = ['$scope','messageService']


  angular
    .module 'myapp.controllers.board', []
    .controller 'BoardCtrl', BoardController
)()