define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherCorrecao.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {
      ////Carrega os dados mais uteis da janela anterior////
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");

      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src",url);
      });

      //procurar as correções do professor selecionado e que ainda não estejam corrigidas.
      //inicialmente, agrupar por alunos, dando destaque ao aluno selecionado e ordenar pela data.
      function map(doc) {
        if (doc.estado == '0' &&
            doc.id_Prof == profId) {
          emit(doc);
        }
      }

      correcoes_local2.query({map: map}, {reduce: false}, function(errx, response) {
        if (errx)  alert("Erro: "+errx);
        else alert("Encontradas "+ response.rows.length +" Correções\n"
                +"Prof_id:" profId);
      });


      //
    },

    events: {
      "click #BackButton": "clickBackButton",
      "click #btnNavINI": "clickbtnNavINI",
      "click #btnNavAlu": "clickbtnNavAlu",
      "click #btnNavProf": "clickbtnNavProf",
    },

    clickBackButton: function(e) {
      window.history.back();
    },

    clickbtnNavAlu: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-2);
    },

    clickbtnNavProf: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-4);
    },


    clickbtnNavINI: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-6);
    },

    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});
