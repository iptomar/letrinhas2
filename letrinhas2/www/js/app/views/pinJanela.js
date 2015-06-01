define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/pinJanela.html'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    onBackKeyDowns: function() {

    },

    initialize: function() {
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var alunoNome = window.localStorage.getItem("AlunoSelecNome");
      var turmaId = window.localStorage.getItem("TurmaSelecID");
      var turmaNome = window.localStorage.getItem("TurmaSelecNome");

      professores_local2.getAttachment(profId, 'prof.jpg', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome + " - [ " + escolaNome + " ]");
        $('#imgProf').attr("src", url);
      });


      alunos_local2.getAttachment(alunoId, 'aluno.jpg', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeAluno').text("[" + turmaNome + " ] -- " + alunoNome);
        $('#imgAluno').attr("src", url);
      });


    },

    events: {
      "click #btn_login": "clickLogin",

    },

    clickLogin: function(e) {
      e.stopPropagation();
      e.preventDefault();
      var self = this;
      var pinDigitado = $('#inputPIN').val();
      var pinProfAux = window.localStorage.getItem("ProfSelecPIN");

      if (pinDigitado != "") {
        if (pinProfAux == pinDigitado) {
          document.removeEventListener("backbutton", self.onBackKeyDowns, false); ///RETIRAR EVENTO DO BOTAO
          $("#popUpAviso").empty();
          $("#proB").css('visibility', 'hidden')
          window.history.go(-2);
        } else {
          $("#popUpAviso").empty();
          $("#popUpAviso").append(
            '<div id="qwert" class="alert alert-danger alert-dismissable">' +
            '<button type="button" class="close" data-dismiss="alert"> <span aria-hidden="true">&times;</span></button>' +
            '<strong>Aviso!</strong> PIN inserido é inválido!' +
            '</div>');
        }
      } else {
        $('#inputPINErr').addClass("has-error");
      }
    },



    clickbtnNavDisci: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.go(-1);
    },

    render: function() {
      this.$el.html(template({}));
      document.addEventListener("backbutton", this.onBackKeyDowns, false); //Adicionar o evento
      return this;
    }
  });

});
