define(function(require) {
  var BtnNavPress;
  
  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/menuTipoOpcao.html'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

    },


    events: {
      "click #BackButtonMO": "clickBackButtonMO",
      "click #btnRealizarTeste": "clickBtnRealizarTeste",
      "click #btnCorrigirTeste": "clickBtnCorrigirTeste",
      "click #btnConsultarTeste": "clickBtnConsultarTeste",
      "click #btnNavINI": "clickbtnNavINI",
      "click #btnNavDisci": "clickbtnNavDisci",
    },



    clickbtnNavDisci: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-1);
    },


    clickbtnNavINI: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-2);
    },


    clickBackButtonMO: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.back();
    },

    clickBtnRealizarTeste: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'escolherTurma') {
        utils.loader(function() {
          e.preventDefault();
          app.navigate('/escolherTurma', {
            trigger: true
          });
        });
      }
    },

    clickBtnCorrigirTeste: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'escolherCorrecao') {
        utils.loader(function() {
          e.preventDefault();
          app.navigate('/escolherCorrecao', {
            trigger: true
          });
        });
      }
    },

    clickBtnConsultarTeste: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'escolherResultados') {
        utils.loader(function() {
          e.preventDefault();
          app.navigate('/escolherResultados', {
            trigger: true
          });
        });
      }
    },

    render: function() {
      this.$el.html(template({}));

      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
        professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src",url);
      });

      return this;
    }
  });

});
