define(function(require) {

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherEscola.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    /////// Funcao executada no inicio de load da janela ////////////
    initialize: function() {

      /// Vai buscar todas as escolas da base de dados //
      escolas_local2.allDocs({
        include_docs: true,
        attachments: true
      }, function(err, data) {
        if (err) console.log(err);

        //Vai buscar o div de output Dinamico
        var $container = $('#outputEscolas');

        for (var i = 0; i < data.total_rows; i++) {
          var docsEscolas = data.rows[i].doc;
          var $btn = $(
            '<div class="col-sm-4">' +
            '<div class="thumbnail" style="height:160px;">' +
            '<div class="caption"> ' +
            "<button id='" + docsEscolas._id + "' type='button' name='"+docsEscolas.nome+"' class='btn btn-info btn-lg btn-block btn-escola' >" +
            " <img style='height:60px;' src='data:image/png;base64," + docsEscolas._attachments['escola.png'].data + "'><p>"+ docsEscolas.nome +"</p> " +
            '</button>'+
            '</div>' +
            '</div></br>' +
            '</div>');
          $btn.appendTo($container);  //Adiciona ao Div
        }

        //// Analisa todos os botoes do div e aqueles que forem botoes de escola escuta o evento click//
        $container.on('click', '.btn-escola', function(ev) {
          ev.stopPropagation(); ev.preventDefault();
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

    //Eventos Click
    events: {
      "click #btnNEXT": "clickNEXT",
      "click #BackButtonEE": "clickBackButtonEE",
    },

    clickBackButtonEE: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.back();
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
      this.$el.html(template({}));
      return this;
    }

  });
});
