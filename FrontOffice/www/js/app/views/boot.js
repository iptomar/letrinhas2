define(function (require) {

  "use strict";

  var $         = require('jquery'),
      _         = require('underscore'),
      Backbone  = require('backbone'),
      janelas       = require('text!janelas/boot.html'),

      template = _.template(janelas);

  return Backbone.View.extend({

    initialize: function() {
      utils.islog('/summary');
    },

    render: function () {
      this.$el.html(template());

      return this;
    }

  });

});
