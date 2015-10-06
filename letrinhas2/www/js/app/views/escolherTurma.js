define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherTurma.html'),
    template = _.template(janelas);

  return Backbone.View.extend({
    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    /////// Funcao executada no inicio de load da janela ////////////
    initialize: function() {

    },

    //Eventos Click
    events: {
      "click #btnTeste": "clickTeste",
      "click #BackButtonET": "clickBackButtonET",
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

    clickBackButtonET: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.back();
    },

    render: function() {
      this.$el.html(template({}));

      /// Vai buscar todas as escolas da base de dados //
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");

      //// Vai buscar o doc da escola selecionada ///

      professores_local2.getAttachment(profId, 'prof.jpg', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src", url);

        if (discplinaSelecionada == 'Português') {
          $('#imgDisciplina').attr("src", "img/portugues.png");
        }
        if (discplinaSelecionada == 'Matemática') {
          $('#imgDisciplina').attr("src", "img/mate.png");
        }
        if (discplinaSelecionada == 'Estudo do Meio') {
          $('#imgDisciplina').attr("src", "img/estudoMeio.png");
        }
        if (discplinaSelecionada == 'Inglês') {
          $('#imgDisciplina').attr("src", "img/ingles.png");
        }
        if (discplinaSelecionada == 'Outras Línguas') {
          $('#imgDisciplina').attr("src", "img/outrasLinguas.png");
        }
        if (discplinaSelecionada == 'Outro') {
          $('#imgDisciplina').attr("src", "img/outro.png");
        }
      });


      /// Vai buscar todas as escolas da base de dados //
      escolas_local2.allDocs({
        include_docs: true,
        attachments: true
      }, function(err, data) {
        if (err) console.log(err);
        var $container = $('#outputEscolasTurmas');

        for (var i = 0; i < data.total_rows; i++) {

          //   console.log( data.rows[i].doc);
          var docsEscolasTurmas = data.rows[i].doc.turmas;

          for (var y = 0; y < docsEscolasTurmas.length; y++) {

            for (var z = 0; z < docsEscolasTurmas[y].professores.length; z++) {
              //    console.log(docsEscolasTurmas[y].professores[z].id);
              if (docsEscolasTurmas[y].professores[z].id == profId) {
              //  console.log(data.rows[i].doc.nome + "  --  " + docsEscolasTurmas[y]._id + "  -- ");

        console.log( data.rows[i].doc);

                var $btn = $(
                  '<div class="col-sm-4">' +
                  '<div class="thumbnail" style="height:170px;">' +
                  '<div class="caption"> ' +
                  '<button id="' + data.rows[i].doc._id +'" type="button" name="' + docsEscolasTurmas[y]._id + '" value="'+docsEscolasTurmas[y].ano + " - " + docsEscolasTurmas[y].nome+'" class="btn btn-info btn-lg btn-block btn-escola" >' +
                  " <img style='height:60px;' src='data:image/png;base64," + data.rows[i].doc._attachments['escola.jpg'].data + "'><p>" + data.rows[i].doc.nome + " </br><b>[" + docsEscolasTurmas[y].ano + " - " + docsEscolasTurmas[y].nome + "]</b> </p> " +
                  '</button>' +
                  '</div>' +
                  '</div></br>' +
                  '</div>');
                $btn.appendTo($container); //Adiciona ao Div
              }
            }
          }
        }

        //// Analisa todos os botoes do div e aqueles que forem botoes de escola escuta o evento click//
        $container.on('click', '.btn-escola', function(ev) {
          ev.stopPropagation();
          ev.preventDefault();
          var $btn = $(this); // O jQuery passa o btn clicado pelo this
          var self = this;
          if (Backbone.history.fragment != 'escolherAluno') {
            utils.loader(function() {
              ev.preventDefault();
              window.localStorage.setItem("TurmaSelecNome", $btn[0].value + ''); //enviar variavel
              window.localStorage.setItem("TurmaSelecID", $btn[0].name + ''); //enviar variavel
              window.localStorage.setItem("EscolaSelecionadaID", $btn[0].id + ''); //enviar variavel
              app.navigate('/escolherAluno', {
                trigger: true
              });
            });
          }
        });
      });

      return this;
    }
  });
});
