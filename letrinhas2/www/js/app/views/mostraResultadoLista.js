var testeID, alunoId, contaPosicao=0;

function convert_n2d(n){
    if(n<10) return("0"+n);
    else return(""+n);
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

function preencheColuna(colunaIn, resultado,posicoes){
  var colunaOut ='',errE=0, errF=0;
  for (var j = 0; j < colunaIn.length; j++) {
    var isErro=false, erro, categ;
    for(var k=0; k<posicoes.length; k++){
      if(contaPosicao == posicoes[k]){
        isErro=true;
        erro=resultado.conteudoResult[k].erro;
        categ=resultado.conteudoResult[k].categoria;
        break;
      }
    }
    if(isErro){
      var cor;
      if(categ == 'Exatidão'){
        cor='#ee2020';
        errE++;
      }
      else{
        cor='#3399ff';
        errF++;
      }
      colunaOut += '<p class="picavel" style="color:'+cor+'"'
             +'data-placement="top"'
             +'data-toggle="popover"'
             +'data-container="body"'
             +'data-content="'+erro+'"'
             +'onclick="$(this).popover()">'
             + colunaIn[j] + '</p>';
    }
    else{
      colunaOut += '<p>'+ colunaIn[j] + '</p>';
    }
    contaPosicao++;
  }
  return {
    coluna:colunaOut,
    exatidao:errE,
    fluidez:errF};
}


function getSrc(obj){
    if($(obj).val()==0){
    correcoes_local2.getAttachment(obj.id, 'gravacao.amr', function(err2, DataAudio) {
      if (err2) console.log(err2);
      GravarSOMfile(obj.id+'.amr', DataAudio, function() {
        obj.src=""+cordova.file.dataDirectory + "/files/"+obj.id+".amr";
        obj.trigger='load';
        console.log("\nplayer carregado com sucesso. \nid: "+ obj.id);
        $(obj).val(1);
      }, function(err) {
        console.log("DEU ERRO" + err);
      });
    });
  }
}

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
      var self=this;
      ////Carrega os dados mais uteis da janela anterior////
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      alunoId = window.localStorage.getItem("AlunoSelecID");
      var alunoNome = window.localStorage.getItem("AlunoSelecNome");
      var resultadoID =  window.localStorage.getItem("resultadoID");
      //escuta evento, para eliminar os "balões", caso estes esteja ativos
      document.addEventListener("backbutton", self.onBKey, false); //Adicionar o evento

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
                  indicadores += '<li data-target="#carouselLista" data-slide-to="'+i+'" class="active"></li>';
                }
                else{
                  indicadores += '<li data-target="#carouselLista" data-slide-to="'+i+'"></li>';
                }
              }
              $("#indicadores").html(indicadores);

              //uma string com o html do conteúdo de cada página
              var mes = new Array("Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro");
              //Constroi a pagina com os dados
              var colum1;
              var colum2;
              var colum3;
              var paginas;
              //construir todas as páginas e respetivos dados
              for (var i=0;i<nPaginas; i++){
                var data= new Date(resultados[i].dataSub);
                paginas='';
                colum1 = null;
                colum2 = null;
                colum3 = null;

                if(i==0){
                  paginas+='<div class="item active">';

                }
                else{
                  paginas+='<div class="item">';
                }
                //colocar o popover por aqui
                var posicoes = new Array();
                for (var j=0; j<resultados[i].conteudoResult.length; j++){
                  posicoes[j]=parseInt(resultados[i].conteudoResult[j].posicao);
                }
                contaPosicao=0;

                colum1 = preencheColuna(testeLista.conteudo.palavrasCl1,resultados[i],posicoes);
                colum2 = preencheColuna(testeLista.conteudo.palavrasCl2,resultados[i],posicoes);
                colum3 = preencheColuna(testeLista.conteudo.palavrasCl3,resultados[i],posicoes);
                var errExatidao = colum1.exatidao + colum2.exatidao + colum3.exatidao;
                var errFluidez = colum1.fluidez + colum2.fluidez + colum3.fluidez;

                var $btn2 = $(''+paginas
                        +'<div class="panel-primary">'
                          +'<div class="panel-body">'
                            +'<table style="width:100%  "><tr><td><div class="relatorioDiv2 col-xs-7">'
                              +'<div class="col-xs-4">' + colum1.coluna + '</div>'
                              +'<div class="col-xs-4">' + colum2.coluna + '</div>'
                              +'<div class="col-xs-4">' + colum3.coluna + '</div>'
                            +'</div>'
                            //*/relatorio lateral aqui
                            +'<div class="col-xs-4"  style="font-size:18px;">'
                              +'<div class="panel panel-danger">'
                                +'<div class="panel-heading">Correção:</div>'
                                +'<div style="padding:15px;">'
                                  +'  Erros de Exatidão: '+errExatidao+'  - acertou: '
                                  +Math.round(100 - errExatidao*100/resultados[i].TotalPalavras)+'% </br>'
                                  +'  Erros de Fluidez: '+errFluidez+'  - acertou: '
                                  +Math.round(100 - errFluidez*100/resultados[i].TotalPalavras)+'% </br>'
                                +'</div>'
                              +'</div>'
                              +'<div class="panel panel-success" style="margin-top:-22px;">'
                                +'<div id="total"class="panel-heading">Precisão: '
                                  +Math.round(100 - (errExatidao + errFluidez)*100/resultados[i].TotalPalavras)+'% certo</div>'
                              +'</div>'
                              +'<div class="panel panel-info" style="margin-top:-10px;">'
                                +'<div class="panel-heading">Detalhes:</div>'
                                +'<div id="detalhes"style="padding:15px;height:258px; overflow:auto">'
                                  +'Total de Palavras: '+resultados[i].TotalPalavras+' </br>'
                                  +'Palavras corretamente lidas: '+(resultados[i].TotalPalavras - errExatidao - errFluidez)+' </br>'
                                  +'Velocidade da leitura: '+resultados[i].velocidade+' plv/min</br>'

                                  //////////Futuro///////////////
                                  +'</br>Outros detalhes: ...'
                                +'</div>'
                              +'</div>'
                            +'</div></td></tr>'
                            //player aqui
                            +'<tr><td>'
                              +'<div class="row" style="margin-left:45px;">'
                                +'<div class="col-xs-2">'
                                  +'<div class="panel panel-warning">'
                                    +'<div class="panel-heading">Leitura do aluno:</div>'
                                  +'</div>'
                                +'</div>'
                                +'<div class="col-xs-9" onclick>'
                                  +'<audio id="'+resultados[i]._id+'" val=0 controls="controls"  style="width:100%" onclick="getSrc(this)"></audio>'
                                +'</div>'
                              +'</div>'
                            +'</td></tr></table>'
                          +'</div>'
                        +'</div>'
                      +'</br></br></br></br></br></br>'
                      +'<div class="carousel-caption">'
                        +'<div class="row" style="width:100%">'
                          +'<h4 style="font-size:20px">Executado às '+ convert_n2d(data.getHours())
                                              +':'+ convert_n2d(data.getMinutes())
                                              +':'+ convert_n2d(data.getSeconds())
                                              +' do dia '+ convert_n2d(data.getDate())
                                              +' do '+ (mes[data.getMonth()])
                                              +' de'+ data.getFullYear()
                          +'</h4>'
                          +'<hr stle="width:100%"></hr> '
                          +'<h4>Página '+ (i+1) +' de '+nPaginas+'</h4>'
                        +'</div>'
                      +'</div>'
                    +'</div></div>');
                var $container = $('#innerPages');
                $btn2.appendTo($container);

                $(".picavel").popover('hide');
              }

              if(nPaginas>1){
                //colocar controlos de navegação caso exista mais que um resultado, para poder comparar
                var controlo = '<a class="left carousel-control2" href="#carouselLista" role="button" data-slide="prev">'
                              +'<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>'
                              +'<span class="sr-only">Previous</span></a>'
                              +'<a class="right carousel-control2" href="#carouselLista" role="button" data-slide="next">'
                              +'<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>'
                              +'<span class="sr-only">Next</span></a>';
                $("#controlos").html(controlo);

                $('#carouselLista').on('slide.bs.carousel', function() {
                  $('.picavel').popover('hide');
                });

                /////////////////Função para ativar o swipe //////////////////////////////
                $("#carouselLista").swipe( {
                  //Generic swipe handler for all directions
                  swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
                    $('#carouselLista').carousel('next');
                  },
                  swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
                    $('#carouselLista').carousel('prev');
                  },
                });
              }
            }
          }
        });
      });

    },

    //Eventos Click
    events: {
      "click #BtnVoltar": "clickBtnCancelar",
    //  "click #controlos": "clickControlos",
    },

  /*  clickControlos: function(e) {
     $(".picavel").popover('hide');
    },
*/

    onBKey: function() {
      var self=this;
      $('.picavel').popover('destroy');
      document.removeEventListener("backbutton", self.onBKey, false); ///RETIRAR EVENTO DO BOTAO
      window.history.back();
    },


    clickBtnCancelar: function(e) {
      var self=this;
      e.stopPropagation(); e.preventDefault();
      document.removeEventListener("backbutton", self.onBKey, false); ///RETIRAR EVENTO DO BOTAO
      $('.picavel').popover('destroy');
      window.history.back();
    },

    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});
