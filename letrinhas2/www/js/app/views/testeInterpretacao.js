define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/testeInterpretacao.html'),
    template = _.template(janelas);

  return Backbone.View.extend({
    modelTrue: false,
    TotalPalavas: 0,
    idPergunta: null,
    respostasCertas: 0,

    /////// Funcao executada no inicio de load da janela ////////////
    initialize: function() {
    },

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

    GetRespostasCertas: function() {
      var self = this;
      var sapns = $("#DivContentorArea > .SpansTxt");
      var maxEle = $("#DivContentorArea > .SpansTxt").length;
      console.log(self.idPergunta);
      perguntas_local2.get(self.idPergunta, function(err, perguntasDoc) {
        if (err) console.log(err);

        var certas = 0;
        var erradas = 0;
        for (var i = 0; i < perguntasDoc.conteudo.posicaoResposta.length; i++) {
          var posicaoCerta = perguntasDoc.conteudo.posicaoResposta[i];
          var color = sapns[posicaoCerta].style.backgroundColor;
          if (color == 'rgb(0, 204, 0)') {
            certas++;
          } else {
            erradas++;
          }
        }
        self.respostasCertas = certas;
      });
    },

    GravarResolucao: function() {
      var self = this;

      var agora = new Date();
      var TesteTextArealizarID = window.localStorage.getItem("TesteTextArealizarID");
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var profId = window.localStorage.getItem("ProfSelecID");

      var sapns = $("#DivContentorArea > .SpansTxt");
      var maxEle = $("#DivContentorArea > .SpansTxt").length;


      perguntas_local2.get(self.idPergunta, function(err, perguntasDoc) {
        if (err) console.log(err);

        var resolucao = {
          'id_Teste': TesteTextArealizarID,
          'id_Aluno': alunoId,
          'id_Prof': profId,
          'tipoCorrecao': 'interpretacao',
          'nota': '-1',
          'respostas': [],
          'dataReso': agora,
          'observ': null,
        };
        resolucao.respostas.push({
          'idPergunta': self.idPergunta,
          'TotalPalavras': maxEle,
          'conteudo': [],
          'correcao': [],
        });

        var respostasDadas = 0;
        for (var i = 0; i < maxEle; i++) {
          var color = sapns[i].style.backgroundColor;
          if (color == 'rgb(0, 204, 0)') {
            {
              respostasDadas++;
              resolucao.respostas[0].conteudo.push({
                'palavra': sapns[i].innerText,
                'posicao': i,
              });
            }
          }
        }
        var certas = 0;
        var erradas = 0;
        for (var i = 0; i < perguntasDoc.conteudo.posicaoResposta.length; i++) {
          var posicaoCerta = perguntasDoc.conteudo.posicaoResposta[i];
          var color = sapns[posicaoCerta].style.backgroundColor;
          resolucao.respostas[0].correcao.push({
            'posicao': posicaoCerta,
          });
          if (color == 'rgb(0, 204, 0)') {
            certas++;
          } else {
            erradas++;
          }
        }
        // console.log("Errado: " + erradas);
        // console.log("certo: " + certas);
        // console.log("RespostasDadass: " + respostasDadas);

        var totalT = erradas + certas;
        var nota = (certas * 100) / totalT;
        resolucao.nota = nota.toFixed(2);
        console.log("Nota: " + nota.toFixed(2));

        console.log(resolucao);

        resolucoes_local2.post(resolucao, function(err, response) {
          if (err) {
            console.log('Resolucao ' + err + ' erro');
          } else {
            console.log('Parabens Inserido Resolucao');
          }
        });
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



    //Eventos Click
    events: {
      "click #btnDemonstracao": "clickbtnDemonstracao",
      "click #btnParar1": "clickbtnParar1",
      "click #btnFinalizar": "clickbtnFinalizar",
      "click #btnConfirmarPIN": "clickbtnConfirmarPIN",
      "click #btnConfirmarSUB": "clickbtnConfirmarSUB",

    },


    clickbtnConfirmarSUB: function(e) {
      var self = this;
      this.modelTrue = false;
      $('#myModalSUB').modal("hide");
      $('#myModalSUB').on('hidden.bs.modal', function(e) {
        $("#myModalCont").modal("show");
        $("#semafro").text("Acertou "+self.respostasCertas+" palavra(s)");
        $('#myModalCont').on('hidden.bs.modal', function(e) {
          self.modelTrue = false;
          self.GravarResolucao();
           document.removeEventListener("backbutton", self.onBackKeyDowns, false); ///RETIRAR EVENTO DO BOTAO
           window.history.back();
        });
      });
    },

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


    clickbtnFinalizar: function(e) {
      var self = this;
      e.stopPropagation();
      e.preventDefault();
      this.modelTrue = true;
      self.GetRespostasCertas();
      $('#myModalSUB').modal("show");
    },


    clickbtnDemonstracao: function(e) {
      $('#div1').hide();
      $('#div2').show();
      $("#AudioPlayerProf").prop("currentTime", 0);
      $("#AudioPlayerProf").trigger('play');
    },

    clickbtnParar1: function(e) {
      $("#AudioPlayerProf").trigger('pause');
      $('#div2').hide();
      $('#div1').show();
    },

    render: function() {
      this.$el.html(template({}));

      var self = this;
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

      testes_local2.get(TesteTextArealizarID, function(err, testeDoc) {
        if (err) console.log(err);
        console.log(testeDoc);
        $('#titleTestePagina').text(testeDoc.titulo);

        self.idPergunta = testeDoc.perguntas[0];

        perguntas_local2.get(testeDoc.perguntas[0], function(err, perguntasDoc) {
          if (err) console.log(err);
          console.log(perguntasDoc);

          $('#lbTituloTeste').text(perguntasDoc.pergunta);
          var textoAux = perguntasDoc.conteudo.texto;

          $('#DivContentorArea').append(textoAux);
          var $container = $('#DivContentorArea'); //Adiciona ao Div


          var words = $("#DivContentorArea").text().split(' ');
          $("#DivContentorArea").html("");
          $.each(words, function(i, val) {
            var $span;
            var $spanVazio;
            if (val == "\n")
              $span = $('</br>');
            else
            $span = $('<span data-toggle="collapse" value=" " class="SpansTxt ">' + val + '</span>');
            $span.css("color", "#000000");
            $span.css("background-color", "#FFFFFF");
            $spanVazio = $('<span> </span>');
            $span.appendTo($container); //Adiciona ao Div
            $spanVazio.appendTo($container); //Adiciona ao Div

          });

          $container.on('click', '.SpansTxt', function(ev) {
            var text = $(this).text();
            var $meuSpan = $(this);
            var color = $(this).css('background-color');
            if (color == 'rgb(255, 255, 255)') {
              $(this).css("background-color", "#00CC00");
            } else
            if (color == 'rgb(0, 204, 0)') {
              $(this).css("background-color", "#FFFFFF");
            }
          });
        });

        perguntas_local2.getAttachment(testeDoc.perguntas[0], 'voz.mp3', function(err2, mp3Aud) {
          if (err2) console.log(err2);
          self.GravarSOMfiles('voz.mp3', mp3Aud, function() {
            console.log('FUNCIONA');
            $("#AudioPlayerProf").attr("src", cordova.file.dataDirectory + "/files/voz.mp3")

          }, function(err) {
            console.log("DEU ERRO" + err);
          });
        });
      });

      return this;
    }

  });
});