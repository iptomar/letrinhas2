define(function(require) {

  var BtnNavPress;
  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherTeste.html'),
    template = _.template(janelas);

  return Backbone.View.extend({
    ponteiro: null,
    btns: null,
    tipoTesteSelecionado: null,
    BtnNavPress: 0,

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

    },

    criarDemostracao: function(tipoTeste, perguntaDoc) {
      var $container2 = $('#outputTestesConteudo');
      $container2.empty();
      perguntas_local2.get(perguntaDoc, function(err, testeDoc) {
        if (err) console.log(err);
        if (tipoTeste == 'texto') { /////////////////////////////////////////TEXTO
          var txtAux = testeDoc.conteudo.texto;
          var $exemp = $(
            '<div class="panel panel-primary">' +
            '<div class="panel-heading centerEX">' +
            '<h3 class="panel-title">' + testeDoc.titulo + '</h3>' +
            '</div>' +
            '<div class="panel-body fontEX2">' +
            txtAux.replace(/\n/g, '</br>') +
            '</div></div>');
          $container2.empty();
          $exemp.appendTo($container2);
        }
        if (tipoTeste == 'palavras') { ////////////////////////////////////LISTAS/////
          var colum1 = "";
          var colum2 = "";
          var colum3 = "";
          for (var j = 0; j < testeDoc.conteudo.palavrasCl1.length; j++) {
            colum1 += testeDoc.conteudo.palavrasCl1[j] + "</p>";
          }
          for (var j = 0; j < testeDoc.conteudo.palavrasCl2.length; j++) {
            colum2 += testeDoc.conteudo.palavrasCl2[j] + "</p>";
          }
          for (var j = 0; j < testeDoc.conteudo.palavrasCl3.length; j++) {
            colum3 += testeDoc.conteudo.palavrasCl3[j] + "</p>";
          }
          var $exemp = $(
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
          $exemp.appendTo($container2);
        }
        if (tipoTeste == 'multimedia') { ////////////////////////////////////multimedia/////
          var $exemp = $(
            '<div class="panel panel-primary">' +
            '<div class="panel-heading centerEX">' +
            '<h3 class="panel-title">NÃO IMPLEMENTADO</h3>' +
            '</div>' +
            '<div class="panel-body fontEX2">NÃO IMPLEMENTADO.... </div></div>');
          $container2.empty();
          $exemp.appendTo($container2);
        }
        if (tipoTeste == 'interpretacao') { ////////////////////////////////////multimedia/////
          var txtAux = testeDoc.conteudo.texto;
          var $exemp = $(
            '<div class="panel panel-primary">' +
            '<div class="panel-heading centerEX">' +
            '<h3 class="panel-title">' + testeDoc.titulo + '</h3>' +
            '</div>' +
            '<div class="panel-body fontEX2">' + '<h4 class="panel-title centerEX" style="color: #00006B;">-[ ' + testeDoc.pergunta + ' ]-</h4></br>' +
            txtAux.replace(/\n/g, '</br>') +
            '</div></div>');
          $container2.empty();
          $exemp.appendTo($container2);
        }
      });
    },


    mostrarListaTestes: function(tipoTeste) {
      var self = this;
      $('#outputTestes').empty();
      var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");

      function obtemDadosParaRow(disciplinaSelecionada, i, perguntaSelc) {
        return function(errx, perguntaDoc) {
          if (errx) {
            console.log(errx);
          }

          if (disciplinaSelecionada == perguntaDoc.disciplina && perguntaDoc.tipoTeste == tipoTeste) {
            if (ponteiro == null)
              ponteiro = perguntaSelc.id;

            var $container = $('#outputTestes');
            var img;
            if (tipoTeste == "texto")
              img = "testeTexto"
            if (tipoTeste == "palavras")
              img = "testLista"
            if (tipoTeste == "multimedia")
              img = "testMul"
            if (tipoTeste == "interpretacao")
              img = "testInterpretacao"

            var $btn = $(
              '<button id="' + perguntaSelc.id + '"  name="' + perguntaDoc._id + '"  type="button" style="height:62px;"" class="btn btn-lg btn-block btn-teste activeXF " >' +
              ' <img src="img/' + img + '.png"  style="height:32px;" > ' +
              perguntaSelc.doc.titulo + '</button>');
            $btn.appendTo($container); //Adiciona ao Div

            $("#" + perguntaSelc.id).click(function() {
              var $btn = $(this); // O jQuery passa o btn clicado pelo this

              if (self.btns != null) {
                self.btns.removeClass("btn-primary");
                self.btns.addClass("activeXF");
              }
              self.btns = $(this);
              $(this).removeClass("activeXF");
              $(this).addClass("btn-primary");
              window.localStorage.setItem("TesteTextArealizarID", $btn[0].id + ''); //enviar variavel
              self.criarDemostracao(tipoTeste, $btn[0].name);
            });

            //Selecionar o 1º Item
            $('#' + ponteiro).click();
          }
        };
      }

      testes_local2.allDocs({
        include_docs: true,
        attachments: false
      }, function(err, testesDoc) {
        if (err) console.log(err);
        for (var i = 0; i < testesDoc.rows.length; i++) {
          var perguntaSelc = testesDoc.rows[i].doc.perguntas[0];
          perguntas_local2.get(perguntaSelc, obtemDadosParaRow(discplinaSelecionada, i, testesDoc.rows[i]));
        }
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
      "click #btnTesteLeituraPalav": "clickbtnTesteLeituraPalav",
      "click #btnTesteLeituraTextos": "clickbtnTesteLeituraTextos",
      "click #btnTesteLeituraMultimedia": "clickbtnTesteLeituraMultimedia",
      "click #btnTesteLeituraInterpretacao": "clickbtnTesteLeituraInterpretacao",

      "click #btnNavINI": "clickbtnNavINI",
      "click #btnNavDisci": "clickbtnNavDisci",
      "click #btnNavMenu": "clickbtnNavMenu",
      "click #btnNavTurmas": "clickbtnNavTurmas",
      "click #btnNavAlunos": "clickbtnNavAlunos",

    },

    clickbtnNavAlunos: function(e) {
      var self = this;
      e.stopPropagation();
      e.preventDefault();
      self.BtnNavPress = -1;
      $('#labelErr').text(""); //limpa campos
      $('#inputPIN').val(""); //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function(e) {
        $("#inputPIN").focus();
      });
    },


    clickbtnNavTurmas: function(e) {
      var self = this;
      e.stopPropagation();
      e.preventDefault();
      self.BtnNavPress = -2;
      $('#labelErr').text(""); //limpa campos
      $('#inputPIN').val(""); //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function(e) {
        $("#inputPIN").focus();
      });
    },

    clickbtnNavMenu: function(e) {
      var self = this;
      e.stopPropagation();
      e.preventDefault();
      self.BtnNavPress = -3;
      $('#labelErr').text(""); //limpa campos
      $('#inputPIN').val(""); //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function(e) {
        $("#inputPIN").focus();
      });
    },

    clickbtnNavDisci: function(e) {
      var self = this;
      e.stopPropagation();
      e.preventDefault();
      self.BtnNavPress = -4;
      $('#labelErr').text(""); //limpa campos
      $('#inputPIN').val(""); //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function(e) {
        $("#inputPIN").focus();
      });
    },


    clickbtnNavINI: function(e) {
      var self = this;
      e.stopPropagation();
      e.preventDefault();
      self.BtnNavPress = -5;
      $('#labelErr').text(""); //limpa campos
      $('#inputPIN').val(""); //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function(e) {
        $("#inputPIN").focus();
      });
    },


    clickbtnConfirmarPIN: function(e) {
      var self = this;
      var pinDigitado = $('#inputPIN').val();
      var pinProfAux = window.localStorage.getItem("ProfSelecPIN");
      if (pinProfAux == pinDigitado) {
        $('#myModal').modal("hide");
        $('#myModal').on('hidden.bs.modal', function(e) {
          window.history.go(self.BtnNavPress);
        });
      } else {
        $('#inputPINErr').addClass("has-error");
        $('#labelErr').text("PIN errado!");
      }
    },

    clickbtnTesteLeituraPalav: function(e) {
      var self = this;
      ponteiro = null;
      $('#outputTestes').empty();
      $('#outputTestesConteudo').empty();
      self.tipoTesteSelecionado = "palavras";
      self.mostrarListaTestes("palavras");
    },

    clickbtnTesteLeituraTextos: function(e) {
      var self = this;
      ponteiro = null;
      $('#outputTestes').empty();
      $('#outputTestesConteudo').empty();
      self.tipoTesteSelecionado = "texto";
      self.mostrarListaTestes("texto");
    },

    clickbtnTesteLeituraMultimedia: function(e) {
      var self = this;
      ponteiro = null;
      $('#outputTestes').empty();
      $('#outputTestesConteudo').empty();
      self.tipoTesteSelecionado = "multimedia";
      self.mostrarListaTestes("multimedia");
    },

    clickbtnTesteLeituraInterpretacao: function(e) {
      var self = this;
      ponteiro = null;
      $('#outputTestes').empty();
      $('#outputTestesConteudo').empty();
      self.tipoTesteSelecionado = "interpretacao";
      self.mostrarListaTestes("interpretacao");
    },


    clickbtnEscolher: function(e) {
      var self = this;
      e.stopPropagation();
      e.preventDefault();
      console.log(self.tipoTesteSelecionado);

      if (self.tipoTesteSelecionado == 'texto') {
        if (Backbone.history.fragment != 'testeTexto') {
          utils.loader(function() {
            e.preventDefault();
            app.navigate('/testeTexto', {
              trigger: true
            });
          });
        }
      } else if (self.tipoTesteSelecionado == 'palavras') {
        if (Backbone.history.fragment != 'testeLista') {
          utils.loader(function() {
            e.preventDefault();
            app.navigate('/testeLista', {
              trigger: true
            });
          });
        }
      } else if (self.tipoTesteSelecionado == 'interpretacao') {
        if (Backbone.history.fragment != 'testeInterpretacao') {
          utils.loader(function() {
            e.preventDefault();
            app.navigate('/testeInterpretacao', {
              trigger: true
            });
          });
        }
      } else {



      }

      //    if (Backbone.history.fragment != 'testeLista') {
      //    utils.loader(function() {
      //    e.preventDefault();
      //    app.navigate('/testeLista', {
      //      trigger: true
      //    });
      //    });
      //  }

    },

    clickBackButtonEscTest: function(e) {
      window.history.back();
    },

    render: function() {
      this.$el.html(template({}));

      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var alunoNome = window.localStorage.getItem("AlunoSelecNome");
      var turmaId = window.localStorage.getItem("TurmaSelecID");
      var turmaNome = window.localStorage.getItem("TurmaSelecNome");
      var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");



      testeID_Aux = false;
      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);

        if (discplinaSelecionada == '1') {
          $('#titleBarlb').text("Escolher Teste de: Português");
          $('#imgDisciplinaIcon').attr("src", "img/portugues.png");
        }
        if (discplinaSelecionada == '2') {
          $('#titleBarlb').text("Escolher Teste de: Matemática");
          $('#imgDisciplinaIcon').attr("src", "img/mate.png");
        }
        if (discplinaSelecionada == '3') {
          $('#titleBarlb').text("Escolher Teste de: Estudo do Meio");
          $('#imgDisciplinaIcon').attr("src", "img/estudoMeio.png");
        }
        if (discplinaSelecionada == '4') {
          $('#titleBarlb').text("Escolher Teste de: Inglês");
          $('#imgDisciplinaIcon').attr("src", "img/ingles.png");
        }

        $('#lbNomeProf').text(profNome + " - [ " +escolaNome+" ]");
        $('#imgProf').attr("src", url);
      });


      alunos_local2.getAttachment(alunoId, 'aluno.png', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeAluno').text("[" + turmaNome + " ] -- " + alunoNome);
        $('#imgAluno').attr("src", url);
      });


      return this;
    }

  });

});
