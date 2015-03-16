


var auxID;
define(function(require) {

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/mostraResultadoTexto.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

    function writ(idCorr, inic)
    {

      correcoes_local2.get(idCorr, function(err, correcaoDoc) {
        if (err) console.log(err);
        var $containerCorr = $('#carroselT');
        var $div ="";
        if (inic == true)
        $div = $('<div id="'+idCorr+'" class="item active"></div>');
        else
        $div = $('<div id="'+idCorr+'" class="item"></div>');

        $div.appendTo($containerCorr); //Adiciona ao Div
        var $containerPrin = $('#'+idCorr);

        testes_local2.get(correcaoDoc.id_Teste, function(err, testeDoc) {
          if (err) console.log("errr"+err);

          var data= new Date(correcaoDoc.dataSub);

        var dataFinal = data.getDate()+"/"+data.getMonth()+"/"+data.getFullYear() + " - "+data.getHours() +":"+data.getMinutes();

          var $btn = $('<h3> '+testeDoc.titulo+' - ('+dataFinal+') </h3>' +
          '<div id="Div'+idCorr+'" class="relatorioDiv container">'+testeDoc.conteudo.texto+'</div>'
          );
          $btn.appendTo($containerPrin);//Adiciona ao Div
          var $container = $('#Div'+idCorr); //Adiciona ao Div
            var trigger = false;
          var words = $('#Div'+idCorr).text().split(' ');
          $('#Div'+idCorr).html("");
          $.each(words, function(i, val) {
            var $span;
            if (val == "\n")
              $span = $('</br>');
            else
            $span = $('<span  data-toggle="collapse" value=" " id="c'+i+'"  class="SpansTxt">' + val + ' </span>');
            $span.css("color", "#000000");



            $span.appendTo($container); //Adiciona ao Div
          });


          var sapns = $('#Div'+idCorr+' > span');
          var maxEle = $('#Div'+idCorr+' > span').length;
          var exatidao = 0;
          var fluidez = 0;
          for (var i = 0; i < correcaoDoc.conteudoResult.length; i++) {
            if (correcaoDoc.conteudoResult[i].categoria == "Exatidão")
            {
              sapns[correcaoDoc.conteudoResult[i].posicao].style.color = 'rgb(255, 0, 0)';
              $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-placement', "top");
              $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-toggle', "popover");
              $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-container', "body");
              $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-content', correcaoDoc.conteudoResult[i].erro);
              $(sapns[correcaoDoc.conteudoResult[i].posicao]).popover();
                exatidao++;
            }
            else{
              $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-placement', "top");
              $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-toggle', "popover");
              $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-container', "body");
              $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-content', correcaoDoc.conteudoResult[i].erro);
              $(sapns[correcaoDoc.conteudoResult[i].posicao]).popover();
              fluidez++;
              sapns[correcaoDoc.conteudoResult[i].posicao].style.color = 'rgb(51, 153, 255)';

            }

          }
          var exPer = Math.round((exatidao/maxEle)*100);
          var exFlu = Math.round((fluidez/maxEle)*100);
          var $btn = $('</br><div class="row centerEX">'+
          '  <div class="col-md-4">'+
          '      <div class="panel panel-success" style="height: 150px">'+
          '        <div class="panel-heading">'+
          '          Texto:'+
          '        </div>'+
          '          Titulo:'+testeDoc.titulo+"</br>"+
          '          Pergunta:'+testeDoc.conteudo.pergunta+"</br>"+
          '          Total Palavras:'+maxEle+"</br>"+
          '      </div>'+
          '    </div>'+
          '    <div class=" col-md-4">'+
          '      <div class="panel panel-danger" style="height: 150px">'+
          '        <div class="panel-heading">'+
          '          Correção:'+
          '        </div>'+
          '          Erros de Exatidão: '+exatidao+'  - acertou: '+(100-exPer)+'% </br>'+
          '          Erros de Fluidez: '+fluidez+'  - acertou: '+(100-exFlu)+'% </br>'+
          '          ---- Total:'+(100-(exPer+exFlu))+'% certo ----</br>'+
          '          Expressividade: </br>'+
          '          Sinais: '+correcaoDoc.expresSinais + ' || Entoação: '+correcaoDoc.expresEntoacao + ' ||Texto: '+correcaoDoc.expresTexto+
          '      </div>'+
          '    </div>'+
          '    <div class=" col-md-4">'+
          '      <div class="panel panel-info" style="height: 150px">'+
          '        <div class="panel-heading">'+
          '          Aluno'+
          '        </div>'+
          '      ffgfgfgfg'+
          '      </div>'+
          '    </div>'+
          '  </div>'

          );
          $btn.appendTo($containerPrin);//Adiciona ao Div
          });
        });
    }



  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {
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
      var resultadoID = window.localStorage.getItem("resultadoID");
      console.log(resultadoID);

      auxID ="";
      writ(resultadoID, true);
      correcoes_local2.get(resultadoID, function(err, CorrrecaoDoc) {
        if (err) console.log(err);
        auxID = CorrrecaoDoc.id_Teste;

        $('#carousel-example-generic').on('slide.bs.carousel', function () {
          console.log("oi");
          $('.SpansTxt').popover('hide');
        })

        function map(doc) {
          if (doc.estado == 1  && doc.id_Aluno == window.localStorage.getItem("AlunoSelecID") && doc.id_Teste == auxID) {
            emit(doc);
          }
        }

        correcoes_local2.query({map: map}, {reduce: false}, function(errx, response) {
          if (errx) console.log("Erro: "+errx);

            for (var i = 0; i < response.rows.length; i++) {
              if (response.rows[i].id != CorrrecaoDoc._id)
              writ(response.rows[i].id, false);
            }

        });

      });

    },

    //Eventos Click
    events: {
      "click #BackButton": "clickBackButton",
    },

    clickBackButton: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.back();
    },

    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});
