define(function(require) {
  ////tipoTeste
  ////texto - Teste Texto
  ////lista- Teste Listas
  ////multimedia - Teste multimedia
  var BtnNavPress;
  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherTipoTeste.html'),
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
      var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");

      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        if (discplinaSelecionada == '1'){$('#labelDisciplina').text("Português");  $('#imgDisciplinaIcon').attr("src","img/portugues.png");}
        if (discplinaSelecionada == '2'){$('#labelDisciplina').text("Matemática"); $('#imgDisciplinaIcon').attr("src","img/mate.png");}
        if (discplinaSelecionada == '3'){$('#labelDisciplina').text("Estudo do Meio"); $('#imgDisciplinaIcon').attr("src","img/estudoMeio.png");}
        if (discplinaSelecionada == '4'){$('#labelDisciplina').text("Inglês"); $('#imgDisciplinaIcon').attr("src","img/ingles.png");}

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

    },



    events: {
      "click #BackButtonETT": "clickBackButtonETT",
      "click #btnTesteLeituraPalav": "clickbtnTesteLeituraPalav",
      "click #btnTesteLeituraTextos": "clickbtnTesteLeituraTextos",
      "click #btnTesteLeituraMultimedia": "clickbtnTesteLeituraMultimedia",
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
      BtnNavPress = -5;
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
      BtnNavPress = -3;
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
      BtnNavPress = -7;
      $('#labelErr').text("");  //limpa campos
      $('#inputPIN').val("");   //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function (e) {
         $("#inputPIN").focus();
      });
    },


    clickBackButtonETT: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.back();
    },

    clickbtnTesteLeituraPalav: function(ev) {
      ev.stopPropagation(); ev.preventDefault();
      var $btn = $(this); // O jQuery passa o btn clicado pelo this
      var self = this;
      if (Backbone.history.fragment != 'escolherTeste') {
        utils.loader(function() {
          ev.preventDefault();
          window.localStorage.setItem("TipoTesteSelecionado", 'palavras'); //enviar variavel
          app.navigate('/escolherTeste', {
            trigger: true
          });
        });
      }
    },

    clickbtnTesteLeituraTextos: function(ev) {
      ev.stopPropagation(); ev.preventDefault();
      var $btn = $(this); // O jQuery passa o btn clicado pelo this
      var self = this;
      if (Backbone.history.fragment != 'escolherTeste') {
        utils.loader(function() {
          ev.preventDefault();
          window.localStorage.setItem("TipoTesteSelecionado", 'texto'); //enviar variavel
          app.navigate('/escolherTeste', {
            trigger: true
          });
        });
      }
    },

    clickbtnTesteLeituraMultimedia: function(ev) {
      ev.stopPropagation(); ev.preventDefault();
      var $btn = $(this); // O jQuery passa o btn clicado pelo this
      var self = this;
      if (Backbone.history.fragment != 'escolherTeste') {
        utils.loader(function() {
          ev.preventDefault();
          console.log($btn[0].name )
          window.localStorage.setItem("TipoTesteSelecionado", 'multimedia'); //enviar variavel
          app.navigate('/escolherTeste', {
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
