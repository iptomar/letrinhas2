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
      // $('#inputEmail').val("elsaAbrantes@aeagtn.pt");
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
    },
    clickLogin: function(e) {

      // app.navigate('/xpto', {
      //        trigger: true
      //      });

      e.stopPropagation();
      e.preventDefault();
      var self = this;
      var pinDigitado = $('#inputPIN').val();
      if (pinDigitado != "") {
        professores_local2.query({
          map: function(doc) {
            console.log(doc);
            if (doc._id == $('#inputEmail').val() && doc.pin == $('#inputPIN').val() && doc.estado == 1) {
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
                '<strong>Aviso!</strong> A sua antenticação não é válida!' +
                '</div>');
            } else {
              $("#popUpAviso").empty();
              window.localStorage.setItem("ProfSelecNome", response.rows[0].key.nome + ''); //enviar variavel
              window.localStorage.setItem("ProfSelecID", response.rows[0].id + ''); //enviar variavel
              window.localStorage.setItem("ProfSelecPIN", response.rows[0].key.pin + ''); //enviar variavel
              clearInterval(self.myVar);





              sistema_local2.info().then(function(info1) {
                if (info1.doc_count == 0) {

                  var sisT = {
                    '_id': 'ultimoLogin',
                    'email': response.rows[0].id
                  };

                  sistema_local2.post(sisT).then(function(response) {
                    console.log("SUCESSO-" + err);
                  }).catch(function(err) {
                    console.log("ERRRO-" + err);
                  });

                } else {

                  sistema_local2.get('ultimoLogin', function(err, otherDoc) {
                    if (err) console.log(err);
                    console.log(otherDoc)
                    otherDoc.email = response.rows[0].id;
                    sistema_local2.put(otherDoc, otherDoc._id, otherDoc._rev, function(err, response) {
                      if (err) {
                        console.log('Correcao ' + err + ' erro');
                      } else {
                        console.log('Parabens o ultimologin');
                      }
                    });
                  });
                }

              });

              $("#proB").css('visibility', 'hidden')
              app.navigate('/escolherDisciplina', {
                trigger: true
              });
            }
          }
        });
      } else {
        $('#inputPINErr').addClass("has-error");
      }

    },


    render: function() {
      this.$el.html(template());

      sistema_local2.get('ultimoLogin').then(function(doc) {
        $('#inputEmail').val(doc.email);

      }).catch(function(err) {
        console.log(err);
      });


      return this;
    }
  });
});
