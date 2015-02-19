define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    tpl = require('text!tpl/login.html'),

    template = _.template(tpl);

  return Backbone.View.extend({

    initialize: function() {},

    events: {
      "click #btn_login": "clickLogin",
      "click #btn_qrcode": "qrreader",
      "click #img_click": "imgclick"
    },

    imgclick: function(e) {
      console.log('click');
    },


    clickLogin: function(e) {
      app.navigate('/promotions', {
        trigger: true
      });
    },

    render: function() {
      this.$el.html(template());
      return this;
    }

  });

});
