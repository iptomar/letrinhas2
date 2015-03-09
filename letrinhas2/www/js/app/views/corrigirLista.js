
//Método para controlar o botão fisico de retroceder do tablet
function onBackKeyDown() {
  alert("Está a sair, esta correção não foi guardada!");
  document.removeEventListener("backbutton", onBackKeyDown, false); ////// RETIRAR EVENTO DO BOTAO
}

function convert_n2d(n){
    if(n<10) return("0"+n);
    else return(""+n);	}


var isFeito=false,
    Demo, leitura,
    totalPalavras=0,
    totalPalavrasErradas=0,//contador de palavras erradas
    relatorio="";

//Função para maracar / desmarcar a palavra clicada
function picaPalavra(plvr){


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
              console.log(testeDoc);

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


          //*id do div com o conteúdo, id="listaAreaConteudo"
          if(testeDoc.conteudo.palavrasCl1.length>0){
            s1="";
            for(var j=0; j<testeDoc.conteudo.palavrasCl1.length;j++){
              s1+="<p class='picavel'  value='' style='font-weight:bold; font-size:20px'>"+ testeDoc.conteudo.palavrasCl1[j] +"</p>";
              totalPalavras++;
            }
            allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
            empty=false;
          }

          if(testeDoc.conteudo.palavrasCl2.length>0){
              s1="";
              for(var j=0; j<testeDoc.conteudo.palavrasCl2.length;j++){
                s1+="<p class='picavel'  value=''  style='font-weight:bold; font-size:20px'>"+ testeDoc.conteudo.palavrasCl2[j] +"</p>";
              }
              totalPalavras++;
              allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
              empty=false;
          }

          if(testeDoc.conteudo.palavrasCl3.length>0){
              s1="";
              for(var j=0; j<testeDoc.conteudo.palavrasCl3.length;j++){
                s1+="<p class='picavel' value='' style='font-weight:bold; font-size:20px'>"+ testeDoc.conteudo.palavrasCl3[j] +"</p>";
              }
              totalPalavras++;
              allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
              empty=false;
          }

          allTable+="</tr></table>";

          if(!empty){
            //Inserir a tabela no div id=listaAreaConteudo
            $('#listaAreaConteudo').html(allTable);

          } else{
            alert("O conteúdo dste teste está vazio! \n"+
                  "Id do teste: "+TesteArealizarID+
                  "\n Professor responsável: "+ profNome+
                  "\n id: "+ profId);
          }


        });

        // Analisa todos os botoes do div
        var $container = $('#listaAreaConteudo');
        $container.on('click', '.picavel', function(ev) {
          ev.stopPropagation(); ev.preventDefault();

          var $btn = $(this); // O jQuery passa o btn clicado pelo this
          var self = this;

          if($btn.val()==''){
            //Teste//
            $btn.val("picada");
            //*******************
            $btn.attr("style","font-weight:bold; font-size:20px; color: #ee0000");
          }
          else{
            //Teste//
            
            $btn.val('');
            //*******************

            $btn.attr("style","font-weight:bold; font-size:20px; color: #000000");
          }

        /*  console.log($btn.val());
          if($btn.val() == "texto" ){
            if (Backbone.history.fragment != 'corrigirTexto') {
              utils.loader(function() {
                ev.preventDefault();
                app.navigate('/corrigirTexto', {trigger: true});
              });
            }
          }else{
            if($btn.val() == "Lista" ){
              if (Backbone.history.fragment != 'corrigirLista') {
                utils.loader(function() {
                  ev.preventDefault();
                  app.navigate('/corrigirLista', {trigger: true});
                });
              }
            }
          }*/
        });

      });










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
