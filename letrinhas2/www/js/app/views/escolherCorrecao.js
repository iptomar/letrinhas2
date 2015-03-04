define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherCorrecao.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {
      ////Carrega os dados mais uteis da janela anterior////
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var alunoId = window.localStorage.getItem("AlunoSelecID");
      var alunoNome = window.localStorage.getItem("AlunoSelecNome");

      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2)  console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src",url);
      });

      //procurar as correções do professor selecionado e que ainda não estejam corrigidas.
      //inicialmente, agrupar por alunos, dando destaque ao aluno selecionado e ordenar pela data.
      function map(doc) {
        if (doc.estado == 0  && doc.id_Prof == window.localStorage.getItem("ProfSelecID")) {
          emit(doc);
        }
      }

      correcoes_local2.query({map: map}, {reduce: false}, function(errx, response) {
        if (errx) console.log("Erro: "+errx);
        else {

          if(response.rows.length > 0){
            //criar um array para receber as correções
            var l=response.rows.length;
            //preencher o cabeçalho
            $("#Cabecalho").text("Tem "+ response.rows.length + " testes por corrigir.");
            //criar um array para receber as correções
            var correcoes= new Array();
            for (var i=0; i< l; i++){
              correcoes[i] =  response.rows[i].key;
            }
            //Teste
            // APENAS //// dar destaque (agrupar) ao aluno selecionado
            if(correcoes.length > 1 ){
              var k=0, j= correcoes.length-1;
              var aux = new Array();
              for(i=0; i<correcoes.length; i++){
                if(correcoes[i].id_Aluno == alunoId){
                  aux[k]=correcoes[i];
                  k++
                }
                else{
                  aux[j]=correcoes[i];
                  j--
                }
              }
              correcoes=aux;
            }

            //construir os botões, baseado no layout do "Letrinhas V.01"
            //
            // |foto do aluno| Nome - Titulo do teste - Data/hora | Tipo de Teste| | Disciplina |
            //

            for(i=0; i<correcoes.length; i++){
              //buscar a foto e nome do aluno
              var nome, foto, titulo, disciplina, tipo, urlDiscp, urlTipo;
              alunos_local2.get(correcoes[i].id_Aluno, function(err, alunoDoc) {
                if (err)  console.log(err);
                nome = alunoDoc.nome;
                $("#pNome").text(nome);
              });
              alunos_local2.getAttachment(correcoes[i].id_Aluno, 'aluno.png', function(err2, DataImg) {
                  if (err2)  console.log(err2);
                  foto = URL.createObjectURL(DataImg);
                  $('#bFoto').attr("src",foto);
              });
              //buscar o título, tipo e disciplina do teste
              testes_local2.get(correcoes[i].id_Teste, function(err, testeDoc) {
                if (err)  console.log(err);
                titulo=testeDoc.titulo;
                disciplina=testeDoc.disciplina;
                tipo=testeDoc.tipoTeste;
                $('#pTitulo').text(titulo+ " - DD-MM-AAAA às HH:MM");
                //imagem da disciplina e tipo de teste
                switch (disciplina){
                  case 1:urlDiscp = "img/portugues.png";
                    break;
                  case 2:urlDiscp = "img/mate.png";
                    break;
                  case 3:urlDiscp = "img/estudoMeio.png";
                    break;
                  case 4:urlDiscp = "img/ingles.png";
                    break;
                }
                if(tipo == "palavras") urlTipo="img/testLista.png";
                if(tipo == "texto") urlTipo= "img/testeTexto.png";
                if(tipo == "multimedia") urlTipoc="img/testMul.png";
                //Entregar a origem das fotos
                $('#bDiscip').attr("src",urlDiscp);
                $('#bTipo').attr("src",urlTipo);
              });

              //construir o botão
              var $btn = $(
                '<div class="col-sm-20">'+
                  '<button id="'+ correcoes[i]._id + 'type="button"' +
                          'style="height:100px;  padding: 0px 10px 0px 10px;"'+
                          'class="btn btn-info btn-lg btn-block btn-Corr" >'+
                    '<img id="bFoto" src="" style=" float: left; height:70px;"/>'+
                    '<img id="bTipo" src="" style=" float: right; height:70px; margin-left:5px"/>'+
                    '<img id="bDiscip" src="" style=" float: right; height:70px; margin-left:5px"/>'+
                    '<a style="color:#FFFFFF;" aria-hidden="true">'+
                      '<p id="pNome"></p>'+
                      '<p id="pTitulo"></p>'+
                    '</a>'+
                  '</button>'+
                '</div>');
              var $container = $('#outputCorrTestes');
              $btn.appendTo($container);
              }

          }
          else{
            $("#Cabecalho").text("Não tem testes para corrigir.");
            $("CorOrdena").enabled(false);
          }

        }
      });


      //Falta criar o evento de click para cada botão! fica para quando acordar, logo à tarde!

      
    },

    events: {
      "click #BackButton": "clickBackButton",
      "click #btnNavINI": "clickbtnNavINI",
      "click #btnNavAlu": "clickbtnNavAlu",
      "click #btnNavProf": "clickbtnNavProf",
    },

    clickBackButton: function(e) {
      window.history.back();
    },

    clickbtnNavAlu: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-2);
    },

    clickbtnNavProf: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-4);
    },


    clickbtnNavINI: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.go(-6);
    },

    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});
