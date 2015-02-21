define(function (require) {

  "use strict";

  var $         = require('jquery'),
      _         = require('underscore'),
      Backbone  = require('backbone'),
      tpl       = require('text!tpl/summary.html'),

      template = _.template(tpl);

  return Backbone.View.extend({

    events: {
      "click #btn_addfunds": "click",
    },

    click: function(e){
      console.log('click');
    },

    render: function () {
      //this.$el.html(template(this.model.toJSON()));
      this.$el.html(template({}));

      return this;
    }

  });

});
