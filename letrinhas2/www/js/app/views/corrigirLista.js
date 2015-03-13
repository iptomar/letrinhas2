
//Método para controlar o botão fisico de retroceder do tablet
function onBackKeyDown() {
  document.removeEventListener("backbutton", onBackKeyDown, false); ////// RETIRAR EVENTO DO BOTAO

}


function convert_n2d(n){
    if(n<10) return("0"+n);
    else return(""+n);	}


var isFeito=false,
    $palavra,
    Demo, leitura,
    totalPalavras=0,
    totalPalavrasErradas=0,//contador de palavras erradas
    relatorio="";

//Função para marcar ou desmarcar a palavra clicada
function picaPalavra(op){
  var $opcao = $(op);
  $palavra.val($opcao.val()+$opcao.text());
  $palavra.attr("style","font-weight:bold; font-size:20px; color: #ee0000");
  totalPalavrasErradas++;
  verificaPalavras();
  $('#myModalSUB').modal("hide");
  $('#myModalSUB').on('hidden.bs.modal', function (e) {});

}

function verificaPalavras(){
   if( totalPalavrasErradas!=0){
     $("#lbErros").attr("style","font-weight:bold; font-size:20px; color: #dd0000; visibility:initial");
     $("#lbErros").text(totalPalavrasErradas + " Palavras Erradas");
   }
   else{
     $("#lbErros").attr("style","visibility:hidden");
   }
 }

function findErr(tip){
  //devolve todas as palavras da classe

  var e=0,f=0,todasPalavras=document.getElementsByClassName("picavel");
  for (var i=0; i< todasPalavras.length; i++){
    if($(todasPalavras[i]).val() != ''){
      //selecionar a categoria do erro (Exatidão / fluidez)
      switch (parseInt(($(todasPalavras[i]).val()).charAt(0))){
        case 0:
          e++;
          break;
        case 1:
          f++;
          break;
      }
    }
  }

  if(tip==0) return e;
  else return f;
}

//////////// Guardar audio vindo do couchDB /////////////////
function GravarSOMfile (name, data, success, fail) {
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

      ////Carrega os dados mais uteis da janela anterior////
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var correcaoID = window.localStorage.getItem("CorrecaoID"); //enviar variavel

      correcoes_local2.get(correcaoID, function(err, correcaoDoc){
        if(err) console.log(err);

        $("#titleTestePagina").text("Corrigir teste de lista de palavras, submetido a "+
                                      convert_n2d(correcaoDoc.dataSub.getDate())+
                                      "/"+ convert_n2d(correcaoDoc.dataSub.getMonth()+1)+
                                      "/"+ convert_n2d(correcaoDoc.dataSub.getFullYear())+
                                      " às "+convert_n2d(correcaoDoc.dataSub.getHours())+
                                      ":"+convert_n2d(correcaoDoc.dataSub.getMinutes())+
                                      ":"+convert_n2d(correcaoDoc.dataSub.getSeconds())
                                      );
        alunos_local2.get(correcaoDoc.id_Aluno, function(err, alunoDoc){
          if(err) console.log(err);

          $("#lbNomeAluno").text(alunoDoc.nome);
        });
        alunos_local2.getAttachment(correcaoDoc.id_Aluno, 'aluno.png', function(err2, DataImg) {
            if (err2)  console.log(err2);

            var foto = URL.createObjectURL(DataImg);
            $("#alunoFoto").attr("src",foto);
        });

        testes_local2.get(correcaoDoc.id_Teste, function(err, testeDoc) {
          if (err)  console.log(err);

          $('#lbTituloTeste').text(testeDoc.titulo+" - "+testeDoc.conteudo.pergunta);
          //imagem da disciplina e tipo de teste
          var urlDiscp;
          switch (testeDoc.disciplina){
            case 1:urlDiscp = "img/portugues.png";
              break;
            case 2:urlDiscp = "img/mate.png";
              break;
            case 3:urlDiscp = "img/estudoMeio.png";
              break;
            case 4:urlDiscp = "img/ingles.png";
              break;
          }
          $('#imgDisciplina').attr("src",urlDiscp);
          var s1,allTable, empty=true;
          allTable ="<table style='width:100%; '><tr>";
          totalPalavras=0;
          //*id do div com o conteúdo, id="listaAreaConteudo"
          if(testeDoc.conteudo.palavrasCl1.length>0){
            s1="";
            for(var j=0; j<testeDoc.conteudo.palavrasCl1.length;j++){
              s1+="<p id='c1l"+ (j+1) +" 'class='picavel' value=''"
                    +"style='font-weight:bold; font-size:20px'>"
                    + testeDoc.conteudo.palavrasCl1[j] +"</p>";
              totalPalavras++;
            }
            allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
            empty=false;
          }

          if(testeDoc.conteudo.palavrasCl2.length>0){
              s1="";
              for(var j=0; j<testeDoc.conteudo.palavrasCl2.length;j++){
                s1+="<p id='c2l"+ (j+1) +"'class='picavel' value=''"
                      +"style='font-weight:bold; font-size:20px'>"
                      + testeDoc.conteudo.palavrasCl2[j] +"</p>";
                totalPalavras++;
              }
              allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
              empty=false;
          }

          if(testeDoc.conteudo.palavrasCl3.length>0){
              s1="";
              for(var j=0; j<testeDoc.conteudo.palavrasCl3.length;j++){
                s1+="<p id='c3l"+ (j+1) +"'class='picavel' value=''"
                      +"style='font-weight:bold; font-size:20px'>"
                      + testeDoc.conteudo.palavrasCl3[j] +"</p>";
                totalPalavras++;
              }
              allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
              empty=false;
          }

          allTable+="</tr></table>";

          if(!empty){
            //Inserir a tabela no div id=listaAreaConteudo
            $('#listaAreaConteudo').html(allTable);

          }
        });

        testes_local2.getAttachment(correcaoDoc.id_Teste, 'voz.mp3', function(err2, DataImg) {
          try{
            GravarSOMfile('voz.mp3', DataImg, function () {
                console.log('FUNCIONA');
                Demo = cordova.file.dataDirectory+"/files/voz.mp3";
                }, function (err) {
                  console.log("DEU ERRO: "+err);
            });
          }
          catch (err){
            console.log(err.message);
          }
        });

        correcoes_local2.getAttachment(correcaoDoc.id_Teste, 'leitura.amr', function(err2, DataImg) {
          try{
            GravarSOMfile('leitura.amr', DataImg, function () {
                console.log('FUNCIONA');
                leitura = cordova.file.dataDirectory+"/files/leitura.amr";
                }, function (err) {
                  console.log("DEU ERRO: "+err);
            });
          }
          catch (err){
            console.log(err);
          }
        });

        // Analisa todos os botoes do div
        var $container = $('#listaAreaConteudo');
        $container.on('click', '.picavel', function(ev) {
          ev.stopPropagation(); ev.preventDefault();

          $palavra = $(this); // O jQuery passa o btn clicado pelo this
          //vou usar o atributo value, para guardar o tipo de erro cometido
          //Se não tem nada no value, logo ainda nãoestá marcada
          if($palavra.val()==''){
            $('#myModalSUB').modal("show");
          }
          else{/// Desmarcar
            totalPalavrasErradas--;
            $palavra.val('');
            $palavra.attr("style","font-weight:bold; font-size:20px; color: #000000");
            verificaPalavras();
          }
        });
      });
      totalPalavrasErradas=0;
    },

    events: {
      "click #BtnCancelar": "clickBtnCancelar",
      "click #demoButton": "clickDemoButton",
      "click #playMyTestButton": "clickPlayMyTestButton",
      "click #submitButton": "clickSubmitButton",
      "click #btnConfirmarSUB": "clickbtnConfirmarSUB",
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
      $('#playPlayer').attr("src",leitura);
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


    clickbtnConfirmarSUB: function(e) {
        $('#myModalConfirm').modal("hide");
        $('#myModalConfirm').on('hidden.bs.modal', function (e) {
        try{
            var plvr, categ, erro;
            //array para receber os items (palavra e erro)
            var conteudoResultado = new Array();

            //devolve todas as palavras da classe
            var todasPalavras =document.getElementsByClassName("picavel");
            for (var i=0; i< todasPalavras.length; i++){
              if($(todasPalavras[i]).val() != ''){
                plvr=$(todasPalavras[i]).text();

                //selecionar a categoria do erro (Exatidão / fluidez)
                switch (parseInt(($(todasPalavras[i]).val()).charAt(0))){
                  case 0:
                    categ="Exatidão";
                    break;
                  case 1:
                    categ="Fluidez";
                    break;
                }
                //O erro em si.
                erro= ($(todasPalavras[i]).val()).substring(1);
                //mini array de 3 campos
                var item = {
                    'palavra': plvr,
                    'categoria': categ,
                    'erro': erro,
                };
                //colocar o item no array
                conteudoResultado[i] = item;
              }
            }

            //Data da correção
            var agora = new Date();
            //garantir que o tempo é da leitura do aluno
            $('#playPlayer').attr("src",leitura);
            //obrigar o player a ficar com o tempo do ficheiro.
            var audio = document.getElementById("playPlayer");
            audio.play();
            audio.pause();

            //retorna o tempo de duração da leitura em segundos,
            //arredondando ao ineiro mais próximo
            var tempoSeg = Math.round($("#playPlayer").prop("duration"));
            //(plm) palavras lidas por minuto (não necessário por enquanto)
            //var plm = Math.roud((totalPalavras*60/tempoSeg));
            //palavras corretamente lidas (pcl)
            var pcl= totalPalavras - totalPalavrasErradas;
            //Velocidade de leitura (VL)
            var vl = Math.round((pcl*60/tempoSeg));

            //Fazer o update
            var CorrID= window.localStorage.getItem("CorrecaoID");
            correcoes_local2.get(CorrID, function(err, docmnt){
              //total de palavras
              docmnt.TotalPalavras = totalPalavras;
              //conteúdo onde estão identificadas as palavras erradas
              docmnt.conteudoResult=conteudoResultado;
              //Data da correção
              docmnt.dataCorr = agora;
              //estado para corrigido!
              docmnt.estado = 1;
              //erros de pontuação (não aplicavel neste tipo de teste)
              docmnt.expresSinais = null;
              //erros de entoação (não aplicavel)
              docmnt.expresEntoacao = null;
              //erros de expressividade do texto (não aplicavel)
              docmnt.expresTexto = null;
              //Velocidade da leitura
              docmnt.velocidade = vl;

              //actualizar o documento (correcao)
              correcoes_local2.put(docmnt, CorrID, docmnt._rev, function(err, response) {
                if (err) {
                  console.log('Correcao ' + err + ' erro');
                } else {
                  console.log('Parabens InseridoCorrecao');
                }
              });

            });
          }
          catch (err){
            console.log(err);
          }
          window.history.back();
        });
    },


    // Fazer update à correção com os devidos campos preenchidos
    clickSubmitButton: function(e) {
      e.stopPropagation(); e.preventDefault();
      //fazer um resumo:
      var resumo ="";
      resumo+="Titulo: "+$("#lbTituloTeste").text()+"\n";
      resumo+="Aluno: "+$("#lbNomeAluno").text()+"\n";
      resumo+="Total de Palavras: "+totalPalavras+"\n";

      var audio = document.getElementById("playPlayer");
      audio.src = Demo;
      audio.play();
      audio.pause();
      var tempo = Math.round(audio.duration);

      resumo+="Tempo do professor:\n"+
              "         - Duração: "+convert_n2d(tempo/60)+":"+convert_n2d(tempo%60)+"\n"+
              "         - Velocidade: "+(Math.round(60*totalPalavras/tempo))+" palavras/min\n\n";
      var e,f;
      e= Math.round((findErr(0)*100/totalPalavras));
      f= Math.round((findErr(1)*100/totalPalavras));
      resumo+="Correção:\n"+
              "         - Exatidão: "+e+" palavras erradas, acertou"+(100-e)+"%\n"+
              "         - Fluidez:  "+f+" palavras erradas, acertou"+(100-f)+"%\n"+
              "         >>> Total: "+(100-(e+f))+"% certo <<<\n\n";

      audio.src = leitura;
      //obrigar o player a ficar com o tempo do ficheiro.
      audio.play();
      audio.pause();
      tempo = Math.round(audio.duration);
      resumo+="Tempo do aluno:\n"+
              "         - Duração: "+convert_n2d(tempo/60)+":"+convert_n2d(tempo%60)+"\n"+
              "         - Velocidade: "+(Math.round(60*totalPalavras/tempo))+" palavras/min\n\n";

      $("#resumo").text(resumo);

      $('#myModalConfirm').modal("show");
    },

    clickBtnCancelar: function(e) {
     e.stopPropagation(); e.preventDefault();
     window.history.back();
    },

    render: function() {
      this.$el.html(template({}));
      return this;
    }

  });

});
