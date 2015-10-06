define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/menuTipoOpcao.html'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

    },

    events: {
      "click #BackButtonMO": "clickBackButtonMO",
      "click #btnRealizarTeste": "clickBtnRealizarTeste",
      "click #btnCorrigirTeste": "clickBtnCorrigirTeste",
      "click #btnConsultarTeste": "clickBtnConsultarTeste",
      "click #btnConsultarEstatisticas": "clickbtnConsultarEstatisticas",
      "click #btnNavINI": "clickbtnNavINI",
      "click #btnNavDisci": "clickbtnNavDisci",
    },



    clickbtnNavDisci: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-1);
    },


    clickbtnNavINI: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-2);
    },


    clickBackButtonMO: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.back();
    },

    clickBtnRealizarTeste: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'escolherTurma') {
        utils.loader(function() {
          e.preventDefault();
          window.localStorage.setItem("TipoOpaoSelec", 'realizarTeste'); //enviar variavel
          app.navigate('/escolherTurma', {
            trigger: true
          });
        });
      }
    },

    clickBtnCorrigirTeste: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'escolherCorrecao') {
        utils.loader(function() {
          e.preventDefault();
          app.navigate('/escolherCorrecao', {
            trigger: true
          });
        });
      }
    },

    clickBtnConsultarTeste: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'escolherTurma') {
        utils.loader(function() {
          e.preventDefault();
          window.localStorage.setItem("TipoOpaoSelec", 'consultarResolucao'); //enviar variave
          app.navigate('/escolherTurma', {
            trigger: true
          });
        });
      }
    },


    clickbtnConsultarEstatisticas: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'escolherTurma') {
        utils.loader(function() {
          e.preventDefault();
          window.localStorage.setItem("TipoOpaoSelec", 'consultarEstatisticas'); //enviar variave
          app.navigate('/escolherTurma', {
            trigger: true
          });
        });
      }
    },


    render: function() {
      this.$el.html(template({}));

      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");
        professores_local2.getAttachment(profId, 'prof.jpg', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src",url);

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

      return this;
    }
  });

});
