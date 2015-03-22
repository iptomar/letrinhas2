var auxID;

function getSrcAUDIO(obj){
  var aux = obj.id.substring(2);
console.log("cenas : "+ aux);
correcoes_local2.getAttachment(aux, 'gravacao.amr', function(err2, DataAudio) {
  if (err2) console.log(err2);
  GravarSOMfiD('gravacao.amr', DataAudio, function() {
    obj.src=""+cordova.file.dataDirectory + "/files/gravacao.amr";
    obj.trigger='load';
    console.log("player carregado com sucesso. id: ");
  }, function(err) {
    console.log("DEU ERRO" + err);
  });
});
}


//////////// GRAVAR SOM VINDO DA BD E PASSAR PARA O PLAYER DE AUDIO /////////////////
function GravarSOMfiD (name, data, success, fail) {
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

define(function(require) {

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/mostraResultadoTexto.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

    function onBKey() {
      $('.SpansTxt').popover('destroy');
      document.removeEventListener("backbutton", onBKey, false); ///RETIRAR EVENTO DO BOTAO
      window.history.back();
    }


  function writ(idCorr, inic) {
    correcoes_local2.get(idCorr, function(err, correcaoDoc) {
      if (err) console.log(err);
      var $containerCorr = $('#carroselT');
      var $div = "";
      if (inic == true)
        $div = $('<div id="' + idCorr + '" class="item active"></div>');
      else
        $div = $('<div id="' + idCorr + '" class="item"></div>');

      $div.appendTo($containerCorr); //Adiciona ao Div
      var $containerPrin = $('#' + idCorr);

      testes_local2.get(correcaoDoc.id_Teste, function(err, testeDoc) {
        if (err) console.log("errr" + err);

        $('#lbTituloTeste').text("Ver resultados: [ "+testeDoc.titulo+" ]");
        var data = new Date(correcaoDoc.dataSub);
        var day = data.getDate().toString();
        var month = data.getMonth().toString();
        var hours = data.getHours().toString();
        var minutes = data.getMinutes().toString();
        day = day.length === 2 ? day : '0' + day;
        month = month.length === 2 ? month : '0' + month;
        hours = hours.length === 2 ? hours : '0' + hours;
        minutes= minutes.length === 2 ? minutes : '0' + minutes;
        var dataFinal = day + "/" + month + "/" + data.getFullYear() + " - " + hours + ":" + minutes;

        var $btn = $('<h3> ' + testeDoc.titulo + ' - (' + dataFinal + ') </h3>' +
          '<div id="Div' + idCorr + '" class="relatorioDiv container">' + testeDoc.conteudo.texto + '</div>'
        );
        $btn.appendTo($containerPrin); //Adiciona ao Div


        var $container = $('#Div' + idCorr); //Adiciona ao Div
        var trigger = false;
        var words = $('#Div' + idCorr).text().split(' ');
        $('#Div' + idCorr).html("");
        $.each(words, function(i, val) {
          var $span;
          if (val == "\n")
            $span = $('</br>');
          else
            $span = $('<span  data-toggle="collapse" value=" " id="c' + i + '" >' + val + ' </span>');
          $span.css("color", "#000000");
          $span.appendTo($container); //Adiciona ao Div
        });

        var sapns = $('#Div' + idCorr + ' > span');
        var maxEle = $('#Div' + idCorr + ' > span').length;
        var exatidao = 0;
        var fluidez = 0;
        for (var i = 0; i < correcaoDoc.conteudoResult.length; i++) {
          if (correcaoDoc.conteudoResult[i].categoria == "Exatidão") {
            sapns[correcaoDoc.conteudoResult[i].posicao].style.color = 'rgb(255, 0, 0)';
            $(sapns[correcaoDoc.conteudoResult[i].posicao]).addClass('SpansTxt');
            $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-placement', "top");
            $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-toggle', "popover");
            $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-container', "body");
            $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-content', correcaoDoc.conteudoResult[i].erro);
            $(sapns[correcaoDoc.conteudoResult[i].posicao]).popover();
            exatidao++;
          } else {
            $(sapns[correcaoDoc.conteudoResult[i].posicao]).addClass('SpansTxt');
            $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-placement', "top");
            $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-toggle', "popover");
            $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-container', "body");
            $(sapns[correcaoDoc.conteudoResult[i].posicao]).attr('data-content', correcaoDoc.conteudoResult[i].erro);
            $(sapns[correcaoDoc.conteudoResult[i].posicao]).popover();
            fluidez++;
            sapns[correcaoDoc.conteudoResult[i].posicao].style.color = 'rgb(51, 153, 255)';
          }
        }

        $("#Div" + idCorr).scroll(function(){
          $('.SpansTxt').popover('hide');
        });

        var exPer = Math.round((exatidao / maxEle) * 100);
        var exFlu = Math.round((fluidez / maxEle) * 100);

        var $btn = $('</br><div class="row centerEX">' +
          '  <div class="col-md-4">' +
          '      <div class="panel panel-success" style="height: 150px">' +
          '        <div class="panel-heading">' +
          '          Texto:' +
          '        </div>' +
          '          Titulo:' + testeDoc.titulo + "</br>" +
          '          Pergunta:' + testeDoc.conteudo.pergunta + "</br>" +
          '          Total Palavras:' + maxEle + "</br>" +
          '      </div>' +
          '    </div>' +
          '    <div class=" col-md-4">' +
          '      <div class="panel panel-danger" style="height: 150px">' +
          '        <div class="panel-heading">' +
          '          Correção:' +
          '        </div>' +
          '          Erros de Exatidão: ' + exatidao + '  - acertou: ' + (100 - exPer) + '% </br>' +
          '          Erros de Fluidez: ' + fluidez + '  - acertou: ' + (100 - exFlu) + '% </br>' +
          '          ---- Total:' + (100 - (exPer + exFlu)) + '% certo ----</br>' +
          '          Expressividade: </br>' +
          '          Sinais: ' + correcaoDoc.expresSinais + ' || Entoação: ' + correcaoDoc.expresEntoacao + ' ||Texto: ' + correcaoDoc.expresTexto +
          '      </div>' +
          '    </div>' +
          '    <div class=" col-md-4">' +
          '      <div class="panel panel-info" style="height: 150px">' +
          '        <div class="panel-heading">' +
          '          Aluno' +
          '        </div>' +
          '        <label id="LB'+idCorr+'"></label>' +
          '        <img id="IMG'+idCorr+'" src="" style="height:44px;">' +
          '        <audio id="AU'+idCorr+'" val="'+idCorr+'" controls="controls"  style="width: 100%"  onclick="getSrcAUDIO(this)"></audio>' +
          '      </div>' +
          '    </div>' +
          '  </div>'

        );
        $btn.appendTo($containerPrin); //Adiciona ao Div

        alunos_local2.getAttachment(correcaoDoc.id_Aluno, 'aluno.png', function(err2, DataImg) {
          if (err2) console.log(err2);
          var url = URL.createObjectURL(DataImg);
          $('#IMG'+idCorr).attr("src", url);
        });

        alunos_local2.get(correcaoDoc.id_Aluno, function(err, alunoDoc) {
          if (err) console.log(err);
          $('#LB'+idCorr).text("Aluno: " + alunoDoc.nome);
        });

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
      document.addEventListener("backbutton", onBKey, false); //Adicionar o evento
      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src", url);
      });

      auxID = "";
      writ(resultadoID, true);






      correcoes_local2.get(resultadoID, function(err, CorrrecaoDoc) {
        if (err) console.log(err);
        auxID = CorrrecaoDoc.id_Teste;


        $('#carouselPrincipal').on('slide.bs.carousel', function() {
          $('.SpansTxt').popover('hide');
        });
/////////////////FUNCAO PARA O SWIPE SO ISTO xD ////////////////////////////////
        $("#carouselPrincipal").swipe( {
          //Generic swipe handler for all directions
          swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
            $('#carouselPrincipal').carousel('next');
          },
          swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
            $('#carouselPrincipal').carousel('prev');
          },
        });
        ////////////////fim ////////////////////////////////

      var $containerIND = $('#IndicatorsCorr');
       var $li = $('<li data-target="#carouselPrincipal" data-slide-to="0" class="active"></li>');
       $li.appendTo($containerIND);
       var count = 0;



        function map(doc) {
          if (doc.estado == 1 && doc.id_Aluno == window.localStorage.getItem("AlunoSelecID") && doc.id_Teste == auxID) {
            emit(doc);
          }
        }
        correcoes_local2.query({
          map: map
        }, {
          reduce: false
        }, function(errx, response) {
          if (errx) console.log("Erro: " + errx);
          for (var i = 0; i < response.rows.length; i++) {
            if (response.rows[i].id != CorrrecaoDoc._id)
            {
            count++;
            writ(response.rows[i].id, false);
            var $containerIND = $('#IndicatorsCorr');
            var $li = $('<li data-target="#carouselPrincipal" data-slide-to="'+count+'" ></li>');
            $li.appendTo($containerIND);

            }

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
      document.removeEventListener("backbutton", onBKey, false); ///RETIRAR EVENTO DO BOTAO
     $('.SpansTxt').popover('destroy');
      window.history.back();
    },

    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});
