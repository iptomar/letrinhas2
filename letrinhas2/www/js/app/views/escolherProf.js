define(function(require) {

  "use strict";
  ///Variaveis de apoio///

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherProf.html'),
    template = _.template(janelas);

  return Backbone.View.extend({

    onBackKeyDown: function() {
      ////nada///
    },

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },
    /////// Funcao executada no inicio de load da janela ////////////
    initialize: function() {

      var self = this;
      ////Carrega dados da janela anterior////
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");

      ///Vai buscar o doc da escola selecionada na janela anterior
      escolas_local2.get(escolaId, function(err, data) {
        if (err) console.log(err);

        document.querySelector("#outputProfs").innerHTML =
          '<div class="panel panel-default">' +
          '<div class="panel-body">' +
          '<center style=" font-size: 120%;">[ '+escolaNome + ' ]</center>' +
          '</div>' +
          '</div>';

        var $container = $('#outputProfs');

        for (var i = 0; i < data.professores.length; i++) {
           data.professores[i].id;
          ///////Vai buscar os docs professores correspondes a escola ///
          professores_local2.get(data.professores[i].id, function(errx, profDoc) {
            if (errx) console.log(errx);
             /////Anexos de fotos dos professores ///


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
              $btn.appendTo($container);  //Adiciona ao Div
            });
          });
        }

        //// Analisa todos os botoes do div e aqueles que forem botoes de Prof escuta o evento click//
        $container.on('click', '.btn-professor', function(ev) {
          ev.stopPropagation(); ev.preventDefault();
          document.addEventListener("backbutton", self.onBackKeyDown, false); //Adicionar o evento
          var $btn = $(this); // O jQuery passa o btn clicado pelo this
          $('#labelErr').text("");  //limpa campos
          $('#inputPIN').val("");   //limpa campos
          $('#inputPINErr').removeClass("has-error"); //limpa campos
          window.localStorage.setItem("ProfSelecNome", $btn[0].innerText + ''); //enviar variavel
          window.localStorage.setItem("ProfSelecID", $btn[0].id + ''); //enviar variavel
          window.localStorage.setItem("ProfSelecPIN", $btn[0].name + ''); //enviar variavel
          $('#myModal').modal("show");
          $('#myModal').on('shown.bs.modal', function (e) {
             $("#inputPIN").focus();
          });
          $('#myModal').on('hidden.bs.modal', function (e) {
            document.removeEventListener("backbutton",  self.onBackKeyDown, false); ///RETIRAR EVENTO DO BOTAO
          });
        });
      });
    },
    //Eventos Click
    events: {
      "click #btnTeste": "clickTeste",
      "click #BackButtonEP": "clickBackButtonEP",
      "click #btnConfirmarPIN": "clickbtnConfirmarPIN",
    },

    clickbtnConfirmarPIN: function(e) {
      var self = this;
      var pinDigitado = $('#inputPIN').val();
      if (window.localStorage.getItem("ProfSelecPIN") == pinDigitado) {
        document.removeEventListener("backbutton",  self.onBackKeyDown, false); ///RETIRAR EVENTO DO BOTAO
        $('#myModal').modal("toggle");
        var self = this;
        if (Backbone.history.fragment != 'escolherTurma') {
          utils.loader(function() {
            e.preventDefault();
            app.navigate('/escolherTurma', {
              trigger: true
            });
          });
        }
      } else {
        $('#inputPINErr').addClass("has-error");
        $('#labelErr').text("PIN errado!");
      }
    },


    clickBackButtonEP: function(ev) {
      ev.stopPropagation(); ev.preventDefault();
      window.history.back();
    },


    render: function() {
      this.$el.html(template({}));
      return this;
    }
  });
});
