define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherCorrecao.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    initialize: function() {
    },

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    events: {
      "click #BackButton": "clickBackButton",
      "click #btnNavINI": "clickbtnNavINI",
      "click #btnNavDisci": "clickbtnNavDisci",
      "click #btnNavMenu": "clickbtnNavMenu",
    },

    clickbtnNavMenu: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-1);
    },

    clickbtnNavDisci: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-2);
    },


    clickbtnNavINI: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-3);
    },


    clickBackButton: function(e) {
      window.history.back();
    },


    render: function() {
      this.$el.html(template());
      ////Carrega os dados mais uteis da janela anterior////
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");

      professores_local2.getAttachment(profId, 'prof.jpg', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src", url);
      });

      function map(doc) {
        if (doc.nota == "-1" && doc.id_Prof == window.localStorage.getItem("ProfSelecID")) {
          emit(doc);
        }
      }

      function convert_n2d(n) {
        if (n < 10) return ("0" + n);
        else return ("" + n);
      }

      function processarDados2(resolucoes) {
        return function(errx, testeDoc) {
          if (errx) {
            console.log(errx);
          }
          var $container = $('#outputCorrTestes');

          var dataCompleta;
          var titulo = testeDoc.titulo;
          console.log("aaaa "+ resolucoes.key._id );
          var data = new Date(resolucoes.key.dataReso);
          dataCompleta = titulo + " - Executado às " +
            convert_n2d(data.getHours()) + ":" + convert_n2d(data.getMinutes()) + ":" + convert_n2d(data.getSeconds()) + " do dia " + convert_n2d(data.getDate()) + " do " + (convert_n2d(data.getMonth() + 1)) + " de" + data.getFullYear();
            //////Buscar Info da pergunta do Teste
          perguntas_local2.get(testeDoc.perguntas[0], function(err, perguntasDoc) {
            if (err) console.log(err);

            var tipoTeste = perguntasDoc.tipoTeste;
            var disciplina = perguntasDoc.disciplina;
            var urlTipo;
            var urlDiscp;
            //////Buscar Imagem da Tipo
            if (tipoTeste == "Lista") {
              urlTipo = "img/testLista.png";
            }
            if (tipoTeste == "Texto") {
              urlTipo = "img/testeTexto.png";
            }

            //////Buscar Imagem da disciplina
            switch (disciplina) {
              case "Português":
                urlDiscp = "img/portugues.png";
                break;
                case "Matemática":
                urlDiscp = "img/mate.png";
                break;
                case "Estudo do Meio":
                urlDiscp = "img/estudoMeio.png";
                break;
                case "Inglês":
                urlDiscp = "img/ingles.png";
                break;
                case "Outro":
                urlDiscp = "img/outro.png";
                break;
            }


            alunos_local2.getAttachment(resolucoes.key.id_Aluno, 'aluno.jpg', function(err2, DataImg) {
              if (err2) console.log(err2);
              var url = URL.createObjectURL(DataImg);

              alunos_local2.get(resolucoes.key.id_Aluno, function(err, alunoDoc) {
                if (err) console.log(err);


                //   //construir o botão
                var $btn = $(
                  '<div class="col-sm-20">' +
                  '<button id="' + resolucoes.key._id + '" value="' + tipoTeste + '" name ="' + alunoDoc.nome + '" type="button"' +
                  'style="height:100px;  padding: 0px 10px 0px 10px;"' +
                  'class="btn btn-info btn-lg btn-block btn-Corr" >' +
                  '<img  src="' + url + '" style=" float: left; height:60px;"/>' +
                  '<img  val=0 src="' + urlTipo + '" style=" float: right; height:60px; margin-left:5px"/>' +
                  '<img  src="' + urlDiscp + '" style=" float: right; height:60px; margin-left:5px"/>' +
                  '<a style="color:#FFFFFF;" aria-hidden="true">' +
                  '<p>' + alunoDoc.nome + '</p>' +
                  '<p>' + dataCompleta + '</p>' +
                  '</a>' +
                  '</button>' +
                  '</div>');

                $btn.appendTo($container);

                $("#" + resolucoes.key._id).click(function(ev) {
                  var $btn = $(this); // O jQuery passa o btn clicado pelo this
                  var self = this;
                  window.localStorage.setItem("CorrecaoID", $btn[0].id + ''); //enviar variavel
                  window.localStorage.setItem("AlunoNameAux", $btn[0].name + ''); //enviar variavel
                  if($btn.val() == "Texto" ){
                    if (Backbone.history.fragment != 'corrigirTexto') {
                      utils.loader(function() {
                        ev.preventDefault();
                        app.navigate('/corrigirTexto', {trigger: true});
                      });
                    }
                  }else{
                    if($btn.val() == "Lista" ){
                      if (Backbone.history.fragment != 'corrigirLista') {
                        utils.loader(function() {
                          ev.preventDefault();
                          app.navigate('/corrigirLista', {trigger: true});
                        });
                      }
                    }
                  }
                })
              });
            });
          });
          }
      }


      function processarDados() {
        return function(errx, response) {
          if (errx) {
            console.log(errx);
          }

          if (response.rows.length > 0)
            $("#Cabecalho").text("Tem " + response.rows.length + " testes por corrigir.");
          else
            $("#Cabecalho").text("Não Têm testes a Corrigir...");
          for (var i = 0; i < response.rows.length; i++) {

            var resolucoes = response.rows[i];

            //////Buscar Info  do Teste
            testes_local2.get(resolucoes.key.id_Teste, processarDados2(resolucoes) );
          }
        }
      }

      resolucoes_local2.query({
        map: map
      }, {
        reduce: false
      }, processarDados());


      return this;
    }
  });
});
