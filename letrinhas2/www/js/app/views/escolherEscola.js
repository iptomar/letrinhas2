define(function(require) {

  "use strict";



  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    tpl = require('text!tpl/escolherEscola.html'),
    classList = require('classList.min'),

    template = _.template(tpl);



  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

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

      //  console.log(data);
        var val = data.total_rows;
        var i = 0;
        var y = 0;
        var carname = "";
        var url;


        var $container = $('#outputEscolas');

        for (i = 0; i < val; i++) {

          var docsEscolas = data.rows[i].doc;

          var $btn = $(
            '<div class="col-sm-4">' +
            '<div class="thumbnail" style="height:160px;">' +
            '<div class="caption"> ' +
            "<button id='" + docsEscolas._id + "' type='button' class='btn btn-info btn-lg btn-block btn-escola' >" +
            "<img style='height:100px;' src='data:image/png;base64," + docsEscolas._attachments['escola.png'].data + "'class='pull-left'/>" + docsEscolas.nome + "</button>" +
            '</div>' +
            '</div></br>' +
            '</div>');

          $btn.appendTo($container);

        }


        $container.on('click', '.btn-escola', function(ev) {
          var $btn = $(this); // O jQuery passa o btn clicado pelo this
          var self = this;
          if (Backbone.history.fragment != 'escolherProf') {
            utils.loader(function() {
              ev.preventDefault();
              window.localStorage.setItem("EscolaSelecionadaNome", $btn[0].innerText + ''); //enviar variavel
              window.localStorage.setItem("EscolaSelecionadaID", $btn[0].id + ''); //enviar variavel

              app.navigate('/escolherProf', {
                trigger: true
              });
            });
          }
        });

      });
    },

    events: {
      "click #btnNEXT": "clickNEXT",
      "click #BackButtonEE": "clickBackButtonEE",

    },


    clickBackButtonEE: function(e) {
      var self = this;
      if (Backbone.history.fragment != 'login') {
        utils.loader(function() {
          e.preventDefault();
          self.highlight(e);
          app.navigate('/login', {
            trigger: true
          });
        });
      }
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

function myFunction() {

}
