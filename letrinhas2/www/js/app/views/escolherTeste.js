define(function(require) {
  ////tipoTeste
  ////texto - Teste Texto
  ////lista- Teste Listas
  ////multimedia - Teste multimedia

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    tpl = require('text!tpl/escolherTeste.html'),
    template = _.template(tpl);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

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
      var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");
      var tipoTesteSelecionado = window.localStorage.getItem("TipoTesteSelecionado");

      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeTurma').text("  ["+turmaNome+"  ]");
        if (discplinaSelecionada == '1'){$('#labelDisciplina').text("Português");  $('#imgDisciplinaIcon').attr("src","img/portugues.png");}
        if (discplinaSelecionada == '2'){$('#labelDisciplina').text("Matemática"); $('#imgDisciplinaIcon').attr("src","img/mate.png");}
        if (discplinaSelecionada == '3'){$('#labelDisciplina').text("Estudo do Meio"); $('#imgDisciplinaIcon').attr("src","img/estudoMeio.png");}
        if (discplinaSelecionada == '4'){$('#labelDisciplina').text("Inglês"); $('#imgDisciplinaIcon').attr("src","img/ingles.png");}

        if (tipoTesteSelecionado == 'texto'){$('#titleEscolherTeste').text("Escolher Teste de Leitura de Palavras");}
        if (tipoTesteSelecionado == 'lista'){$('#titleEscolherTeste').text("Escolher Teste de Leitura de Textos");}
        if (tipoTesteSelecionado == 'multimedia'){$('#titleEscolherTeste').text("Escolher Teste Multimedia");}

        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src",url);
      });

      alunos_local2.getAttachment(alunoId, 'aluno.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeAluno').text(alunoNome);
        $('#imgAluno').attr("src",url);
      });


      function map(doc) {
        if (doc.disciplina === 4 && doc.tipoTeste === 'texto') {
          emit(doc);
        }
      }

      testes_local2.query({map: map}, {reduce: false}, function(errx, response) {
        if (errx)  console.log(errx);
        var $container = $('#outputTestes');
        for (var i = 0; i < response.rows.length; i++) {
         var   idTest =  response.rows[i].key;

        var $btn = $(
          '<div class="col-sm-20">' +
          '<button id="' + idTest._id+ '" type="button" style="height:65px;"" class="btn btn-info btn-lg btn-block btn-turma" >' +
          '  <span class="glyphicon glyphicon-file" ></span>   ' +
          idTest.titulo + "</button>" +
          '</div>');
        $btn.appendTo($container); //Adiciona ao Div
      }
      });
    },



    events: {
      "click #BackButtonEscTest": "clickBackButtonEscTest",
      "click #btnRealizarTeste": "clickBtnRealizarTeste",
      "click #btnCorrigirTeste": "clickBtnCorrigirTeste",
      "click #btnConsultarTeste": "clickBtnConsultarTeste",
    },


    clickBackButtonEscTest: function(e) {
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
    //  window.history.back();
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
