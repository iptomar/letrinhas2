define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/corrigirTexto.html'),
    template = _.template(janelas);

  return Backbone.View.extend({

    errosTTexto: 0,
    triggerSelecionado: false,
    aux: null,

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {},


    AnalisarTexto: function() {
      var $container = $('#DivContentorArea'); //Adiciona ao Div
      var sapns = $("#DivContentorArea > span");
      var maxEle = $("#DivContentorArea > span").length;
      var exatidao = 0;
      var fluidez = 0;
      var totalPalavas = 0;
      for (var i = 0; i < maxEle; i++) {
        totalPalavas++;
        var color = sapns[i].style.color
        if (color == 'rgb(255, 0, 0)') {
          exatidao++;
        }
        if (color == 'rgb(51, 153, 255)') {
          fluidez++;
        }
      }
      return {
        "exatidao": exatidao,
        "fluidez": fluidez,
        "totalPalavas": totalPalavas
      };
    },

    convert_n2d: function(n) {
      if (n < 10) return ("0" + n);
      else return ("" + n);
    },

    readableDuration: function(seconds) {
      var sec = Math.floor(seconds);
      var min = Math.floor(sec / 60);
      min = min >= 10 ? min : '0' + min;
      sec = Math.floor(sec % 60);
      sec = sec >= 10 ? sec : '0' + sec;
      return min + ':' + sec;
    },

    InsertCorrecao: function(IdCorr) {
      var self = this;
      var $container = $('#DivContentorArea'); //Adiciona ao Div
      var sapns = $("#DivContentorArea > span");
      var maxEle = $("#DivContentorArea > span").length;
      var agora = new Date();
      var tempoSeg = $('#AudioPlayerAluno').prop("duration");
      var palavrasErr = 0;


      resolucoes_local2.get(IdCorr, function(err, otherDoc) {
        if (err) console.log(err);

        for (var i = 0; i < maxEle; i++) {
          var color = sapns[i].style.color;
          if (color == 'rgb(255, 0, 0)' || color == 'rgb(51, 153, 255)') // =='blue' <- IE hack
          {
            var cenas = sapns[i].getAttribute("value");
            palavrasErr++;
            otherDoc.respostas[0].correcao.push({
              'palavra': sapns[i].innerText,
              'categoria': self.converterStingEmTexto(cenas).categoria,
              'erro': self.converterStingEmTexto(cenas).erro,
              'posicao': i,
            });
          }
        }
        var exPer = Math.round((palavrasErr / maxEle) * 100);
        var nota = (100 - exPer);
        otherDoc.nota = $('#LBCNota').val();


        var pcl = maxEle - palavrasErr;
        otherDoc.respostas[0].TotalPalavras = maxEle;
        otherDoc.respostas[0].velocidade = Math.round((pcl * 60 / tempoSeg));
        otherDoc.respostas[0].expresSinais = $('#DropExprSinais').val();
        otherDoc.respostas[0].expresEntoacao = $('#DropExprEntoacao').val();
        otherDoc.respostas[0].expresTexto = $('#DropExprTexto').val();
        otherDoc.respostas[0].dataCorr = agora;


        resolucoes_local2.put(otherDoc, IdCorr, otherDoc._rev, function(err, response) {
          if (err) {
            console.log('Correcao ' + err + ' erro');
          } else {
            console.log('Parabens InseridoCorrecao');
          }
        });
      });
    },


    converterStingEmTexto: function(stringx) {
      if (stringx == "op1_1")
        return {
          "categoria": "Exatidão",
          "erro": "Substituição de letras"
        };
      if (stringx == "op1_2")
        return {
          "categoria": "Exatidão",
          "erro": "Substituição de palavras"
        };
      if (stringx == "op1_3")
        return {
          "categoria": "Exatidão",
          "erro": "Adições"
        };
      if (stringx == "op1_4")
        return {
          "categoria": "Exatidão",
          "erro": "Omissões de letras"
        };
      if (stringx == "op1_5")
        return {
          "categoria": "Exatidão",
          "erro": "Omissões de sílabas"
        };
      if (stringx == "op1_6")
        return {
          "categoria": "Exatidão",
          "erro": "Omissões de palavras"
        };
      if (stringx == "op1_7")
        return {
          "categoria": "Exatidão",
          "erro": "Inversões"
        };

      if (stringx == "op2_1")
        return {
          "categoria": "Fluidez",
          "erro": "Vacilação"
        };
      if (stringx == "op2_2")
        return {
          "categoria": "Fluidez",
          "erro": "Repetições"
        };
      if (stringx == "op2_3")
        return {
          "categoria": "Fluidez",
          "erro": "Soletração"
        };
      if (stringx == "op2_4")
        return {
          "categoria": "Fluidez",
          "erro": "Fragmentação de palavras"
        };
      if (stringx == "op2_5")
        return {
          "categoria": "Fluidez",
          "erro": "Retificação espontânea"
        };
    },


    //////////// GRAVAR SOM VINDO DA BD E PASSAR PARA O PLAYER DE AUDIO /////////////////
    GravarSOMfile: function(name, data, success, fail) {
      var gotFileSystem = function(fileSystem) {
        fileSystem.root.getFile(name, {
          create: true,
          exclusive: false
        }, function(fileEntry) {
          fileEntry.createWriter(function(writer) {
            writer.onwrite = success;
            writer.onerror = fail;
            writer.write(data);
          }, fail);
        }, fail);
      };
      window.requestFileSystem(window.LocalFileSystem.PERSISTENT, data.length || 0, gotFileSystem, fail);
    },

    events: {
      "click #BackButton": "clickBackButton",
      "click #btnFinalizar": "clickbtnFinalizar",
      "click #btnConfirmarSUB": "clickbtnConfirmarSUB",
      "click #BTOpcPopOver1": "clickBTOpcPopOver1",
      "click #BTOpcPopOver2": "clickBTOpcPopOver2",
      "click #lessBtn": "lessBtn",
      "click #moreBtn": "moreBtn"

    },

    lessBtn: function(e) {
      console.log("asdsadasd");
      if (parseInt($("#LBCNota").val()) != 0)
        $("#LBCNota").val((parseFloat($("#LBCNota").val()) - 1).toFixed(0));
    },

    moreBtn: function(e) {
      if (parseInt($("#LBCNota").val()) != 100)
        $("#LBCNota").val((parseFloat($("#LBCNota").val()) + 1).toFixed(0));
    },

    clickBTOpcPopOver1: function(e) {
      var self = this;
      var clickedEl = $(e.currentTarget);
      var tipo = clickedEl.attr("name");
      self.aux.popover('hide').attr('value', tipo).css('color', '#FF0000');
      self.triggerSelecionado = false;
      $("#AudioPlayerAluno").prop("currentTime", $("#AudioPlayerAluno").prop("currentTime") - 1);
      $("#AudioPlayerAluno").trigger('play');
      $('body').unbind('touchmove')
    },

    clickBTOpcPopOver2: function(e) {
      var self = this;
      var clickedEl = $(e.currentTarget);
      var tipo = clickedEl.attr("name");
      self.aux.popover('hide').attr('value', tipo).css('color', '#3399FF');
      self.triggerSelecionado = false;
      $("#AudioPlayerAluno").prop("currentTime", $("#AudioPlayerAluno").prop("currentTime") - 1);
      $("#AudioPlayerAluno").trigger('play');
      $('body').unbind('touchmove')
    },


    clickbtnConfirmarSUB: function(e) {
      var self = this;
      self.InsertCorrecao(window.localStorage.getItem("CorrecaoID"));
      /////////////////    document.removeEventListener("backbutton", onBack, false); ///RETIRAR EVENTO DO BOTAO
      $('#myModalSUB').modal("hide");
      $('#myModalSUB').on('hidden.bs.modal', function(e) {
      window.history.back();
       });
    },


    clickbtnFinalizar: function(e) {
      var self = this;
      e.stopPropagation();
      e.preventDefault();
      var timex = $('#AudioPlayerAluno').prop("duration");

      if (timex == 0) {
        $("#popUpAviso").empty();
        $("#popUpAviso").append(
          '<div id="qwert" class="alert alert-danger alert-dismissable">' +
          '<button type="button" class="close" data-dismiss="alert"> <span aria-hidden="true">&times;</span></button>' +
          '<strong>Aviso!</strong> Têm que ouvir pelo menos uma vez a leitura do Aluno.' +
          '</div>');
      } else {
        $("#popUpAviso").empty();
        $('#myModalSUB').modal("show");
        var auxAnalisar = self.AnalisarTexto();

        var audioElement = $("#AudioPlayerProf")[0];
        audioElement.play();
        audioElement.pause();

        var exatidaoTotal = auxAnalisar.exatidao;
        var fluidezTotal = auxAnalisar.fluidez;
        var palavrasTotal = auxAnalisar.totalPalavas;

        $('#LBtotalPalavras').text("Total de Palavras: " + auxAnalisar.totalPalavas);
        var exPer = Math.round((exatidaoTotal / palavrasTotal) * 100);
        var exFlu = Math.round((fluidezTotal / palavrasTotal) * 100);
        $('#LBCorrecao').html("Correção: </br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp-Exatidão: " + auxAnalisar.exatidao + " palavras erradas, acertou: " + (100 - exPer) + "% </br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp-Fluidez: " + auxAnalisar.fluidez + " palavras, acertou: " + (100 - exFlu) + "% </br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp---[ Total:" + (100 - (exPer + exFlu)) + "% certo ]--- </br>" +
          "Expressividade: </br>" +
          "&nbsp-Sinais: " + $('#DropExprSinais').val() + " || -Entoação: " + $('#DropExprEntoacao').val() + " || -Texto: " + $('#DropExprTexto').val()
        );
        var tempoSeg = $('#AudioPlayerAluno').prop("duration");
        var tempoSegProf = $('#AudioPlayerProf').prop("duration");
        var a1 = auxAnalisar.exatidao;
        var a2 = auxAnalisar.fluidez;
        var totalErrado = a1 + a2;
        var calcNota = Math.round((totalErrado / palavrasTotal) * 100);
        var notaFinal = (100 - calcNota);

        $('#LBCtempoAluno').html("Tempo do Aluno: </br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp-Duração: " + self.readableDuration(tempoSeg) + " </br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp-Velocidade: " + (Math.round(60 * palavrasTotal / tempoSeg)) + " ");

        $('#LBCtempoProf').html("Tempo do Professor: </br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp-Duração: " + self.readableDuration(tempoSegProf) + " </br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp-Velocidade: " + (Math.round(60 * palavrasTotal / tempoSegProf)) + " ");

        $('#LBCNota').val(notaFinal.toFixed(0));

      }
    },

    clickBackButton: function(e) {
      e.stopPropagation();
      e.preventDefault();
      ////////////////////    document.removeEventListener("backbutton", onBack, false); ///RETIRAR EVENTO DO BOTAO
      window.history.back();
    },


    render: function() {
      this.$el.html(template({}));

      var self = this;
      this.errosTTexto = 0;
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");
      var tipoTesteSelecionado = window.localStorage.getItem("TipoTesteSelecionado");
      var TesteArealizarID = window.localStorage.getItem("TesteArealizarID");
      var AlunoNameAux = window.localStorage.getItem("AlunoNameAux");

      var correcaoID = window.localStorage.getItem("CorrecaoID"); //enviar variavel
      /////////////////  document.addEventListener("backbutton", onBack, false); //Adicionar o evento

      professores_local2.getAttachment(profId, 'prof.jpg', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src", url);
      });

      resolucoes_local2.get(correcaoID, function(err, correcaoDoc) {
        if (err) console.log(err);
        var data = new Date(correcaoDoc.dataReso);
        ///Alunos dados:
        alunos_local2.getAttachment(correcaoDoc.id_Aluno, 'aluno.jpg', function(err2, DataImg) {
          if (err2) console.log(err2);
          var foto = URL.createObjectURL(DataImg);
          $('#imgAluno').attr("src", foto);

          $('#imgAlunoTitleRela').attr("src", foto);
        });

        alunos_local2.get(correcaoDoc.id_Aluno, function(err, alunoDoc) {
          if (err) console.log(err);
          $('#lbNomeAluno').text("Teste Realizado por: " + alunoDoc.nome);
          $("#LBrelaAluno").text("Aluno: " + alunoDoc.nome);
        });
        ////////////////////////////////
        resolucoes_local2.getAttachment(correcaoID, 'gravacao.amr', function(err2, DataAudio) {
          if (err2) console.log(err2);
          self.GravarSOMfile('gravacao.amr', DataAudio, function() {
            console.log('FUNCIONA VOZ ALUNO');
            $("#AudioPlayerAluno").attr("src", cordova.file.dataDirectory + "/files/gravacao.amr");
            $("#AudioPlayerAluno").trigger('load');
          }, function(err) {
            console.log("DEU ERRO VOZ ALUNO " + err);
          });
        });

        testes_local2.get(correcaoDoc.id_Teste, function(err, testeDoc) {
          if (err) console.log(err);

          $('#titleTestePagina').text(testeDoc.titulo + " - " +
            self.convert_n2d(data.getDate()) +
            "/" + self.convert_n2d(data.getMonth() + 1) +
            "/" + self.convert_n2d(data.getFullYear()) +
            " às " + self.convert_n2d(data.getHours()) +
            ":" + self.convert_n2d(data.getMinutes()) +
            ":" + self.convert_n2d(data.getSeconds()));
          $('#LBrelaTitulo').text("Titulo: " + testeDoc.titulo);


          perguntas_local2.getAttachment(testeDoc.perguntas[0], 'voz.mp3', function(err2, DataImg) {
            if (err2) console.log(err2);
            self.GravarSOMfile('voz.mp3', DataImg, function() {
              console.log('FUNCIONA VOZ PROF');
              $('.loader2').hide();
              $("#AudioPlayerProf").attr("src", cordova.file.dataDirectory + "/files/voz.mp3");
              $("#AudioPlayerProf").trigger('load');
              $("#AudioPlayerProf").trigger('play');
              setTimeout(function() {
                $("#AudioPlayerProf").trigger('pause');
                $("#AudioPlayerProf").prop("currentTime", 0);
              }, 200);



            }, function(err) {
              console.log("DEU ERRO VOZ PROF" + err);
            });
          });

          perguntas_local2.get(testeDoc.perguntas[0], function(err, perguntaDoc) {
            if (err) console.log(err);
            $('#titlePerguntaLB').text(perguntaDoc.pergunta);
            $('#DivContentorArea').append(perguntaDoc.conteudo.texto);
            var $container = $('#DivContentorArea'); //Adiciona ao Div


            var words = $("#DivContentorArea").text().split(' ');
            $("#DivContentorArea").html("");
            $.each(words, function(i, val) {


              var $span;
              var $spanVazio;
              if (val.indexOf("\n") != -1) {
                $span = $('<span data-toggle="collapse" value=" " class="SpansTxt">' + val.substring(0, val.indexOf("\n") - 1) +
                  '</span></br><span data-toggle="collapse" value=" " class="SpansTxt">' + val.substring(val.indexOf("\n")) + '</span>');
                $span.css("color", "#000000");
                $span.appendTo($container); //Adiciona ao Div
                $spanVazio = $('<span> </span>');
                $spanVazio.appendTo($container);
              } else {
                $span = $('<span data-toggle="collapse" value=" " class="SpansTxt">' + val + '</span>');
                $spanVazio = $('<span> </span>');
                $span.css("color", "#000000");
                $span.appendTo($container); //Adiciona ao Div
                $spanVazio.appendTo($container);
              }
            });
            $container.on('click', '.SpansTxt', function(ev) {
              var text = $(this).text();
              var $meuSpan = $(this);
              $meuSpan.popover({
                toggle: "popover",
                content: function() {
                  return $('#divPopOverOp').html();
                },
                placement: 'top',
                html: true,
                trigger: 'focus'
              });

              var color = $(this).css('color');
              if (color == 'rgb(255, 153, 0)' || color == 'rgb(255, 0, 0)' || color == 'rgb(51, 153, 255)') // =='blue' <- IE hack
              {
                if (self.triggerSelecionado == false) {
                  $(this).css("color", "#000000");
                  $meuSpan.popover('destroy');
                  $meuSpan.attr("value", " ");
                  self.errosTTexto--;
                  $('#ContadorDeErros').text("Erros: " + self.errosTTexto);
                  self.triggerSelecionado = false;
                  $('body').unbind('touchmove');
                  self.aux = null;
                }
              } else if (self.triggerSelecionado == false) {
                $("#AudioPlayerAluno").trigger('pause');
                $(this).css("color", "#FF9900");
                $meuSpan.popover('show');
                $('body').bind('touchmove', function(e) {
                  e.preventDefault()
                });
                self.errosTTexto++;
                $('#ContadorDeErros').text("Erros: " + self.errosTTexto);
                self.triggerSelecionado = true;
                self.aux = $meuSpan;
              }
            });
          });
        });
      });
      return this;
    }

  });

});
