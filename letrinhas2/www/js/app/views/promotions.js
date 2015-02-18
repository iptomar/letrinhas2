define(function (require) {

  "use strict";

  var $        = require('jquery'),
      _        = require('underscore'),
      Backbone = require('backbone'),
      tpl      = require('text!tpl/promotions.html'),

      template = _.template(tpl);



      $("#outputEscolas").html('');
      $("#outputEscolas").append('Running query Joao1000 ...</br>');
      escolas_local2.info().then(function(info) {
        $("#outputEscolas").append('Documentos: ' + info.doc_count + '</br>');
      });






      escolas_local2.allDocs({include_docs: true, attachments: true}, function (err, data) {
        if (err) console.log(err);
        var val = data.total_rows;
        var i = 0;
        var carname = "";
        carname ="</br><table border='1'><tr>";

        var colum = 0;
        for (i = 0; i < val; i++) {
          var  aves = data.rows[i].doc;
          if   (colum < 3){
            carname +="<td>";
            carname += aves.nome;
            carname +="</td>";
          }
          else {
            colum = 0;
            carname +="</tr><tr>";
            carname +="<td>";
            carname += aves.nome;
            carname +="</td>";
          }

          colum++;
          }

          carname +="</tr></table>";

          $("#outputEscolas").append(carname);




          // handle err or response
        });















  return Backbone.View.extend({

    events: {
      "click #img_click": "imgclick"
    },

    imgclick: function(e) {
      console.log('click')
    },

    render: function () {
      this.$el.html(template());

      return this;
    }

  });

});
