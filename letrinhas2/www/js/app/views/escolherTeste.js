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
    countAuxBtn: 0,

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

    },

    GravarSOMfiles: function(name, data, success, fail) {
      var gotFileSystem = function(fileSystem) {
        fileSystem.root.getFile(name, {
          create: true,
          exclusive: false
        }, gotFileEntry, fail);
      };

      var gotFileEntry = function(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
      };

      var gotFileWriter = function(writer) {
        writer.onwrite = success;
        writer.onerror = fail;
        writer.write(data);
      };
      window.requestFileSystem(window.LocalFileSystem.PERSISTENT, data.length || 0, gotFileSystem, fail);
    },

    criarDemostracao: function(tipoTeste, perguntaDoc, totalPerguntas) {
      var self = this;
      var $container2 = $('#outputTestesConteudo');
      $container2.empty();

      perguntas_local2.get(perguntaDoc, {
        attachments: true
      }).then(function(testeDoc) {

        if (tipoTeste == 'Texto') { /////////////////////////////////////////TEXTO
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
        if (tipoTeste == 'Lista') { ////////////////////////////////////LISTAS/////
          var colum1 = "";
          var colum2 = "";
          var colum3 = "";
          for (var j = 0; j < testeDoc.conteudo.palavrasCL1.length; j++) {
            colum1 += testeDoc.conteudo.palavrasCL1[j] + "</p>";
          }
          for (var j = 0; j < testeDoc.conteudo.palavrasCL2.length; j++) {
            colum2 += testeDoc.conteudo.palavrasCL2[j] + "</p>";
          }
          for (var j = 0; j < testeDoc.conteudo.palavrasCL3.length; j++) {
            colum3 += testeDoc.conteudo.palavrasCL3[j] + "</p>";
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
        if (tipoTeste == 'Multimédia') { ////////////////////////////////////multimedia/////

          var construirJanela = '<div class="panel panel-primary">' +
            '<div class="panel-heading centerEX">' +
            '<h3 class="panel-title">' + testeDoc.titulo + ' - (Perguntas: ' + totalPerguntas + ')</h3>' +
            '</div><h4 class="centerEX">' + testeDoc.pergunta + '</h4>';

          if (testeDoc.conteudo.tipoDoCorpo == "texto") {
            construirJanela +=
              '<div class="panel-body fontEX2"><div class="panel panel-info centerEX">' +
              ' <div class="panel-heading"> ' + testeDoc.conteudo.corpo +
              '</div></div>';
          } else if (testeDoc.conteudo.tipoDoCorpo == "imagem") {
            construirJanela +=
              '<div class="panel-body fontEX2"><div class="panel panel-info centerEX">' +
              ' <div class="panel-heading"> <img style="height:150px;" src="data:image/jpg;base64,' + testeDoc._attachments['corpo.jpg'].data + '" style="width:75%;" /> ' +
              '</div></div>';
          } else if (testeDoc.conteudo.tipoDoCorpo == "audio") {
            construirJanela +=
              '<div class="panel-body fontEX2"><div class="panel panel-info centerEX">' +
              ' <div class="panel-heading">   <audio id="AudioPlayerProf" controls="controls"  style="width: 100%"></audio>' +
              '</div></div>';
          }
          construirJanela += '<div class="row centerEX">';

          var tamanhoTotalOpc = testeDoc.conteudo.opcoes.length;
          var sorteados = [];
          var valorMaximo = tamanhoTotalOpc;
          var valorMaximo2 = valorMaximo - 1;
          while (sorteados.length != valorMaximo) {
            var sugestao = Math.round(Math.random() * valorMaximo2); // Escolher um numero ao acaso
            while (sorteados.indexOf(sugestao) >= 0) { // Enquanto o numero já existir, escolher outro
              sugestao = Math.round(Math.random() * valorMaximo2);
            }
            sorteados.push(sugestao); // adicionar este numero à array de numeros sorteados para futura referência
          }

          var sorteados2 = [];
          var valorMaximo2 = tamanhoTotalOpc;
          while (sorteados2.length != valorMaximo2) {
            var sugestao2 = Math.ceil(Math.random() * valorMaximo2); // Escolher um numero ao acaso
            while (sorteados2.indexOf(sugestao2) >= 0) { // Enquanto o numero já existir, escolher outro
              sugestao2 = Math.ceil(Math.random() * valorMaximo2);
            }
            sorteados2.push(sugestao2); // adicionar este numero à array de numeros sorteados para futura referência
          }
          for (var y = 0; y < tamanhoTotalOpc; y++) {

            if (tamanhoTotalOpc == 3)
              construirJanela += '<div class="col-md-4">';
            else if (tamanhoTotalOpc == 2)
              construirJanela += '<div class="col-md-6">';
            else if (tamanhoTotalOpc == 4)
              construirJanela += '<div class="col-md-3">';

            if (testeDoc.conteudo.opcoes[y].tipo == "texto") {

              construirJanela += '<button type="button" class="btn btn-info btn-lg btn-block disabled"> ' +
                testeDoc.conteudo.opcoes[sorteados[y]].conteudo + '</button></div>';
            } else if (testeDoc.conteudo.opcoes[y].tipo == "imagem") {
              var auxY = y + 1;
              construirJanela += '<button type="button" style="height:150px;" class="btn btn-info btn-lg btn-block disabled"> ' +
                '<img id="imgOp' + auxY + '"  style="max-height:135px; max-width:135px" src="data:image/jpg;base64,' + testeDoc._attachments['op' + sorteados2[y] + '.jpg'].data + '" /></button></div>';
            }
          }

          construirJanela += '</div></div></div>';
          var $exemp = $(construirJanela);
          $container2.empty();
          $exemp.appendTo($container2);

          if (testeDoc.conteudo.tipoDoCorpo == "audio") {
            perguntas_local2.getAttachment(testeDoc._id, 'corpo.mp3', function(err2, mp3Aud) {
              if (err2) console.log(err2);
              self.GravarSOMfiles('corpo.mp3', mp3Aud, function() {
                console.log('FUNCIONA');
                $("#AudioPlayerProf").attr("src", cordova.file.dataDirectory + "/files/corpo.mp3")

              }, function(err) {
                console.log("DEU ERRO" + err);
              });
            });
          }

        }
        if (tipoTeste == 'Interpretação') { ////////////////////////////////////multimedia/////
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
      var $container = $('#outputTestes');
      var $btn = $('<h2> Sem resultados </h2>');
      $btn.appendTo($container); //Adiciona ao Div
      window.localStorage.setItem("TesteTextArealizarID", 'null'); //enviar variavel
      window.localStorage.setItem("nRepeticoes", 0);

      var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");
        self.countAuxBtn = 0;
      testes_local2.allDocs({
        include_docs: true,
        attachments: false
      }, function(err, testesDoc) {
        if (err) console.log(err);
        for (var i = 0; i < testesDoc.rows.length; i++) {

          var anoEsc = $("#DropDAno").text();
          if (anoEsc != "Todos") {
            if (testesDoc.rows[i].doc.estado == true &&
              testesDoc.rows[i].doc.anoEscolar == anoEsc &&
              testesDoc.rows[i].doc.disciplina == discplinaSelecionada &&
              testesDoc.rows[i].doc.tipo == tipoTeste) {
                self.criarBtneClickEventList(tipoTeste, testesDoc.rows[i].doc);
            }
          } else {
            if (testesDoc.rows[i].doc.estado == true &&
              testesDoc.rows[i].doc.disciplina == discplinaSelecionada &&
              testesDoc.rows[i].doc.tipo == tipoTeste) {
                self.criarBtneClickEventList(tipoTeste, testesDoc.rows[i].doc);
            }
          }
        }
      });
    },

    criarBtneClickEventList: function(tipoTeste, TestDoc) {
      var self = this;
      var $container = $('#outputTestes');
      if (self.countAuxBtn == 0) {
        $('#outputTestes').empty();
        self.countAuxBtn = 1;
      }
      var img;
      if (tipoTeste == "Texto")
        img = "testeTexto"
      if (tipoTeste == "Lista")
        img = "testLista"
      if (tipoTeste == "Multimédia")
        img = "testMul"
      if (tipoTeste == "Interpretação")
        img = "testInterpretacao"
      var $btn = $(
        '<button id="' + TestDoc._id + '"  name="' + TestDoc.perguntas[0] + '" value="' + TestDoc.perguntas.length + '" type="button" style="height:62px; text-align: left;" class="btn btn-lg btn-block btn-teste activeXF" >' +
        ' &nbsp;&nbsp;&nbsp;&nbsp;<img src="img/' + img + '.png"  style="height:32px;" > ' +
        TestDoc.titulo + '</button>');
      $btn.appendTo($container); //Adiciona ao Div
      ///////////////////////click event////////////
      $("#" + TestDoc._id).click(function() {
        var $btn = $(this); // O jQuery passa o btn clicado pelo this

        if (self.btns != null) {
          self.btns.removeClass("btn-primary");
          self.btns.addClass("activeXF");
        }
        self.btns = $(this);
        $(this).removeClass("activeXF");
        $(this).addClass("btn-primary");
        window.localStorage.setItem("TesteTextArealizarID", $btn[0].id + ''); //enviar variavel
        window.localStorage.setItem("nRepeticoes", 0);
        self.criarDemostracao(tipoTeste, $btn[0].name, $btn[0].value );
      });
      //Selecionar o 1º Item
      if (self.ponteiro == null) {
        $('#' + TestDoc._id).click();
        self.ponteiro = true;
      }
    },

      pesquisarEcriarBTN: function(pesquisa) {
        var self = this;
        $('#outputTestes').empty();
        var $container = $('#outputTestes');
        var $btn = $('<h2> Sem resultados </h2>');
        var tipoTeste = self.tipoTesteSelecionado;
        $btn.appendTo($container); //Adiciona ao Div
        window.localStorage.setItem("TesteTextArealizarID", 'null'); //enviar variavel
        window.localStorage.setItem("nRepeticoes", 0);

        var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");
        self.countAuxBtn = 0;
          testes_local2.search({
          query: pesquisa,
          fields: ['titulo'],
          include_docs: true,
        }).then(function(testesDoc) {
          for (var i = 0; i < testesDoc.rows.length; i++) {
            console.log(testesDoc.rows[i].doc.perguntas[0]);
            var anoEsc = $("#DropDAno").text();
            if (anoEsc != "Todos") {
              if (testesDoc.rows[i].doc.estado == true &&
                testesDoc.rows[i].doc.anoEscolar == anoEsc &&
                testesDoc.rows[i].doc.disciplina == discplinaSelecionada &&
                testesDoc.rows[i].doc.tipo == tipoTeste) {
                  self.criarBtneClickEventList(tipoTeste, testesDoc.rows[i].doc);
              }
            } else {
              if (testesDoc.rows[i].doc.estado == true &&
                testesDoc.rows[i].doc.disciplina == discplinaSelecionada &&
                testesDoc.rows[i].doc.tipo == tipoTeste) {
                  self.criarBtneClickEventList(tipoTeste, testesDoc.rows[i].doc);
              }
            }
          }
        }).catch(function() {
          // console.log(err);
          // handle error
        });
      },

    selecionarTipoTesteColor: function(tipoTeste) {
      $('#btnTesteLeituraMultimedia').removeClass("btn-primary");
      $('#btnTesteLeituraMultimedia').addClass("activeXF");
      $('#btnTesteLeituraPalav').removeClass("btn-primary");
      $('#btnTesteLeituraPalav').addClass("activeXF");
      $('#btnTesteLeituraTextos').removeClass("btn-primary");
      $('#btnTesteLeituraTextos').addClass("activeXF");
      $('#btnTesteLeituraInterpretacao').removeClass("btn-primary");
      $('#btnTesteLeituraInterpretacao').addClass("activeXF");

      if (tipoTeste == "Interpretação") {
        $('#btnTesteLeituraInterpretacao').removeClass("activeXF");
        $('#btnTesteLeituraInterpretacao').addClass("btn-primary");
      }
      if (tipoTeste == "Multimédia") {
        $('#btnTesteLeituraMultimedia').removeClass("activeXF");
        $('#btnTesteLeituraMultimedia').addClass("btn-primary");
      }
      if (tipoTeste == "Texto") {
        $('#btnTesteLeituraTextos').removeClass("activeXF");
        $('#btnTesteLeituraTextos').addClass("btn-primary");
      }
      if (tipoTeste == "Lista") {
        $('#btnTesteLeituraPalav').removeClass("activeXF");
        $('#btnTesteLeituraPalav').addClass("btn-primary");
      }
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
      "click #btnPesquisar": "clickbtnPesquisar",
    },

    clickbtnPesquisar: function(e) {
      var self = this;
      var pesquisa = $('#txtBoxPesquisa').val();
      if (pesquisa != "") {
        self.ponteiro = null;
        self.pesquisarEcriarBTN(pesquisa);
      }
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
      self.ponteiro = null;
      $('#outputTestes').empty();
      $('#outputTestesConteudo').empty();
      self.tipoTesteSelecionado = "Lista";
      self.selecionarTipoTesteColor("Lista");
      self.mostrarListaTestes("Lista");
      $('#txtBoxPesquisa').val("");
      $("#btnPesquisar").removeClass("disabled");
    },

    clickbtnTesteLeituraTextos: function(e) {
      var self = this;
      self.ponteiro = null;
      $('#outputTestes').empty();
      $('#outputTestesConteudo').empty();
      self.tipoTesteSelecionado = "Texto";
      self.selecionarTipoTesteColor("Texto");
      self.mostrarListaTestes("Texto");
      $('#txtBoxPesquisa').val("");
      $("#btnPesquisar").removeClass("disabled");
    },

    clickbtnTesteLeituraMultimedia: function(e) {
      var self = this;
      self.ponteiro = null;
      $('#btnTesteLeituraMultimedia').removeClass("activeXF");
      $('#btnTesteLeituraMultimedia').addClass("btn-primary");
      $('#outputTestes').empty();
      $('#outputTestesConteudo').empty();
      self.tipoTesteSelecionado = "Multimédia";
      self.selecionarTipoTesteColor("Multimédia");
      self.mostrarListaTestes("Multimédia");
      $('#txtBoxPesquisa').val("");
      $("#btnPesquisar").removeClass("disabled");
    },

    clickbtnTesteLeituraInterpretacao: function(e) {
      var self = this;
      self.ponteiro = null;
      $('#outputTestes').empty();
      $('#outputTestesConteudo').empty();
      self.tipoTesteSelecionado = "Interpretação";
      self.selecionarTipoTesteColor("Interpretação");
      self.mostrarListaTestes("Interpretação");
      $('#txtBoxPesquisa').val("");
      $("#btnPesquisar").removeClass("disabled");
    },


    clickbtnEscolher: function(e) {
      var self = this;
      e.stopPropagation();
      e.preventDefault();
      console.log(self.tipoTesteSelecionado);
      if (window.localStorage.getItem("TesteTextArealizarID") != "null")
        if (self.tipoTesteSelecionado == 'Texto') {
          if (Backbone.history.fragment != 'testeTexto') {
            utils.loader(function() {
              e.preventDefault();
              app.navigate('/testeTexto', {
                trigger: true
              });
            });
          }
        } else if (self.tipoTesteSelecionado == 'Lista') {
        if (Backbone.history.fragment != 'testeLista') {
          utils.loader(function() {
            e.preventDefault();
            app.navigate('/testeLista', {
              trigger: true
            });
          });
        }
      } else if (self.tipoTesteSelecionado == 'Interpretação') {
        if (Backbone.history.fragment != 'testeInterpretacao') {
          utils.loader(function() {
            e.preventDefault();
            app.navigate('/testeInterpretacao', {
              trigger: true
            });
          });
        }
      } else if (self.tipoTesteSelecionado == 'Multimédia') {
        if (Backbone.history.fragment != 'testeMultimedia') {
          utils.loader(function() {
            e.preventDefault();
            app.navigate('/testeMultimedia', {
              trigger: true
            });
          });
        }
      }
    },

    clickBackButtonEscTest: function(e) {
      window.history.back();
    },

    render: function() {
      this.$el.html(template({}));
      var self = this;
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
      professores_local2.getAttachment(profId, 'prof.jpg', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);

        $('#titleBarlb').text("Escolher Teste de: " + discplinaSelecionada);
        if (discplinaSelecionada == 'Português') {
          $('#imgDisciplinaIcon').attr("src", "img/portugues.png");
        }
        if (discplinaSelecionada == 'Matemática') {
          $('#imgDisciplinaIcon').attr("src", "img/mate.png");
        }
        if (discplinaSelecionada == 'Estudo do Meio') {
          $('#imgDisciplinaIcon').attr("src", "img/estudoMeio.png");
        }
        if (discplinaSelecionada == 'Inglês') {
          $('#imgDisciplinaIcon').attr("src", "img/ingles.png");
        }
        if (discplinaSelecionada == 'Outro') {
          $('#imgDisciplinaIcon').attr("src", "img/outro.png");
        }
        $('#lbNomeProf').text(profNome + " - [ " + escolaNome + " ]");
        $('#imgProf').attr("src", url);
      });



      alunos_local2.getAttachment(alunoId, 'aluno.jpg', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeAluno').text("[" + turmaNome + " ] -- " + alunoNome);
        $('#imgAluno').attr("src", url);
        $("#btnPesquisar").addClass("disabled");

        $("#DropDAno").text("Todos");
        $("#DropDAno").val("Todos");
        $(".dropdown-menu li a").click(function() {
          $("#DropDAno").text($(this).text());
          $("#DropDAno").val($(this).text());
          self.ponteiro = null;
          $('#outputTestes').empty();
          $('#outputTestesConteudo').empty();
          self.mostrarListaTestes(self.tipoTesteSelecionado);
        });
      });



      return this;
    }

  });

});
