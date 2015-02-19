define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    tpl = require('text!tpl/promotions.html'),
    classList = require('classList.min'),

    template = _.template(tpl);

  return Backbone.View.extend({

        initialize: function() {
          $("#outputEscolas").html('');
          $("#outputEscolas").append('Running query Joao1000 ...</br>');
          escolas_local2.info().then(function(info) {
            $("#outputEscolas").append('Documentos: ' + info.doc_count + '</br>');
          });



          escolas_local2.allDocs({
            include_docs: true,
            attachments: true
          }, function(err, data) {
            if (err) console.log(err);

            console.log(data);
            var val = data.total_rows;
            var i = 0;
            var y = 0;
            var carname = "";
            var url;
            carname = "</br><table border='1'><tr>";

            var colum = 0;
            for (i = 0; i < val; i++) {



              var aves = data.rows[i].doc;

             console.log(aves._attachments);

              //  console.log(aves);
              if (colum < 3) {





            //    carname += "<td>   <img src="+aves._attachments+" />";
            carname += "<td> ";
                carname += aves.nome;
                carname += "</td>";
              } else {
                colum = 0;
                carname += "</tr><tr>";
                carname += "<td> ";
                carname += aves.nome;
                carname += "</td>";
              }
              colum++;
            }

            carname += "</tr></table>";
            $("#outputEscolas").append(carname);




          // handle err or response
        });
    },

    events: {
      "click #btnNEXT": "clickNEXT",
    },


    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },


    clickNEXT: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'summary') {
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);

          app.navigate('/summary', {
            trigger: true
          });
        });
      }
    },

    render: function() {
      //this.$el.html(template(this.model.toJSON()));
      this.$el.html(template({}));

      return this;
    }


});









return Backbone.View.extend({

events: {
  "click #img_click": "imgclick"
},

imgclick: function(e) {
  console.log('click')
},

render: function() {
  this.$el.html(template());

  return this;
}

});

});
