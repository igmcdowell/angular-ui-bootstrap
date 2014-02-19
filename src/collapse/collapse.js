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

        element.on('$animate:before', function (e, data) {
          if (data.className == collapseConfig.visibleClass) {
            element.css({height: data.event == 'addClass' ? '0' : _fullHeight()});
          }
        });

        element.on('$animate:after', function (e, data) {
          if (data.className == collapseConfig.visibleClass) {
            element.css({height: data.event == 'addClass' ? _fullHeight() : '0'});
          }
        });

        element.on('$animate:close', function (e, data) {
          if (data.className == collapseConfig.visibleClass) {
            element.css({height: data.event == 'addClass' ? 'auto' : '0'});
            animateDone();
          }
        });

        function _fullHeight() {
          return element[0].scrollHeight + 'px';
        }

        function expand() {
          animateStart();
          $animate.addClass(element, collapseConfig.visibleClass);
        }

        function collapse() {
          animateStart();
          $animate.removeClass(element, collapseConfig.visibleClass);
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

;
