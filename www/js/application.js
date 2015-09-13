angular.module('myapp', ['ionic', 'myapp.api.constants', 'myapp.routes', 'myapp.controllers.app', 'myapp.controllers.menu', 'myapp.controllers.dashboard', 'myapp.controllers.board', 'myapp.services.messages']).run(["$ionicPlatform", "$rootScope", "$ionicLoading", function($ionicPlatform, $rootScope, $ionicLoading) {
  $rootScope.$on('$stateChangeStart', function() {
    return $ionicLoading.show({
      templateUrl: 'templates/directives/loading.html'
    });
  });
  $rootScope.$on('$stateChangeSuccess', function() {
    return $ionicLoading.hide();
  });
  $rootScope.viewDistance = false;
  $rootScope.currentLocation = [];
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });
}]);

angular.module('myapp.routes', []).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu/sidemenu.html',
    controller: 'AppCtrl'
  }).state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  }).state('app.dash', {
    url: '/dash',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl as dashboard'
      }
    }
  }).state('app.board', {
    url: '/board',
    views: {
      'menuContent': {
        templateUrl: 'templates/board/index.html',
        controller: 'BoardCtrl as board'
      }
    }
  });
  $urlRouterProvider.otherwise('/app/dash');
}]);

(function() {
  return angular.module('myapp.controllers.app', []).controller('AppCtrl', ["$scope", function($scope) {}]);
})();

(function() {
  var BoardController;
  BoardController = function($scope, messageService) {
    var activate, init;
    $scope.hideLoader = false;
    init = (function(_this) {
      return function() {
        var vm;
        vm = _this;
        vm.messages = ["Message from board controller", "Another message from board controller"];
        return activate();
      };
    })(this);
    activate = (function(_this) {
      return function() {
        var vm;
        vm = _this;
        return messageService.getMessages().then(function(response) {
          return vm.messages = vm.messages.concat(response.data.messages);
        });
      };
    })(this);
    init();
  };
  BoardController.$inject = ['$scope', 'messageService'];
  return angular.module('myapp.controllers.board', []).controller('BoardCtrl', BoardController);
})();

(function() {
  var DashboardController;
  DashboardController = function($sce) {
    var vm;
    vm = this;
    vm.message = $sce.trustAsHtml("This message is loaded from the controller.");
  };
  DashboardController.$inject = ["$sce"];
  return angular.module('myapp.controllers.dashboard', []).controller('DashCtrl', DashboardController);
})();

(function() {
  var MenuController;
  MenuController = function($scope, $rootScope) {};
  MenuController.$inject = ['$scope', '$rootScope'];
  return angular.module('myapp.controllers.menu', []).controller('MenuCtrl', MenuController);
})();

(function() {
  var messageService;
  messageService = function($http, apiUrl) {
    var Places;
    return new (Places = (function() {
      function Places() {
        this.timestamp = Date.now() - 900000;
      }

      Places.prototype.getMessages = function() {
        return $http.get('/js/messages.json');
      };

      return Places;

    })());
  };
  return angular.module('myapp.services.messages', []).factory('messageService', ['$http', 'apiUrl', messageService]);
})();

var _, log;

log = require('util').log;

_ = require('lodash');

module.exports = function(grunt) {
  var allExamples, allExamplesOpen, allExamplesTaskToRun, dev, exampleOpenTasks, listWithQuotes, options, showOpenType;
  require('./grunt/bower')(grunt);
  ["grunt-contrib-uglify", "grunt-contrib-jshint", "grunt-contrib-concat", "grunt-contrib-clean", "grunt-contrib-connect", "grunt-contrib-copy", "grunt-contrib-watch", "grunt-open", "grunt-mkdir", "grunt-contrib-coffee", "grunt-contrib-jasmine", "grunt-conventional-changelog", "grunt-bump", 'grunt-replace', 'grunt-subgrunt', 'grunt-debug-task', 'grunt-curl', 'grunt-verbosity', 'grunt-webpack', 'grunt-angular-architecture-graph'].forEach(function(gruntLib) {
    return grunt.loadNpmTasks(gruntLib);
  });
  options = require('./grunt/options')(grunt);
  allExamples = grunt.file.expand('example/*.html');
  allExamplesOpen = {};
  allExamples.forEach(function(path) {
    var pathValue, root;
    root = path.replace('example/', '').replace('.html', '');
    pathValue = "http://localhost:3100/" + path;
    return allExamplesOpen[root] = {
      path: pathValue
    };
  });
  showOpenType = function(toIterate) {
    if (toIterate == null) {
      toIterate = allExamplesOpen;
    }
    return _(toIterate).each(function(v, k) {
      return log(k + " -> " + v.path);
    });
  };
  options.open = _.extend(options.open, allExamplesOpen);
  grunt.initConfig(options);
  grunt.registerTask("default", ['bower', 'curl', 'verbosity', 'clean:dist', 'jshint', 'mkdir', 'coffee', 'concat:libs', 'replace', 'webpack', 'concat:dist', 'concat:streetview', 'copy', 'uglify:dist', 'uglify:streetview', 'jasmine:consoleSpec']);
  grunt.registerTask("spec", ['bower', 'curl', 'verbosity', "clean:dist", "jshint", "mkdir", "coffee", "concat:libs", "replace", "webpack", "concat", "copy", "connect:jasmineServer", "jasmine:spec", "open:jasmine", "watch:spec"]);
  grunt.registerTask("coverage", ['bower', 'curl', "clean:dist", "jshint", "mkdir", "coffee", "concat:libs", "replace", "concat:dist", "copy", "uglify:dist", "jasmine:coverage"]);
  grunt.registerTask('default-no-specs', ["clean:dist", "jshint", "mkdir", "coffee", "concat:libs", "replace", "concat:dist", "copy", "uglify:dist"]);
  grunt.registerTask('offline', ['default-no-specs', 'watch:offline']);
  dev = ["clean:dist", "jshint", "mkdir", "coffee", "concat:libs", "replace", "webpack", "concat", "copy"];
  grunt.registerTask("dev", dev.concat(["uglify:distMapped", "uglify:streetviewMapped", "jasmine:spec"]));
  grunt.registerTask("fast", dev.concat(["jasmine:spec"]));
  grunt.registerTask("mappAll", ['bower', 'curl', "clean:dist", "jshint", "mkdir", "coffee", "concat:libs", "replace", "webpack", "concat", "uglify", "copy", "jasmine:spec", "graph"]);
  grunt.registerTask("build-street-view", ['clean:streetview', 'mkdir', 'coffee', 'concat:libs', 'replace', 'concat:streetview', 'concat:streetviewMapped', 'uglify:streetview', 'uglify:streetviewMapped']);
  grunt.registerTask("buildAll", "mappAll");
  grunt.registerTask('graph', ['angular_architecture_graph']);
  grunt.registerTask('bump-@-preminor', ['changelog', 'bump-only:preminor', 'mappAll', 'bump-commit']);
  grunt.registerTask('bump-@-prerelease', ['changelog', 'bump-only:prerelease', 'mappAll', 'bump-commit']);
  grunt.registerTask('bump-@', ['changelog', 'bump-only', 'mappAll', 'bump-commit']);
  grunt.registerTask('bump-@-minor', ['changelog', 'bump-only:minor', 'mappAll', 'bump-commit']);
  grunt.registerTask('bump-@-major', ['changelog', 'bump-only:major', 'mappAll', 'bump-commit']);
  exampleOpenTasks = [];
  _.each(allExamplesOpen, function(v, key) {
    var basicTask;
    basicTask = "open:" + key;
    grunt.registerTask(key, ["fast", "clean:example", "connect:server", basicTask, "watch:all"]);
    return exampleOpenTasks.push(basicTask);
  });
  allExamplesTaskToRun = ["fast", "clean:example", "connect:server"].concat(exampleOpenTasks).concat(['watch:all']);
  listWithQuotes = function(collection, doLog) {
    var all, last;
    if (doLog == null) {
      doLog = true;
    }
    last = collection.length - 1;
    all = '';
    collection.forEach(function(t, i) {
      return all += i < last ? "'" + t + "'," : "'" + t + "'";
    });
    if (doLog) {
      return log(all);
    }
    return all;
  };
  grunt.registerTask('listExamples', showOpenType);
  grunt.registerTask('listAllOpen', function() {
    return showOpenType(options.open);
  });
  grunt.registerTask('listAllExamplesTasks', function() {
    return listWithQuotes(exampleOpenTasks);
  });
  grunt.registerTask('allExamples', allExamplesTaskToRun);
  grunt.registerTask('server', ["connect:server", "watch:all"]);
  return grunt.registerTask('s', 'server');
};

beforeEach(function() {
  this.googleTemp = window.google;
  angular.module('uiGmapgoogle-maps').config(["$provide", function($provide) {
    return $provide.decorator('$timeout', ["$delegate", "$browser", function($delegate, $browser) {
      $delegate.hasPendingTasks = function() {
        return $browser.deferredFns.length > 0;
      };
      return $delegate;
    }]);
  }]);
  angular.module('uiGmapgoogle-maps.specs', ['uiGmapgoogle-maps']);
  module("uiGmapgoogle-maps.specs");
  this.injectAll = (function(_this) {
    return function() {
      return _this.injects.forEach(function(toInject) {
        return inject(toInject);
      });
    };
  })(this);
  this.injects = [];
  this.injects.push((function(_this) {
    return function(_$rootScope_, $timeout, $q, $browser, $compile, uiGmapPropMap) {
      window.PropMap = uiGmapPropMap;
      _this.q = $q;
      _this.browser = $browser;
      _this.rootScope = _$rootScope_;
      _this.scope = angular.extend(_this.rootScope.$new(), _this.scope || {});
      _this.scope.map = angular.extend(_this.scope.map || {}, {
        zoom: 12,
        center: {
          longitude: 47,
          latitude: -27
        }
      });
      _this.timeout = $timeout;
      return _this.compile = $compile;
    };
  })(this));
  return this.digest = (function(_this) {
    return function(fn, doCompile) {
      if (doCompile == null) {
        doCompile = true;
      }
      if (_this.html && _this.scope && doCompile) {
        _this.compile(_this.html)(_this.scope);
      }
      if ((fn != null) && _.isFunction(fn)) {
        fn();
      }
      while (_this.timeout.hasPendingTasks()) {
        _this.timeout.flush();
      }
      return _this.rootScope.$digest();
    };
  })(this);
});

afterEach(function() {
  if (this.googleTemp != null) {
    return window.google = this.googleTemp;
  }
});

var capitalize,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

capitalize = function(s) {
  return s[0].toUpperCase() + s.slice(1);
};

angular.module('uiGmapgoogle-maps.mocks', ['uiGmapgoogle-maps']).factory('GoogleApiMock', function() {
  var DraggableObject, GoogleApiMock, MapObject, MockInfoWindow, PositionObject, VisibleObject, getCircle, getLatLng, getMVCArray, getMap, getMarker, getPolyline;
  MapObject = (function() {
    function MapObject() {
      this.setOptions = bind(this.setOptions, this);
      this.setMap = bind(this.setMap, this);
      this.getMap = bind(this.getMap, this);
    }

    MapObject.prototype.getMap = function() {
      return this.map;
    };

    MapObject.prototype.setMap = function(m) {
      return this.map = m;
    };

    MapObject.prototype.setOptions = function(o) {
      return this.opts = o;
    };

    return MapObject;

  })();
  DraggableObject = (function(superClass) {
    extend(DraggableObject, superClass);

    function DraggableObject() {
      this.getDraggable = bind(this.getDraggable, this);
      this.setDraggable = bind(this.setDraggable, this);
      return DraggableObject.__super__.constructor.apply(this, arguments);
    }

    DraggableObject.prototype.setDraggable = function(bool) {
      return this.draggable = bool;
    };

    DraggableObject.prototype.getDraggable = function() {
      return this.draggable;
    };

    return DraggableObject;

  })(MapObject);
  VisibleObject = (function(superClass) {
    extend(VisibleObject, superClass);

    function VisibleObject() {
      this.getVisible = bind(this.getVisible, this);
      this.setVisible = bind(this.setVisible, this);
      return VisibleObject.__super__.constructor.apply(this, arguments);
    }

    VisibleObject.prototype.setVisible = function(bool) {
      return this.visible = bool;
    };

    VisibleObject.prototype.getVisible = function() {
      return this.visible;
    };

    return VisibleObject;

  })(MapObject);
  PositionObject = (function(superClass) {
    extend(PositionObject, superClass);

    function PositionObject() {
      this.getPosition = bind(this.getPosition, this);
      this.setPosition = bind(this.setPosition, this);
      return PositionObject.__super__.constructor.apply(this, arguments);
    }

    PositionObject.prototype.setPosition = function(position) {
      return this.position;
    };

    PositionObject.prototype.getPosition = function() {
      return this.position;
    };

    return PositionObject;

  })(MapObject);
  MockInfoWindow = (function() {
    function MockInfoWindow() {
      this.getContent = bind(this.getContent, this);
      this.setContent = bind(this.setContent, this);
      this.close = bind(this.close, this);
      this.open = bind(this.open, this);
      this._isOpen = false;
    }

    MockInfoWindow.prototype.open = function(map, anchor) {
      this._isOpen = true;
    };

    MockInfoWindow.prototype.close = function() {
      this._isOpen = false;
    };

    MockInfoWindow.prototype.isOpen = function(val) {
      if (val == null) {
        val = void 0;
      }
      if (val == null) {
        return this._isOpen;
      } else {
        return this._isOpen = val;
      }
    };

    MockInfoWindow.prototype.setContent = function(content) {
      return this.content = content;
    };

    MockInfoWindow.prototype.getContent = function() {
      return this.content;
    };

    return MockInfoWindow;

  })();
  getLatLng = function() {
    var LatLng;
    return LatLng = (function() {
      function LatLng(y1, x1, nowrap) {
        this.y = y1;
        this.x = x1;
        this.lng = bind(this.lng, this);
        this.lat = bind(this.lat, this);
      }

      LatLng.prototype.lat = function() {
        return this.y;
      };

      LatLng.prototype.lng = function() {
        return this.x;
      };

      return LatLng;

    })();
  };
  getMarker = function() {
    var Marker;
    return Marker = (function(superClass) {
      extend(Marker, superClass);

      _.extend(Marker.prototype, PositionObject.prototype, DraggableObject.prototype, VisibleObject.prototype);

      Marker.instances = 0;

      Marker.resetInstances = function() {
        return Marker.instances = 0;
      };

      Marker.creationSubscribe = function(obj, cb) {
        return window.google.maps.event.addListener(obj, 'creation', cb);
      };

      Marker.creationUnSubscribe = function(listener) {
        return window.google.maps.event.removeListener(listener);
      };

      function Marker(opts) {
        this.getOpacity = bind(this.getOpacity, this);
        this.setOpacity = bind(this.setOpacity, this);
        this.getTitle = bind(this.getTitle, this);
        this.setTitle = bind(this.setTitle, this);
        this.getZIndex = bind(this.getZIndex, this);
        this.setZIndex = bind(this.setZIndex, this);
        this.getClickable = bind(this.getClickable, this);
        this.setClickable = bind(this.setClickable, this);
        this.getIcon = bind(this.getIcon, this);
        this.setIcon = bind(this.setIcon, this);
        this.getAnimation = bind(this.getAnimation, this);
        this.setAnimation = bind(this.setAnimation, this);
        this.setOptions = bind(this.setOptions, this);
        var ref, ref1;
        Marker.__super__.constructor.call(this);
        if (opts != null) {
          ['draggable', 'editable', 'map', 'visible', 'position'].forEach((function(_this) {
            return function(o) {
              return _this[o] = opts[o];
            };
          })(this));
        }
        Marker.instances += 1;
        if ((typeof window !== "undefined" && window !== null ? (ref = window.google) != null ? (ref1 = ref.maps) != null ? ref1.event : void 0 : void 0 : void 0) != null) {
          window.google.maps.event.fireAllListeners('creation', this);
        }
      }

      Marker.prototype.setOptions = function(o) {
        Marker.__super__.setOptions.call(this, o);
        if ((o != null ? o.position : void 0) != null) {
          return this.position = o.position;
        }
      };

      Marker.prototype.setAnimation = function(obj) {
        return this.animation = obj;
      };

      Marker.prototype.getAnimation = function() {
        return this.animation;
      };

      Marker.prototype.setIcon = function(icon) {
        return this.icon;
      };

      Marker.prototype.getIcon = function() {
        return this.icon;
      };

      Marker.prototype.setClickable = function(bool) {
        return this.clickable = bool;
      };

      Marker.prototype.getClickable = function() {
        return this.clickable;
      };

      Marker.prototype.setZIndex = function(z) {
        return this.zIndex = z;
      };

      Marker.prototype.getZIndex = function() {
        return this.zIndex;
      };

      Marker.prototype.setTitle = function(str) {
        return this.title = str;
      };

      Marker.prototype.getTitle = function() {
        return this.title;
      };

      Marker.prototype.setOpacity = function(num) {
        return this.opacity = num;
      };

      Marker.prototype.getOpacity = function() {
        return this.opacity;
      };

      return Marker;

    })(MapObject);
  };
  getCircle = function() {
    var Circle;
    return Circle = (function(superClass) {
      extend(Circle, superClass);

      _.extend(Circle.prototype, DraggableObject.prototype, VisibleObject.prototype);

      Circle.instances = 0;

      Circle.resetInstances = function() {
        return Circle.instances = 0;
      };

      Circle.creationSubscribe = function(obj, cb) {
        return window.google.maps.event.addListener(obj, 'creation', cb);
      };

      Circle.creationUnSubscribe = function(listener) {
        return window.google.maps.event.removeListener(listener);
      };

      function Circle(opts) {
        this.setOptions = bind(this.setOptions, this);
        var ref, ref1;
        Circle.__super__.constructor.call(this);
        this.props = ['draggable', 'editable', 'map', 'visible', 'radius', 'center'];
        this.setOptions(opts);
        this.props.forEach((function(_this) {
          return function(p) {
            return _this["get" + (capitalize(p))] = function() {
              return _this[p];
            };
          };
        })(this));
        this.props.forEach((function(_this) {
          return function(p) {
            return _this["set" + (capitalize(p))] = function(val) {
              _this[p] = val;
              if (p === "radius" || p === "center") {
                return window.google.maps.event.fireAllListeners(p + "_changed", _this);
              }
            };
          };
        })(this));
        Circle.instances += 1;
        this.instance = Circle.instances;
        if ((typeof window !== "undefined" && window !== null ? (ref = window.google) != null ? (ref1 = ref.maps) != null ? ref1.event : void 0 : void 0 : void 0) != null) {
          window.google.maps.event.fireAllListeners('creation', this);
        }
      }

      Circle.prototype.setOptions = function(o) {
        Circle.__super__.setOptions.call(this, o);
        return _.extend(this, o);
      };

      return Circle;

    })(MapObject);
  };
  getMap = function() {
    var Map;
    Map = function(opts) {};
    Map.prototype.center = {
      lat: function() {
        return 0;
      },
      lng: function() {
        return 0;
      }
    };
    Map.prototype.controls = {
      TOP_CENTER: [],
      TOP_LEFT: [],
      TOP_RIGHT: [],
      LEFT_TOP: [],
      RIGHT_TOP: [],
      LEFT_CENTER: [],
      RIGHT_CENTER: [],
      LEFT_BOTTOM: [],
      RIGHT_BOTTOM: [],
      BOTTOM_CENTER: [],
      BOTTOM_LEFT: [],
      BOTTOM_RIGHT: []
    };
    Map.prototype.overlayMapTypes = new window.google.maps.MVCArray();
    Map.prototype.getControls = function() {
      return this.controls;
    };
    Map.prototype.setOpts = function() {};
    Map.prototype.setOptions = function() {};
    Map.prototype.setZoom = function() {};
    Map.prototype.setCenter = function() {};
    Map.prototype.getCoords = function() {
      if (Map.getCoords == null) {
        return {
          latitude: 47,
          longitude: -27
        };
      }
    };
    Map.prototype.getBounds = function() {
      if (Map.getBounds == null) {
        return {
          getNorthEast: function() {
            return google.maps.LatLng(47, 27);
          },
          getSouthWest: function() {
            return google.maps.LatLng(89, 100);
          }
        };
      }
    };
    return Map;
  };
  ({
    getMarkerWithLabel: function() {
      var MarkerWithLabel;
      return MarkerWithLabel = (function(superClass) {
        extend(MarkerWithLabel, superClass);

        MarkerWithLabel.instances = 0;

        MarkerWithLabel.resetInstances = function() {
          return MarkerWithLabel.instances = 0;
        };

        function MarkerWithLabel(opts) {
          this.onAdd = bind(this.onAdd, this);
          this.onRemove = bind(this.onRemove, this);
          this.draw = bind(this.draw, this);
          this.getContent = bind(this.getContent, this);
          this.setContent = bind(this.setContent, this);
          this.getStyles = bind(this.getStyles, this);
          this.setStyles = bind(this.setStyles, this);
          this.getMandatoryStyles = bind(this.getMandatoryStyles, this);
          this.setMandatoryStyles = bind(this.setMandatoryStyles, this);
          this.getAnchor = bind(this.getAnchor, this);
          this.setAnchor = bind(this.setAnchor, this);
          if (opts != null) {
            ['draggable', 'editable', 'map', 'path', 'visible'].forEach((function(_this) {
              return function(o) {
                return _this[o] = opts[o];
              };
            })(this));
          }
          this.drawn = false;
          MarkerWithLabel.instances += 1;
        }

        MarkerWithLabel.prototype.setAnchor = function(anchor) {
          return this.anchor = this.anchor;
        };

        MarkerWithLabel.prototype.getAnchor = function() {
          return this.anchor;
        };

        MarkerWithLabel.prototype.setMandatoryStyles = function(obj) {
          return this.mandatoryStyles = obj;
        };

        MarkerWithLabel.prototype.getMandatoryStyles = function() {
          return this.mandatoryStyles;
        };

        MarkerWithLabel.prototype.setStyles = function(obj) {
          return this.styles = obj;
        };

        MarkerWithLabel.prototype.getStyles = function() {
          return this.styles;
        };

        MarkerWithLabel.prototype.setContent = function(content) {
          return this.content = content;
        };

        MarkerWithLabel.prototype.getContent = function() {
          return this.content;
        };

        MarkerWithLabel.prototype.draw = function() {
          return this.drawn = true;
        };

        MarkerWithLabel.prototype.onRemove = function() {};

        MarkerWithLabel.prototype.onAdd = function() {};

        return MarkerWithLabel;

      })(getMarker());
    }
  });
  getPolyline = function() {
    var Polyline;
    return Polyline = (function(superClass) {
      extend(Polyline, superClass);

      Polyline.instances = 0;

      Polyline.resetInstances = function() {
        return Polyline.instances = 0;
      };

      function Polyline(opts) {
        this.setPath = bind(this.setPath, this);
        this.setEditable = bind(this.setEditable, this);
        this.getPath = bind(this.getPath, this);
        this.getEditable = bind(this.getEditable, this);
        if (opts != null) {
          ['draggable', 'editable', 'map', 'path', 'visible'].forEach((function(_this) {
            return function(o) {
              return _this[o] = opts[o];
            };
          })(this));
        }
        Polyline.instances += 1;
      }

      Polyline.prototype.getEditable = function() {
        return this.editable;
      };

      Polyline.prototype.getPath = function() {
        return this.path;
      };

      Polyline.prototype.setEditable = function(bool) {
        return this.editable = bool;
      };

      Polyline.prototype.setPath = function(array) {
        return this.path = array;
      };

      return Polyline;

    })(DraggableObject);
  };
  getMVCArray = function() {
    var MVCArray;
    return MVCArray = (function(superClass) {
      extend(MVCArray, superClass);

      MVCArray.instances = 0;

      MVCArray.resetInstances = function() {
        return MVCArray.instances = 0;
      };

      function MVCArray() {
        this.insertAt = bind(this.insertAt, this);
        this.getLength = bind(this.getLength, this);
        this.getAt = bind(this.getAt, this);
        this.getArray = bind(this.getArray, this);
        MVCArray.instances += 1;
        MVCArray.__super__.constructor.call(this);
      }

      MVCArray.prototype.clear = function() {
        return this.length = 0;
      };

      MVCArray.prototype.getArray = function() {
        return this;
      };

      MVCArray.prototype.getAt = function(i) {
        return this[i];
      };

      MVCArray.prototype.getLength = function() {
        return this.length;
      };

      MVCArray.prototype.insertAt = function(i, elem) {
        return this.splice(i, 0, elem);
      };

      MVCArray.prototype.removeAt = function(i) {
        return this.splice(i, 1);
      };

      MVCArray.prototype.setAt = function(i, elem) {
        return this[i] = elem;
      };

      return MVCArray;

    })(Array);
  };
  GoogleApiMock = (function() {
    function GoogleApiMock() {
      this.mockMap = bind(this.mockMap, this);
      this.mocks = [this.mockAPI, this.mockLatLng, this.mockLatLngBounds, this.mockControlPosition, this.mockAnimation, this.mockMapTypeId, this.mockOverlayView, this.mockOverlayView, this.mockEvent, this.mockInfoWindow, this.mockMarker, this.mockCircle, this.mockMVCArray, this.mockPoint, this.mockPolygon, this.mockPolyline, this.mockMap, this.mockPlaces, this.mockSearchBox];
      this.initAll = function() {
        return this.mocks.forEach(function(fn) {
          return typeof fn === "function" ? fn() : void 0;
        });
      };
    }

    GoogleApiMock.prototype.mockAPI = function() {
      var unmocked;
      window.google = {};
      window.google.maps = {};
      unmocked = (function(_this) {
        return function(api) {
          return function() {
            throw new String('Unmocked API ' + api);
          };
        };
      })(this);
      window.google.maps.Marker = unmocked('Marker');
      window.google.maps.event = {
        clearListeners: unmocked('event.clearListeners'),
        addListener: unmocked('event.addListener'),
        removeListener: unmocked('event.removeListener')
      };
      window.google.maps.OverlayView = unmocked('OverlayView');
      window.google.maps.InfoWindow = unmocked('InfoWindow');
      window.google.maps.LatLng = unmocked('LatLng');
      window.google.maps.MVCArray = unmocked('MVCArray');
      window.google.maps.Point = unmocked('Point');
      window.google.maps.LatLngBounds = unmocked('LatLngBounds');
      return window.google.maps.Polyline = unmocked('Polyline');
    };

    GoogleApiMock.prototype.mockPlaces = function() {
      return window.google.maps.places = {};
    };

    GoogleApiMock.prototype.mockSearchBox = function(SearchBox) {
      if (SearchBox == null) {
        SearchBox = function() {};
      }
      return window.google.maps.places.SearchBox = SearchBox;
    };

    GoogleApiMock.prototype.mockLatLng = function(yours) {
      return window.google.maps.LatLng = !yours ? getLatLng() : yours;
    };

    GoogleApiMock.prototype.mockLatLngBounds = function(LatLngBounds) {
      if (LatLngBounds == null) {
        LatLngBounds = function() {};
      }
      if (!(LatLngBounds.extend != null)) {
        LatLngBounds.prototype.extend = function() {};
      }
      return window.google.maps.LatLngBounds = LatLngBounds;
    };

    GoogleApiMock.prototype.mockMap = function() {
      var Map;
      this.mockMapTypeId();
      this.mockLatLng();
      this.mockOverlayView();
      this.mockEvent();
      this.mockMVCArray();
      Map = getMap();
      return window.google.maps.Map = Map;
    };

    GoogleApiMock.prototype.mockControlPosition = function() {
      var ControlPosition;
      ControlPosition = {
        TOP_CENTER: 'TOP_CENTER',
        TOP_LEFT: 'TOP_LEFT',
        TOP_RIGHT: 'TOP_RIGHT',
        LEFT_TOP: 'LEFT_TOP',
        RIGHT_TOP: 'RIGHT_TOP',
        LEFT_CENTER: 'LEFT_CENTER',
        RIGHT_CENTER: 'RIGHT_CENTER',
        LEFT_BOTTOM: 'LEFT_BOTTOM',
        RIGHT_BOTTOM: 'RIGHT_BOTTOM',
        BOTTOM_CENTER: 'BOTTOM_CENTER',
        BOTTOM_LEFT: 'BOTTOM_LEFT',
        BOTTOM_RIGHT: 'BOTTOM_RIGHT'
      };
      return window.google.maps.ControlPosition = ControlPosition;
    };

    GoogleApiMock.prototype.mockAnimation = function(Animation) {
      if (Animation == null) {
        Animation = {
          BOUNCE: 'bounce'
        };
      }
      return window.google.maps.Animation = Animation;
    };

    GoogleApiMock.prototype.mockMapTypeId = function(MapTypeId) {
      if (MapTypeId == null) {
        MapTypeId = {
          ROADMAP: 'roadmap'
        };
      }
      return window.google.maps.MapTypeId = MapTypeId;
    };

    GoogleApiMock.prototype.mockOverlayView = function(OverlayView) {
      if (OverlayView == null) {
        OverlayView = OverlayView = (function() {
          function OverlayView() {}

          OverlayView.prototype.setMap = function() {};

          return OverlayView;

        })();
      }
      return window.google.maps.OverlayView = OverlayView;
    };

    GoogleApiMock.prototype.mockEvent = function(event) {
      var listeners;
      if (event == null) {
        event = {};
      }
      listeners = [];
      if (!event.addListener) {
        event.addListener = function(thing, eventName, callBack) {
          var found, toPush;
          found = _.find(listeners, function(obj) {
            return obj.obj === thing;
          });
          if (found == null) {
            toPush = {};
            toPush.obj = thing;
            toPush.events = {};
            toPush.events[eventName] = [callBack];
            return listeners.push(toPush);
          } else {
            if (!found.events[eventName]) {
              return found.events[eventName] = [callBack];
            } else {
              return found.events[eventName].push(callBack);
            }
          }
        };
        event.addListenerOnce = function(thing, eventName, callBack) {
          callBack();
          return event.addListener(thing, eventName, callBack);
        };
      }
      if (!event.clearListeners) {
        event.clearListeners = function() {
          return listeners.length = 0;
        };
      }
      if (!event.removeListener) {
        event.removeListener = function(item) {
          var index;
          index = listeners.indexOf(item);
          if (index !== -1) {
            return listeners.splice(index);
          }
        };
      }
      if (!event.fireListener) {
        event.fireListener = function(thing, eventName) {
          var found;
          found = _.find(listeners, function(obj) {
            return obj.obj === thing;
          });
          if ((found != null) && ((found != null ? found.events[eventName] : void 0) != null)) {
            return found.events[eventName].forEach(function(cb) {
              return cb(found.obj);
            });
          }
        };
      }
      if (!event.normalizedEvents) {
        event.normalizedEvents = function() {
          var ret;
          ret = _(listeners.map(function(obj) {
            return _.keys(obj.events);
          })).chain().flatten().uniq().value();
          return ret;
        };
      }
      if (!event.fireAllListeners) {
        event.fireAllListeners = function(eventName, state) {
          return listeners.forEach(function(obj) {
            if (obj.events[eventName] != null) {
              return obj.events[eventName].forEach(function(cb) {
                return cb(state);
              });
            }
          });
        };
      }
      window.google.maps.event = event;
      return listeners;
    };

    GoogleApiMock.prototype.mockInfoWindow = function(InfoWindow) {
      if (InfoWindow == null) {
        InfoWindow = MockInfoWindow;
      }
      return window.google.maps.InfoWindow = InfoWindow;
    };

    GoogleApiMock.prototype.mockMarker = function(Marker) {
      if (Marker == null) {
        Marker = getMarker();
      }
      return window.google.maps.Marker = Marker;
    };

    GoogleApiMock.prototype.mockMVCArray = function(impl) {
      if (impl == null) {
        impl = getMVCArray();
      }
      return window.google.maps.MVCArray = impl;
    };

    GoogleApiMock.prototype.mockCircle = function(Circle) {
      if (Circle == null) {
        Circle = getCircle();
      }
      return window.google.maps.Circle = Circle;
    };

    GoogleApiMock.prototype.mockPoint = function(Point) {
      if (Point == null) {
        Point = function(x, y) {
          return {
            x: x,
            y: y
          };
        };
      }
      return window.google.maps.Point = Point;
    };

    GoogleApiMock.prototype.mockPolyline = function(impl) {
      if (impl == null) {
        impl = getPolyline();
      }
      return window.google.maps.Polyline = impl;
    };

    GoogleApiMock.prototype.mockPolygon = function(polygon) {
      if (polygon != null) {
        return window.google.maps.Polygon = polygon;
      }
      return window.google.maps.Polygon = function(options) {
        this.getDraggable = function() {
          return options.draggable;
        };
        this.getEditable = function() {
          return options.editable;
        };
        this.getMap = function() {
          return options.map;
        };
        this.getPath = function() {
          return _.first(options.paths);
        };
        this.getPaths = function() {
          return options.paths;
        };
        this.getVisible = function() {
          return options.visible;
        };
        this.setOptions = function(opts) {
          return options = opts;
        };
        this.setDraggable = function(boolean) {
          return options.draggable = boolean;
        };
        this.setEditable = function(boolean) {
          return options.editable = boolean;
        };
        this.setMap = function(map) {
          return options.map = map;
        };
        this.setPath = function(path) {
          if ((options.paths != null) && options.paths.length > 0) {
            return options.paths[0] = path;
          } else {
            options.paths = [];
            return options.paths.push(path);
          }
        };
        this.setPaths = function(paths) {
          return options.paths = paths;
        };
        this.setVisible = function(boolean) {
          return options.visible = boolean;
        };
        return this;
      };
    };

    GoogleApiMock.prototype.getMarker = getMarker;

    GoogleApiMock.prototype.getMap = getMap;

    GoogleApiMock.prototype.getPolyline = getPolyline;

    GoogleApiMock.prototype.getMVCArray = getMVCArray;

    GoogleApiMock.prototype.getLatLng = getLatLng;

    return GoogleApiMock;

  })();
  return GoogleApiMock;
});

(function() {
  var module;
  return module = angular.module("angular-google-maps-specs", ['uiGmapgoogle-maps']).controller('GoogleMapSpecController', ["$scope", "$timeout", "$log", function($scope, $timeout, $log) {
    var self;
    self = this;
    this.hasRun = false;
    this.map = {};
    google.maps.visualRefresh = true;
    return angular.extend($scope, {
      showTraffic: true,
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 3,
      events: {
        tilesloaded: function(map, eventName, originalEventArgs) {
          if (!self.hasRun) {
            self.map = map;
            document.gMap = map;
            return self.hasRun = true;
          }
        }
      }
    });
  }]);
})();

describe('Events Mock', function() {
  var subject;
  subject = null;
  afterEach(function() {
    return google.maps.event.clearListeners();
  });
  beforeEach(function() {
    window['uiGmapInitiator'].initMock(this, function(apiMock) {
      subject = apiMock.getPolyline();
      return subject.resetInstances();
    });
    return this.injectAll();
  });
  it('exists', function() {
    return expect(window.google.maps.event).toBeDefined();
  });
  return describe('flatten', function() {
    it('can add a few events and they all are flattened', function() {
      var actualEvents, expectedEvents, obj;
      obj = {};
      expectedEvents = ['click', 'mouseover', 'mousedown'];
      expectedEvents.forEach(function(e) {
        return google.maps.event.addListener(obj, e, function() {});
      });
      actualEvents = window.google.maps.event.normalizedEvents();
      return expectedEvents.forEach(function(e) {
        return expect(actualEvents).toContain(e);
      });
    });
    return it('two individul object listeners', function() {
      var actualEvents, expectedEvents, expectedEvents2, obj, obj2;
      obj = {};
      obj2 = {};
      expectedEvents = ['click', 'mouseover', 'mousedown'];
      expectedEvents2 = ['lol', 'crap', 'ROFL'];
      expectedEvents.forEach(function(e) {
        return google.maps.event.addListener(obj, e, function() {});
      });
      expectedEvents2.forEach(function(e) {
        return google.maps.event.addListener(obj2, e, function() {});
      });
      actualEvents = window.google.maps.event.normalizedEvents();
      return expectedEvents.concat(expectedEvents2).forEach(function(e) {
        return expect(actualEvents).toContain(e);
      });
    });
  });
});

describe('Polyline Mock', function() {
  var subject;
  subject = null;
  beforeEach(function() {
    module("uiGmapgoogle-maps.mocks");
    return inject(function(GoogleApiMock) {
      var apiMock;
      apiMock = new GoogleApiMock();
      subject = apiMock.getPolyline();
      return subject.resetInstances();
    });
  });
  it('constructor exists', function() {
    return expect(subject).toBeDefined();
  });
  return it('can create exists', function() {
    var poly;
    poly = new subject();
    expect(poly).toBeDefined();
    return expect(subject.instances).toBe(1);
  });
});

window["uiGmapInitiator"] = {
  initDirective: function(testSuite, apiSubjectClassName, thingsToInit) {
    var injects;
    if (thingsToInit == null) {
      thingsToInit = ['initAll'];
    }
    injects = ['uiGmapLogger'];
    if (apiSubjectClassName != null) {
      injects.push('uiGmap' + apiSubjectClassName);
    }
    module("uiGmapgoogle-maps.mocks");
    inject(function(GoogleApiMock) {
      testSuite.apiMock = new GoogleApiMock();
      return thingsToInit.forEach(function(init) {
        return testSuite.apiMock[init]();
      });
    });
    injects.push(function(Logger, SubjectClass) {
      if (SubjectClass != null) {
        testSuite.subject = new SubjectClass();
      }
      testSuite.log = Logger;
      return spyOn(testSuite.log, 'error');
    });
    testSuite.injects.push(injects);
    return testSuite;
  },
  initMock: function(testSuite, injectedCb) {
    var apiMock, app;
    app = module("uiGmapgoogle-maps.mocks");
    module("uiGmapgoogle-maps.directives.api.utils");
    apiMock = void 0;
    testSuite.injects.push((function(_this) {
      return function(GoogleApiMock) {
        apiMock = new GoogleApiMock();
        apiMock.initAll();
        if ((injectedCb != null) && _.isFunction(injectedCb)) {
          return injectedCb(apiMock);
        }
      };
    })(this));
    return {
      app: app,
      apiMock: apiMock
    };
  }
};
