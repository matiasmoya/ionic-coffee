(->
  DashboardController = ($sce) ->
    vm = @
    vm.message = $sce.trustAsHtml("This message is loaded from the controller.")
    return

  DashboardController
    .$inject = ["$sce"]

  angular
    .module 'myapp.controllers.dashboard', []
    .controller 'DashCtrl', DashboardController
)()
