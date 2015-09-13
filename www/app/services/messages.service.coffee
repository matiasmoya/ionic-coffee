(->
  messageService = ($http, apiUrl) ->
    new class Places
      constructor: ->
        @timestamp = Date.now() - 900000

      getMessages: ->
        $http.get('/js/messages.json')

  angular
    .module('myapp.services.messages', [])
    .factory 'messageService', ['$http', 'apiUrl', messageService]
)()
