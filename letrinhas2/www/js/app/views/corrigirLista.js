
//Método para controlar o botão fisico de retroceder do tablet
function onBackKeyDown() {
  alert("Está a sair, esta correção não foi guardada!");
  document.removeEventListener("backbutton", onBackKeyDown, false); ////// RETIRAR EVENTO DO BOTAO
}

var isFeito=false,
    Demo, leitura, totalPalavrasErradas=0,//contador de palavras erradas
    relatorio="";


//******************************************************************************
define(function(require) {
  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/corrigirLista.html'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {
      document.addEventListener("backbutton", onBackKeyDown, false); //Adicionar o evento
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");
      var tipoTesteSelecionado = window.localStorage.getItem("TipoTesteSelecionado");
      var TesteArealizarID = window.localStorage.getItem("TesteArealizarID");







    },

    events: {
      "click #BtnCancelar": "clickBtnCancelar",
      "click #demoButton": "clickDemoButton",
      "click #playMyTestButton": "clickPlayMyTestButton",
      "click #submitButton": "clickSubmitButton",
      "click #BackButtonEE": "clickBackButtonEE",
    },



    //Função para executar a demonstração e inibir a reprodução da leitura e a finalização!.
    clickDemoButton: function(){
      $('#playPlayer').attr("src",Demo);
      var audio = document.getElementById("playPlayer");
      if ($('#demoButton').val()==0) {
        $('#demoButton').val(1);
        $('#demoButton').attr("style","background-color: #ee0000");
        $('#demoButton').html('<span class="glyphicon glyphicon-stop"aria-hidden="true"> </span> Parar </a>');
        $('#playPlayer').attr("style","visibility:initial; width:100%");
        $('#playMyTestButton').attr("style","visibility:hidden;");
        $('#submitButton').attr("style","visibility:hidden;");
        audio.play();
      }
      else {
        $('#demoButton').val(0);
        $('#demoButton').attr("style","background-color: #ffc060");
        $('#demoButton').html('<span class="glyphicon glyphicon-headphones"aria-hidden="true"> </span> Demonstrar </a>');
        $('#playPlayer').attr("style","visibility:hidden;");
        $('#playMyTestButton').attr("style","visibility:initial;background-color: #4ed0ff");
        if (isFeito){
          $('#submitButton').attr("style","visibility:initial;background-color: #00ee00");
        }
        audio.pause();
      }

    },

    // reproduzir a ultima leitura do teste
    clickPlayMyTestButton: function(){
      $('#playPlayer').attr("src",mediaSrc);
      //$('#playPlayer').attr("src",Demo);
      isFeito=true;
      var audio = document.getElementById("playPlayer");
      if ($('#playMyTestButton').val()==0) {
        $('#playMyTestButton').val(1);
        $('#playMyTestButton').attr("style","background-color: #ee0000");
        $('#playMyTestButton').html('<span class="glyphicon glyphicon-stop"aria-hidden="true"> </span> Parar </a>');
        $('#playPlayer').attr("style","visibility:initial; width:100%");
        $('#demoButton').attr("style","visibility:hidden;");
        $('#submitButton').attr("style","visibility:hidden;");
        audio.play();
      }
      else {
        $('#playMyTestButton').val(0);
        $('#playMyTestButton').attr("style","background-color: #4ed0ff");
        $('#playMyTestButton').html('<span class="glyphicon glyphicon-play"aria-hidden="true"> </span> Ouvir-me </a>');
        $('#playPlayer').attr("style","visibility:hidden;");
        $('#demoButton').attr("style","visibility:initial;background-color: #ffc060");
        $('#submitButton').attr("style","visibility:initial;background-color: #00ee00");
        audio.pause();
      }

    },

    // Fazer update à correção com os devidos campos preenchidos
    clickSubmitButton: function(e) {

      /*
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var agora=new Date();
      var ids = 'Cr'+ alunoId + agora.toISOString();
      var TesteArealizarID = window.localStorage.getItem("TesteArealizarID");
      var profId = window.localStorage.getItem("ProfSelecID");
      var correcao = {
          '_id': ids,
          'id_Teste': TesteArealizarID,
          'id_Aluno': alunoId,
          'id_Prof': profId,
          'tipoCorrecao': 'Lista',
          'estado': '0',
          'conteudoResult':null,
          'TotalPalavras':totalPalavras,
          'dataSub': agora,
          'dataCorr':null,
          'observ':null,
      };


      correcoes_local2.put(correcao, function(err, body) {
          if (!err) {
            console.log('correcao ' + correcao._id + ' inserted\n Falta saber como inserir a gravação');
            alert("Submissão do teste, feita com sucesso!\n Falta inserir a gravação \n testeLista.js linha:218");
          }
          else {
            console.log('correcao ' + err + ' erro');
            alert("Erro na submissão do teste \n"+ err);
          }
      });

      correcoes_local2.get(ids, function(err, otherDoc) {});
      */

      document.removeEventListener("backbutton", onBackKeyDown, false); ///RETIRAR EVENTO DO BOTAO
      window.history.back();
    },

    clickBtnCancelar: function(e) {
     e.stopPropagation(); e.preventDefault();
     alert("Está a sair, esta correção não foi guardada!");
     document.removeEventListener("backbutton", onBackKeyDown, false); ////// RETIRAR EVENTO DO BOTAO
     window.history.back();

    },

    render: function() {
      this.$el.html(template({}));
      return this;
    }

  });

});
