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

      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#imgProf').attr("src", url);
      });

          /// Vai buscar todas as escolas da base de dados //
          escolas_local2.get(escolaId, function(err, escolaDoc) {
            if (err) console.log(err);
            window.localStorage.setItem("EscolaSelecionadaNome", escolaDoc.nome + ''); //enviar variavel
            $('#lbNomeProf').text(profNome + " - [ " +escolaDoc.nome+" ]");
            var $container = $('#outputAlunos'); //Adiciona ao Div
            console.log(escolaDoc);
            for (var i = 0; i < escolaDoc.turmas.length; i++) {
              //Se o id do aluno da turma é igual ao id do aluno entao vai buscar seus dados//


              if (escolaDoc.turmas[i]._id == turmaId) {
                $('#lbNomeAluno').text("[ "+escolaDoc.turmas[i].nome+" ]  ");
                window.localStorage.setItem("TurmaSelecNome", escolaDoc.turmas[i].nome + ''); //enviar variavel
                for (var y = 0; y < escolaDoc.turmas[i].alunos.length; y++) {
                  var idAlunox = escolaDoc.turmas[i].alunos[y].id;

                  alunos_local2.get(idAlunox, function(err, alunoDoc) {
                    if (err) console.log(err);

                    alunos_local2.getAttachment(alunoDoc._id, 'aluno.png', function(err2, DataImg) {
                      if (err2) console.log(err2);
                      var url = URL.createObjectURL(DataImg);
                      var $btn = $(
                        '<div class="col-md-4">' +
                        '<div class="thumbnail" style="height:160px;"  >' +
                        '<div class="caption">' +
                        "<button id='" + alunoDoc._id + "' type='button' class='btn btn-info btn-lg btn-block btn-aluno' >" +
                        "<img style='height:100px;' src='" + url + "' class='pull-left'/>" + alunoDoc.nome + "</button>" +
                        '</div>' +
                        '</div></br>' +
                        '</div>');
                      $btn.appendTo($container); //Adiciona ao Div
                    });
                  });
                }

              }
            }
            //// Analisa todos os botoes do div e aqueles que forem botoes de escola escuta o evento click//
            $container.on('click', '.btn-aluno', function(ev) {
              ev.stopPropagation();
              ev.preventDefault();
              var $btn = $(this); // O jQuery passa o btn clicado pelo this
              var self = this;
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
            });
          });


      return this;
    }
  });
});
