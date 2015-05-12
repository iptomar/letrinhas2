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

    criarDemostracao: function(tipoTeste, perguntaDoc) {
      var self = this;
      var $container2 = $('#outputTestesConteudo');
      $container2.empty();
      perguntas_local2.get(perguntaDoc,{attachments: true}).then(function (testeDoc) {

        console.log(testeDoc);
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
          var construirJanela = '<div class="panel panel-primary">' +
            '<div class="panel-heading centerEX">' +
            '<h3 class="panel-title">' + testeDoc.titulo + '</h3>' +
            '</div>';

          if (testeDoc.conteudo.tipoDoCorpo == "texto") {
            construirJanela +=
              '<div class="panel-body fontEX2"><div class="panel panel-info centerEX">' +
              ' <div class="panel-heading"> ' + testeDoc.conteudo.corpo +
              '</div></div>';
          } else if (testeDoc.conteudo.tipoDoCorpo == "imagem") {
            construirJanela +=
              '<div class="panel-body fontEX2"><div class="panel panel-info centerEX">' +
              ' <div class="panel-heading"> <img src="data:image/png;base64,' + testeDoc._attachments['corpo.png'].data + '" style="height:150px;" /> ' +
              '</div></div>';
        } else if (testeDoc.conteudo.tipoDoCorpo == "audio") {
          construirJanela +=
            '<div class="panel-body fontEX2"><div class="panel panel-info centerEX">' +
            ' <div class="panel-heading">   <audio id="AudioPlayerProf" controls="controls"  style="width: 100%"></audio>' +
            '</div></div>';
        }
          construirJanela += '<div class="row centerEX">';

          //
          var  tamanhoTotalOpc = testeDoc.conteudo.opcoes.length;


          var sorteados = [];
          var valorMaximo = tamanhoTotalOpc;
          var valorMaximo2 = valorMaximo-1;
              while (sorteados.length != valorMaximo) {
              var sugestao = Math.round(Math.random() * valorMaximo2); // Escolher um numero ao acaso
              while (sorteados.indexOf(sugestao) >= 0) {  // Enquanto o numero já existir, escolher outro
                  sugestao = Math.round(Math.random() * valorMaximo2);
              }
              sorteados.push(sugestao); // adicionar este numero à array de numeros sorteados para futura referência
            }

            var sorteados2 = [];
            var valorMaximo2 = tamanhoTotalOpc;
                while (sorteados2.length != valorMaximo2) {
                var sugestao2 = Math.ceil(Math.random() * valorMaximo2); // Escolher um numero ao acaso
                while (sorteados2.indexOf(sugestao2) >= 0) {  // Enquanto o numero já existir, escolher outro
                    sugestao2 = Math.ceil(Math.random() * valorMaximo2);
                }
                sorteados2.push(sugestao2); // adicionar este numero à array de numeros sorteados para futura referência
              }
              console.log(sorteados2);

          for (var y = 0; y < tamanhoTotalOpc; y++) {

            if(tamanhoTotalOpc == 3)
            construirJanela += '<div class="col-md-4">';
            else  if(tamanhoTotalOpc == 2)
            construirJanela += '<div class="col-md-6">';
            else  if(tamanhoTotalOpc == 4)
            construirJanela += '<div class="col-md-3">';

            if (testeDoc.conteudo.opcoes[y].tipo == "texto") {

             construirJanela += '<button type="button" class="btn btn-info btn-lg btn-block disabled"> ' +
                testeDoc.conteudo.opcoes[sorteados[y]].conteudo + '</button></div>';
            } else if (testeDoc.conteudo.opcoes[y].tipo == "imagem") {
              var auxY = y + 1;
              construirJanela += '<button type="button" class="btn btn-info btn-lg btn-block disabled"> ' +
                '<img id="imgOp' + auxY + '" src="data:image/png;base64,' + testeDoc._attachments['op'+sorteados2[y]+'.png'].data + '" style="height:120px;" class="pull-center"/></button></div>';
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

      function obtemDadosParaRow(disciplinaSelecionada, i, perguntaSelc) {
        return function(errx, perguntaDoc) {
          if (errx) {
            console.log(errx);
          }
          if (disciplinaSelecionada == perguntaDoc.disciplina && perguntaDoc.tipoTeste == tipoTeste) {

            if (self.ponteiro == null)
              self.ponteiro = perguntaSelc.id;

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
              window.localStorage.setItem("PerguntaMultiNext", 0); //enviar variavel
              self.criarDemostracao(tipoTeste, $btn[0].name);
            });

            //Selecionar o 1º Item
            $('#' + self.ponteiro).click();
          }
        };
      }
    },


    pesquisarEcriarBTN: function(pesquisa) {
      var self = this
      $('#outputTestes').empty();
      $('#outputTestesConteudo').empty();
      var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");
      var tipoTeste = self.tipoTesteSelecionado;

      testes_local2.search({
        query: pesquisa,
        fields: ['titulo'],
        include_docs: true
      }).then(function(testesDoc) {

        for (var i = 0; i < testesDoc.rows.length; i++) {
          var perguntaSelc = testesDoc.rows[i].doc.perguntas[0];
          console.log(perguntaSelc);
          perguntas_local2.get(perguntaSelc, obtemDadosParaRow(discplinaSelecionada, i, testesDoc.rows[i]));
        }


      }).catch(function(err) {
        console.log(err);
        // handle error
      });

      function obtemDadosParaRow(disciplinaSelecionada, i, perguntaSelc) {
        return function(errx, perguntaDoc) {
          if (errx) {
            console.log(errx);
          }

          if (disciplinaSelecionada == perguntaDoc.disciplina && perguntaDoc.tipoTeste == tipoTeste) {
            if (self.ponteiro == null)
              self.ponteiro = perguntaSelc.id;

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
              window.localStorage.setItem("PerguntaMultiNext", 0); //enviar variavel
              window.localStorage.setItem("TesteTextArealizarID", $btn[0].id + ''); //enviar variavel
              self.criarDemostracao(tipoTeste, $btn[0].name);
            });
            console.log("a");
            //Selecionar o 1º Item
            $('#' + self.ponteiro).click();
          }
        };
      }
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

      if (tipoTeste == "interpretacao") {
        $('#btnTesteLeituraInterpretacao').removeClass("activeXF");
        $('#btnTesteLeituraInterpretacao').addClass("btn-primary");
      }
      if (tipoTeste == "multimedia") {
        $('#btnTesteLeituraMultimedia').removeClass("activeXF");
        $('#btnTesteLeituraMultimedia').addClass("btn-primary");
      }
      if (tipoTeste == "texto") {
        $('#btnTesteLeituraTextos').removeClass("activeXF");
        $('#btnTesteLeituraTextos').addClass("btn-primary");
      }
      if (tipoTeste == "palavras") {
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
      if (pesquisa != "")
        self.pesquisarEcriarBTN(pesquisa);
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
      self.tipoTesteSelecionado = "palavras";
      self.selecionarTipoTesteColor("palavras");
      self.mostrarListaTestes("palavras");
    },

    clickbtnTesteLeituraTextos: function(e) {
      var self = this;
      self.ponteiro = null;
      $('#outputTestes').empty();
      $('#outputTestesConteudo').empty();
      self.tipoTesteSelecionado = "texto";
      self.selecionarTipoTesteColor("texto");
      self.mostrarListaTestes("texto");
    },

    clickbtnTesteLeituraMultimedia: function(e) {
      var self = this;
      self.ponteiro = null;
      $('#btnTesteLeituraMultimedia').removeClass("activeXF");
      $('#btnTesteLeituraMultimedia').addClass("btn-primary");
      $('#outputTestes').empty();
      $('#outputTestesConteudo').empty();
      self.tipoTesteSelecionado = "multimedia";
      self.selecionarTipoTesteColor("multimedia");
      self.mostrarListaTestes("multimedia");
    },

    clickbtnTesteLeituraInterpretacao: function(e) {
      var self = this;
      self.ponteiro = null;
      $('#outputTestes').empty();
      $('#outputTestesConteudo').empty();
      self.tipoTesteSelecionado = "interpretacao";
      self.selecionarTipoTesteColor("interpretacao");
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
      } else if (self.tipoTesteSelecionado == 'multimedia') {
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
        $('#lbNomeProf').text(profNome + " - [ " + escolaNome + " ]");
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
