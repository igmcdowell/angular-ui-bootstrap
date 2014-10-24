/* global __mappings: false, __files: false, FastClick, smoothScroll */
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
    var jsContent =selectedModules
    .map(function (module) {
      return __mappings[module];
    })
    .reduce(function (toBuild, module) {
      if (toBuild.indexOf(module.name) == -1) {
        toBuild.push(module.name);
      }

      module.dependencies.forEach(function (depName) {
        if (toBuild.indexOf(depName) == -1) {
          toBuild.push(depName);
        }
      });
      return toBuild;
    }, [])
    .reduce(function (buildFiles, module) {
      return buildFiles.concat(__mappings[module].srcFiles).concat(__mappings[module].tpljsFiles);
    }, [])
    .map(function (buildFile) {
      return __files[buildFile];
    })
    .join('\n')
    ;

    console.log(jsContent);
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
