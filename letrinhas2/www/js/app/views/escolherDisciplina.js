define(function(require) {
//// 1 -Portugues  2- Matematica
///  3 -EstudoMeio 4- Ingles
var BtnNavPress;
  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherDisciplina.html'),
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
      "click #BackButtonED": "clickBackButtonED",
      "click #btnSelecPortugues": "clickbtnSelecPortugues",
      "click #btnSelecMate": "clickbtnSelecMate",
      "click #btnSelecEstuMeio": "clickbtnSelecEstuMeio",
      "click #btnSelecIngles": "clickbtnSelecIngles",
      "click #btnNavINI": "clickbtnNavINI",
    },

    clickbtnNavINI: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-1);
    },

    clickBackButtonED: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-1);
    },

    clickbtnSelecPortugues: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.localStorage.setItem("DiscplinaSelecionada", 1); //enviar variavel 1 -Portugues
      var self = this;
      if (Backbone.history.fragment != 'menuTipoOpcao') {
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);
          app.navigate('/menuTipoOpcao', {
            trigger: true
          });
        });
      }
    },

    clickbtnSelecMate: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.localStorage.setItem("DiscplinaSelecionada", 2); //enviar variavel 2- Matematica
      var self = this;
      if (Backbone.history.fragment != 'menuTipoOpcao') {
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);
          app.navigate('/menuTipoOpcao', {
            trigger: true
          });
        });
      }
    },

    clickbtnSelecEstuMeio: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.localStorage.setItem("DiscplinaSelecionada", 3); //enviar variavel 3 -EstudoMeio
      var self = this;
      if (Backbone.history.fragment != 'menuTipoOpcao') {
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);
          app.navigate('/menuTipoOpcao', {
            trigger: true
          });
        });
      }
    },

    clickbtnSelecIngles: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.localStorage.setItem("DiscplinaSelecionada", 4); //enviar variavel 4- Ingles
      var self = this;
      if (Backbone.history.fragment != 'menuTipoOpcao') {
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);
          app.navigate('/menuTipoOpcao', {
            trigger: true
          });
        });
      }
    },

    render: function() {
      this.$el.html(template({}));
      ////Carrega dados da janela anterior////
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src",url);
      });
      ////////////////////////
      return this;
    }
  });
});
