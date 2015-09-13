Ionic w/CoffeeScript Starter App
================================

## Installing

```bash
npm install -g cordova ionic gulp
npm install
ionic platform add android ios
```

Run the development server:
```bash
ionic serve
```
Generate builds with:
```bash
ionic build ios
ionic build android
```

If you want to emulate the app with ios/android
```bash
ionic emulate ios
ionic emulate android
```

#Missing translation

Por defecto se cargan las variables de entorno de development (como constantes) al correr ionic serve.
Antes de hacer un deploy a production se debe correr `gulp replace production` para cambiar por los valores del ENV de produccion.
los archivos con estas variables se encuentran en `./config/{{ENV}}.json`

TO-DO: mejorar la implementacion. Una idea es agregar un Procfile o algun hook de git para realizar esto automaticamente en los deploy.
Mas info: [http://geekindulgence.com/environment-variables-in-angularjs-and-ionic/]

## Notas

### Controllers

Las vistas en ionic son cacheadas, controllers son llamados unicamente cuando
son recreados o cuando la aplicacion inicia, en lugar de ser llamados en cada cambio
de pagina.
Para escuchar eventos para cuando la pagina esta activa (por ejemplo, al actualizar datos),
escuchamos al evento `$ionicView.enter`:

```js
$scope.$on('$ionicView.enter', function(e) {...});
```

### Code Style
Usamos coffeescript para el desarrollo. Dentro de la carpeta `www/coffee/` se encuentran los archivos.
Estos son compilados a js cuando ejecutamos `ionic serve` o `build`.
Creamos carpetas para separar controllers, services, directives, etc..


### Promises
Para resolver promises (resultados de llamas asinconras) se puede optar por alguna de estas dos practicas
sugeridas por la comunidad angular:

**Cuando el resultado del promise no es escencial para la vista o logica del controller**

```coffee
(->
  Avengers = (dataservice)->

    init = ()=>
      @avengers = []
      @title = 'Avengers'

      activate()

    ##############

    activate = ()=>
      dataservice
        .getAvengers()
        .then (data)=>
          @avengers = data

    init()
    return

  angular
    .module('app')
    .controller('Avengers', Avengers)
)()
```
(Este es el patron recomendado, dejar las promises en una funcion separada y llamarla al final de la funcion init, la cual inicializa el controller.)

**Cuando el resultado del promise es necesario para la logica del controller o la visualizacion correcta de la vista**
```coffee
# angular routes
angular
  .module('app')
  .config($stateProvider, $urlRouterProvider) ->

    $stateProvider
      .state 'tab.chats',
        url: '/chats'
        views: 'tab-chats':
          templateUrl: 'templates/tab-chats.html'
          controller: 'ChatsCtrl as chat'
        resolve:
          chatPreService: (ChatService) ->
            ChatService.getMessages()
```

la opcion resolve ejecutara la promise antes de ejecutar el codigo del controller, de esta forma vamos a disponer del resultado del promise
dentro de nuestro controller usando `sessionPreService`:

```coffee
# chats controller
(->
  ChatsController = ($scope, chatPreService) ->
    init = () =>
      vm = @
      vm.messages = chatPreService.data

    init()
    return

  angular
    .module 'thny.controllers.chats', []
    .controller 'ChatsCtrl', ChatsController
)()
```
[http://geekindulgence.com/environment-variables-in-angularjs-and-ionic/]: http://geekindulgence.com/environment-variables-in-angularjs-and-ionic/
