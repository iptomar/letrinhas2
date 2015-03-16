/////////////////////////////////////////////////////////////////////////
define(function(require) {
  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/testes.html'),
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
      "click #btnVerFile": "btnVerFile",
      "click #btnGravarSom": "btnGravarSom",
      "click #btnStopRec": "btnStopRec",
      "click #btnReprProfSom": "btnReprProfSom",
    },

    btnVerFile: function(e) {
    },


    btnGravarSom: function(e) {

    },

    btnStopRec: function(e) {

    },

    btnReprProfSom: function(e) {

    },



    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});
