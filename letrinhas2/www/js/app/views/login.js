define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/login.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    myVar: setInterval(function() {
      if (btnBloqueado == false) {
        $("#progBAR").css('width', perc + '%').attr('aria-valuenow', perc).html(perc + '%');
        $("#btn_login").removeClass("disabled");
      } else {
        $("#proB").css('visibility', 'visible')
        $("#progBAR").css('width', perc + '%').attr('aria-valuenow', perc).html(perc + '%');
        $("#btn_login").addClass("disabled");
      }
    }, 500),

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

    },

    //Eventos Click
    events: {
      "click #btn_login": "clickLogin",
      "click #btn_testes": "btn_testes"
    },

    clickLogin: function(e) {
      e.stopPropagation();
      e.preventDefault();
      var self = this;
      var pinDigitado = $('#inputPIN').val();
      if (pinDigitado != "") {



        professores_local2.query({
          map: function (doc) {
            if (doc.pin == $('#inputPIN').val() && doc.estado == 1) {
              emit(doc);
            }
          }
        }, {
          reduce: false
        }, function(errx, response) {
          if (errx) {
            console.log("Erro: " + errx);
          } else {
            if (response.rows.length == 0) {
              $("#popUpAviso").empty();
              $("#popUpAviso").append(
                '<div id="qwert" class="alert alert-danger alert-dismissable">' +
                '<button type="button" class="close" data-dismiss="alert"> <span aria-hidden="true">&times;</span></button>' +
                '<strong>Aviso!</strong> Não foi encontrado nenhum professor associado ao PIN inserido!' +
                '</div>');
            } else {
              $("#popUpAviso").empty();
              window.localStorage.setItem("ProfSelecNome", response.rows[0].key.nome + ''); //enviar variavel
              window.localStorage.setItem("ProfSelecID", response.rows[0].id + ''); //enviar variavel
              window.localStorage.setItem("ProfSelecPIN", response.rows[0].key.pin+ ''); //enviar variavel
              clearInterval(self.myVar);
              $("#proB").css('visibility', 'hidden')
              app.navigate('/escolherDisciplina', {
                trigger: true
              });
            }
          }
        });
      }
      else
      {
        $('#inputPINErr').addClass("has-error");
      }
    },


    btn_testes: function(e) {
      console.log("PARA TESTES");

    },

    render: function() {
      this.$el.html(template());




      return this;
    }
  });
});
