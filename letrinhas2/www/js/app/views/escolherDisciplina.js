define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    tpl = require('text!tpl/escolherDisciplina.html'),
    template = _.template(tpl);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },
    /////// Funcao executada no inicio de load da janela ////////////
    initialize: function() {
      ////Carrega dados da janela anterior////
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
        $('#lbNomeTurma').text("  ["+turmaNome+"  ]");
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src",url);
      });


      alunos_local2.getAttachment(alunoId, 'aluno.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeAluno').text(alunoNome);
        $('#imgAluno').attr("src",url);
      });
      //console.log(alunoId);
      //console.log(alunoNome);
    },

    events: {
      "click #BackButtonED": "clickBackButtonED",
      "click #btnSelecPortugues": "clickbtnSelecPortugues",
      "click #btnSelecMate": "clickbtnSelecMate",
      "click #btnSelecEstuMeio": "clickbtnSelecEstuMeio",
      "click #btnSelecIngles": "clickbtnSelecIngles",
    },

    clickBackButtonED: function(e) {
      window.history.back();
    },

    clickbtnSelecPortugues: function(e) {
      console.log("pt");
    },

    clickbtnSelecMate: function(e) {
      console.log("mate");
    },

    clickbtnSelecEstuMeio: function(e) {
      console.log("estudomeio");
    },

    clickbtnSelecIngles: function(e) {
      console.log("ingles");
    },

    render: function() {
      this.$el.html(template({}));
      return this;
    }
  });
});
