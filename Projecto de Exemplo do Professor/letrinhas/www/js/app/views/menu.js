define(function (require) {

  "use strict";

  var $          = require('jquery'),
      _          = require('underscore'),
      Backbone   = require('backbone'),
      tpl        = require('text!tpl/menu.html'),
      classList  = require('classList.min'),

      template = _.template(tpl);

  return Backbone.View.extend({

    events: {
      "click #slide_txt": "clickMenu",
      "click #menuSummary": "clickSummary",
      "click #menuPromotions": "clickPromotions",
      "click #slide-menu-button": "clickMenu"
    },


    loaduser: function(e) {
      app.navigate('/summary', {
        trigger: true
      });
      window.location.reload();
    },

    clickMenu: function(e) {
      var cl = document.body.classList;
      if (cl.contains('left-nav')) {
          cl.remove('left-nav');
      } else {
          cl.add('left-nav');
      }
    },

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    clickSummary: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'summary'){
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);

          app.navigate('/summary', {
            trigger: true
          });
        });
      }
    },

    clickPromotions: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'promotions'){
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);

          app.navigate('/promotions', {
            trigger: true
          });
        });
      }
    },

    render: function () {
      //this.$el.html(template(this.model.toJSON()));
      this.$el.html(template({}));
      return this;
    }
  });

});
