define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    tpl = require('text!tpl/menuTipoOpcao.html'),

    template = _.template(tpl);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var alunoNome = window.localStorage.getItem("AlunoSelecNome");

      console.log(alunoId);
      console.log(alunoNome);
    },



    events: {
      "click #BackButtonMO": "clickBackButtonMO",
      "click #btnRealizarTeste": "clickbtnRealizarTeste",
      "click #btnCorrigirTeste": "clickbtnCorrigirTeste",
      "click #btnConsultarTeste": "clickbtnConsultarTeste",
    },


    clickBackButtonMO: function(e) {
      window.history.back();
    },

    clickbtnRealizarTeste: function(e) {
      window.history.back();
    },

    btnCorrigirTeste: function(e) {
      window.history.back();
    },

    btnConsultarTeste: function(e) {
      window.history.back();
    },


    render: function() {
      this.$el.html(template({}));
      return this;
    }

  });

});
