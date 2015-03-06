
//Método para controlar o botão fisico de retroceder do tablet
function onBackKeyDown() {
  $('#labelErr').text("");  //limpa campos
  $('#inputPIN').val("");   //limpa campos
  $('#inputPINErr').removeClass("has-error"); //limpa campos
  $('#myModal').modal("show");
  $('#myModal').on('shown.bs.modal', function (e) {
     $("#inputPIN").focus();
  });
}

var mediaRec,//objeto Media que irá fazer a gravação
    mediaSrc,//url onde deverá ser guardada a gravação
    totalPalavras=0;//contador de palavras

//Gravar a leitura
function recordAudio() {
  mediaSrc = "gravacao.amr";
  mediaRec = new Media(mediaSrc,
            // success callback
            function() {},
            // error callback
            function(err) {
              alert("recordAudio():Audio Error: " + err.code);
            });

  // Record audio
  mediaRec.startRecord();
}

//Parar a gravação
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
    Demo, isFeito=false;

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
      document.addEventListener("backbutton", onBackKeyDown, false); //Adicionar o evento
    // Vai buscar todas as variaveis necessárias
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
            totalPalavras++;
          }
          allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");

          if(testeDoc.conteudo.palavrasCl2.length>0){
            s1="";
            for(var j=0; j<testeDoc.conteudo.palavrasCl2.length;j++){
              s1+="<p style='font-style:bold; font-size:18px'>"+ testeDoc.conteudo.palavrasCl2[j] +"</p>";
            }
            totalPalavras++;
            allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
          }

          if(testeDoc.conteudo.palavrasCl3.length>0){
            s1="";
            for(var j=0; j<testeDoc.conteudo.palavrasCl3.length;j++){
              s1+="<p style='font-style:bold; font-size:18px'>"+ testeDoc.conteudo.palavrasCl3[j] +"</p>";
            }
            totalPalavras++;
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
      "click #BtnCancelar": "clickBtnCancelar",
      "click #demoButton": "clickDemoButton",
      "click #startButton": "clickStartButton",
      "click #playMyTestButton": "clickPlayMyTestButton",
      "click #submitButton": "clickSubmitButton",//por finalizar
      "click #btnConfirmarPIN": "clickbtnConfirmarPIN",
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
      $('#playPlayer').attr("src",mediaSrc);
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
    clickSubmitButton: function(e) {
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var agora=new Date();
      var ids = 'Cr'+ alunoId + agora.toISOString();
      var testeLista = {
          'TotalPalavras':totalPalavras,
          'NPalavrasErradas':'0',
          'Vacilacoes':'0',
          'Fragmentacoes':'0',
          'Silabacoes':'0',
          'Repeticoes':'0',
          'PrecisaoL': '0',
          'VelocidadeL': '0',
          'Ritmo': '0',
          'Expressividade': '0',
          'PLM': '0',
          'dataSub': agora,
          'dataCorr':null,
        };

      var TesteArealizarID = window.localStorage.getItem("TesteArealizarID");
      var profId = window.localStorage.getItem("ProfSelecID");
      var correcao = {
          '_id': ids,
          'id_Teste': TesteArealizarID,
          'id_Aluno': alunoId,
          'id_Prof': profId,
          'tipoCorrecao': 'Lista',
          'estado': '0',
          'conteudo': testeLista,
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
      document.removeEventListener("backbutton", onBackKeyDown, false); ///RETIRAR EVENTO DO BOTAO
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
     $('#labelErr').text("");  //limpa campos
     $('#inputPIN').val("");   //limpa campos
     $('#inputPINErr').removeClass("has-error"); //limpa campos
     $('#myModal').modal("show");
     $('#myModal').on('shown.bs.modal', function (e) {
        $("#inputPIN").focus();
     });
    },

    clickbtnConfirmarPIN: function(e) {

      var pinDigitado = $('#inputPIN').val();
      var pinProfAux = window.localStorage.getItem("ProfSelecPIN");
      if (pinProfAux == pinDigitado) {
        document.removeEventListener("backbutton", onBackKeyDown, false); ////// RETIRAR EVENTO DO BOTAO
        $('#myModal').modal("hide");
        $('#myModal').on('hidden.bs.modal', function (e) {

          window.history.go(-1);
        });
      } else {
        $('#inputPINErr').addClass("has-error");
        $('#labelErr').text("PIN errado!");
        $('#inputPIN').val("");
      }
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
