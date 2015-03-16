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

  var btns = null;
  var tipo = 0;
  var testeID_Aux = false;
  var tipoTesteSelecionado;
  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },



    initialize: function() {
      ////Carrega dados da janela anterior////
      BtnNavPress = 0;
      btns = null
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var alunoNome = window.localStorage.getItem("AlunoSelecNome");
      var turmaId = window.localStorage.getItem("TurmaSelecID");
      var turmaNome = window.localStorage.getItem("TurmaSelecNome");
      var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");
      tipoTesteSelecionado = window.localStorage.getItem("TipoTesteSelecionado");


      testeID_Aux = false;
      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeTurma').text("  [" + turmaNome + "  ]");
        if (discplinaSelecionada == '1') {
          $('#labelDisciplina').text("Português");
          $('#imgDisciplinaIcon').attr("src", "img/portugues.png");
        }
        if (discplinaSelecionada == '2') {
          $('#labelDisciplina').text("Matemática");
          $('#imgDisciplinaIcon').attr("src", "img/mate.png");
        }
        if (discplinaSelecionada == '3') {
          $('#labelDisciplina').text("Estudo do Meio");
          $('#imgDisciplinaIcon').attr("src", "img/estudoMeio.png");
        }
        if (discplinaSelecionada == '4') {
          $('#labelDisciplina').text("Inglês");
          $('#imgDisciplinaIcon').attr("src", "img/ingles.png");
        }

        if (tipoTesteSelecionado == 'palavras') {
          $('#titleEscolherTeste').text("Escolher Teste de Leitura de Palavras");
        }
        if (tipoTesteSelecionado == 'texto') {
          $('#titleEscolherTeste').text("Escolher Teste de Leitura de Textos");
        }
        if (tipoTesteSelecionado == 'multimedia') {
          $('#titleEscolherTeste').text("Escolher Teste Multimedia");
        }

        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src", url);
      });

      alunos_local2.getAttachment(alunoId, 'aluno.png', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeAluno').text("[" + turmaNome + " ] -- " + alunoNome);
        $('#imgAluno').attr("src", url);
      });


      function map(doc) {

        if (doc.disciplina == window.localStorage.getItem("DiscplinaSelecionada") && doc.tipoTeste === window.localStorage.getItem("TipoTesteSelecionado")) {
          emit(doc);
        }
      }

      testes_local2.query({
        map: map
      }, {
        reduce: false
      }, function(errx, response) {
        if (errx) console.log(errx);
        var $container = $('#outputTestes');
        if (response.rows.length == 0) {
          var $msg = $("<h4 class='centerEX' >SEM DADOS</h4>");
          $msg.appendTo($container); //Adiciona ao Div
        }

        for (var i = 0; i < response.rows.length; i++) {
          var idTest = response.rows[i].key;
          var $btn = $(
            '<button id="' + idTest._id + '" type="button" style="height:65px;"" class="btn btn-lg btn-block btn-teste activeXF " >' +
            '  <span class="glyphicon glyphicon-file" ></span>   ' +
            idTest.titulo + "</button>");
          $btn.appendTo($container); //Adiciona ao Div
        }
        //// Analisa todos os botoes do div e aqueles que forem botoes de turma escuta o evento click//
        $container.on('click', '.btn-teste', function(ev) {
          ev.stopPropagation();
          ev.preventDefault();
          if (btns != null) {
            btns.removeClass("btn-primary");
            btns.addClass("activeXF");
          }
          btns = $(this);
          $(this).removeClass("activeXF");
          $(this).addClass("btn-primary");

          var $btn = $(this); // O jQuery passa o btn clicado pelo this
          var self = this;

          if (tipoTesteSelecionado == 'palavras') {
            var $container2 = $('#outputTestesConteudo');
            testeID_Aux = true;
            window.localStorage.setItem("TesteArealizarID", $btn[0].id + ''); //enviar variavel
            testes_local2.get($btn[0].id, function(err, testeDoc) {
              if (err) console.log(err);
              //console.log(testeDoc);
              var colum1 = "";
              var colum2 = "";
              var colum3 = "";
              for (var j = 0; j < testeDoc.conteudo.palavrasCl1.length; j++) {
                colum1 += testeDoc.conteudo.palavrasCl1[j] + "</p>";
              }

              for (var j = 0; j < testeDoc.conteudo.palavrasCl1.length; j++) {
                colum2 += testeDoc.conteudo.palavrasCl2[j] + "</p>";
              }

              for (var j = 0; j < testeDoc.conteudo.palavrasCl1.length; j++) {
                colum3 += testeDoc.conteudo.palavrasCl3[j] + "</p>";
              }

              var $btn2 = $(
                '<div class="panel panel-primary">' +
                '<div class="panel-heading centerEX">' +
                '<h3 class="panel-title">' + testeDoc.titulo + '</h3>' +
                '</div>' +
                '<div class="panel-body fontEX2">' +
                '<div class="row">' +
                '<div class="col-xs-4">' + colum1 + '</div>' +
                '<div class="col-xs-4">' + colum2 + '</div>' +
                '<div class="col-xs-4">' + colum3 + '</div>' +
                '</div>' +
                '</div></div>');
              $container2.empty();
              $btn2.appendTo($container2);
            });
          }
          //////////colocar aqui para ir para a janela de T//////////
          else if (tipoTesteSelecionado == 'texto') {
            var $container2 = $('#outputTestesConteudo');
            testeID_Aux=  true;
            window.localStorage.setItem("TesteTextArealizarID", $btn[0].id + ''); //enviar variavel
            testes_local2.get($btn[0].id, function(err, testeDoc) {
              if (err) console.log(err);
              //console.log(testeDoc);
              var $btn2 = $(
                '<div class="panel panel-primary">' +
                '<div class="panel-heading centerEX">' +
                '<h3 class="panel-title">' + testeDoc.titulo + '</h3>' +
                '</div>' +
                '<div class="panel-body fontEX2">' +
                testeDoc.conteudo.texto.replace(/\n/g, '</br>') +
                '</div></div>');
              $container2.empty();
              $btn2.appendTo($container2);
            });
          } else if (tipoTesteSelecionado == 'texto') {
            //////////colocar aqui para ir para a janela de multimedia//////////
          }
        });
      });
    },

    events: {
      "click #BackButtonEscTest": "clickBackButtonEscTest",
      "click #btnNavINI": "clickbtnNavINI",
      "click #btnNavAlu": "clickbtnNavAlu",
      "click #btnNavProf": "clickbtnNavProf",
      "click #btnNavCorrecao": "clickbtnNavCorrecao",
      "click #btnConfirmarPIN": "clickbtnConfirmarPIN",
      "click #btnEscolher": "clickbtnEscolher",
    },

    clickbtnEscolher: function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (testeID_Aux != 0) {
        if (tipoTesteSelecionado == 'texto') {
          if (Backbone.history.fragment != 'testeTexto') {
            utils.loader(function() {
              e.preventDefault();
              app.navigate('/testeTexto', {
                trigger: true
              });
            });
          }
        } else {
           if (Backbone.history.fragment != 'testeLista') {
           utils.loader(function() {
           e.preventDefault();
          app.navigate('/testeLista', {
            trigger: true
             });
             });
           }
        }
      }
    },


    clickbtnNavCorrecao: function(e) {
      e.stopPropagation();
      e.preventDefault();
      BtnNavPress = -3;
      $('#labelErr').text(""); //limpa campos
      $('#inputPIN').val(""); //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function(e) {
        $("#inputPIN").focus();
      });
    },


    clickbtnConfirmarPIN: function(e) {
      var pinDigitado = $('#inputPIN').val();
      var pinProfAux = window.localStorage.getItem("ProfSelecPIN");
      if (pinProfAux == pinDigitado) {
        $('#myModal').modal("hide");
        $('#myModal').on('hidden.bs.modal', function(e) {
          window.history.go(BtnNavPress);
        });
      } else {
        $('#inputPINErr').addClass("has-error");
        $('#labelErr').text("PIN errado!");
      }
    },


    clickbtnNavProf: function(e) {
      e.stopPropagation();
      e.preventDefault();
      BtnNavPress = -6;
      $('#labelErr').text(""); //limpa campos
      $('#inputPIN').val(""); //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function(e) {
        $("#inputPIN").focus();
      });
    },

    clickbtnNavAlu: function(e) {
      e.stopPropagation();
      e.preventDefault();
      BtnNavPress = -4;
      $('#labelErr').text(""); //limpa campos
      $('#inputPIN').val(""); //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function(e) {
        $("#inputPIN").focus();
      });
    },


    clickbtnNavINI: function(e) {
      e.stopPropagation();
      e.preventDefault();
      BtnNavPress = -8;
      $('#labelErr').text(""); //limpa campos
      $('#inputPIN').val(""); //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function(e) {
        $("#inputPIN").focus();
      });
    },


    clickBackButtonEscTest: function(e) {
      window.history.back();
    },

    render: function() {
      this.$el.html(template({}));
      return this;
    }

  });

});
