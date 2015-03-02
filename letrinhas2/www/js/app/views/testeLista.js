var mediaRec;

//Gravar a leitura
function recordAudio() {
  var src = "gravacao.amr";
  mediaRec = new Media(src,
            // success callback
            function() {},
            // error callback
            function(err) {
              alert("recordAudio():Audio Error: " + err.code);
            });

  // Record audio
  mediaRec.startRecord();
}

function StopRec() {
  mediaRec.stopRecord();
  mediaRec.release();
}




define(function(require) {

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/testeLista.html'),
    template = _.template(janelas),
    Demo, mediaRec, isFeito=false;

  var profId, profNome, escolaNome, escolaId, alunoId, alunoNome,
      turmaId, turmaNome, discplinaSelecionada, tipoTesteSelecionado,
      TesteArealizarID;

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    // Funcao executada no inicio de load da janela ////////////
    initialize: function() {

    // Vai buscar todas
      profId = window.localStorage.getItem("ProfSelecID");
      profNome = window.localStorage.getItem("ProfSelecNome");
      escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      alunoId = window.localStorage.getItem("AlunoSelecID");
      alunoNome = window.localStorage.getItem("AlunoSelecNome");
      turmaId = window.localStorage.getItem("TurmaSelecID");
      turmaNome = window.localStorage.getItem("TurmaSelecNome");
      discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada");
      tipoTesteSelecionado = window.localStorage.getItem("TipoTesteSelecionado");
      TesteArealizarID = window.localStorage.getItem("TesteArealizarID");

      testes_local2.get(TesteArealizarID, function(err, testeDoc) {
        if (err)  console.log(err);
            console.log(testeDoc);

        $('#titleTestePagina').text(testeDoc.titulo);
        $('#lbTituloTeste').text(testeDoc.conteudo.pergunta);

        // buscar o conteúdo
        // Construir as 3 colunas caso seja possivel
        var s1,allTable;
        allTable ="<table style='width:100%; '><tr>";

        //*id do div com o conteúdo, id="listaAreaConteudo"
        if(testeDoc.conteudo.palavrasCl1.length>0){
          s1="";
          for(var j=0; j<testeDoc.conteudo.palavrasCl1.length;j++){
            s1+="<p style='font-style:bold; font-size:18px'>"+ testeDoc.conteudo.palavrasCl1[j] +"</p>";
          }
          allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");

          if(testeDoc.conteudo.palavrasCl2.length>0){
            s1="";
            for(var j=0; j<testeDoc.conteudo.palavrasCl2.length;j++){
              s1+="<p style='font-style:bold; font-size:18px'>"+ testeDoc.conteudo.palavrasCl2[j] +"</p>";
            }
            allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
          }

          if(testeDoc.conteudo.palavrasCl3.length>0){
            s1="";
            for(var j=0; j<testeDoc.conteudo.palavrasCl3.length;j++){
              s1+="<p style='font-style:bold; font-size:18px'>"+ testeDoc.conteudo.palavrasCl3[j] +"</p>";
            }
            allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
          }

          allTable+="</tr></table>";

          //Inserir a tabela no div id=listaAreaConteudo
          $('#listaAreaConteudo').html(allTable);

        } else{
          alert("Este teste está vazio! \n"+
                "Id do teste: "+TesteArealizarID+
                "\n Professor responsável: "+ profNome+
                "\n id: "+ profId);
        }
      });

      testes_local2.getAttachment(TesteArealizarID, 'voz.mp3', function(err2, DataImg) {
        if (err2) console.log(err2);
          Demo = URL.createObjectURL(DataImg);
      });

    },

    //Eventos Click
    events: {
      "click #BtnCancelar": "clickBtnCancelar",//por finalizar
      "click #demoButton": "clickDemoButton",
      "click #startButton": "clickStartButton",//por fazer
      "click #playMyTestButton": "clickPlayMyTestButton",//por fazer
      "click #submitButton": "clickSubmitButton",//por fazer
      "click #BackButtonEE": "clickBackButtonEE",
    },

    // Inicio da gravação da leitura do teste!
    clickStartButton: function(){
      var record;
      if ($('#startButton').val()==0) {
        $('#startButton').val(1);
        $('#startButton').attr("style","background-color: #ee0000");
        $('#startButton').html('<span class="glyphicon glyphicon-stop"aria-hidden="true"> </span> Parar </a>');
        $('#demoButton').attr("style","visibility:hidden;");
        $('#playMyTestButton').attr("style","visibility:hidden;");
        $('#submitButton').attr("style","visibility:hidden;");

        //Iniciar a gravação
        recordAudio();
      }
      else {
        $('#startButton').val(0);
        $('#startButton').attr("style","background-color: #eeff00");
        $('#startButton').html('<span class="glyphicon glyphicon-repeat"aria-hidden="true"> </span> Repetir </a>');
        $('#demoButton').attr("style","visibility:initial;background-color: #ffc060");
        $('#playMyTestButton').attr("style","visibility:initial; background-color: #c065ff");
        $('#submitButton').attr("style","visibility:initial; background-color: #00ee00");

        //parar a gravação!
        StopRec();
        isFeito=true;
      }
    },

    // reproduzir a ultima leitura do teste
    clickPlayMyTestButton: function(){
      $('#playPlayer').attr("src",mediaRec);
      //$('#playPlayer').attr("src",Demo);

      var audio = document.getElementById("playPlayer");
      if ($('#playMyTestButton').val()==0) {
        $('#playMyTestButton').val(1);
        $('#playMyTestButton').attr("style","background-color: #ee0000");
        $('#playMyTestButton').html('<span class="glyphicon glyphicon-stop"aria-hidden="true"> </span> Parar </a>');
        $('#playPlayer').attr("style","visibility:initial; width:100%");
        $('#startButton').attr("style","visibility:hidden;");
        $('#demoButton').attr("style","visibility:hidden;");
        $('#submitButton').attr("style","visibility:hidden;");
        audio.play();
      }
      else {
        $('#playMyTestButton').val(0);
        $('#playMyTestButton').attr("style","background-color: #c065ff");
        $('#playMyTestButton').html('<span class="glyphicon glyphicon-play"aria-hidden="true"> </span> Ouvir-me </a>');
        $('#playPlayer').attr("style","visibility:hidden;");
        $('#startButton').attr("style","visibility:initial;background-color: #eeff00");
        $('#demoButton').attr("style","visibility:initial;background-color: #ffc060");
        $('#submitButton').attr("style","visibility:initial;background-color: #00ee00");
        audio.pause();
      }


    },

    // Sumeter o teste para corecção (Criar uma correção não corrigida)
    clickSubmitButton: function(){
      //Criar o objeto correção!
      alert("Funcionalidade ainda indisponivel");
      window.history.back();
    },

    //Função para executar a demonstração e inibir a gravação/reprodução da leitura e a finalização!.
    clickDemoButton: function(){
      $('#playPlayer').attr("src",Demo);
      var audio = document.getElementById("playPlayer");
      if ($('#demoButton').val()==0) {
        $('#demoButton').val(1);
        $('#demoButton').attr("style","background-color: #ee0000");
        $('#demoButton').html('<span class="glyphicon glyphicon-stop"aria-hidden="true"> </span> Parar </a>');
        $('#playPlayer').attr("style","visibility:initial; width:100%");
        $('#startButton').attr("style","visibility:hidden;");
        $('#playMyTestButton').attr("style","visibility:hidden;");
        $('#submitButton').attr("style","visibility:hidden;");
        audio.play();
      }
      else {
        $('#demoButton').val(0);
        $('#demoButton').attr("style","background-color: #ffc060");
        $('#demoButton').html('<span class="glyphicon glyphicon-headphones"aria-hidden="true"> </span> Demonstrar </a>');
        $('#playPlayer').attr("style","visibility:hidden;");
        $('#startButton').attr("style","visibility:initial;background-color: #60f060");
        if (isFeito){
          $('#playMyTestButton').attr("style","visibility:initial;background-color: #c065ff");
          $('#submitButton').attr("style","visibility:initial;background-color: #00ee00");
        }
        audio.pause();
      }


    },

    clickBtnCancelar: function(e) {
     e.stopPropagation(); e.preventDefault();
     //Falta implementar o pedido do Pin do professor
     alert("Opção ainda não está 100% funcional!");
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
