
define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/login.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    myVar : setInterval(function() {
      if (btnBloqueado == false) {
        $("#progBAR").css('width', perc + '%').attr('aria-valuenow', perc).html(perc + '%');
        $("#btn_login").removeClass("disabled");
      } else {
        $("#proB").css('visibility', 'visible')
        $("#progBAR").css('width', perc + '%').attr('aria-valuenow', perc).html(perc + '%');
        $("#btn_login").addClass("disabled");
      }
    }, 500),



    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {
    },

    //Eventos Click
    events: {
      "click #btn_login": "clickLogin",
      "click #btn_qrcode": "qrreader",
      "click #btn_testes": "btn_testes"
    },

    clickLogin: function(e) {
      var self = this;
      e.stopPropagation(); e.preventDefault();

      clearInterval(self.myVar);
      $("#proB").css('visibility','hidden')
      app.navigate('/escolherEscola', {
        trigger: true
      });
    },


    btn_testes: function(e) {
      e.stopPropagation(); e.preventDefault();
      app.navigate('/testes', {
        trigger: true
      });
    },

    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});
