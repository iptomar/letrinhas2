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
  var my_media;

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
      "escolherProf": "escolherProf",
      "escolherTurma": "escolherTurma",
      "escolherAluno": "escolherAluno",
      "menuTipoOpcao": "menuTipoOpcao",
      "escolherDisciplina": "escolherDisciplina",
      "escolherTeste": "escolherTeste",
      "testeTexto": "testeTexto",
      "testeLista": "testeLista",
      "escolherCorrecao": "escolherCorrecao",
      "corrigirLista": "corrigirLista",
      "corrigirTexto": "corrigirTexto",
      "escolherResultados": "escolherResultados",
      "mostraResultadoLista": "mostraResultadoLista",
      "mostraResultadoTexto": "mostraResultadoTexto",
      "testeInterpretacao": "testeInterpretacao",
      "mostraResultadoInterpretacao": "mostraResultadoInterpretacao",


    },

    boot: function() {
      var bootView = new BootView();
      this.showView(bootView);
    },


    mostraResultadoInterpretacao: function() {
      var self = this;
      require(["app/views/mostraResultadoInterpretacao"], function(mostraResultadoInterpretacaoView) {
        var view = new mostraResultadoInterpretacaoView();
        self.showView(view);
      });
    },

    testeInterpretacao: function() {
      var self = this;
      require(["app/views/testeInterpretacao"], function(testeInterpretacaoView) {
        var view = new testeInterpretacaoView();
        self.showView(view);
      });
    },

    mostraResultadoLista: function() {
      var self = this;
      require(["app/views/mostraResultadoLista"], function(mostraResultadoListaView) {
        var view = new mostraResultadoListaView();
        self.showView(view);
      });
    },

    mostraResultadoTexto: function() {
      var self = this;
      require(["app/views/mostraResultadoTexto"], function(mostraResultadoTextoView) {
        var view = new mostraResultadoTextoView();
        self.showView(view);
      });
    },

    escolherResultados: function() {
      var self = this;
      require(["app/views/escolherResultados"], function(escolherResultadosView) {
        var view = new escolherResultadosView();
        self.showView(view);
      });
    },

    corrigirTexto: function() {
      var self = this;
      require(["app/views/corrigirTexto"], function(CorrigirTextoView) {
        var view = new CorrigirTextoView();
        self.showView(view);
      });
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


    escolherDisciplina: function() {
      var self = this;

      require(["app/views/escolherDisciplina"], function(EscolherDisciplinaView) {
        var view = new EscolherDisciplinaView();
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


    // acb: function() {
    //   try {
    //     my_media = new Media("/android_asset/www/img/btn.mp3",
    //       // success callback
    //       function() {
    //         console.log("playAudio():Audio Success");
    //       },
    //       // error callback
    //       function(err) {
    //         console.log("playAudio():Audio Error: " + err);
    //       }
    //     );
    //   } catch (err) {
    //   }
    // },


    login: function() {
      var self = this;
      //
      //
      //
      //
      //
      // $('body').on('click', 'button', function() {
      //
      //
      //   // Play audio
      //   my_media.play();
      //
      // });


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
