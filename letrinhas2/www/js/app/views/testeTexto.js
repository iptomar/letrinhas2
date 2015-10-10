define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/testeTexto.html'),
    template = _.template(janelas);

  return Backbone.View.extend({
    modelTrue: false,  ///Se algum model esta visivel
    TotalPalavas: 0,  ///Total de palavras de um teste
    idPergunta: null, ///id da pergunta do teste em questao
    legendas: null,
    timeouts: null,
    timeoutsX: null,

    /////// Funcao executada no inicio de load da janela ////////////
    initialize: function() {

    },

    /////// Vai ler o ficheiro de audio e Inseire na bd A resolucao do teste////////////
    LerficheiroGravacaoEins: function() {
      var self = this;
      window.resolveLocalFileSystemURL("file:///sdcard/gravacao1.amr",
        function(fileEntry) {
          console.log(fileEntry);
          fileEntry.file(
            function(file) {
              var agora = new Date();
              var TesteTextArealizarID = window.localStorage.getItem("TesteTextArealizarID");
              var alunoId = window.localStorage.getItem("AlunoSelecID");
              var profId = window.localStorage.getItem("ProfSelecID");
              var resolucao = {
                'id_Teste': TesteTextArealizarID,
                'id_Aluno': alunoId,
                'id_Prof': profId,
                'tipoCorrecao': 'Texto',
                'nota': '-1',
                'respostas': [],
                'dataReso': agora,
                'observ': null,
              };
              resolucao.respostas.push({
                'idPergunta': self.idPergunta,
                'TotalPalavras': self.TotalPalavas,
                'correcao': [],
              });
              resolucoes_local2.post(resolucao, function(err, response) {
                if (err) {
                  console.log('Resolucao ' + err + ' erro');
                } else {
                  resolucoes_local2.putAttachment(response.id, 'gravacao.amr', response.rev, file, 'audio/amr', function(err, res) {
                    if (!err) {
                      console.log('Anexo  inserted: ' + response.id);
                    } else {
                      console.log('anexo ' + err + ' erro');
                    }
                  });
                  console.log('Resolucao ' + response.id + ' inserido!');
                }
              });
            },
            function(e) {
              console.log("FileSystem Error:" + e);
            });
        },
        function(e) {
          console.log("FileSystem Error:" + e);
        });
    },

    //////////// GRAVAR SOM VINDO DA BD E PASSAR PARA O PLAYER DE AUDIO /////////////////
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

    ////Gravar audio para o sdcard com ajuda do cordova
    recordAudioForSD: function() {
      var src = "gravacao1.amr";
      this.mediaRec = new Media(src,
        function() {},
        // error callback
        function(err) {
          alert("Audio Error: " + err.code);
        }
      );
      // Record audio
      this.mediaRec.startRecord();
    },

    ////Para o player de audio
    StopRecorder: function() {
      this.mediaRec.stopRecord();
      this.mediaRec.release();
    },

      ////Evento para o botao fisico retroceder
    onBackKeyDowns: function() {
      if (this.modelTrue == false)
        $('#labelErr').text(""); //limpa campos
      $('#inputPIN').val(""); //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModalProf').modal("show");
      $('#myModalProf').on('shown.bs.modal', function(e) {
        $("#inputPIN").focus();
      });
    },

    //Eventos Click
    events: {
      "click #BackButtonTTexto": "clickBackButtonTTexto",
      "click #btnRec": "clickbtnRec",
      "click #btnFinalizar": "clickbtnFinalizar",
      "click #btnConfirmarPIN": "clickbtnConfirmarPIN",
      "click #btnConfirmarSUB": "clickbtnConfirmarSUB",
      "click #btnDemonstracao": "clickbtnDemonstracao",
      "click #btnParar1": "clickbtnParar1",
      "click #btnParar2": "clickbtnParar2",
      "click #btnOuvirme": "clickbtnOuvirme",
      "click #btnConfirmarSUBGrav": "clickbtnConfirmarSUBGrav",
    },

    ///Evento botao Confirmar submissao
    clickbtnConfirmarSUBGrav: function(e) {
      $('#myModalSUBGravar').modal("hide");
      $('#btnDemonstracao').hide();
      $('#btnFinalizar').hide();
      $('#btnOuvirme').hide();
      $('#AudioPlayerProf').prop('controls', false);
      $('#AudioPlayerProf').trigger('pause');
      $('#AudioPlayerProf').prop("currentTime", 0);
      $('#btnRec').removeClass("btn-primary"); //limpa campos
      $('#btnRec').removeClass("btn-success"); //limpa campos
      $('#btnRec').addClass("btn-danger"); //limpa campos
      $('#btnRec').html("<span class='glyphicon glyphicon glyphicon-stop' ></span> Parar");
      this.mediaRec = null;
      this.recordAudioForSD();
    },

  ///legendas
    mudaPalavra: function(palavra) {
      return function() {
        var aux1 = parseInt(palavra) - 1;
        var aux2 = parseInt(palavra) + 1;
        $('#sp' + aux1).css("background-color", "#FFCC99");
        $('#sp' + palavra).css("background-color", "#FFCC99");
        $('#sp' + aux2).css("background-color", "#FFCC99");
      }
    },

    ///Evento botao tocar demonstracao
    clickbtnDemonstracao: function(e) {
      var self = this;
      $('#div1').hide();
      $('#div2').show();
       $("#AudioPlayerProf").trigger('play');
    },

  ///Evento botao parar reprod audio Prof
    clickbtnParar1: function(e) {
      var self = this;
      $("#AudioPlayerProf").trigger('pause');
      $('#div2').hide();
      $('#div1').show();
    },

    ///Evento botao parar reprod audio aluno
    clickbtnParar2: function(e) {
      $("#AudioPlayerAluno").trigger('pause');
      $('#div3').hide();
      $('#div1').show();
    },

    clickbtnOuvirme: function(e) {
      $('#div1').hide();
      $('#div3').show();
      $("#AudioPlayerAluno").prop("currentTime", 0);
      $("#AudioPlayerAluno").trigger('play');
    },

    ///Evento botao confirmar pin do prof
    clickbtnConfirmarPIN: function(e) {
      var self = this;
      var pinDigitado = $('#inputPIN').val();
      var pinProfAux = window.localStorage.getItem("ProfSelecPIN");
      if (pinProfAux == pinDigitado) {
        $('#myModalProf').modal("hide");
        $('#myModalProf').on('hidden.bs.modal', function(e) {
          document.removeEventListener("backbutton", self.onBackKeyDowns, false); ////// RETIRAR EVENTO DO BOTAO
          window.history.go(-1);
        });
      } else {
        $('#inputPINErr').addClass("has-error");
        $('#labelErr').text("PIN errado!");
        $('#inputPIN').val("");
      }
    },

    ///Evento botao confirmar submissao
    clickbtnConfirmarSUB: function(e) {
      var self = this;
      this.modelTrue = false;
      $('#myModalSUB').modal("hide");
      $('#myModalSUB').on('hidden.bs.modal', function(e) {
        self.modelTrue = false;
        document.removeEventListener("backbutton", self.onBackKeyDowns, false); ///RETIRAR EVENTO DO BOTAO
        self.LerficheiroGravacaoEins();
        app.navigate('/pinJanela', {
          trigger: true
        });
      });
    },

    ///Evento botao finalizar
    clickbtnFinalizar: function(e) {
      e.stopPropagation();
      e.preventDefault();
      this.modelTrue = true;
      $('#myModalSUB').modal("show");
    },

    ///Evento botao gravar audio do aluno
    clickbtnRec: function(e) {
      ///Se o botao é botao de gravar
      if ($('#btnRec').hasClass("btn-success")) {
        $('#btnDemonstracao').hide();
        $('#btnFinalizar').hide();
        $('#btnOuvirme').hide();
        $('#AudioPlayerProf').prop('controls', false);
        $('#AudioPlayerProf').trigger('pause');
        $('#AudioPlayerProf').prop("currentTime", 0);
        $('#btnRec').removeClass("btn-primary"); //limpa campos
        $('#btnRec').removeClass("btn-success"); //limpa campos
        $('#btnRec').addClass("btn-danger"); //limpa campos
        $('#btnRec').html("<span class='glyphicon glyphicon glyphicon-stop' ></span> Parar");
        this.mediaRec = null;
        this.recordAudioForSD();

      } else if ($('#btnRec').hasClass("btn-primary")) {
        $('#myModalSUBGravar').modal("show");
      }
      ///Se for para parar a gravacao
      else if ($('#btnRec').hasClass("btn-danger")) {
        $('#btnFinalizar').removeClass("disabled"); //limpa campos
        this.StopRecorder();
        $('#AudioPlayerProf').prop('controls', true);
        $('#btnRec').removeClass("btn-danger"); //limpa campos
        $('#btnRec').addClass("btn-primary"); //limpa campos
        $('#btnRec').html("<span class='glyphicon glyphicon glyphicon-repeat'></span>  Repetir");
        $('#btnDemonstracao').show();
        $('#btnFinalizar').show();
        $('#btnOuvirme').show();
        $("#AudioPlayerAluno").attr("src", "file:///sdcard/gravacao1.amr");
        $("#AudioPlayerAluno").bind("ended", function() {
          $('#btnParar2').click();
        });
      }
    },

    clickBackButtonTTexto: function(e) {
      e.stopPropagation();
      e.preventDefault();
      $('#labelErr').text(""); //limpa campos
      $('#inputPIN').val(""); //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModalProf').modal("show");
      $('#myModalProf').on('shown.bs.modal', function(e) {
        $("#inputPIN").focus();
      });
    },


    render: function() {
      this.$el.html(template({}));

      var self = this;
      this.TotalPalavas = 0;
      this.modelTrue = false;
      document.addEventListener("backbutton", this.onBackKeyDowns, false); //Adicionar o evento
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

      professores_local2.getAttachment(profId, 'prof.jpg', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome + " - [ " + escolaNome + " ]");
        $('#imgProf').attr("src", url);
      });

      alunos_local2.getAttachment(alunoId, 'aluno.jpg', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeAluno').text("[" + turmaNome + " ] -- " + alunoNome);
        $('#imgAluno').attr("src", url);
      });

      testes_local2.get(TesteTextArealizarID, function(err, testeDoc) {
        if (err) console.log(err);
        console.log(testeDoc);
        $('#titleTestePagina').text(testeDoc.titulo);
        self.idPergunta = testeDoc.perguntas[0];

        perguntas_local2.get(testeDoc.perguntas[0], function(err, perguntasDoc) {
          if (err) console.log(err);
          self.legendas = perguntasDoc.legendas;
          $('#lbTituloTeste').text(perguntasDoc.pergunta);
          var textoAux = perguntasDoc.conteudo.texto;
          $('#txtAreaConteud').append(textoAux);
          var $container = $('#txtAreaConteud'); //Adiciona ao Div
          var words = $("#txtAreaConteud").text().split(' ');
          $("#txtAreaConteud").html("");
          $.each(words, function(i, val) {
            var $span;
            var $spanVazio;
            if (val.indexOf("\n") != -1) {
              $span = $('<span data-toggle="collapse" value=" " class="SpansTxt">' + val.substring(0, val.indexOf("\n") - 1) +
                '</span></br><span data-toggle="collapse" value=" " class="SpansTxt">' + val.substring(val.indexOf("\n")) + '</span>');
              $span.appendTo($container); //Adiciona ao Div
              $spanVazio = $('<span> </span>');
              $spanVazio.appendTo($container);
            } else {
              $span = $('<span data-toggle="collapse" value=" " class="SpansTxt">' + val + '</span>');
              $spanVazio = $('<span> </span>');
              $span.appendTo($container); //Adiciona ao Div
              $spanVazio.appendTo($container);
            }
          });
        });

        perguntas_local2.getAttachment(testeDoc.perguntas[0], 'voz.mp3', function(err2, mp3Aud) {
          if (err2) console.log(err2);
          self.GravarSOMfiles('voz.mp3', mp3Aud, function() {
            console.log('FUNCIONA');
            $('.loader2').hide();
            $("#AudioPlayerProf").attr("src", cordova.file.dataDirectory + "/files/voz.mp3")
            $("#AudioPlayerProf").bind("ended", function() {
              $('#btnParar1').click();
            });
          }, function(err) {
            console.log("DEU ERRO" + err);
          });
        });
      });
      return this;
    }

  });
});
