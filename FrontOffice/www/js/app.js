require.config({

  baseUrl: 'js/lib',

  paths: {
    app: '../app',
    janelas: '../janelas',
    'swipe': '../lib/swipe',
    'utils': '../app/utils',
  },

  map: {
    '*': {
      'app/models/Service': 'app/models/Service'
    }
  },

  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'bootstrap': {
      deps: ['jquery'],
      exports: 'Bootstrap'
    },
    'underscore': {
      exports: '_'
    }
  }
});



require(['jquery', 'bootstrap', 'backbone', 'app/router', 'async', 'swipe', 'utils'],
function ($, Bootstrap, Backbone, Router, async, swipe, utils) {

  $('body').on('blur', 'input, textarea', function(e) {
    setTimeout(function() {
      window.scrollTo(0,$(e.target).offset().top-5);
    }, 50);
  });

  function toggleChevron(e) {
    $(e.target)
      .prev('.accordion-heading')
      .find(".indicator")
      .toggleClass('font-icon-arrow-simple-down font-icon-arrow-simple-up');
  }

  $('body').on('hidden.bs.collapse', '#accordion', toggleChevron);
  $('body').on('shown.bs.collapse', '#accordion', toggleChevron);

  var handler = function() {
    app = new Router();
    Backbone.history.start();

    document.documentElement.style.webkitTouchCallout = "none";
    document.documentElement.style.webkitUserSelect = "none";

    var cl = document.body.classList;
    $('body').swipe({
      swipeRight:function(event, distance, duration, fingerCount, fingerData) {
        if (!cl.contains('left-nav')) {
          cl.add('left-nav');
        }
      },
      swipeLeft:function(event, distance, duration, fingerCount, fingerData) {
        if (cl.contains('left-nav')) {
          cl.remove('left-nav');
        }
      }
    });
  };

  handler();

});
