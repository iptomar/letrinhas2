define(function (require) {

  "use strict";

  var $          = require('jquery'),
      _          = require('underscore'),
      Backbone   = require('backbone'),
      janelas        = require('text!janelas/menu.html'),
      classList  = require('classList.min'),

      template = _.template(janelas);

  return Backbone.View.extend({

    events: {
      "click #slide_txt": "clickMenu",
      "click #menuSummary": "clickSummary",
      "click #menuPromotions": "clickPromotions",
      "click #slide-menu-button": "clickMenu"
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
