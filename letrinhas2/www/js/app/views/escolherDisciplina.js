define(function(require) {
//// 1 -Portugues  2- Matematica
///  3 -EstudoMeio 4- Ingles
var BtnNavPress;
  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherDisciplina.html'),
    template = _.template(janelas);

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
        $('#lbNomeAluno').text("["+turmaNome+" ] -- "+alunoNome);
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
      "click #btnNavINI": "clickbtnNavINI",
      "click #btnNavAlu": "clickbtnNavAlu",
      "click #btnNavProf": "clickbtnNavProf",
      "click #btnConfirmarPIN": "clickbtnConfirmarPIN",
    },

    clickbtnConfirmarPIN: function(e) {
      var pinDigitado = $('#inputPIN').val();
      var pinProfAux = window.localStorage.getItem("ProfSelecPIN");
      if (pinProfAux == pinDigitado) {
        $('#myModal').modal("hide");
        $('#myModal').on('hidden.bs.modal', function (e) {
          window.history.go(BtnNavPress);
        });
      } else {
        $('#inputPINErr').addClass("has-error");
        $('#labelErr').text("PIN errado!");
      }
    },


    clickbtnNavProf: function(e) {
      e.stopPropagation(); e.preventDefault();
      BtnNavPress = -4;
      $('#labelErr').text("");  //limpa campos
      $('#inputPIN').val("");   //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function (e) {
         $("#inputPIN").focus();
      });
    },

    clickbtnNavAlu: function(e) {
      e.stopPropagation(); e.preventDefault();
      BtnNavPress = -2;
      $('#labelErr').text("");  //limpa campos
      $('#inputPIN').val("");   //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function (e) {
         $("#inputPIN").focus();
      });
    },


    clickbtnNavINI: function(e) {
      e.stopPropagation(); e.preventDefault();
      BtnNavPress = -6;
      $('#labelErr').text("");  //limpa campos
      $('#inputPIN').val("");   //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function (e) {
         $("#inputPIN").focus();
      });
    },

    clickBackButtonED: function(e) {
      window.history.back();
    },

    clickbtnSelecPortugues: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.localStorage.setItem("DiscplinaSelecionada", 1); //enviar variavel 1 -Portugues
      var self = this;
      if (Backbone.history.fragment != 'escolherTipoTeste') {
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);
          app.navigate('/escolherTipoTeste', {
            trigger: true
          });
        });
      }
    },

    clickbtnSelecMate: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.localStorage.setItem("DiscplinaSelecionada", 2); //enviar variavel 2- Matematica
      var self = this;
      if (Backbone.history.fragment != 'escolherTipoTeste') {
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);
          app.navigate('/escolherTipoTeste', {
            trigger: true
          });
        });
      }
    },

    clickbtnSelecEstuMeio: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.localStorage.setItem("DiscplinaSelecionada", 3); //enviar variavel 3 -EstudoMeio
      var self = this;
      if (Backbone.history.fragment != 'escolherTipoTeste') {
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);
          app.navigate('/escolherTipoTeste', {
            trigger: true
          });
        });
      }
    },

    clickbtnSelecIngles: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.localStorage.setItem("DiscplinaSelecionada", 4); //enviar variavel 4- Ingles
      var self = this;
      if (Backbone.history.fragment != 'escolherTipoTeste') {
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);
          app.navigate('/escolherTipoTeste', {
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
