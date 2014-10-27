/* global __banner: false, __mappings: false, __files: false, FastClick, smoothScroll */
angular.module('ui.bootstrap.demo', ['ui.bootstrap', 'plunker', 'ngTouch'], function($httpProvider){
  FastClick.attach(document.body);
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).run(['$location', function($location){
  //Allows us to navigate to the correct element on initialization
  if ($location.path() !== '' && $location.path() !== '/') {
    smoothScroll(document.getElementById($location.path().substring(1)), 500, function(el) {
      location.replace(el.id);
    });
  }
}]);

var builderUrl = "http://50.116.42.77:3001";

function MainCtrl($scope, $http, $document, $modal, orderByFilter) {
  $scope.showBuildModal = function() {
    var modalInstance = $modal.open({
      templateUrl: 'buildModal.html',
      controller: 'SelectModulesCtrl',
      resolve: {
        modules: function() {
          return Object.keys(__mappings);
        }
      }
    });
  };

  $scope.showDownloadModal = function() {
    var modalInstance = $modal.open({
      templateUrl: 'downloadModal.html',
      controller: 'DownloadCtrl'
    });
  };
}

var SelectModulesCtrl = function($scope, $modalInstance, modules) {
  $scope.selectedModules = [];
  $scope.modules = modules;

  $scope.selectedChanged = function(module, selected) {
    if (selected) {
      $scope.selectedModules.push(module);
    } else {
      $scope.selectedModules.splice($scope.selectedModules.indexOf(module), 1);
    }
  };

  $scope.downloadBuild = function () {
    $modalInstance.close($scope.selectedModules);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss();
  };

  $scope.build = function (selectedModules) {

    var srcModuleNames = selectedModules
    .map(function (module) {
      return __mappings[module];
    })
    .reduce(function (toBuild, module) {
      addIfNotExists(toBuild, module.name);

      module.dependencies.forEach(function (depName) {
        addIfNotExists(toBuild, depName);
      });
      return toBuild;
    }, []);

    var srcModules = srcModuleNames
    .map(function (moduleName) {
      return __mappings[moduleName];
    });

    var srcJsContent = srcModules
    .reduce(function (buildFiles, module) {
      return buildFiles.concat(module.srcFiles);
    }, [])
    .map(getFileContent)
    .join('\n')
    ;

    console.log(createNoTplFile(srcModuleNames, srcJsContent));

    var tplModuleNames = srcModules
    .reduce(function (tplModuleNames, module) {
      return tplModuleNames.concat(module.tplModules);
    }, []);

    var tplJsContent = srcModules
    .reduce(function (buildFiles, module) {
      return buildFiles.concat(module.tpljsFiles);
    }, [])
    .map(getFileContent)
    .join('\n')
    ;

    console.log(createWithTplFile(srcModuleNames, srcJsContent, tplModuleNames, tplJsContent));

    function createNoTplFile(srcModuleNames, srcJsContent) {
      return __banner + 'angular.module("ui.bootstrap", ' + JSON.stringify(srcModuleNames) + ');\n' +
        srcJsContent;
    }

    function createWithTplFile(srcModuleNames, srcJsContent, tplModuleNames, tplJsContent) {
      var depModuleNames = srcModuleNames.slice();
      depModuleNames.push('ui.bootstrap.tpls');

      return __banner + 'angular.module("ui.bootstrap", ' + JSON.stringify(depModuleNames) + ');\n' +
        'angular.module("ui.bootstrap.tpls", [' + tplModuleNames.join(',') + ']);\n' +
        srcJsContent + '\n' + tplJsContent;

    }

    function addIfNotExists(array, element) {
      if (array.indexOf(element) == -1) {
        array.push(element);
      }
    }

    function getFileContent(fileName) {
      return __files[fileName];
    }
  };
};

var DownloadCtrl = function($scope, $modalInstance) {
  $scope.options = {
    minified: true,
    tpls: true
  };

  $scope.download = function (version) {
    var options = $scope.options;

    var downloadUrl = ['ui-bootstrap-'];
    if (options.tpls) {
      downloadUrl.push('tpls-');
    }
    downloadUrl.push(version);
    if (options.minified) {
      downloadUrl.push('.min');
    }
    downloadUrl.push('.js');

    return downloadUrl.join('');
  };

  $scope.cancel = function () {
    $modalInstance.dismiss();
  };
};
