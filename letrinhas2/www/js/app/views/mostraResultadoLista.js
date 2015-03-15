
define(function(require) {

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/mostraResultadoLista.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {
      ////Carrega os dados mais uteis da janela anterior////
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var alunoNome = window.localStorage.getItem("AlunoSelecNome");
      var reslutadoID =  window.localStorage.getItem("resultadoID");


      var nome, foto;
      alunos_local2.get(alunoId, function(err, alunoDoc) {
        if (err)  console.log(err);
        nome = alunoDoc.nome;
        $("#lbNomeAluno" ).text(nome);
      });

      alunos_local2.getAttachment(alunoId, 'aluno.png', function(err2, DataImg) {
          if (err2)  console.log(err2);
          foto = URL.createObjectURL(DataImg);
          $('#alunoFoto').attr("src",foto);
      });

    },

    //Eventos Click
    events: {


    },

    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});
