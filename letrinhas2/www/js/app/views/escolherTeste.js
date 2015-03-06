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
    janelas = require('text!janelas/escolherTeste.html'),
    template = _.template(janelas);

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

        if (tipoTesteSelecionado == 'palavras'){$('#titleEscolherTeste').text("Escolher Teste de Leitura de Palavras");}
        if (tipoTesteSelecionado == 'texto'){$('#titleEscolherTeste').text("Escolher Teste de Leitura de Textos");}
        if (tipoTesteSelecionado == 'multimedia'){$('#titleEscolherTeste').text("Escolher Teste Multimedia");}

        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src",url);
      });

      alunos_local2.getAttachment(alunoId, 'aluno.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeAluno').text("["+turmaNome+" ] -- "+alunoNome);
        $('#imgAluno').attr("src",url);
      });


      function map(doc) {

        if (doc.disciplina == window.localStorage.getItem("DiscplinaSelecionada")
        && doc.tipoTeste === window.localStorage.getItem("TipoTesteSelecionado")) {
          emit(doc);
        }
      }

      testes_local2.query({map: map}, {reduce: false}, function(errx, response) {
        if (errx)  console.log(errx);
        var $container = $('#outputTestes');
        if (response.rows.length == 0)
      {
        var $msg = $("<h4 class='centerEX' >SEM DADOS</h4>");
        $msg.appendTo($container); //Adiciona ao Div
       }

        for (var i = 0; i < response.rows.length; i++) {
         var   idTest =  response.rows[i].key;
        var $btn = $(
          '<div class="col-sm-20">' +
          '<button id="' + idTest._id+ '" type="button" style="height:65px;"" class="btn btn-info btn-lg btn-block btn-teste" >' +
          '  <span class="glyphicon glyphicon-file" ></span>   ' +
          idTest.titulo + "</button>" +
          '</div>');
        $btn.appendTo($container); //Adiciona ao Div
      }
      //// Analisa todos os botoes do div e aqueles que forem botoes de turma escuta o evento click//
      $container.on('click', '.btn-teste', function(ev) {
        ev.stopPropagation(); ev.preventDefault();
        var $btn = $(this); // O jQuery passa o btn clicado pelo this
        var self = this;

        if (tipoTesteSelecionado == 'palavras'){
          if (Backbone.history.fragment != 'testeLista') {
           utils.loader(function() {
             ev.preventDefault();
             window.localStorage.setItem("TesteArealizarID", $btn[0].id + ''); //enviar variavel
             app.navigate('/testeLista', {
               trigger: true
             });
           });
         }
        }

        else if (tipoTesteSelecionado == 'texto'){
          if (Backbone.history.fragment != 'testeTexto') {
           utils.loader(function() {
             ev.preventDefault();
             window.localStorage.setItem("TesteArealizarID", $btn[0].id + ''); //enviar variavel
             app.navigate('/testeTexto', {
               trigger: true
             });
           });
         }
        }
        else if (tipoTesteSelecionado == 'texto'){
          //////////colocar aqui para ir para a janela de multimedia//////////
        }
      });
      });
    },

    events: {
      "click #BackButtonEscTest": "clickBackButtonEscTest",
      "click #btnRealizarTeste": "clickBtnRealizarTeste",
      "click #btnCorrigirTeste": "clickBtnCorrigirTeste",
      "click #btnConsultarTeste": "clickBtnConsultarTeste",
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
      BtnNavPress = -6;
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
      BtnNavPress = -4;
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
      BtnNavPress = -8;
      $('#labelErr').text("");  //limpa campos
      $('#inputPIN').val("");   //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function (e) {
         $("#inputPIN").focus();
      });
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
