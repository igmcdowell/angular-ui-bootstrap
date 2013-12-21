angular.module('ui.bootstrap.collapse', [])

  .constant('collapseConfig', {
    inactiveClass: 'collapse',
    activeClass: 'collapsing',
    visibleClass: 'in'
  })

  .directive('collapse', [
           'collapseConfig', '$animate',
  function (collapseConfig ,  $animate) {

    return {
      link: function (scope, element, attrs) {
        element.addClass(collapseConfig.inactiveClass);

        function expand() {
          animateStart();
          $animate.addClass(element, collapseConfig.visibleClass, function () {
            // Doing height: '' to remove this property works too as "height:
            // auto" is already in the Bootstrap stylesheet but may break
            // compatibility with IE8 according to warning on
            // http://api.jquery.com/css/
            element.css({height: 'auto'});
            animateDone();
          });
        }

        function collapse() {
          animateStart();
          $animate.removeClass(element, collapseConfig.visibleClass, function () {
            // Read note above about IE8
            element.css({height: '0'});
            animateDone();
          });
        }

        function animateStart() {
          element
            .removeClass(collapseConfig.inactiveClass)
            .addClass(collapseConfig.activeClass);
        }

        function animateDone() {
          element
            .removeClass(collapseConfig.activeClass)
            .addClass(collapseConfig.inactiveClass);
        }

        scope.$watch(attrs.collapse, function (shouldCollapse) {
          if (shouldCollapse) {
            collapse();
          } else {
            expand();
          }
        });
      }
    };
  }])

  .animation('.collapsing', [
             'collapseConfig',
    function (collapseConfig) {

    // Check for addition/removal of 'in' class
    return {
      beforeAddClass: _setZeroHeight,
      addClass: _setFullHeight,
      beforeRemoveClass: _setFullHeight,
      removeClass: _setZeroHeight
    };

    function _setFullHeight(element, className, done) {
      if (className == collapseConfig.visibleClass) {
        element.css({height: element[0].scrollHeight + 'px'});
      }
      done();
    }

    function _setZeroHeight(element, className, done) {
      if (className == collapseConfig.visibleClass) {
        element.css({height: '0'});
      }
      done();
    }

  }])

;
