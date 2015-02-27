define(function (require) {

  "use strict";

  var $         = require('jquery'),
      _         = require('underscore'),
      Backbone  = require('backbone'),
      tpl       = require('text!tpl/login.html'),

      template = _.template(tpl);

  return Backbone.View.extend({

    initialize: function() {
    },

    events: {
      "click #btn_login": "clickLogin",
      "click #btn_qrcode": "qrreader",
      "click #img_click": "imgclick",
      "click #btn1": "btn1"

    },

    imgclick: function(e) {
      console.log('click');
    },

    btn1: function(e) {

      console.log($('#input1').val());
    },


    clickLogin: function(e) {
      app.navigate('/summary', {
        trigger: true
      });
    },

    render: function () {
      this.$el.html(template());
      return this;
    }

  });

});
