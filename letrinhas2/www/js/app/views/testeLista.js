define(function(require) {

  var self;
  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/testeLista.html'),
    template = _.template(janelas);

  return Backbone.View.extend({
    isFeito:false,
    TotalPalavras:0,

/////////// Fora de serviço, continua com o problema de unefined ///////////////
    semaforo: function(){
      var self = this;
      var semaforoIntrvl,
      semfroCont=3;
      clearInterval(semaforoIntrvl);
      semaforoIntrvl=setInterval(//'desenha()'
        function(){
          $("#semafro").text(''+semfroCont);
          console.log(semfroCont);
          if(semfroCont>0){
            semfroCont--;
          }else{
            clearInterval(semaforoIntrvl);
            $('#myModalCont').modal("hide");
            $('#myModalCont').on('hidden.bs.modal', function (e) {
              $('#startButton').val(1);
              $('#startButton').attr("style","background-color: #ee0000");
              $('#startButton').html('<span class="glyphicon glyphicon-stop"aria-hidden="true"> </span> Parar </a>');
              $('#demoButton').attr("style","visibility:hidden;");
              $('#playMyTestButton').attr("style","visibility:hidden;");
              $('#submitButton').attr("style","visibility:hidden;");
              //Iniciar a gravação
              self.recordAudio();
              });
          }
        },1100);
    },
////////////////////////////////////////////////////////////////////////////////

    ////////////////////////Ler ficheiro e colocar em anexo para correcao///////
    LerficheiroGravacaoEinserir: function() {
      var self = this;
      window.resolveLocalFileSystemURL("file:///sdcard/gravacao.amr",
      function (fileEntry) {
        console.log(fileEntry);
      	fileEntry.file(
          function (file) {
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
              'TotalPalavras':self.TotalPalavras,
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
        , function (e) {
        	console.log("FileSystem Error:"+e);
        });
      },  function (e) {
      	console.log("FileSystem Error:"+e);
      });
    },

    //////////// Guardar audio vindo do couchDB /////////////////
    GravarSOMfile: function(name, data, success, fail) {
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
    },


    vaiGravar: function(){
      self = this;
      $('#startButton').val(1);
      $('#startButton').attr("style","background-color: #ee0000");
      $('#startButton').html('<span class="glyphicon glyphicon-stop"aria-hidden="true"> </span> Parar </a>');
      $('#demoButton').attr("style","visibility:hidden;");
      $('#playMyTestButton').attr("style","visibility:hidden;");
      $('#submitButton').attr("style","visibility:hidden;");
      //Iniciar a gravação
      self.recordAudio();
    },


    recordAudio: function(){
      self = this;
        self.mediaSrc = "gravacao.amr";
        self.mediaRec = new Media(self.mediaSrc,
          // success callback
          function() {
            console.log("recordAudio():Audio Success");
          },
          // error callback
          function(err) {
            console.log("recordAudio():Audio Error: " + err.message);
          }
        );
      // Record audio
      self.mediaRec.startRecord();
    },

    StopRec: function() {
      try{
        self = this;
        self.mediaRec.stopRecord();
        self.mediaRec.release();}
      catch(err){console.log(err.message);}
    },

    PlayRec: function()
    {
      self = this;
      try{self.mediaRec.play();}
      catch(err){console.log(err.message);}
    },

    StopPlayRec: function ()
    {
      self = this;
      try{self.mediaRec.stop();}
      catch(err){console.log(err.message)}
    },
    ////////////////////////////////////////////////////////////////////////////////

    onBackKeyDown:  function() {
      $('#labelErr').text("");  //limpa campos
      $('#inputPIN').val("");   //limpa campos
      $('#inputPINErr').removeClass("has-error"); //limpa campos
      $('#myModal').modal("show");
      $('#myModal').on('shown.bs.modal', function (e) {
         $("#inputPIN").focus();
      });
    },

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    // Funcao executada no inicio de load da janela ////////////
    initialize: function() {
      self = this;
      document.addEventListener("backbutton", this.onBackKeyDown, false); //Adicionar o evento
      self.isFeito=false;
    // Vai buscar todas as variaveis necessárias
      var profId = window.localStorage.getItem("ProfSelecID"),
      profNome = window.localStorage.getItem("ProfSelecNome"),
      escolaNome = window.localStorage.getItem("EscolaSelecionadaNome"),
      escolaId = window.localStorage.getItem("EscolaSelecionadaID"),
      alunoNome = window.localStorage.getItem("AlunoSelecNome"),
      turmaId = window.localStorage.getItem("TurmaSelecID"),
      turmaNome = window.localStorage.getItem("TurmaSelecNome"),
      discplinaSelecionada = window.localStorage.getItem("DiscplinaSelecionada"),
      tipoTesteSelecionado = window.localStorage.getItem("TipoTesteSelecionado"),
      TesteArealizarID = window.localStorage.getItem("TesteArealizarID");

      testes_local2.get(TesteArealizarID, function(err, testeDoc) {
        if (err)  console.log(err);

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
            self.TotalPalavras++;
          }
          allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
          if(testeDoc.conteudo.palavrasCl2.length>0){
            s1="";
            for(var j=0; j<testeDoc.conteudo.palavrasCl2.length;j++){
              s1+="<p style='font-weight:bold; font-size:20px'>"+ testeDoc.conteudo.palavrasCl2[j] +"</p>";
              self.TotalPalavras++;
            }
            allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
          }

          if(testeDoc.conteudo.palavrasCl3.length>0){
            s1="";
            for(var j=0; j<testeDoc.conteudo.palavrasCl3.length;j++){
              s1+="<p style='font-weight:bold; font-size:20px'>"+ testeDoc.conteudo.palavrasCl3[j] +"</p>";
              self.TotalPalavras++;
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
        self.GravarSOMfile('voz.mp3', DataImg, function () {
          self.Demo = cordova.file.dataDirectory+"/files/voz.mp3";
          $("#playPlayer").attr("src",self.Demo);
          console.log("\nA carregar demo: "+self.Demo);

        }, function (err) {
          console.log("DEU ERRO: "+err);
          });
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
      "click #btnConfirmarSUB": "clickbtnConfirmarSUB",
      "click #btnConfirmarRep": "clickbtnConfirmarRep",
      "click #pik": "clickpik",

    },

    ///////////////////////Fora de serviço///////////////////////////////////
    clickpik: function(e){
      var self=this;
      e.stopPropagation(); e.preventDefault();
      mediaRec = null;
      self.vaiGravar();
    },
    /////////////////////////////////////////////////////////////////////////


    //Controlo para repetição da gravação de leitura
    clickbtnConfirmarRep: function(e){
      var self=this;
      e.stopPropagation(); e.preventDefault();
      $('#myModalRep').modal("hide");
      $('#myModalRep').on('hidden.bs.modal', function(e){});
      //$("#myModalCont").modal("show");
      self.vaiGravar();
    },

    // Inicio da gravação da leitura do teste!
    clickStartButton: function(e){
      e.stopPropagation(); e.preventDefault();
      $("#semafro").text('A gravar em');
      if ($('#startButton').val()==0){
        if(self.isFeito==true){
          $('#myModalRep').modal("show");
        }
        else {
          //$("#myModalCont").modal("show");
          self.vaiGravar();
        }
      }
        else {
          $('#startButton').val(0);
          $('#startButton').attr("style","background-color: #eeff00");
          $('#startButton').html('<span class="glyphicon glyphicon-repeat"aria-hidden="true"> </span> Repetir </a>');
          $('#demoButton').attr("style","visibility:initial;background-color: #ffc060");
          $('#playMyTestButton').attr("style","visibility:initial; background-color: #c065ff");
          $('#submitButton').attr("style","visibility:initial; background-color: #00ee00");

          //parar a gravação!
          self.StopRec();
          self.isFeito=true;
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
      var self=this;
        $('#myModalSUB').modal("hide");
        $('#myModalSUB').on('hidden.bs.modal', function (e) {
          document.removeEventListener("backbutton", self.onBackKeyDown, false); ///RETIRAR EVENTO DO BOTAO
          self.LerficheiroGravacaoEinserir();
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
      var self=this;
      console.log("\nDemoButon: "+self.Demo);

      $('#playPlayer').attr("src",self.Demo);
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
        if (self.isFeito){
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
        $('#myModal').modal("hide");
        $('#myModal').on('hidden.bs.modal', function (e) {
          document.removeEventListener("backbutton", self.onBackKeyDown, false); ////// RETIRAR EVENTO DO BOTAO
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
