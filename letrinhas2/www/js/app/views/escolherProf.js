define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    tpl = require('text!tpl/escolherProf.html'),

    template = _.template(tpl);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

      var escolaId = window.localStorage.getItem ("EscolaSelecionadaID");
      var escolaNome = window.localStorage.getItem ("EscolaSelecionadaNome");
      console.log(escolaId);
      console.log(escolaNome);




        escolas_local2.get(escolaId, function(err, data) {
          if (err) console.log(err);

          document.querySelector("#outputProfs").innerHTML  = "<h4>Escola Selecionada:  ---[ "+escolaNome+" ]---</h4>";

          var $container = $('#outputProfs');

        for (var i = 0; i < data.professores.length; i++) {
          var abc = data.professores[i].id;
          professores_local2.get(abc, function(errx, datax) {
             if (errx) console.log(errx);


              console.log(datax._id);
              professores_local2.getAttachment(datax._id, 'prof.png', function(err2, DataImg) {
                   if (err2) console.log(err2);
                    var url = URL.createObjectURL(DataImg);

                    var $btn = $(
                        '<div class="col-sm-4">' +
                            '<div class="thumbnail">' +
                                '<div class="caption">' +
                                    "<button id='" + datax._id + "' type='button' class='btn btn-info btn-lg btn-block btn-escola' ><img src='" + url + "' class='pull-left'/>" + datax.nome + "</button>" +
                                '</div>' +
                            '</div>' +
                        '</div>');

                    $btn.appendTo($container);
                });
           });
        }

        });

    },



    events: {
      "click #btnTeste": "clickTeste",
      "click #BackButtonEP": "clickBackButtonEP",
    },


    clickBackButtonEP: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'escolherEscola') {
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);
          app.navigate('/escolherEscola', {
            trigger: true
          });
        });
      }
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
