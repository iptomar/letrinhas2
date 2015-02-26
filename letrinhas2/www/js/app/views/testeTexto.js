define(function(require) {

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    tpl = require('text!tpl/testeTexto.html'),
    template = _.template(tpl);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    /////// Funcao executada no inicio de load da janela ////////////
    initialize: function() {

      /// Vai buscar todas
         var profId = window.localStorage.getItem("ProfSelecID");
        var profNome = window.localStorage.getItem("ProfSelecNome");
        var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
        var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
        var alunoId = window.localStorage.getItem("AlunoSelecID");
        var alunoNome = window.localStorage.getItem("AlunoSelecNome");
        var turmaId = window.localStorage.getItem("TurmaSelecID");
        var turmaNome = window.localStorage.getItem("TurmaSelecNome");
        var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");
        var tipoTesteSelecionado = window.localStorage.getItem("TipoTesteSelecionado");
        var TesteArealizarID = window.localStorage.getItem("TesteArealizarID");


        professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
          if (err2)  console.log(err2);
          var url = URL.createObjectURL(DataImg);
          $('#lbNomeProf').text(profNome);
          $('#imgProf').attr("src",url);
        });


        testes_local2.get(TesteArealizarID, function(err, testeDoc) {
          if (err)  console.log(err);
          console.log(testeDoc);

          $('#titleTestePagina').text(testeDoc.titulo);
          $('#lbTituloTeste').text(testeDoc.conteudo.pergunta);
          $('#txtAreaConteud').val(testeDoc.conteudo.texto);
        });

        testes_local2.getAttachment(TesteArealizarID, 'voz.mp3', function(err2, DataImg) {
          if (err2) console.log(err2);
          var url = URL.createObjectURL(DataImg);
          $('#playPlayer').attr("src",url);

        });

        


    },

    //Eventos Click
    events: {
      "click #BackButtonTTexto": "clickBackButtonTTexto",
      "click #BackButtonEE": "clickBackButtonEE",
    },

    clickBackButtonTTexto: function(e) {
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
