var mediaRec;




function recordAudio() {
  alert("A gravação vai começar!");
  var src = "gravacao.amr";
  mediaRec = new Media(src,
    // success callback
    function() {
      //  alert("recordAudio():Audio Success");
    },
    // error callback
    function(err) {
      alert("recordAudio():Audio Error: " + err.code);
    }
  );
  // Record audio
  mediaRec.startRecord();
}

function StopRec() {
  alert("Foi parado a gravacao!");
  mediaRec.stopRecord();
  mediaRec.release();
  mediaRec.play();
}


define(function(require) {

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/testeTexto.html'),
    template = _.template(janelas);

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
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src", url);
      });


      testes_local2.get(TesteArealizarID, function(err, testeDoc) {
        if (err) console.log(err);
        console.log(testeDoc);

        $('#titleTestePagina').text(testeDoc.titulo);
        $('#lbTituloTeste').text(testeDoc.conteudo.pergunta);
        $('#txtAreaConteud').val(testeDoc.conteudo.texto);
      });

      testes_local2.getAttachment(TesteArealizarID, 'voz.mp3', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#playPlayer').attr("src", url);

        //  var audio = new Audio(url);
        //  audio.play();

      });


    },

    //Eventos Click
    events: {
      "click #BackButtonTTexto": "clickBackButtonTTexto",
      "click #BackButtonEE": "clickBackButtonEE",
      "click #btnRecStop": "clickbtnRecStop",
      "click #btnRec": "clickbtnRec",
      "click #BTNTESTE": "BTNTESTE",


    },

    BTNTESTE: function(e) {

       var ids = 'Corr' + new Date().toISOString();
      var testeTexto = {
        'exatidao': '1',
        'velocidade': '2',
        'fluidez': '2',
        'expressividade': '2',
        'compreensao': '2',
      };

      var TesteArealizarID = window.localStorage.getItem("TesteArealizarID");
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var profId = window.localStorage.getItem("ProfSelecID");
      var correcao = {
        '_id': ids,
        'id_Teste': TesteArealizarID,
        'id_Aluno': alunoId,
        'id_Prof': profId,
        'tipoCorrecao': 'texto',
        'estado': '0',
        'conteudo': testeTexto,
      };


      correcoes_local2.put(correcao, function(err, body) {
        if (!err) {
          console.log('correcao ' + correcao._id + ' inserted');
        } else {
          console.log('correcao ' + err + ' erro');
        }
      });

      correcoes_local2.get(ids, function(err, otherDoc) {

      });

    },


    clickbtnRec: function(e) {
    recordAudio();
    },

    clickbtnRecStop: function(e) {
      StopRec();
    },




    clickBackButtonTTexto: function(e) {
      e.stopPropagation();
      e.preventDefault();
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
