define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/login.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

    },

    //Eventos Click
    events: {
      "click #btnEntrar": "btnEntrar",
    },

    btnEntrar: function(e) {
      e.stopPropagation(); e.preventDefault();
      app.navigate('/paginic', {
        trigger: true
      });
    },

    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});
