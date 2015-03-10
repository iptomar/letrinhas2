

////// teste para ler um ficheiro neste caso o ficheiro que foi gravado para a memoria fisica do tele
function LerFile() {
//  window.plugins.fileOpener.open("file:///sdcard/gravacao.amr");
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
    console.log("File size: " + file);

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




/////////////////////////////////////////////////////////////////////////
define(function(require) {
  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/testes.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {



    },

    //Eventos Click
    events: {
      "click #btnVerFile": "btnVerFile",
      "click #btnGravarSom": "btnGravarSom",
      "click #btnStopRec": "btnStopRec",
      "click #btnReprProfSom": "btnReprProfSom",
    },

    btnVerFile: function(e) {
    //  LerFile();
		$("#cenas").append("O Lorem Ipsum é um texto modelo da indústria tipográfica e de impressão. O Lorem Ipsum tem vindo a ser o texto padrão usado por estas indústrias desde o ano de 1500, quando uma misturou os caracteres de um texto para criar um espécime de livro. Este texto não só sobreviveu 5 séculos, mas também o salto para a tipografia electrónica, mantendo-se essencialmente inalterada. Foi popularizada nos anos 60 com a disponibilização das folhas de Letraset, que continham passagens com Lorem Ipsum, e mais recentemente com os programas de publicação como o Aldus PageMaker que incluem versões do Lorem Ipsum.</br>xto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos. Richard McClintock, um professor de Latim no Colégio Hampden-Sydney, na Virgínia, procurou uma das palavras em Latim mais obscuras (consectetur) numa passagem Lorem Ipsum, e");
    },


    btnGravarSom: function(e) {
      recordAudio();
    },

    btnStopRec: function(e) {
      StopRec();
    },

    btnReprProfSom: function(e) {
      testes_local2.getAttachment('Teste_N0', 'voz.mp3', function(err2, DataImg) {
      if (err2) console.log(err2);
      GravarSOMfile('voz.mp3', DataImg, function () {
        console.log('FUNCIONA');
        $("#AudioPlayer").attr("src",cordova.file.dataDirectory+"/files/voz.mp3")
      }, function (err) {
        console.log("DEU ERRO"+err);
        });
      });
    },



    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});
