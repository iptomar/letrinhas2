define(function(require) {
  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/corrigirLista.html'),
    template = _.template(janelas);

  return Backbone.View.extend({
    totalPalavras: 0,
    totalPalavrasErradas: 0, //contador de palavras erradas
    triggerSelec: false,
    aux: null,

    initialize: function() {
    },


    convert_n2d: function(n) {
      if (n < 10) return ("0" + n);
      else return ("" + n);
    },

    convert_n3d: function(n) {
      var self = this;
      if (n < 100) return ("0" + self.convert_n2d(n));
      else return ("" + n);
    },

    verificaPalavras: function() {
      var self = this;
      if (self.totalPalavrasErradas != 0) {
        $("#ContadorDeErros").attr("style", "color: #dd0000; visibility:initial");
        $("#ContadorDeErros").text(self.totalPalavrasErradas + " Palavras Erradas");
      } else {
        $("#ContadorDeErros").attr("style", "visibility:hidden");
      }
    },

    findErr: function() {
      //devolve todas as palavras da classe
      var e = 0,
        f = 0,
        todasPalavras = document.getElementsByClassName("picavel");
      for (var i = 0; i < todasPalavras.length; i++) {
        var valor = $(todasPalavras[i]).attr("value");
        if (valor != '') {
          //selecionar a categoria do erro (Exatidão / fluidez)
          switch (parseInt((valor).charAt(0))) {
            case 1:
              e++;
              break;
            case 2:
              f++;
              break;
          }
        }
      }
      return {
        "exatidao": e,
        "fluidez": f
      };
    },

    //////////// Guardar audio vindo do couchDB /////////////////
    GravarSOMfile: function(name, data, success, fail) {
      console.log(cordova.file.dataDirectory);
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

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    events: {
      "click #BtnCancelar": "clickBtnCancelar",
      "click #demoButton": "clickDemoButton",
      "click #playMyTestButton": "clickPlayMyTestButton",
      "click #submitButton": "clickSubmitButton",
      "click #btnConfirmarSUB": "clickbtnConfirmarSUB",
      "click #BTOpcPopOver1": "clickBTOpcPopOver1",
      "click #BTOpcPopOver2": "clickBTOpcPopOver2",
    },

    clickBTOpcPopOver1: function(e) {
      var self = this;
      var clickedEl = $(e.currentTarget);
      var tipo = clickedEl.attr("name");
      self.aux.popover('hide').attr('value', tipo).css('color', '#FF0000');
      self.triggerSelec = false;
      $("#AudioPlayerAluno").prop("currentTime",$("#AudioPlayerAluno").prop("currentTime")-1);
      $("#AudioPlayerAluno").trigger('play');
      $('body').unbind('touchmove')
    },

    clickBTOpcPopOver2: function(e) {
      var self = this;
      var clickedEl = $(e.currentTarget);
      var tipo = clickedEl.attr("name");
      self.aux.popover('hide').attr('value', tipo).css('color', '#3399FF');
      self.triggerSelec = false;
      $("#AudioPlayerAluno").prop("currentTime",$("#AudioPlayerAluno").prop("currentTime")-1);
      $("#AudioPlayerAluno").trigger('play');
      $('body').unbind('touchmove')
    },

    clickbtnConfirmarSUB: function(e) {
      var self = this;
      $('#myModalSUB').modal("hide");
      $('#myModalSUB').on('hidden.bs.modal', function(e) {

          var plvr, categ, erro;
          //array para receber os items (palavra e erro)
          var conteudoResultado = new Array();
          //devolve todas as palavras da classe
          var todasPalavras = document.getElementsByClassName("picavel");
          var a = 0;

          for (var i = 0; i < todasPalavras.length; i++) {
            var valor = $(todasPalavras[i]).attr("value");

            if (valor != '') {
              plvr = $(todasPalavras[i]).text();
              //selecionar a categoria do erro (Exatidão / fluidez)
              switch (parseInt((valor).charAt(0))) {
                case 1:
                  categ = "Exatidão";
                  break;
                case 2:
                  categ = "Fluidez";
                  break;
              }
              //O erro em si.
              switch (parseInt($(todasPalavras[i]).attr("value"))) {
                case 11:
                  erro = "Substituição de palavras";
                  break;
                case 13:
                  erro = "Adições";
                  break;
                case 14:
                  erro = "Omissões de letras";
                  break;
                case 15:
                  erro = "Omissões de sílabas";
                  break;
                case 16:
                  erro = "Omissões de palavras";
                  break;
                case 17:
                  erro = "Inversões";
                  break;
                case 21:
                  erro = "Vacilação";
                  break;
                case 22:
                  erro = "Repetições";
                  break;
                case 23:
                  erro = "Soletração";
                  break;
                case 24:
                  erro = "Fragmentação de palavras";
                  break;
                case 25:
                  erro = "Retificação espontânea";
                  break;
              }

              //mini array de 4 campos
              var item = {
                'palavra': plvr,
                'categoria': categ,
                'erro': erro,
                'posicao': $(todasPalavras[i]).attr("id")
              };

              //colocar o item no array
              conteudoResultado[a] = item;
              a++;
            }
          }


          //Data da correção
          var agora = new Date();
          var tempoSeg = $('#AudioPlayerAluno').prop("duration");

          //retorna o tempo de duração da leitura em segundos,
          //arredondando ao ineiro mais próximo
          var tempoSeg = Math.round($("#AudioPlayerAluno").prop("duration"));
          //(plm) palavras lidas por minuto (não necessário por enquanto)
          //var plm = Math.roud((totalPalavras*60/tempoSeg));
          //palavras corretamente lidas (pcl)
          var pcl = self.totalPalavras - self.totalPalavrasErradas;
          //Velocidade de leitura (VL)
          var vl = Math.round((pcl * 60 / tempoSeg));

          //Fazer o update
          var CorrID = window.localStorage.getItem("CorrecaoID");
          resolucoes_local2.get(CorrID, function(err, docmnt) {
            // //total de palavras
            docmnt.respostas[0].TotalPalavras = self.totalPalavras;
            // //conteúdo onde estão identificadas as palavras erradas
            docmnt.respostas[0].correcao = conteudoResultado;
            //Data da correção
            docmnt.respostas[0].dataCorr = agora;
            //estado para corrigido!
            console.log(conteudoResultado);

            var calcNota = Math.round((a / self.totalPalavras) * 100);
            var nota=  (100 - calcNota);
            docmnt.nota = nota;
            //Velocidade da leitura
            docmnt.respostas[0].velocidade = vl;

            //actualizar o documento (correcao)
            resolucoes_local2.put(docmnt, CorrID, docmnt._rev, function(err, response) {
              if (err) {
                console.log('Correcao ' + err + ' erro');
              } else {
                console.log('Parabens InseridoCorrecao');
              }
            });

          });

       window.history.back();
      });
    },


    // Fazer update à correção com os devidos campos preenchidos
    clickSubmitButton: function(e) {
      e.stopPropagation();
      e.preventDefault();
      var self = this;
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

        var analise = self.findErr();
        var exatidaoTotal = analise.exatidao;
        var fluidezTotal = analise.fluidez;

        $('#LBtotalPalavras').text("Total de Palavras: " + self.totalPalavras);
        var exPer = Math.round((exatidaoTotal / self.totalPalavras) * 100);
        var exFlu = Math.round((fluidezTotal / self.totalPalavras) * 100);
        $('#LBCorrecao').html("Correção: </br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp-Exatidão: " + exatidaoTotal + " palavras erradas, acertou: " + (100 - exPer) + "% </br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp-Fluidez: " + fluidezTotal + " palavras, acertou: " + (100 - exFlu) + "% </br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp>>> Precisão:" + (100 - (exPer + exFlu)) + "% certo <<<\n\n"
        );
        var tempoSeg = $('#AudioPlayerAluno').prop("duration");

        var tempoSegProf = $('#AudioPlayerProf').prop("duration");
        var totalErrado = exatidaoTotal + fluidezTotal;
        var calcNota = Math.round((totalErrado / self.totalPalavras) * 100);
        var notaFinal=  (100 - calcNota);

        $('#LBCtempoAluno').html("Tempo do Aluno: </br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp-Duração: " + Math.round(tempoSeg) + " segundos </br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp-Velocidade: " + (Math.round(60 * self.totalPalavras / tempoSeg)) + " plv/min. ");

        $('#LBCtempoProf').html("Tempo do Professor: </br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp-Duração: " + Math.round(tempoSegProf) + " segundos</br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp-Velocidade: " + (Math.round(60 * self.totalPalavras / tempoSegProf)) + " plv/min.");
        $('#myModalSUB').modal("show");


        $('#LBCNota').html("Nota: "+notaFinal+" %");
      }
    },

    clickBtnCancelar: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.back();
    },

    render: function() {
      this.$el.html(template({}));

      var self = this;
      ////Carrega os dados mais uteis da janela anterior////
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var correcaoID = window.localStorage.getItem("CorrecaoID"); //enviar variavel


      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src", url);
      });


      resolucoes_local2.get(correcaoID, function(err, correcaoDoc) {
        if (err) console.log(err);

        var data = new Date(correcaoDoc.dataReso);


        ///Dados aluno///
        alunos_local2.getAttachment(correcaoDoc.id_Aluno, 'aluno.png', function(err2, DataImg) {
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
            ":" + self.convert_n2d(data.getSeconds())
          );
          $('#LBrelaTitulo').text("Titulo: " + testeDoc.titulo);

          perguntas_local2.getAttachment(testeDoc.perguntas[0], 'voz.mp3', function(err2, DataImg) {
            if (err2) console.log(err2);
            self.GravarSOMfile('voz.mp3', DataImg, function() {
              console.log('FUNCIONA VOZ PROF');
              $("#AudioPlayerProf").attr("src", cordova.file.dataDirectory + "/files/voz.mp3");
              $("#AudioPlayerProf").trigger('load');
              var audioElement = $("#AudioPlayerProf")[0];
              audioElement.play();
              audioElement.pause();
            }, function(err) {
              console.log("DEU ERRO VOZ PROF" + err);
            });
          });

          perguntas_local2.get(testeDoc.perguntas[0], function(err, perguntaDoc) {
            if (err) console.log(err);
            $('#titlePerguntaLB').text(perguntaDoc.pergunta);


            var s1, allTable, empty = true;
            allTable = "<table style='width:100%; '><tr>";
            self.totalPalavras = 0;
            //*id do div com o conteúdo, id="listaAreaConteudo"
            if (perguntaDoc.conteudo.palavrasCl1.length > 0) {
              s1 = "";
              for (var j = 0; j < perguntaDoc.conteudo.palavrasCl1.length; j++) {
                s1 += "<p id='" + self.convert_n3d(self.totalPalavras) + " 'class='picavel' value=''" + "style='font-weight:bold; font-size:20px'>" + perguntaDoc.conteudo.palavrasCl1[j] + "</p>";
                self.totalPalavras++;
              }
              allTable += ("<td class='well' align='center' valign='top' style='width:30%'>" + s1 + "</td>");
              empty = false;
            }

            if (perguntaDoc.conteudo.palavrasCl2.length > 0) {
              s1 = "";
              for (var j = 0; j < perguntaDoc.conteudo.palavrasCl2.length; j++) {
                s1 += "<p id='" + self.convert_n3d(self.totalPalavras) + "'class='picavel' value=''" + "style='font-weight:bold; font-size:20px'>" + perguntaDoc.conteudo.palavrasCl2[j] + "</p>";
                self.totalPalavras++;
              }
              allTable += ("<td class='well' align='center' valign='top' style='width:30%'>" + s1 + "</td>");
              empty = false;
            }

            if (perguntaDoc.conteudo.palavrasCl3.length > 0) {
              s1 = "";
              for (var j = 0; j < perguntaDoc.conteudo.palavrasCl3.length; j++) {
                s1 += "<p id='" + self.convert_n3d(self.totalPalavras) + "'class='picavel' value=''" + "style='font-weight:bold; font-size:20px'>" + perguntaDoc.conteudo.palavrasCl3[j] + "</p>";
                self.totalPalavras++;
              }
              allTable += ("<td class='well' align='center' valign='top' style='width:30%'>" + s1 + "</td>");
              empty = false;
            }
            allTable += "</tr></table>";

            if (!empty) {
              //Inserir a tabela no div id=listaAreaConteudo
              $('#listaAreaConteudo').html(allTable);
            }

            // Analisa todos os botoes do div
            var $container = $('#listaAreaConteudo');
            $container.on('click', '.picavel', function(ev) {
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
                $(this).css("color", "#000000");
                $meuSpan.popover('destroy');
                $meuSpan.attr("value", " ");
                self.totalPalavrasErradas--;
                self.verificaPalavras();
                self.triggerSelec = false;
                $('body').unbind('touchmove');
                self.aux = null;
              } else if (self.triggerSelec == false) {
                $("#AudioPlayerAluno").trigger('pause');
                $(this).css("color", "#FF9900");
                $meuSpan.popover('show');
                $('body').bind('touchmove', function(e){e.preventDefault()});
                self.totalPalavrasErradas++;
                self.verificaPalavras();
                self.triggerSelec = true;
                self.aux = $meuSpan;
              }
            });
            self.totalPalavrasErradas=0;
          });
        });
      });

      //    $('#lbTituloTeste').text(testeDoc.titulo+" - "+testeDoc.conteudo.pergunta);
      //  $('#LBrelaTitulo').text(testeDoc.titulo+" - "+testeDoc.conteudo.pergunta);

      // //imagem da disciplina e tipo de teste
      // var urlDiscp;
      // switch (testeDoc.disciplina){
      //   case 1:urlDiscp = "img/portugues.png";
      //     break;
      //   case 2:urlDiscp = "img/mate.png";
      //     break;
      //   case 3:urlDiscp = "img/estudoMeio.png";
      //     break;
      //   case 4:urlDiscp = "img/ingles.png";
      //     break;
      // }
      // $('#imgDisciplina').attr("src",urlDiscp);

      return this;
    }

  });

});
