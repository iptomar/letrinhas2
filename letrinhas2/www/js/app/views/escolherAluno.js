define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherAluno.html'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    /////// Funcao executada no inicio de load da janela ////////////
    initialize: function() {



    },

    events: {
      "click #btnTeste": "clickTeste",
      "click #BackButtonEA": "clickBackButtonEA",
      "click #btnNavINI": "clickbtnNavINI",
      "click #btnNavDisci": "clickbtnNavDisci",
      "click #btnNavMenu": "clickbtnNavMenu",
      "click #btnNavTurmas": "clickbtnNavTurmas",
    },

    clickbtnNavTurmas: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-1);
    },

    clickbtnNavMenu: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-2);
    },

    clickbtnNavDisci: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-3);
    },


    clickbtnNavINI: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-4);
    },


    clickBackButtonEA: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.back();
    },

    render: function() {
      this.$el.html(template({}));

      ////Carrega dados da janela anterior////
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var turmaId = window.localStorage.getItem("TurmaSelecID");
      var turmaNome = window.localStorage.getItem("TurmaSelecNome");


      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#imgProf').attr("src", url);
      });
      console.log("Assssssssssssssssssssssssssss");
      /// Vai buscar todas as escolas da base de dados //
      escolas_local2.get(escolaId, function(err, escolaDoc) {
        if (err) console.log(err);
        window.localStorage.setItem("EscolaSelecionadaNome", escolaDoc.nome + ''); //enviar variavel
        $('#lbNomeProf').text(profNome + " - [ " + escolaDoc.nome + " ]");
       $('#lbNomeAluno').text("[ "+turmaNome+" ]  ");
      });

      function map(doc) {
        if (doc.estado == true && doc.turma == window.localStorage.getItem("TurmaSelecID")) {
          emit(doc);
        }
      }

      alunos_local2.query({
        map: map
      }, {
        include_docs: true,
        attachments: false
      }).then(function(response) {
        var $container = $('#outputAlunos'); //Adiciona ao Div
        if (response.rows.length == 0) {
          var $btn = $('<h3>---SEM ALUNOS NESTA TURMA---<h3>');
          $btn.appendTo($container); //Adiciona ao Div
        } else {
          console.log("Assssssssssssssssssssssssssss");
          var instrucoes = [];

          for (var i = 0; i < response.rows.length; i++) {
              var abc = response.rows[i].id;
              console.log(abc);
          var ImaAluno =  alunos_local2.getAttachment(abc, 'aluno.png').then(function (DataImg) {
            var url = URL.createObjectURL(DataImg);
              return url;
            });


            instrucoes.push(ImaAluno)
          }


          Promise.all(instrucoes).then(function (url) {
              console.log(url[0]);
              console.log(url[1]);
              console.log("gtgggggg");

              for (var i = 0; i < response.rows.length; i++) {

                var $btn = $(
                  '<div class="col-md-4">' +
                  '<div class="thumbnail" style="height:160px;"  >' +
                  '<div class="caption">' +
                  '<button id="' + response.rows[i].doc._id + '" type="button" class="btn btn-info btn-lg btn-block btn-aluno" >' +
                  '<img style="height:100px;" ' +
                  //'src="data:image/png;base64,' + response.rows[i].doc._attachments['aluno.png'].data + '"' +
                   'src="'+url[i]+'"'+
                  'class="pull-left"/>' + response.rows[i].doc.nome + '</button>' +
                  '</div>' +
                  '</div></br>' +
                  '</div>');
                $btn.appendTo($container); //Adiciona ao Div
              }



          });



          $container.on('click', '.btn-aluno', function(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            var $btn = $(this); // O jQuery passa o btn clicado pelo this
            var self = this;
            var tipoOpcao = window.localStorage.getItem("TipoOpaoSelec");
            if (tipoOpcao == 'realizarTeste')
            {
              if (Backbone.history.fragment != 'escolherTeste') {
                utils.loader(function() {
                  ev.preventDefault();
                  window.localStorage.setItem("AlunoSelecNome", $btn[0].innerText + ''); //enviar variavel
                  window.localStorage.setItem("AlunoSelecID", $btn[0].id + ''); //enviar variavel
                  app.navigate('/escolherTeste', {
                    trigger: true
                  });
                });
              }
            }
            else
            {
              if (Backbone.history.fragment != 'escolherResultados') {
                utils.loader(function() {
                  ev.preventDefault();
                  window.localStorage.setItem("AlunoSelecNome", $btn[0].innerText + ''); //enviar variavel
                  window.localStorage.setItem("AlunoSelecID", $btn[0].id + ''); //enviar variavel
                  app.navigate('/escolherResultados', {
                    trigger: true
                  });
                });
              }
            }
          });
        }
      });

      return this;
    }
  });
});
