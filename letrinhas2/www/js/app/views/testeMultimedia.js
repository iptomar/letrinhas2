define(function(require) {
  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/testeMultimedia.html'),
    template = _.template(janelas);

  return Backbone.View.extend({
    array: [],


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

    desenhaJanelaFim: function() {
      var $containerCorr = $('#carroselT');
      var $div = $('<div class="item" style="height:90vh;"></br></br><div class="panel-heading fontEX_XSS centerEX">' +
        '</br></br></br><span >Finalizar Teste?</span></br>' +
        '<button id="btnFinalizar" style="height:100px;" type="button" class="btn btn-success btn-lg btn-block">' +
        '<span class="glyphicon glyphicon-ok fontEX_XSS" aria-hidden="true"> Finalizar</span></button></br></br>' +
        '<h3 id="avisoLB" style="color: red;"> </h3>' +
        '</div></div>');
      $div.appendTo($containerCorr); //Adiciona ao Div


    },

    desenhaJanelas: function(idPergunta, inic, fini) {
      var self = this;
      perguntas_local2.get(idPergunta, {
        attachments: true
      }).then(function(perguntaDoc) {


        self.array.push([perguntaDoc._id, 0 , -1]);

        var $containerCorr = $('#carroselT');
        var $div = "";
        if (inic == true)
          $div = $('<div id="' + idPergunta + '" class="item active"></div>');
        else
          $div = $('<div id="' + idPergunta + '" class="item"></div>');

        $div.appendTo($containerCorr); //Adiciona ao Div
        var $containerPrin = $('#' + idPergunta);


        var $divTit = $('</br></br><div class="panel panel-info">' +
          '<div class="panel-heading fontEX_XSS centerEX">' +
          '<span id="titlePerguntatxt">' + perguntaDoc.pergunta + '</span>' +
          '</div></div>');

        $divTit.appendTo($containerPrin); //Adiciona ao Div

        var construirJanelaConteudo = '<div class="panel fontEX_XL centerEX">';
        if (perguntaDoc.conteudo.tipoDoCorpo == "texto") {
          construirJanelaConteudo +=
            ' <div class="panel-heading" style="height:30vh;"> <h2 style="font-size:8vh;">' + perguntaDoc.conteudo.corpo +
            '</h2></div>';
        } else if (perguntaDoc.conteudo.tipoDoCorpo == "imagem") {
          construirJanelaConteudo +=
            ' <div class="panel-heading" style="height:30vh;"> <img class="imgMultimedia" src="data:image/png;base64,' + perguntaDoc._attachments['corpo.png'].data + '" style="height:190px;" /> ' +
            '</div>';
        } else if (perguntaDoc.conteudo.tipoDoCorpo == "audio") {
          construirJanelaConteudo +=
            ' <div class="panel-heading" style="height:30vh;"> </br><audio id="Audio'+ perguntaDoc._id+'" controls="controls"  style="width: 100%"></audio>' +
            '</div>';
        }
        construirJanelaConteudo += '</div></br></br></br></br><div>';


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
            construirJanelaConteudo += '<div class="col-md-4">';
          else if (tamanhoTotalOpc == 2)
            construirJanelaConteudo += '<div class="col-md-6">';
          else if (tamanhoTotalOpc == 4)
            construirJanelaConteudo += '<div class="col-md-3">';
          // style="height:30vh;"
          if (perguntaDoc.conteudo.opcoes[y].tipo == "texto") { ////Se corpo for Texto
            var idx = parseInt(sorteados[y])+1;
            construirJanelaConteudo += '<button  value="'+correta+'" id="' + idx + '" name="' + idPergunta + '" type="button" style="height:200px;" class="btn btn-info btn-lg btn-block fontEX_XS btnOP btn-opcao-' + idPergunta + '"> ' +
              perguntaDoc.conteudo.opcoes[sorteados[y]].conteudo + '</button></div>';
          } else if (perguntaDoc.conteudo.opcoes[y].tipo == "imagem") { ///Se corpo for Imagem
            construirJanelaConteudo += '<button value="'+correta+'" id="' + sorteados2[y] + '" name="' + idPergunta + '" type="button" class="btn btn-info btn-lg btn-block btnOP btn-opcao-' + idPergunta + '"> ' +
              '<img src="data:image/png;base64,' + perguntaDoc._attachments['op' + sorteados2[y] + '.png'].data + '" style="height:180px;" class="pull-center"/></button></div>';
          }
        }
        var $exemp = $(construirJanelaConteudo);
        $exemp.appendTo($containerPrin);
          console.log();
        if (perguntaDoc.conteudo.tipoDoCorpo == "audio") {
          perguntas_local2.getAttachment(testeDoc._id, 'corpo.mp3', function(err2, mp3Aud) {
            if (err2) console.log(err2);
            self.GravarSOMfiles('corpo.mp3', mp3Aud, function() {
              console.log('FUNCIONA');
              $('#Audio'+ perguntaDoc._id).attr("src", cordova.file.dataDirectory + "/files/corpo.mp3")

            }, function(err) {
              console.log("DEU ERRO" + err);
            });
          });
        }

        $containerPrin.on('click', '.btnOP', function(ev) {
          console.log("oi");
          var $btn = $(this); // O jQuery passa o btn clicado pelo this
          $('.btn-opcao-' + idPergunta).removeClass("btn-success");
          $('.btn-opcao-' + idPergunta).addClass("btn-info");
          $(this).removeClass("btn-info");
          $(this).addClass("btn-success");



            self.array[_.findIndex(self.array, function(i) {
              return i[0] == $btn[0].name
            })] = [$btn[0].name, $btn[0].id ,$btn[0].value];

        });

        if (fini == true)
          self.desenhaJanelaFim();
      });
    },

    events: {
      "click #btnFinalizar": "clickbtnFinalizar",
      "click #btnConfirmarSUB": "clickbtnConfirmarSUB",

    },

    clickbtnConfirmarSUB: function(e) {
      var self = this;
      var contVENC = 0;
      var semResposta = false;
      for (var i = 0; i < self.array.length; i++) {
        if (self.array[i][1] == 0)
        semResposta = true;
        else
        if (self.array[i][1] == self.array[i][2]){
          contVENC++;
          console.log(self.array[i][0]+" -- Venceu");
        }
        else
          console.log(self.array[i][0]+" -- Perdeu");
      }


        var agora = new Date();
        var TesteTextArealizarID = window.localStorage.getItem("TesteTextArealizarID");
        var alunoId = window.localStorage.getItem("AlunoSelecID");
        var profId = window.localStorage.getItem("ProfSelecID");

         var nota = ((contVENC * 100)/self.array.length);

          var resolucao = {
            'id_Teste': TesteTextArealizarID,
            'id_Aluno': alunoId,
            'id_Prof': profId,
            'tipoCorrecao': 'multimedia',
            'nota': nota,
            'respostas': [],
            'dataReso': agora,
            'observ': null,
          };

          for (var i = 0; i < self.array.length; i++) {
          resolucao.respostas.push({
            'idPergunta': self.array[i][0],
            'conteudo': {'escolha': self.array[i][1]},
            'correcao': {'certa': self.array[i][2]},
          });
        }
         console.log(resolucao);
         resolucoes_local2.post(resolucao, function(err, response) {
           if (err) {
             console.log('Resolucao ' + err + ' erro');
           } else {
             console.log('Parabens Inserido Resolucao');
             self.modelTrue = true;
             $('#myModalSUB').modal("hide");
             $('#myModalSUB').on('hidden.bs.modal', function(e) {
               $("#myModalCont").modal("show");
               $("#semafro").text("Acertou "+contVENC+" pergunta(s)");
               $('#myModalCont').on('hidden.bs.modal', function(e) {
                  self.modelTrue = false;
              //    document.removeEventListener("backbutton", self.onBackKeyDowns, false); ///RETIRAR EVENTO DO BOTAO
                  window.history.back();
               });
             });

           }
         });
    },

    clickbtnFinalizar: function(e) {
      var self = this;

      var semResposta = false;
      for (var i = 0; i < self.array.length; i++) {
        if (self.array[i][1] == 0)
        semResposta = true;
      }


      if(semResposta)
      {
        $('#avisoLB').text("Aviso: Existe perguntas que ainda não respondeu!");
      }
      else{
        $('#avisoLB').text(" ");
      e.stopPropagation();
      e.preventDefault();
      self.modelTrue = true;
      $('#myModalSUB').modal("show");
    }
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

      testes_local2.get(TesteTextArealizarID, function(err, testeDoc) {
        if (err) console.log(err);
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
        ////////////////fim ////////////////////////////////


        for (var i = 0; i < testeDoc.perguntas.length; i++) {
          if (i == 0) {
            var $containerIND = $('#IndicatorsCorr');
            var $li = $('<li data-target="#carouselPrincipal" data-slide-to="0" class="active"></li>');
            $li.appendTo($containerIND);
            self.desenhaJanelas(testeDoc.perguntas[0], true, false);
          } else {
            var $containerIND = $('#IndicatorsCorr');
            var $li = $('<li data-target="#carouselPrincipal" data-slide-to="' + i + '" ></li>');
            $li.appendTo($containerIND);
            if(i == testeDoc.perguntas.length-1)
            self.desenhaJanelas(testeDoc.perguntas[i], false, true);
            else
            self.desenhaJanelas(testeDoc.perguntas[i], false, false);
          }
        }
        var $containerIND = $('#IndicatorsCorr');
        var $li = $('<li data-target="#carouselPrincipal" data-slide-to="' + testeDoc.perguntas.length + '" ></li>');
        $li.appendTo($containerIND);
      });


      return this;
    }
  });
});
