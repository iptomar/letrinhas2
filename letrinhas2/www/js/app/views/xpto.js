define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/xpto.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({



    initialize: function() {


    },

    //Eventos Click
    events: {
      "click #btn_login": "clickLogin",
    },
    clickLogin: function(e) {


    },


    render: function() {
      this.$el.html(template());

    

      return this;
    }
  });
});
