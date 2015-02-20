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
      "summary": "summary",
      "promotions": "promotions",
      "escolherProf": "escolherProf"
    },

    boot: function() {
      var bootView = new BootView();
      this.showView(bootView);
    },

    promotions: function() {
      var self = this;
      require(["app/views/promotions"], function(PromotionsView) {
        var view = new PromotionsView();
        self.showView(view);
      });
    },

    summary: function() {
      var self = this;
      require(["app/views/summary"], function(SummaryView) {
        var view = new SummaryView();
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
      if (this.menuView) {
        this.menuView.unbind();
        this.menuView.undelegateEvents();
        this.menuView = undefined;
      }
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
