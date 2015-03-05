///////// ONDE SE CONFIGURA AS ROTAS DE NAVEGACAO ////////////
define(function(require) {
  "use strict";

  var $ = require('jquery');
  var Backbone = require('backbone'),
    BootView = require('app/views/boot'),
    classList = require('classList.min');

  Backbone.View.prototype.close = function() {
    this.remove();
    this.unbind();
    this.undelegateEvents();
  };

  var $body = $('#main_content');
  var $header = $('#header');

  return Backbone.Router.extend({
    currentView: undefined,
    menuView: undefined,

    showView: function(view) {
      $body.show();
      if (this.currentView) this.currentView.close();

      this.currentView = view;
      this.currentView.delegateEvents();

      var rendered = view.render();
      $body.html(rendered.el);

      var cl = document.body.classList;
      if (cl.contains('left-nav')) {
        cl.remove('left-nav');
      }

      $('.loader').fadeOut('slow');
    },

    routes: {
      "": "login",
      "login": "login",
      "escolherEscola": "escolherEscola",
      "escolherProf": "escolherProf",
      "escolherTurma": "escolherTurma",
      "escolherAluno": "escolherAluno",
      "menuTipoOpcao": "menuTipoOpcao",
      "escolherDisciplina": "escolherDisciplina",
      "escolherTipoTeste": "escolherTipoTeste",
      "escolherTeste": "escolherTeste",
      "testeTexto": "testeTexto",
      "testeLista": "testeLista",
      "escolherCorrecao":"escolherCorrecao",
      "corrigirLista":"corrigirLista",

    },

    boot: function() {
      var bootView = new BootView();
      this.showView(bootView);
    },

    corrigirLista: function() {
      var self = this;
      require(["app/views/corrigirLista"], function(CorrigirListaView) {
        var view = new CorrigirListaView();
        self.showView(view);
      });
    },

    escolherCorrecao: function() {
      var self = this;
      require(["app/views/escolherCorrecao"], function(EscolherCorrecaoView) {
        var view = new EscolherCorrecaoView();
        self.showView(view);
      });
    },

    testeLista: function() {
      var self = this;
      require(["app/views/testeLista"], function(TesteListaView) {
        var view = new TesteListaView();
        self.showView(view);
      });
    },

    testeTexto: function() {
      var self = this;
      require(["app/views/testeTexto"], function(TesteTextoView) {
        var view = new TesteTextoView();
        self.showView(view);
      });
    },

    escolherTeste: function() {
      var self = this;
      require(["app/views/escolherTeste"], function(EscolherTesteView) {
        var view = new EscolherTesteView();
        self.showView(view);
      });
    },

    escolherTipoTeste: function() {
      var self = this;
      require(["app/views/escolherTipoTeste"], function(EscolherTipoTesteView) {
        var view = new EscolherTipoTesteView();
        self.showView(view);
      });
    },


    escolherDisciplina: function() {
      var self = this;
      require(["app/views/escolherDisciplina"], function(EscolherDisciplinaView) {
        var view = new EscolherDisciplinaView();
        self.showView(view);
      });
    },


    escolherEscola: function() {
      var self = this;
      require(["app/views/escolherEscola"], function(EscolherEscolaView) {
        var view = new EscolherEscolaView();
        self.showView(view);
      });
    },

    menuTipoOpcao: function() {
      var self = this;
      require(["app/views/menuTipoOpcao"], function(MenuTipoOpcaoView) {
        var view = new MenuTipoOpcaoView();
        self.showView(view);
      });
    },

    escolherTurma: function() {
      var self = this;
      require(["app/views/escolherTurma"], function(EscolherTurmaView) {
        var view = new EscolherTurmaView();
        self.showView(view);
      });
    },

    escolherAluno: function() {
      var self = this;
      require(["app/views/escolherAluno"], function(EscolherAlunoView) {
        var view = new EscolherAlunoView();
        self.showView(view);
      });
    },


    escolherProf: function() {
      var self = this;
      require(["app/views/escolherProf"], function(EscolherProfView) {
        var view = new EscolherProfView();
        self.showView(view);
      });
    },


    login: function() {
      var self = this;
      require(["app/views/login"], function(LoginView) {
        $header.html('');
        $body.html('');
        $body.hide();
        var view = new LoginView();
        view.delegateEvents();
        var rendered = view.render();
        $('#login_content').html(rendered.el);
        //navigator.splashscreen.hide();

        self.currentView = view;
      });
    },

  });
});
