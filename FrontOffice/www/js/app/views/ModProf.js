define(function(require) {

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/ModProf.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({


    /////// Funcao executada no inicio de load da janela ////////////
    initialize: function() {

    },

    //Eventos Click
    events: {
        "click #BackButtonEE": "clickBackButtonEE",
    },

    clickBackButtonEE: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.back();
    },


    render: function() {
      this.$el.html(template({}));
      return this;
    }

  });
});
