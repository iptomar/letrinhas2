

function checkStatus() {
if  (btnBloqueado == false)
     $("#btn_login").removeClass( "disabled" );
else
$("#btn_login").addClass("disabled");
}


define(function(require) {

  "use strict";
  var myVar = setInterval(checkStatus, 500);
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
      "click #btn_login": "clickLogin",
      "click #btn_qrcode": "qrreader",
      "click #btn_testes": "btn_testes"
    },

    clickLogin: function(e) {
      clearInterval(myVar);
      $.getScript( "js/apoio.js", function() {
      });
      e.stopPropagation(); e.preventDefault();
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
