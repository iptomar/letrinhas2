define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherCorrecao.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

    },

    events: {
      "click #BackButton": "clickBackButton",
    },

    clickBackButton: function(e) {
      window.history.back();
    },

  
    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});
