define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherResultados.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {
    },

    events: {
      "click #btnNavINI": "clickbtnNavINI",
      "click #btnNavDisci": "clickbtnNavDisci",
      "click #btnNavMenu": "clickbtnNavMenu",
      "click #btnNavTurmas": "clickbtnNavTurmas",
      "click #btnNavAlunos": "clickbtnNavAlunos",
    },

    clickbtnNavAlunos: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-1);
    },


    clickbtnNavTurmas: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-2);
    },

    clickbtnNavMenu: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-3);
    },

    clickbtnNavDisci: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-4);
    },


    clickbtnNavINI: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-5);
    },


    render: function() {
      this.$el.html(template());

      ////Carrega os dados mais uteis da janela anterior////
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var alunoNome = window.localStorage.getItem("AlunoSelecNome");
      var turmaId = window.localStorage.getItem("TurmaSelecID");
      var turmaNome = window.localStorage.getItem("TurmaSelecNome");

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



      function convert_n2d(n) {
        if (n < 10) return ("0" + n);
        else return ("" + n);
      }

      //procurar os resultados das correções do aluno selecionado.
      function map(doc) {
       if (doc.nota != -1 && doc.id_Aluno == window.localStorage.getItem("AlunoSelecID")) {
         emit(doc);
       }
      }

      resolucoes_local2.query({
        map: map,
      }, {
        reduce: false,
      }, processarDados());

      function processarDados() {
        return function(errx, response) {
          if (errx) {
            console.log(errx);
          } else {

            if (response.rows.length > 0) {
              //criar um array para receber as correções
            var l=response.rows.length;
            //criar um array para receber as correções unicas por teste

            var resultados= new Array();
            resultados[0] =  response.rows[0].key;
            if(l>1){
              var j=0;
              var resAux= new Array();
              for (var i=1; i< l; i++){
                resAux[i] =  response.rows[i].key;
                if(resAux[i].id_Teste != resultados[j].id_Teste){
                  j++;
                  resultados[j]=resAux[i];
                }
              }
            }

              //criar um array para receber as correções
              var total = resultados.length;
              //preencher o cabeçalho
              $("#Cabecalho").text("Tem " + total + " resultados.");
              ///////////////////////////////////////////////////////////
              //construir os botões,
              // Titulo do teste - Data/hora | Tipo de Teste| | Disciplina |
              //
              for (var i = 0; i < total; i++) {
                //buscar a foto e nome do aluno
                var correcaoEncontrada = resultados[i];
                console.log(correcaoEncontrada.id_Teste);
                //buscar o título, tipo e disciplina do teste
                testes_local2.get(correcaoEncontrada.id_Teste, processarDados2(correcaoEncontrada));
              }
            } else {
              $("#Cabecalho").text("Não existem resultados.");
            }
          }
        }
      }

      function processarDados2(correcaoEncontrada) {
        return function(errx, testeDoc) {
          if (errx) {
            console.log(errx);
          } else {
            var urlTipo, urlDiscp;
            var titulo = testeDoc.titulo;
            var data = new Date(correcaoEncontrada.dataReso);
            var tituloBtn = titulo + " - Executado às " +
              convert_n2d(data.getHours()) + ":" + convert_n2d(data.getMinutes()) + ":" + convert_n2d(data.getSeconds()) + " do dia " + convert_n2d(data.getDate()) + " do " + (convert_n2d(data.getMonth() + 1)) + " de " + data.getFullYear();

            perguntas_local2.get(testeDoc.perguntas[0], function(err, perguntasDoc) {
              if (err) console.log(" ddds" + err);
              var disciplina = perguntasDoc.disciplina;
              var tipoTeste = perguntasDoc.tipoTeste
                //imagem da disciplina e tipo de teste
              switch (disciplina) {
                case 1:
                  urlDiscp = "img/portugues.png";
                  break;
                case 2:
                  urlDiscp = "img/mate.png";
                  break;
                case 3:
                  urlDiscp = "img/estudoMeio.png";
                  break;
                case 4:
                  urlDiscp = "img/ingles.png";
                  break;
              }
              if (tipoTeste == "palavras") {
                urlTipo = "img/testLista.png";
              } else
                if (tipoTeste == "texto") {
                  urlTipo = "img/testeTexto.png";
                }
               else
               if (tipoTeste == "interpretacao") {
                 urlTipo = "img/testInterpretacao.png";
               }
               else
               if (tipoTeste == "multimedia") {
                 urlTipo = "img/testMul.png";
               }

              var $container = $('#outputResultado');
              //construir o botão
              var $btn = $(
                '<div class="col-sm-20">' +
                '<button id="' + correcaoEncontrada._id + '" value="' + correcaoEncontrada.tipoCorrecao + '" type="button"' +
                'style="height:100px;  padding: 0px 10px 0px 10px;"' +
                'class="btn btn-info btn-lg btn-block btn-Corr" >' +
                '<img  src="' + urlTipo + '" style=" float: right; height:65px; margin-left:5px"/>' +
                '<img  src="' + urlDiscp + '" style=" float: right; height:60px; margin-left:5px"/>' +
                '<a style="color:#FFFFFF;" aria-hidden="true">' +
                '<p>' + tituloBtn + '</p>' +
                '</a>' +
                '</button>' +
                '</div>');
              $btn.appendTo($container);
              $("#" + correcaoEncontrada._id).click(function(ev) {
                var $btn = $(this); // O jQuery passa o btn clicado pelo this
                var self = this;
              window.localStorage.setItem("resultadoID", $btn[0].id + ''); //enviar variavel
              if($btn.val() == "texto" ){
                if (Backbone.history.fragment != 'mostraResultadoTexto') {
                  utils.loader(function() {
                    ev.preventDefault();
                    app.navigate('/mostraResultadoTexto', {trigger: true});
                  });
                }
              }else
                if($btn.val() == "palavras" ){
                  if (Backbone.history.fragment != 'mostraResultadoLista') {
                    utils.loader(function() {
                      ev.preventDefault();
                      app.navigate('/mostraResultadoLista', {trigger: true});
                    });
                  }
                }
              else
                if($btn.val() == "interpretacao" ){
                  if (Backbone.history.fragment != 'mostraResultadoInterpretacao') {
                    utils.loader(function() {
                      ev.preventDefault();
                      app.navigate('/mostraResultadoInterpretacao', {trigger: true});
                    });
                  }
                }
                else
                if($btn.val() == "multimedia" ){
                  if (Backbone.history.fragment != 'mostraResultadoMultimedia') {
                    utils.loader(function() {
                      ev.preventDefault();
                      app.navigate('/mostraResultadoMultimedia', {trigger: true});
                    });
                  }
                }
              });

            });
          }
        }
      }

      return this;
    }
  });
});
