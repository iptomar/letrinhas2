///PARA PROGRAMADORES APENAS ESTA JANELA
define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/admin.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({
    initialize: function() {
    },

    //Eventos Click
    events: {
      "click #btnConfirmarIP": "btnConfirmarIP",
    },


    btnConfirmarIP: function(e) {
      sistema2_local2.get('ipServer', function(err, otherDoc) {
        if (err) console.log(err);
        console.log(otherDoc)
        otherDoc.ip = $('#ipTxt').val();
        sistema2_local2.put(otherDoc, otherDoc._id, otherDoc._rev, function(err, response) {
          if (err) {
            $("#idMSG").html('Correcao ' + err + ' erro');
            console.log('Correcao ' + err + ' erro');
          } else {
            $("#idMSG").html('Parabens o Guardado');
            console.log('Parabens o ultimologin');
          }
        });
      });

    },


    render: function() {
      this.$el.html(template());

      sistema2_local2.get('ipServer').then(function(doc) {
        console.log(doc);
        $('#ipTxt').val(doc.ip);

      }).catch(function(err) {
        console.log(err);
      });

      return this;
    }
  });
});
