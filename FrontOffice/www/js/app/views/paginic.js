define(function(require) {

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/paginic.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({


    /////// Funcao executada no inicio de load da janela ////////////
    initialize: function() {

    },

    //Eventos Click
    events: {
      "click #btnNEXT": "clickNEXT",
      "click #BackButtonEE": "clickBackButtonEE",
    },

    clickBackButtonEE: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.back();
    },


    clickNEXT: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'summary') {
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);
          app.navigate('/summary', {
            trigger: true
          });
        });
      }
    },

    render: function() {
      this.$el.html(template({}));
      return this;
    }

  });
});
