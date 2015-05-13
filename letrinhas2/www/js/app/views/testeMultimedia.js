define(function(require) {
  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/testeMultimedia.html'),
    template = _.template(janelas);

  return Backbone.View.extend({

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


    ConstruirJanela: function ConstruirJanela(IdtesteSelecionado, PerguntaMultiNext) {
      testes_local2.get(IdtesteSelecionado, function(err, testeDoc) {
        if (err) console.log(err);

        var testeDocPergunta = testeDoc.perguntas[PerguntaMultiNext];
        perguntas_local2.get(testeDocPergunta, {
          attachments: true
        }).then(function(perguntaDoc) {
          $('#titleTestePagina').text(perguntaDoc.titulo);
          $('#titlePerguntatxt').text(perguntaDoc.pergunta);
          $('#divTitulo').empty();
          $('#txtAreaConteud').empty();
          var $container2 = $('#divTitulo');
          var $containerCorpo = $('#txtAreaConteud');
          var construirJanela = "";
          if (perguntaDoc.conteudo.tipoDoCorpo == "texto") {
            construirJanela +=
              ' <div class="panel-heading"> ' + perguntaDoc.conteudo.corpo +
              '</div>';
          } else if (perguntaDoc.conteudo.tipoDoCorpo == "imagem") {
            construirJanela +=
              ' <div class="panel-heading"> <img src="data:image/png;base64,' + perguntaDoc._attachments['corpo.png'].data + '" style="height:200px;" /> ' +
              '</div>';
          } else if (perguntaDoc.conteudo.tipoDoCorpo == "audio") {
            construirJanela +=
              ' <div class="panel-heading">   <audio id="AudioPlayerProf" controls="controls"  style="width: 100%"></audio>' +
              '</div>';
          }


          var $exemp = $(construirJanela);
          $exemp.appendTo($container2);
          console.log(perguntaDoc);

          var tamanhoTotalOpc = perguntaDoc.conteudo.opcoes.length;
          var construirCorpo = "";
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
          console.log(sorteados2);

          for (var y = 0; y < tamanhoTotalOpc; y++) {

            if (tamanhoTotalOpc == 3)
              construirCorpo += '<div class="col-md-4">';
            else if (tamanhoTotalOpc == 2)
              construirCorpo += '<div class="col-md-6">';
            else if (tamanhoTotalOpc == 4)
              construirCorpo += '<div class="col-md-3">';

            if (perguntaDoc.conteudo.opcoes[y].tipo == "texto") { ////Se corpo for Texto
              construirCorpo += '<button id="op' + sorteados[y] + '" type="button" class="btn btn-info btn-lg btn-block fontEX_XS btn-opcao"> ' +
                perguntaDoc.conteudo.opcoes[sorteados[y]].conteudo + '</button></div>';
            } else if (perguntaDoc.conteudo.opcoes[y].tipo == "imagem") { ///Se corpo for Imagem
              var auxY = y + 1;
              construirCorpo += '<button id="op' + sorteados[y] + '" type="button" class="btn btn-info btn-lg btn-block btn-opcao"> ' +
                '<img id="imgOp' + auxY + '" src="data:image/png;base64,' + perguntaDoc._attachments['op' + sorteados2[y] + '.png'].data + '" style="height:150px;" class="pull-center"/></button></div>';
            }
          }

          var $exemp = $(construirCorpo);
          $exemp.appendTo($containerCorpo);

          if (perguntaDoc.conteudo.tipoDoCorpo == "audio") {
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

          $containerCorpo.on('click', '.btn-opcao', function(ev) {

            var $btn = $(this); // O jQuery passa o btn clicado pelo this
            var self = this;
            var a = parseInt(PerguntaMultiNext);
            var aux = a+1;

            console.log(testeDoc._id );
            window.localStorage.setItem("PerguntaMultiNext", aux); //enviar variavel
            window.localStorage.setItem("TesteTextArealizarID", testeDoc._id + ''); //enviar variavel
            if (testeDoc.perguntas.length != aux)
          {
            ConstruirJanela(testeDoc._id, aux);
          }
        //  window.history.go(0);
          else
          window.history.go(-1);

          });


        });



      });
    },

    events: {
      "click #BackButtonMO": "clickBackButtonMO",
    },



    clickBackButtonMO: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-1);
    },



    render: function() {
      this.$el.html(template({}));

      var self = this;
      this.TotalPalavas = 0;
      this.modelTrue = false;
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var alunoNome = window.localStorage.getItem("AlunoSelecNome");
      var turmaId = window.localStorage.getItem("TurmaSelecID");
      var turmaNome = window.localStorage.getItem("TurmaSelecNome");
      var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");
      var TesteTextArealizarID = window.localStorage.getItem("TesteTextArealizarID");
      var PerguntaMultiNext = window.localStorage.getItem("PerguntaMultiNext");



      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome + " - [ " + escolaNome + " ]");
        $('#imgProf').attr("src", url);
      });


      alunos_local2.getAttachment(alunoId, 'aluno.png', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeAluno').text("[" + turmaNome + " ] -- " + alunoNome);
        $('#imgAluno').attr("src", url);
      });

      self.ConstruirJanela(TesteTextArealizarID, PerguntaMultiNext);



      return this;
    }
  });
});
