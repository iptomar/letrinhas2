define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    tpl = require('text!tpl/escolherTipoTeste.html'),
    template = _.template(tpl);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var alunoNome = window.localStorage.getItem("AlunoSelecNome");
      var turmaId = window.localStorage.getItem("TurmaSelecID");
      var turmaNome = window.localStorage.getItem("TurmaSelecNome");
      var tipoTestSelc = window.localStorage.getItem("TipoDiscSelecionado");

      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        if (tipoTestSelc == '1'){$('#labelDisciplina').text("Português");  $('#imgDisciplinaIcon').attr("src","img/portugues.png");}
        if (tipoTestSelc == '2'){$('#labelDisciplina').text("Matemática"); $('#imgDisciplinaIcon').attr("src","img/mate.png");}
        if (tipoTestSelc == '3'){$('#labelDisciplina').text("Estudo do Meio"); $('#imgDisciplinaIcon').attr("src","img/estudoMeio.png");}
        if (tipoTestSelc == '4'){$('#labelDisciplina').text("Inglês"); $('#imgDisciplinaIcon').attr("src","img/ingles.png");}

        $('#lbNomeTurma').text("  ["+turmaNome+"  ]");
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src",url);
      });


      alunos_local2.getAttachment(alunoId, 'aluno.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeAluno').text(alunoNome);
        $('#imgAluno').attr("src",url);
      });

    },



    events: {
      "click #BackButtonETT": "clickBackButtonETT",
      "click #btnTesteLeituraPalav": "clickbtnTesteLeituraPalav",
      "click #btnTesteLeituraTextos": "clickbtnTesteLeituraTextos",
      "click #btnTesteLeituraMultimedia": "clickbtnTesteLeituraMultimedia",
    },


    clickBackButtonETT: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.back();
    },

    clickbtnTesteLeituraPalav: function(e) {

    },

    clickbtnTesteLeituraTextos: function(e) {
    //  window.history.back();
    },

    clickbtnTesteLeituraMultimedia: function(e) {
      //window.history.back();
    },


    render: function() {
      this.$el.html(template({}));
      return this;
    }

  });

});
