var testeID, alunoId;

function convert_n2d(n){
    if(n<10) return("0"+n);
    else return(""+n);	}

define(function(require) {

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/mostraResultadoLista.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {
      ////Carrega os dados mais uteis da janela anterior////
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      alunoId = window.localStorage.getItem("AlunoSelecID");
      var alunoNome = window.localStorage.getItem("AlunoSelecNome");
      var resultadoID =  window.localStorage.getItem("resultadoID");

      var nome, foto;
      alunos_local2.get(alunoId, function(err, alunoDoc) {
        if (err)  console.log(err);
        nome = alunoDoc.nome;
        $("#lbNomeAluno" ).text(nome);
      });

      alunos_local2.getAttachment(alunoId, 'aluno.png', function(err2, DataImg) {
          if (err2)  console.log(err2);
          foto = URL.createObjectURL(DataImg);
          $('#alunoFoto').attr("src",foto);
      });



      var resultados = new Array();
      correcoes_local2.get(resultadoID, function(err, correcaoDoc){
        if(err) console.log(err);

        testeID = correcaoDoc.id_Teste;

        //receber o conteúdo do teste;
        var testeLista;
        testes_local2.get(testeID, function(err, testeDoc) {
          if (err)  console.log(err);
          testeLista = testeDoc;
          //construi o titulo da pagina
          $("#lbTituloTeste").text(testeDoc.titulo +" - "+
          testeDoc.conteudo.pergunta);
          var disciplina = testeDoc.disciplina;

          $('#bTipo').attr("src","img/testLista.png");
          //imagem da disciplina e tipo de teste
          var urlDiscp;
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
          $('#imgDisciplina').attr("src",urlDiscp);
        });

        //ir buscar outros resultados do mesmo teste feitos pelo mesmo aluno
        function map(doc) {
          if (doc.id_Teste == testeID  && doc.id_Aluno == alunoId) {
            emit(doc);
          }
        }

        correcoes_local2.query({map: map}, {reduce: false}, function(errx, response) {
          if (errx) console.log("Erro: "+errx);
          else {
            if(response.rows.length > 0){

              //criar um array para receber os resultados
              var nPaginas=response.rows.length;

              for (var i=0; i< nPaginas; i++){
                resultados[i] =  response.rows[i].key;
              }

              //uma string com o html dos indicadores de cada página
              var indicadores='';
              for (var i=0; i<nPaginas; i++){
                if(i==0){
                  indicadores += '<li data-target="#carousel-example-generic" data-slide-to="'+i+'" class="active"></li>';
                }
                else{
                  indicadores += '<li data-target="#carousel-example-generic" data-slide-to="'+i+'"></li>';
                }
              }
              $("#indicadores").html(indicadores);

              //uma string com o html do conteúdo de cada página
              var mes = new Array("Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro");
              //Constroi a pagina com os dados
              var colum1 = "";
              var colum2 = "";
              var colum3 = "";
              var paginas='';
              //construir todas as páginas!
              for (var i=0;i<nPaginas; i++){
                var data= new Date(resultados[i].dataSub);
                if(i==0){
                  paginas+='<div class="item active">';

                }
                else{
                  paginas+='<div class="item">';
                }
                for (var j = 0; j < testeLista.conteudo.palavrasCl1.length; j++) {
                  colum1 += '<p>'+ testeLista.conteudo.palavrasCl1[j] + '</p>';
                }

                for (var j = 0; j < testeLista.conteudo.palavrasCl2.length; j++) {
                  colum2 += '<p>'+ testeLista.conteudo.palavrasCl2[j] + '</p>';
                }

                for (var j = 0; j < testeLista.conteudo.palavrasCl2.length; j++) {
                  colum3 += '<p>'+ testeLista.conteudo.palavrasCl3[j] + '</p>';
                }
                var $btn2 = $(''+paginas+'<div class="panel-body croool2" class="row">'
                      +'<div class="panel-body fontEX2">' +
                      '<div class="row">' +
                      '<div class="col-xs-4">' + colum1 + '</div>' +
                      '<div class="col-xs-4">' + colum2 + '</div>' +
                      '<div class="col-xs-4">' + colum3 + '</div>' +
                      '</div>'
                      +'</div></div>'
                      +'<div class="carousel-caption">'
                      +'<h4>Executado às '+ convert_n2d(data.getHours())
                                          +':'+ convert_n2d(data.getMinutes())
                                          +':'+ convert_n2d(data.getSeconds())
                                          +' do dia '+ convert_n2d(data.getDate())
                                          +' do '+ (mes[data.getMonth()])
                                          +' de'+ data.getFullYear()
                      +'</h4><hr stle="width:100%"></hr> Página '+ (i+1) +' de '+nPaginas
                      +'</div></div>');
                var $container = $('#innerPages');
                $btn2.appendTo($container);

              }


              if(nPaginas>1){
                //colocar controlos de navegação caso existam mais que um resultado, para poder comparar
                var controlo = '<a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">'
                              +'<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>'
                              +'<span class="sr-only">Previous</span></a>'
                              +'<a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">'
                              +'<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>'
                              +'<span class="sr-only">Next</span></a>';
                $("#controlos").html(controlo);
              }


/*+++++++++ modelo de construção no carrosel!
                            //for(var i=0; i< pages; i++;){
                              /*<div class="item active">
                                    <div  id="outputResultado" class="row" style="height:610px; width:1030px; overflow:auto;">
                                      <table style=" height:100%; width:100%; margin-left:200px; background-color:#ff0000">
                                        <tr>
                                          <td>
                                            <a class="well"> Leia as palavras na horizontal</a>
                                            <img src="img/inConstruction.jpg" alt="...">
                                          </td>
                                          <td>
                                            <img src="img/inConstruction.jpg" alt="...">
                                            <a>... </a>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                <div id="resDatePage"class="carousel-caption">
                                 pg1/2
                                </div>
                              </div>
                              <!--<div class="item">
                                <img src="img/RealizarTestes.png" alt="...">
                                <div class="carousel-caption">
                                  Página 2
                                </div>
                              </div>
                              <div class="item">
                                <img src="img/letrinhas2.png" alt="...">
                                <div class="carousel-caption">
                                  Página 3
                                </div>
                              </div>-->/*

                            }




                            /*console.log((pages) +" páginas");
                            console.log("principal "+ resultados[0].dataSub);
                            console.log(new Date(resultadox[0].dataSub));
              */


                }



          }
        });
      });















    },

    //Eventos Click
    events: {
      "click #BtnVoltar": "clickBtnCancelar",

    },

    clickBtnCancelar: function(e) {
     e.stopPropagation(); e.preventDefault();
     window.history.back();
    },

    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});
