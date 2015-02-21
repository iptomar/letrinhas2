define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    tpl = require('text!tpl/boot.html'),

    template = _.template(tpl);

  return Backbone.View.extend({

    initialize: function() {
      utils.islog('/summary');
    },

    render: function() {
      this.$el.html(template());

      return this;
    }

  });

});
