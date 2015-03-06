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

      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var alunoNome = window.localStorage.getItem("AlunoSelecNome");
      var turmaId = window.localStorage.getItem("TurmaSelecID");
      var turmaNome = window.localStorage.getItem("TurmaSelecNome");

      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src",url);
      });


      alunos_local2.getAttachment(alunoId, 'aluno.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeAluno').text("["+turmaNome+" ] -- "+alunoNome);
        $('#imgAluno').attr("src",url);
      });

    },



    events: {
      "click #BackButtonMO": "clickBackButtonMO",
      "click #btnRealizarTeste": "clickBtnRealizarTeste",
      "click #btnCorrigirTeste": "clickBtnCorrigirTeste",
      "click #btnConsultarTeste": "clickBtnConsultarTeste",
      "click #btnNavINI": "clickbtnNavINI",
      "click #btnNavAlu": "clickbtnNavAlu",
      "click #btnNavProf": "clickbtnNavProf",
    },

    clickbtnNavProf: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-3);
    },

    clickbtnNavAlu: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-1);
    },


    clickbtnNavINI: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-5);
    },


    clickBackButtonMO: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.back();
    },

    clickBtnRealizarTeste: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'escolherDisciplina') {
        utils.loader(function() {
          e.preventDefault();
          app.navigate('/escolherDisciplina', {
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
      //window.history.back();
    },


    render: function() {
      this.$el.html(template({}));
      return this;
    }

  });

});
