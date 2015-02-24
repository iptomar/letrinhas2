define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    tpl = require('text!tpl/escolherTurma.html'),
    template = _.template(tpl);

  return Backbone.View.extend({
    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    /////// Funcao executada no inicio de load da janela ////////////
    initialize: function() {
      /// Vai buscar todas as escolas da base de dados //
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      //// Vai buscar o doc da escola selecionada ///

      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src",url);
      });


      escolas_local2.get(escolaId, function(err, data) {
        if (err) console.log(err);
        document.querySelector("#outputTurmas").innerHTML =
          '<div class="panel panel-default">' +
          '<div class="panel-body">' +
          '<center style=" font-size: 120%;">[ '+escolaNome + ' ]</center>' +
          '</div>' +
          '</div>';

        var $container = $('#outputTurmas');

        for (var i = 0; i < data.turmas.length; i++) {
          var $btn = $(
            '<div class="col-md-4">' +
            '<div class="thumbnail" style="height:100px;"  >' +
            '<div class="caption">' +
            '<button id="' + data.turmas[i]._id + '" type="button" style="height:65px;"" class="btn btn-info btn-lg btn-block btn-turma" >' +
            '  <span class="glyphicon glyphicon-list-alt" ></span>   ' +
            data.turmas[i].ano + " - " + data.turmas[i].nome + "</button>" +
            '</div>' +
            '</div></br>' +
            '</div>');
          $btn.appendTo($container); //Adiciona ao Div
        }

        //// Analisa todos os botoes do div e aqueles que forem botoes de turma escuta o evento click//
        $container.on('click', '.btn-turma', function(ev) {
          ev.stopPropagation(); ev.preventDefault();
          var $btn = $(this); // O jQuery passa o btn clicado pelo this
          var self = this;
          if (Backbone.history.fragment != 'escolherAluno') {
            utils.loader(function() {
              ev.preventDefault();
              window.localStorage.setItem("TurmaSelecNome", $btn[0].innerText + ''); //enviar variavel
              window.localStorage.setItem("TurmaSelecID", $btn[0].id + ''); //enviar variavel
              app.navigate('/escolherAluno', {
                trigger: true
              });
            });
          }
        });
      });
    },
    //Eventos Click
    events: {
      "click #btnTeste": "clickTeste",
      "click #BackButtonET": "clickBackButtonET",
    },

    clickBackButtonET: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.back();
    },

    render: function() {
      this.$el.html(template({}));
      return this;
    }
  });
});
