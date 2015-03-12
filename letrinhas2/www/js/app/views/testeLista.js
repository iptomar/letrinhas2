var Demo,           //caminho para reproduzir o ficheiro de demonstração
    mediaRec,       //objeto Media que irá fazer a gravação
    mediaSrc,       //url onde deverá ser guardada a gravação
    totalPalavras=0;//contador de palavras

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

////////////////////////Ler ficheiro e colocar em anexo para correcao/////////
function LerficheiroGravacaoEinserir() {
  window.resolveLocalFileSystemURL("file:///sdcard/gravacao.amr", gotFile, fail);
}

function gotFile(fileEntry) {
  console.log(fileEntry);
  fileEntry.file(success, fail);
}

function fail(e) {
	console.log("FileSystem Error:"+e);
}


function success(file) {
  var agora=new Date();
  var TesteArealizarID = window.localStorage.getItem("TesteArealizarID");
  var alunoId = window.localStorage.getItem("AlunoSelecID");
  var profId = window.localStorage.getItem("ProfSelecID");
  var correcao = {
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

  correcoes_local2.post(correcao, function(err, response) {
    if (err) {
      console.log('Correcao ' + err + ' erro');
    }
    else {
      correcoes_local2.putAttachment(response.id, 'gravacao.amr', response.rev, file, 'audio/amr', function(err, res) {
        if (!err) {
          console.log('Anexo  inserted: '+ response.id);
        }
        else {
          console.log('anexo ' + err + ' erro');
        }
      });
      console.log('Correcao ' + response.id + ' inserido!');
    }
  });

}

//////////// Guardar audio vindo do couchDB /////////////////
function GravarSOMfile (name, data, success, fail) {
  console.log(cordova.file.dataDirectory);
  var gotFileSystem = function (fileSystem) {
    fileSystem.root.getFile(name, { create: true, exclusive: false }, gotFileEntry, fail);
  };

  var gotFileEntry = function (fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
  };

  var gotFileWriter = function (writer) {
    writer.onwrite = success;
    writer.onerror = fail;
    writer.write(data);
  };
  window.requestFileSystem(window.LocalFileSystem.PERSISTENT, data.length || 0, gotFileSystem, fail);
}

function recordAudio() {
  try{
    mediaSrc = "gravacao.amr";
    mediaRec = new Media(mediaSrc,
      // success callback
      function() {
        console.log("recordAudio():Audio Success");
      },
      // error callback
      function(err) {
        console.log("recordAudio():Audio Error: " + err.code);
      }
    );
  // Record audio
    mediaRec.startRecord();
  }
  catch (err){
    console.log(err.message);
  }

}

function StopRec() {
  try{
  mediaRec.stopRecord();
  mediaRec.release();}
  catch(err){console.log(err.message);}
}

function PlayRec()
{
  try{mediaRec.play();}
  catch(err){console.log(err.message);}
}

function StopPlayRec()
{
  try{mediaRec.stop();}
  catch(err){console.log(err.message)}
}


////////////////////////////////////////////////////////////////////////////////
define(function(require) {
  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/testeLista.html'),
    template = _.template(janelas),
    isFeito=false;

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
            s1+="<p style='font-weight:bold; font-size:20px'>"+ testeDoc.conteudo.palavrasCl1[j] +"</p>";
            totalPalavras++;
          }
          allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
          if(testeDoc.conteudo.palavrasCl2.length>0){
            s1="";
            for(var j=0; j<testeDoc.conteudo.palavrasCl2.length;j++){
              s1+="<p style='font-weight:bold; font-size:20px'>"+ testeDoc.conteudo.palavrasCl2[j] +"</p>";
              totalPalavras++;
            }
            allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
          }

          if(testeDoc.conteudo.palavrasCl3.length>0){
            s1="";
            for(var j=0; j<testeDoc.conteudo.palavrasCl3.length;j++){
              s1+="<p style='font-weight:bold; font-size:20px'>"+ testeDoc.conteudo.palavrasCl3[j] +"</p>";
              totalPalavras++;
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
        GravarSOMfile('voz.mp3', DataImg, function () {
          console.log('FUNCIONA');
          Demo = cordova.file.dataDirectory+"/files/voz.mp3";
          $("#playPlayer").attr("src",Demo)
        }, function (err) {
          console.log("DEU ERRO"+err);
          });
      });

      ////// adicionar EVENTO DO BOTAO
      document.addEventListener("backbutton", onBackKeyDown, true);

    },

    //Eventos Click
    events: {
      "click #BtnCancelar": "clickBtnCancelar",
      "click #demoButton": "clickDemoButton",
      "click #startButton": "clickStartButton",
      "click #playMyTestButton": "clickPlayMyTestButton",
      "click #submitButton": "clickSubmitButton",//por finalizar
      "click #btnConfirmarPIN": "clickbtnConfirmarPIN",
      "click #btnConfirmarSUB": "clickbtnConfirmarSUB",

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
      $("#playPlayer").attr("src","file:///sdcard/gravacao.amr")

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

    clickbtnConfirmarSUB: function(e) {
      document.removeEventListener("backbutton", onBackKeyDown, false); ///RETIRAR EVENTO DO BOTAO
        $('#myModalSUB').modal("hide");
        $('#myModalSUB').on('hidden.bs.modal', function (e) {
          LerficheiroGravacaoEinserir();
          window.history.back();
        });
    },

    // Sumeter o teste para corecção (Criar uma correção não corrigida)
    clickSubmitButton: function(e) {
      e.stopPropagation(); e.preventDefault();
      $('#myModalSUB').modal("show");
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

    render: function() {
      this.$el.html(template({}));
      return this;
    }

  });
});
