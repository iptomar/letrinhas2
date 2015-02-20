define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    tpl = require('text!tpl/escolherProf.html'),

    template = _.template(tpl);

  return Backbone.View.extend({

    initialize: function() {

      var escolaId = window.localStorage.getItem ("EscolaSelecionadaID");
      var escolaNome = window.localStorage.getItem ("EscolaSelecionadaNome");
      console.log(escolaId);
      console.log(escolaNome);

      escolas_local2.getAttachment(escolaId, 'escola.png', function(err, data) {

      //  var url = URL.createObjectURL(data);

        //console.log(url);

      //  document.querySelector("#qwerty").src = url;

       document.querySelector("#outputProfs").innerHTML  = "<h3>"+escolaNome+"</h3>";


      });


        escolas_local2.get(escolaId, function(err, data) {
          if (err) console.log(err);

        for (var i = 0; i < data.professores.length; i++) {
          var abc = data.professores[i].id;
          professores_local2.get(abc, function(errx, datax) {
             if (errx) console.log(errx);

              $("#outputProfs").append(datax.nome);
              $("#outputProfs").append('</br>');
              $("#outputProfs").append('</br>');

    
           });

        }
        //



        });

    },



    events: {
      "click #btnTeste": "clickTeste",

    },

    clickTeste: function(e) {

    },

    click: function(e) {
      console.log('click');
    },

    render: function() {
      //this.$el.html(template(this.model.toJSON()));
      this.$el.html(template({}));

      return this;
    }

  });

});
