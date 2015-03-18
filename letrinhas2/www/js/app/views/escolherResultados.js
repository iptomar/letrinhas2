define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/escolherResultados.html'),
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

      //procurar os resultados das correções do aluno selecionado.
      function map(doc) {
        if (doc.estado == 1  && doc.id_Aluno == window.localStorage.getItem("AlunoSelecID")) {
          emit(doc);
        }
      }
      function convert_n2d(n){
          if(n<10) return("0"+n);
          else return(""+n);	}

      correcoes_local2.query({map: map}, {reduce: false}, function(errx, response) {
        if (errx) console.log("Erro: "+errx);
        else {



          if(response.rows.length > 0){
            //criar um array para receber as correções
            var l=response.rows.length;
            //criar um array para receber as correções unicas por teste

            var resultados= new Array();
            resultados[0] =  response.rows[0].key;
            if(l>1){
              var j=0;
              var resAux= new Array();
              for (var i=1; i< l; i++){
                resAux[i] =  response.rows[i].key;
                if(resAux[i].id_Teste != resultados[0].id_Teste){
                  j++;
                  resultados[j]=resAux[i];
                }
              }
            }


            //preencher o cabeçalho
            $("#Cabecalho").text("Tem "+ resultados.length + " resultados.");




            var nome, foto;
            alunos_local2.get(resultados[0].id_Aluno, function(err, alunoDoc) {
              if (err)  console.log(err);
              nome = alunoDoc.nome;
              $("#alNome" ).text(nome);
              a++;
            });

            alunos_local2.getAttachment(resultados[0].id_Aluno, 'aluno.png', function(err2, DataImg) {
                if (err2)  console.log(err2);
                foto = URL.createObjectURL(DataImg);
                $('#alFoto').attr("src",foto);
                b++;
            });

            ///////////////////////////////////////////////////////////
            //
            //construir os botões,
            // Titulo do teste - Data/hora | Tipo de Teste| | Disciplina |
            //
            for(i=0; i<resultados.length; i++){
              //buscar a foto e nome do aluno
              var a=0, b=0, c=0 , titulo, disciplina, tipo, urlDiscp, urlTipo;



              //buscar o título, tipo e disciplina do teste
              testes_local2.get(resultados[i].id_Teste, function(err, testeDoc) {
                if (err)  console.log(err);
                titulo=testeDoc.titulo;
                disciplina=testeDoc.disciplina;
                tipo=testeDoc.tipoTeste;
                var data= new Date(resultados[c].dataSub);
                $('#pTitulo'+c).text(titulo+ " - Executado às "+
                                    convert_n2d(data.getHours())
                                    +":"+ convert_n2d(data.getMinutes())
                                    +":"+ convert_n2d(data.getSeconds())
                                    +" do dia "+ convert_n2d(data.getDate())
                                    +" do "+ (convert_n2d(data.getMonth()+1))
                                    +" de"+ data.getFullYear());

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
                var s = resultados[c]._id;
                if(tipo == "palavras"){
                  urlTipo="img/testLista.png";
                }
                else{
                  if(tipo == "texto"){
                    urlTipo= "img/testeTexto.png";
                  }
                }

                //Entregar a origem das fotos
                $('#bDiscip'+c).attr("src",urlDiscp);
                $('#bTipo'+c).attr("src",urlTipo);
                c++;
              });

              //construir o botão
              var $btn = $(
                '<div class="col-sm-20">'+
                  '<button id="'+ resultados[i]._id +'" value="'+resultados[i].tipoCorrecao+'" type="button"' +
                          'style="height:100px;  padding: 0px 10px 0px 10px;"'+
                          'class="btn btn-info btn-lg btn-block btn-Corr" >'+
                    '<img id="bTipo'+ i +'" val=0 src="" style=" float: right; height:60px; margin-left:5px"/>'+
                    '<img id="bDiscip'+ i +'" src="" style=" float: right; height:60px; margin-left:5px"/>'+
                    '<a style="color:#FFFFFF;" aria-hidden="true">'+
                      '<p id="pTitulo'+ i +'"></p>'+
                    '</a>'+
                  '</button>'+
                '</div>');
              var $container = $('#outputResultado');
              $btn.appendTo($container);
              }

              // Analisa todos os botoes do div
              $container.on('click', '.btn-Corr', function(ev) {
                ev.stopPropagation(); ev.preventDefault();

                var $btn = $(this); // O jQuery passa o btn clicado pelo this
                var self = this;
                window.localStorage.setItem("resultadoID", $btn[0].id + ''); //enviar variavel
                if($btn.val() == "Texto" ){
                  if (Backbone.history.fragment != 'mostraResultadoTexto') {
                    utils.loader(function() {
                      ev.preventDefault();
                      app.navigate('/mostraResultadoTexto', {trigger: true});
                    });
                  }
                }else{
                  if($btn.val() == "Lista" ){
                    if (Backbone.history.fragment != 'mostraResultadoLista') {
                      utils.loader(function() {
                        ev.preventDefault();
                        app.navigate('/mostraResultadoLista', {trigger: true});
                      });
                    }
                  }
                }
              });
          }
          else{
            $("#Cabecalho").text("Não existem resultados.");
          }
        }
      });
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
