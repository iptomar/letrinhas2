var TotalPalavas;

////////////////////////LerFile e colocar em anexo para correcao/////////
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
      'tipoCorrecao': 'Texto',
      'estado': '0',
      'conteudoResult':[],
      'TotalPalavras':TotalPalavas,
      'dataSub': agora,
      'dataCorr':null,
      'expresSinais':null,
      'expresEntoacao':null,
      'expresTexto':null,
      'velocidade':null,
      'observ':null,
    };

    correcoes_local2.post(correcao, function(err, response) {
      if (err) {
        console.log('Correcao ' + err + ' erro');
      } else {
        correcoes_local2.putAttachment(response.id, 'gravacao.amr', response.rev, file, 'audio/amr', function(err, res) {
        if (!err) {
         console.log('Anexo  inserted: '+ response.id);
        } else {
          console.log('anexo ' + err + ' erro');
        }
       });
        console.log('Correcao ' + response.id + ' inserido!');
      }
    });

}

function countWords(stringx){
  stringx = stringx.replace(/(^\s*)|(\s*$)/gi,"");
  stringx = stringx.replace(/[ ]{2,}/gi," ");
  stringx = stringx.replace(/\n /,"\n");
//  console.log(stringx.split(' ').length);
TotalPalavas = stringx.split(' ').length;
}


//////////// GRAVAR SOM VINDO DA BD E PASSAR PARA O PLAYER DE AUDIO /////////////////
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

//////////// ////  recorder ////  /////////////////////////////

var mediaRec;

function recordAudio() {
  var src = "gravacao.amr";
  mediaRec = new Media(src,
    function() {
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
  mediaRec.stopRecord();
  mediaRec.release();
}


//////////////////////////////////////////////////
define(function(require) {

  "use strict";

  var self;

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/testeTexto.html'),
    template = _.template(janelas);

  return Backbone.View.extend({

    onBackKeyDown:  function() {
      $('#labelErr').text("");  //limpa campos
      $('#inputPIN').val("");   //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModalProf').modal("show");
      $('#myModalProf').on('shown.bs.modal', function (e) {
         $("#inputPIN").focus();
      });
    },


    /////// Funcao executada no inicio de load da janela ////////////
    initialize: function() {
      /// Vai buscar todas
      self = this;
      TotalPalavas = 0;
      document.addEventListener("backbutton", this.onBackKeyDown, false); //Adicionar o evento
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
        //console.log(testeDoc);

        $('#titleTestePagina').text(testeDoc.titulo);
        $('#lbTituloTeste').text(testeDoc.conteudo.pergunta);
        $('#txtAreaConteud').append(testeDoc.conteudo.texto.replace(/\n/g, '</br>'));
        countWords(testeDoc.conteudo.texto);
      });

      testes_local2.getAttachment(TesteArealizarID, 'voz.mp3', function(err2, DataImg) {
        if (err2) console.log(err2);
        GravarSOMfile('voz.mp3', DataImg, function () {
          console.log('FUNCIONA');
          $("#AudioPlayerProf").attr("src",cordova.file.dataDirectory+"/files/voz.mp3")

        }, function (err) {
          console.log("DEU ERRO"+err);
          });
      });

    },

    //Eventos Click
    events: {
      "click #BackButtonTTexto": "clickBackButtonTTexto",
      "click #btnRec": "clickbtnRec",
      "click #btnFinalizar": "clickbtnFinalizar",
      "click #btnConfirmarPIN": "clickbtnConfirmarPIN",
      "click #btnConfirmarSUB": "clickbtnConfirmarSUB",
      "click #btnDemonstracao": "clickbtnDemonstracao",
      "click #btnParar1": "clickbtnParar1",
      "click #btnParar2": "clickbtnParar2",
      "click #btnOuvirme": "clickbtnOuvirme",

    },

    clickbtnDemonstracao: function(e) {

      $('#div1').hide();
      $('#div2').show();
      $("#AudioPlayerProf").prop("currentTime",0);
      $("#AudioPlayerProf").trigger('play');
     },


     clickbtnParar1: function(e) {
       $("#AudioPlayerProf").trigger('pause');
       $('#div2').hide();
       $('#div1').show();
      },

      clickbtnParar2: function(e) {
        $("#AudioPlayerAluno").trigger('pause');
        $('#div3').hide();
        $('#div1').show();
       },

      clickbtnOuvirme: function(e) {
        $('#div1').hide();
        $('#div3').show();
        $("#AudioPlayerAluno").prop("currentTime",0);
        $("#AudioPlayerAluno").trigger('play');
       },


    clickbtnConfirmarPIN: function(e) {
      mediaRec = null;
      var pinDigitado = $('#inputPIN').val();
      var pinProfAux = window.localStorage.getItem("ProfSelecPIN");
      if (pinProfAux == pinDigitado) {
        $('#myModalProf').modal("hide");
        $('#myModalProf').on('hidden.bs.modal', function (e) {
          document.removeEventListener("backbutton", self.onBackKeyDown, false); ////// RETIRAR EVENTO DO BOTAO
          window.history.go(-1);
        });
      } else {
        $('#inputPINErr').addClass("has-error");
        $('#labelErr').text("PIN errado!");
        $('#inputPIN').val("");
      }
    },


    clickbtnConfirmarSUB: function(e) {

        $('#myModalSUB').modal("hide");
        $('#myModalSUB').on('hidden.bs.modal', function (e) {
          document.removeEventListener("backbutton", self.onBackKeyDown, false); ///RETIRAR EVENTO DO BOTAO
          LerficheiroGravacaoEinserir();
          window.history.back();
        });
    },

    clickbtnFinalizar: function(e) {
      e.stopPropagation(); e.preventDefault();
      $('#myModalSUB').modal("show");
    },


    clickbtnRec: function(e) {
   ///Se o botao é botao de gravar
    if  ($('#btnRec').hasClass("btn-success") || $('#btnRec').hasClass("btn-primary"))
    {
      $('#btnDemonstracao').hide();
      $('#AudioPlayerProf').prop('controls', false);
      $('#AudioPlayerProf').trigger('pause');
      $('#AudioPlayerProf').prop("currentTime",0);
      $('#btnRec').removeClass("btn-success"); //limpa campos
      $('#btnRec').removeClass("btn-primary"); //limpa campos
      $('#btnRec').addClass("btn-danger"); //limpa campos
      $('#btnRec').html("<span class='glyphicon glyphicon glyphicon-stop' ></span> Parar");
      mediaRec = null;
      recordAudio();
    }///Se for para parar a gravacao
    else if ($('#btnRec').hasClass("btn-danger"))
    {  $('#btnFinalizar').removeClass("disabled"); //limpa campos
        StopRec();
      $('#AudioPlayerProf').prop('controls', true);
      $('#btnRec').removeClass("btn-danger"); //limpa campos
      $('#btnRec').addClass("btn-primary"); //limpa campos
      $('#btnRec').html("<span class='glyphicon glyphicon glyphicon-repeat'></span>  Repetir");
      $('#btnDemonstracao').show();
      $('#btnFinalizar').show();
      $('#btnOuvirme').show();
      $("#AudioPlayerAluno").attr("src","file:///sdcard/gravacao.amr");
    }

    },

    clickBackButtonTTexto: function(e) {
      e.stopPropagation(); e.preventDefault();
      $('#labelErr').text("");  //limpa campos
      $('#inputPIN').val("");   //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModalProf').modal("show");
      $('#myModalProf').on('shown.bs.modal', function (e) {
         $("#inputPIN").focus();
      });
    },


    render: function() {
      this.$el.html(template({}));
      return this;
    }

  });
});
