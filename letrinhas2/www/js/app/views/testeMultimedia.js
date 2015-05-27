define(function(require) {
  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/testeMultimedia.html'),
    template = _.template(janelas);

  return Backbone.View.extend({
    array: [],
    filesApagar: [],
    modelTrue: false,

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

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

      var self = this;
      self.TotalPalavas = 0;
      self.modelTrue = false;
      document.addEventListener("backbutton", self.onBackKeyDowns, false); //Adicionar o evento
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

      testes_local2.get(TesteTextArealizarID, function(err, testeDoc) {
        if (err) console.log(err);


        var $containerIND = $('#IndicatorsCorr');
        var pum= '<li data-target="#carouselPrincipal" data-slide-to="0" class="active"></li>';
        for (var i = 1; i <= testeDoc.perguntas.length; i++) {
        pum+='<li data-target="#carouselPrincipal" data-slide-to="' + i + '" ></li>';
      }
      var $li = $(pum);
      $li.appendTo($containerIND);


        $('#titleTestePagina').text(testeDoc.titulo);
        $('#carouselPrincipal').carousel('pause');
        /////////////////FUNCAO PARA O SWIPE SO ISTO xD ////////////////////////////////
        $("#carouselPrincipal").swipe({
          //Generic swipe handler for all directions
          swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
            $('#carouselPrincipal').carousel('next');
          },
          swipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
            $('#carouselPrincipal').carousel('prev');
          },
        });
        var instrucoes = [];
        self.array = [];
        ////////////////fim ////////////////////////////////
        for (var i = 0; i < testeDoc.perguntas.length; i++) {
          var ini = false;
          if (i == 0)
          ini = true;
          self.array[i] = [testeDoc.perguntas[i], 0, 0];
        var janelaConstru =   self.desenhaJanelas(testeDoc.perguntas[i], ini).then(function(ix) {
            return ix;
          });
          instrucoes.push(janelaConstru)
        }

        Promise.all(instrucoes).then(function (result) {
          var $containerCorr = $('#carroselT');
          for (var i = 0; i < testeDoc.perguntas.length; i++) {
              var $exemp = $(  result[i]);
              $exemp.appendTo($containerCorr);
             if (i == (testeDoc.perguntas.length -1 )){
               var $exemp = $(self.desenhaJanelaFim());
               $exemp.appendTo($containerCorr);
           }
          }

           $containerCorr.on('click', '.btnOP', function(ev) {
            var $btn = $(this); // O jQuery passa o btn clicado pelo this
            $('.btn-opcao-' + $btn[0].name).removeClass("btn-success");
            $('.btn-opcao-' + $btn[0].name).addClass("btn-info");
            $(this).removeClass("btn-info");
            $(this).addClass("btn-success");

            var qwerty = _.findIndex(self.array, function(i) {
              return i[0] == $btn[0].name
            });
            self.array[qwerty] = [$btn[0].name, $btn[0].id, $btn[0].value];

            $('#carouselPrincipal').carousel('next');
          });
        });

      });

    },



    auxRemoveAll: function() {
      var self = this;
      for (var i = 0; i < self.filesApagar.length; i++) {
        self.Removefile(self.filesApagar[i], function() {
          console.log("APAGADO");
        }, function(err) {
          console.log("DEU ERRO APAGAR" + err);
        });
      }
    },


    //////////// RemoverFicheiro /////////////////
    Removefile: function(name, success, fail) {
      var gotFileSystems = function(fileSystem) {
        fileSystem.root.getFile(name, {
          create: false,
          exclusive: false
        }, gotRemoveFileEntry, fail);
      };
      var gotRemoveFileEntry = function(fileEntry) {
        fileEntry.remove(success, fail);
      };
      window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, gotFileSystems, fail);
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

    desenhaJanelaFim: function() {

      var divFinal = '<div class="item" style="height:90vh;"></br></br><div class="panel-heading fontEX_XSS centerEX">' +
        '</br></br></br><span >Finalizar Teste?</span></br>' +
        '<button id="btnFinalizar" style="height:100px;" type="button" class="btn btn-success btn-lg btn-block">' +
        '<span class="glyphicon glyphicon-ok fontEX_XSS" aria-hidden="true"> Finalizar</span></button></br></br>' +
        '<h3 id="avisoLB" style="color: red;"> </h3>' +
        '</div></div>';
        return divFinal;
    },

    desenhaJanelas: function(idPergunta, inic, i) {
      var self = this;
      return perguntas_local2.get(idPergunta, {
        attachments: true
      }).then(function(perguntaDoc) {





        var puty = '';
        if (inic == true)
        puty +='<div id="' + idPergunta + '" class="item active">';
         else
         puty += '<div id="' + idPergunta + '" class="item">';




        puty += '</br></br><div class="panel panel-info">' +
          '<div class="panel-heading fontEX_XSS centerEX">' +
          '<span id="titlePerguntatxt">' + perguntaDoc.pergunta + '</span>' +
          '</div></div>';



          puty += '<div class="panel fontEX_XL centerEX">';
        if (perguntaDoc.conteudo.tipoDoCorpo == "texto") {
          puty +=
            ' <div class="panel-heading" style="height:30vh;"> <h2 style="font-size:35px;">' + perguntaDoc.conteudo.corpo +
            '</h2></div>';
        } else if (perguntaDoc.conteudo.tipoDoCorpo == "imagem") {
          puty +=
            ' <div class="panel-heading" style="height:30vh;"> <img  src="data:image/png;base64,' + perguntaDoc._attachments['corpo.png'].data + '" style="height:190px;" /> ' +
            '</div>';
        } else if (perguntaDoc.conteudo.tipoDoCorpo == "audio") {
          puty +=
            ' <div class="panel-heading" style="height:30vh;"> </br><audio id="Audio' + perguntaDoc._id + '" controls="controls"  style="width: 100%"></audio>' +
            '</div>';
        }
        puty += '</div></br></br></br><div>';


        var tamanhoTotalOpc = perguntaDoc.conteudo.opcoes.length;
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

        var correta = perguntaDoc.conteudo.opcaoCerta;

        for (var y = 0; y < tamanhoTotalOpc; y++) {
          if (tamanhoTotalOpc == 3)
          puty += '<div class="col-md-4">';
          else if (tamanhoTotalOpc == 2)
          puty += '<div class="col-md-6">';
          else if (tamanhoTotalOpc == 4)
          puty += '<div class="col-md-3">';
          // style="height:30vh;"
          if (perguntaDoc.conteudo.opcoes[y].tipo == "texto") { ////Se corpo for Texto
            var idx = parseInt(sorteados[y]) + 1;
            puty += '<button  value="' + correta + '" id="' + idx + '" name="' + idPergunta + '" type="button" style="height:200px;" class="btn btn-info btn-lg btn-block fontEX_XS btnOP btn-opcao-' + idPergunta + '"> ' +
              perguntaDoc.conteudo.opcoes[sorteados[y]].conteudo + '</button></div>';
          } else if (perguntaDoc.conteudo.opcoes[y].tipo == "imagem") { ///Se corpo for Imagem
            puty += '<button value="' + correta + '" id="' + sorteados2[y] + '" name="' + idPergunta + '" type="button" class="btn btn-info btn-lg btn-block btnOP btn-opcao-' + idPergunta + '"> ' +
              '<img src="data:image/png;base64,' + perguntaDoc._attachments['op' + sorteados2[y] + '.png'].data + '" style="height:180px;" class="pull-center"/></button></div>';
          }
        }

        if (perguntaDoc.conteudo.tipoDoCorpo == "audio") {
          self.filesApagar.push(perguntaDoc._id + '.mp3');
          perguntas_local2.getAttachment(perguntaDoc._id, 'corpo.mp3', function(err2, mp3Aud) {
            if (err2) console.log(err2);
            self.GravarSOMfiles(perguntaDoc._id + '.mp3', mp3Aud, function() {
              console.log('FUNCIONA');
              $('#Audio' + perguntaDoc._id).attr("src", cordova.file.dataDirectory + "/files/" + perguntaDoc._id + ".mp3")

            }, function(err) {
              console.log("DEU ERRO" + err);
            });
          });
        }

        // $containerCorr.on('click', '.btnOP', function(ev) {
        //   var $btn = $(this); // O jQuery passa o btn clicado pelo this
        //   $('.btn-opcao-' + idPergunta).removeClass("btn-success");
        //   $('.btn-opcao-' + idPergunta).addClass("btn-info");
        //   $(this).removeClass("btn-info");
        //   $(this).addClass("btn-success");
        //
        //   var qwerty = _.findIndex(self.array, function(i) {
        //     return i[0] == $btn[0].name
        //   });
        //   self.array[qwerty] = [$btn[0].name, $btn[0].id, $btn[0].value];
        //
        //   $('#carouselPrincipal').carousel('next');
        // });

        puty +=  '</div>';
        return puty;

      });
    },

    events: {
      "click #btnFinalizar": "clickbtnFinalizar",
      "click #btnConfirmarSUB": "clickbtnConfirmarSUB",
      "click #btnConfirmarPIN": "clickbtnConfirmarPIN",
    },

    clickbtnConfirmarPIN: function(e) {
      var self = this;
      var pinDigitado = $('#inputPIN').val();
      var pinProfAux = window.localStorage.getItem("ProfSelecPIN");
      if (pinProfAux == pinDigitado) {
        $('#myModalProf').modal("hide");
        $('#myModalProf').on('hidden.bs.modal', function(e) {
          self.auxRemoveAll();
          document.removeEventListener("backbutton", self.onBackKeyDowns, false); ////// RETIRAR EVENTO DO BOTAO
          window.history.go(-1);
        });
      } else {
        $('#inputPINErr').addClass("has-error");
        $('#labelErr').text("PIN errado!");
        $('#inputPIN').val("");
      }
    },


    clickbtnConfirmarSUB: function(e) {
      var self = this;
      var contVENC = 0;
      var semResposta = false;
      for (var i = 0; i < self.array.length; i++) {
        if (self.array[i][1] == 0)
          semResposta = true;
        else
        if (self.array[i][1] == self.array[i][2]) {
          contVENC++;
          console.log(self.array[i][0] + " -- Venceu");
        } else
          console.log(self.array[i][0] + " -- Perdeu");
      }


      var agora = new Date();
      var TesteTextArealizarID = window.localStorage.getItem("TesteTextArealizarID");
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var profId = window.localStorage.getItem("ProfSelecID");

      var nota = ((contVENC * 100) / self.array.length);

      var resolucao = {
        'id_Teste': TesteTextArealizarID,
        'id_Aluno': alunoId,
        'id_Prof': profId,
        'tipoCorrecao': 'Multimédia',
        'nota': nota,
        'respostas': [],
        'dataReso': agora,
        'observ': null,
      };

      for (var i = 0; i < self.array.length; i++) {
        resolucao.respostas.push({
          'idPergunta': self.array[i][0],
          'conteudo': {
            'escolha': self.array[i][1]
          },
          'correcao': {
            'certa': self.array[i][2]
          },
        });
      }

console.log("Acertou " + contVENC + " pergunta(s)");
      // resolucoes_local2.post(resolucao, function(err, response) {
      //   if (err) {
      //     console.log('Resolucao ' + err + ' erro');
      //   } else {
      //     console.log('Parabens Inserido Resolucao');
      //     self.modelTrue = true;
      //     $('#myModalSUB').modal("hide");
      //     $('#myModalSUB').on('hidden.bs.modal', function(e) {
      //       $("#myModalCont").modal("show");
      //       $("#semafro").text("Acertou " + contVENC + " pergunta(s)");
      //       $('#myModalCont').on('hidden.bs.modal', function(e) {
      //         self.modelTrue = false;
      //         self.auxRemoveAll();
      //         document.removeEventListener("backbutton", self.onBackKeyDowns, false); ///RETIRAR EVENTO DO BOTAO
      //         window.history.back();
      //       });
      //     });
      //
      //   }
      // });
    },

    clickbtnFinalizar: function(e) {
      var self = this;

      var semResposta = false;
      console.log(self.array.length);
      console.log(self.array)
      for (var i = 0; i < self.array.length; i++) {
        if (self.array[i][1] == 0)
          semResposta = true;
      }


      if (semResposta) {
        $('#avisoLB').text("Aviso: Existe perguntas que ainda não respondeu!");
      } else {
        $('#avisoLB').text(" ");
        e.stopPropagation();
        e.preventDefault();
        self.modelTrue = true;
        $('#myModalSUB').modal("show");
      }
    },

    render: function() {
      this.$el.html(template({}));



      return this;
    }
  });
});
