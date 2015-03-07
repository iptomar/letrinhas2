var mediaRec;

////// teste para ler um ficheiro neste caso o ficheiro que foi gravado para a memoria fisica do tele
function LerFile() {
//  window.plugins.fileOpener.open("file:///sdcard/gravacao.amr");
window.resolveLocalFileSystemURL("file:///sdcard/gravacao.amr", gotFile, fail);
}

function fail(e) {
	console.log("FileSystem Error:"+e);
}

function gotFile(fileEntry) {
  console.log(fileEntry);
  fileEntry.file(function(file) {
		var reader = new FileReader();

		reader.onload  = function() {
      console.log("---------------------------------");
      var attachment = new Blob([reader.result], {type: 'audio/amr'});
      console.log(reader.result);
      console.log("---------------------------------");
			console.log(attachment);
      //////Este codigo serve para inserir um anexo terá que por exemplo colocar um ID e _Rev valido por exemolo com os testes existentes no servidor ince.pt

    //  correcoes_local2.putAttachment('Corr0', 'uiy.amr', "2-9f187af943e4cb64b8aac9c28c9c71d9", attachment, 'audio/amr', function(err, res) {
    //  if (!err) {
    //   console.log('anexo  inserted'+ res);
    //  } else {
    //    console.log('anexo ' + err + ' erro');
    //  }
    //  });
		}
		reader.readAsBinaryString(file);
	});
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
      LerFile();
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
