(function() {
  'use strict';

  angular.module('Core')
    .service('smoothScrollService', smoothScrollService);

  smoothScrollService.$inject = ['commonService'];

  function smoothScrollService(commonService) {
    var service = this;
    service.scrollToElementId = scrollToElementId;

    /* ======================================== Var ==================================================== */
    service.userData = {

    };

    /* ======================================== Services =============================================== */

    /* ======================================== Public Methods ========================================= */
    function scrollToElementId(elementId, isRelativeToWindow) {
      var startYPos = currentYPosition();
      var targetYPos;
      if(isRelativeToWindow === true) {
        targetYPos = targetYPositionToWindow(elementId);
      } else {
        targetYPos = targetYPositionToElement(elementId);
      }
      var distance = targetYPos > startYPos ? (targetYPos - startYPos) : (startYPos - targetYPos);
      if (distance < 100) {
        scrollTo(0, targetYPos);
        return;
      }

      var speed = Math.round(distance / 100);
      if (speed >= 20) {
        speed = 20;
      }
      var step = Math.round(distance / 25);
      var leapY = targetYPos > startYPos ? (startYPos + step) : startYPos - step;
      var timer = 0;
      if (targetYPos > startYPos) {
        for (var i = startYPos; i < targetYPos; i += step) {
          if(isRelativeToWindow === true) {
            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
          } else {
            setTimeout(function() {
              document.getElementById(elementId).scrollTop = leapY;
            }, timer * speed);
          }
          leapY += step;
          if (leapY > targetYPos) leapY = targetYPos;
          timer++;
        }
        return;
      }
      for (var i = startYPos; i > targetYPos; i -= step) {
        if(isRelativeToWindow === true) {
          setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
        } else {
          setTimeout(function() {
            document.getElementById(elementId).scrollTop = leapY;
          }, timer * speed);
        }
        leapY -= step;
        if (leapY < targetYPos) {
          leapY = targetYPos;
        }
        timer++;
      }
    }

    /* ======================================== Private Methods ======================================== */
    function targetYPositionToElement(elementId) {
      return document.getElementById(elementId).scrollHeight;
    }
    
    function targetYPositionToWindow(elementId) {
      var element = document.getElementById(elementId);
      var y = element.offsetTop;
      var node = element;
      while (node.offsetParent && (node.offsetParent != document.body)) {
        node = node.offsetParent;
        y += node.offsetTop;
      }
      return y;
    }

    function currentYPosition() {
      // Firefox, Chrome, Opera, Safari
      if (self.pageYOffset) {
        return self.pageYOffset;
      }

      // Internet Explorer 6 - standards mode
      if (document.documentElement && document.documentElement.scrollTop) {
        return document.documentElement.scrollTop;
      }

      // Internet Explorer 6, 7 and 8
      if (document.body.scrollTop) {
        return document.body.scrollTop;
      }

      return 0;
    }

    function init() {

    }

    init();
  }
})();
