define(function (require) {

  "use strict";

  var $        = require('jquery'),
      _        = require('underscore'),
      Backbone = require('backbone'),
      tpl      = require('text!tpl/promotions.html'),

      template = _.template(tpl);

  return Backbone.View.extend({

    events: {
      "click #img_click": "imgclick"
    },

    imgclick: function(e) {
      console.log('click')
    },

    render: function () {
      this.$el.html(template());

      return this;
    }

  });

});
