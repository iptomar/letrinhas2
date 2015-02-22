define(function(require) {

  "use strict";
  var nomeProfAux;
  var idProfAux;
  var pinProfAux;

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

      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      //  console.log(escolaId);
      //  console.log(escolaNome);

      escolas_local2.get(escolaId, function(err, data) {
        if (err) console.log(err);

        document.querySelector("#outputProfs").innerHTML =
          '<div class="panel panel-default">' +
          '<div class="panel-body">' +
          '<center>---[  <b> ' + escolaNome + ' </b>  ]---</center>' +
          '</div>' +
          '</div>';

        var $container = $('#outputProfs');

        for (var i = 0; i < data.professores.length; i++) {
          var abc = data.professores[i].id;
          professores_local2.get(abc, function(errx, profDoc) {
            if (errx) console.log(errx);


            //  console.log(profDoc._id);
            professores_local2.getAttachment(profDoc._id, 'prof.png', function(err2, DataImg) {
              if (err2) console.log(err2);
              var url = URL.createObjectURL(DataImg);

              var $btn = $(
                '<div class="col-md-4">' +
                '<div class="thumbnail" style="height:160px;"  >' +
                '<div class="caption">' +
                "<button id='" + profDoc._id + "' name='" + profDoc.pin + "' type='button' class='btn btn-info btn-lg btn-block btn-professor'>" +
                "<img style='height:100px;' src='" + url + "' class='pull-left'/>" + profDoc.nome + "</button>" +
                '</div>' +
                '</div></br>' +
                '</div>');

              $btn.appendTo($container);
            });
          });
        }


        $container.on('click', '.btn-professor', function(ev) {
          var $btn = $(this); // O jQuery passa o btn clicado pelo this
          $('#labelErr').text("");
          $('#inputPIN').val("");
          $('#myModal').modal("show");
          nomeProfAux = $btn[0].innerText;
          idProfAux = $btn[0].id;
          pinProfAux = $btn[0].name;
        });

      });
    },



    events: {
      "click #btnTeste": "clickTeste",
      "click #BackButtonEP": "clickBackButtonEP",
      "click #btnConfirmarPIN": "clickbtnConfirmarPIN",

    },


    clickBackButtonEP: function(e) {
      window.history.back();
    },

    clickbtnConfirmarPIN: function(e) {
      var pinDigitado = $('#inputPIN').val();

      if (pinProfAux == pinDigitado) {
        $('#myModal').modal("toggle");

        var self = this;
        if (Backbone.history.fragment != 'escolherTurma') {
          utils.loader(function() {
            e.preventDefault();
            window.localStorage.setItem("ProfSelecNome", nomeProfAux + ''); //enviar variavel
            window.localStorage.setItem("ProfSelecID", idProfAux + ''); //enviar variavel

            app.navigate('/escolherTurma', {
              trigger: true
            });
          });
        }



      } else {
        $('#labelErr').text("PIN errado!");
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
