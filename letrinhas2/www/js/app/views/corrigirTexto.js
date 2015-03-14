var triggerSelec = false;

function TocarDepoisDeSelec()
{
  triggerSelec = false;
  $("#AudioPlayerAluno").prop("currentTime",$("#AudioPlayerAluno").prop("currentTime")-1);
  $("#AudioPlayerAluno").trigger('play');
}

function AnalisarTexto()
{
  var $container = $('#DivContentorArea'); //Adiciona ao Div
  var sapns = $("#DivContentorArea > span");
  var maxEle = $("#DivContentorArea > span").length;

  var exatidao = 0;
  var fluidez = 0;
  var totalPalavas = 0;
  for (var i = 0; i < maxEle; i++) {
    totalPalavas++;
    var color = sapns[i].style.color
    if (color == 'rgb(255, 0, 0)')
    {
      exatidao++;
    }
    if (color == 'rgb(51, 153, 255)')
    {
      fluidez++;
    }
  }

  return {
    "exatidao": exatidao,
    "fluidez": fluidez,
    "totalPalavas": totalPalavas
    };

}


//////////// GRAVAR SOM VINDO DA BD E PASSAR PARA O PLAYER DE AUDIO /////////////////
function GravarSOMfile(name, data, success, fail) {
  console.log(cordova.file.dataDirectory);
  var gotFileSystem = function(fileSystem) {
    fileSystem.root.getFile(name, {
      create: true,
      exclusive: false
    }, gotFileEntry, fail);
  };

  var gotFileEntry = function(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
  };

  var gotFileWriter = function(writer) {
    writer.onwrite = success;
    writer.onerror = fail;
    writer.write(data);
  };
  window.requestFileSystem(window.LocalFileSystem.PERSISTENT, data.length || 0, gotFileSystem, fail);
}


function converterStingEmTexto(stringx) {
  if (stringx == "op1_1")
    return {
      "categoria": "Exatidão",
      "erro": "Substituição de letras"
    };
  if (stringx == "op1_2")
    return {
      "categoria": "Exatidão",
      "erro": "Substituição de palavras"
    };
  if (stringx == "op1_3")
    return {
      "categoria": "Exatidão",
      "erro": "Adições"
    };
  if (stringx == "op1_4")
    return {
      "categoria": "Exatidão",
      "erro": "Omissões de letras"
    };
  if (stringx == "op1_5")
    return {
      "categoria": "Exatidão",
      "erro": "Omissões de sílabas"
    };
  if (stringx == "op1_6")
    return {
      "categoria": "Exatidão",
      "erro": "Omissões de palavras"
    };
  if (stringx == "op1_7")
    return {
      "categoria": "Exatidão",
      "erro": "Inversões"
    };

  if (stringx == "op2_1")
    return {
      "categoria": "Fluidez",
      "erro": "Vacilação"
    };
  if (stringx == "op2_2")
    return {
      "categoria": "Fluidez",
      "erro": "Repetições"
    };
  if (stringx == "op2_3")
    return {
      "categoria": "Fluidez",
      "erro": "Soletração"
    };
  if (stringx == "op2_4")
    return {
      "categoria": "Fluidez",
      "erro": "Fragmentação de palavras"
    };
  if (stringx == "op2_5")
    return {
      "categoria": "Fluidez",
      "erro": "Retificação espontânea"
    };
}

function readableDuration(seconds) {
    sec = Math.floor( seconds );
    min = Math.floor( sec / 60 );
    min = min >= 10 ? min : '0' + min;
    sec = Math.floor( sec % 60 );
    sec = sec >= 10 ? sec : '0' + sec;
    return min + ':' + sec;
}

function InsertCorrecao(IdCorr) {
  var $container = $('#DivContentorArea'); //Adiciona ao Div
  var sapns = $("#DivContentorArea > span");
  var maxEle = $("#DivContentorArea > span").length;
  var agora = new Date();
  var tempoSeg = $('#AudioPlayerAluno').prop("duration");
  var palavrasErr = 0;

  correcoes_local2.get(IdCorr, function(err, otherDoc) {
    otherDoc.estado = 1;
    otherDoc.TotalPalavras = maxEle;
    otherDoc.dataCorr = agora;
    otherDoc.expresSinais = $('#DropExprSinais').val();
    otherDoc.expresEntoacao = $('#DropExprEntoacao').val();
    otherDoc.expresTexto = $('#DropExprTexto').val();

    for (var i = 0; i < maxEle; i++) {
      var color = sapns[i].style.color
      if (color == 'rgb(255, 0, 0)' || color == 'rgb(51, 153, 255)') // =='blue' <- IE hack
      {
        var cenas = sapns[i].getAttribute("value");
        palavrasErr++;
        otherDoc.conteudoResult.push({
          'palavra': sapns[i].innerText,
          'categoria': converterStingEmTexto(cenas).categoria,
          'erro': converterStingEmTexto(cenas).erro,
        });
      }
    }
    var pcl = maxEle - palavrasErr;
    otherDoc.velocidade = Math.round((pcl * 60 / tempoSeg));

    correcoes_local2.put(otherDoc, IdCorr, otherDoc._rev, function(err, response) {
      if (err) {
        console.log('Correcao ' + err + ' erro');
      } else {
        console.log('Parabens InseridoCorrecao');
      }
    });
  });
}

define(function(require) {

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/corrigirTexto.html'),
    template = _.template(janelas);

  var errosTTexto = 0;
  return Backbone.View.extend({



    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {
      errosTTexto = 0;
      triggerSelec = false;
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
      var TesteArealizarID = window.localStorage.getItem("TesteArealizarID");
      var correcaoID = window.localStorage.getItem("CorrecaoID"); //enviar variavel

      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome);
        $('#imgProf').attr("src", url);
        //    document.addEventListener("backbutton", onBackKeyDown, false); //Adicionar o evento
      });

      correcoes_local2.get(correcaoID, function(err, correcaoDoc) {
        if (err) console.log(err);


        alunos_local2.getAttachment(correcaoDoc.id_Aluno, 'aluno.png', function(err2, DataImg) {
            if (err2)  console.log(err2);
            var foto = URL.createObjectURL(DataImg);
            $('#imgAlunoTitle').attr("src",foto);
            $('#imgAlunoTitleRela').attr("src",foto);


        });
        alunos_local2.get(correcaoDoc.id_Aluno, function(err, alunoDoc){
          if(err) console.log(err);
          $('#titleTestePagina').text("("+alunoDoc.nome+")");
          $('#LBrelaAluno').text("Aluno: "+alunoDoc.nome);

        });

        correcoes_local2.getAttachment(correcaoID, 'gravacao.amr', function(err2, DataAudio) {
          if (err2) console.log(err2);
          console.log(DataAudio);
          GravarSOMfile('gravacao.amr', DataAudio, function() {
            console.log('FUNCIONA');
            $("#AudioPlayerAluno").attr("src", cordova.file.dataDirectory + "/files/gravacao.amr");
            $("#AudioPlayerAluno").trigger('load');
          }, function(err) {
            console.log("DEU ERRO" + err);
          });
        });


        testes_local2.get(correcaoDoc.id_Teste, function(err, testeDoc) {
          if (err) console.log(err);

          testes_local2.getAttachment(testeDoc._id, 'voz.mp3', function(err2, DataImg) {
            if (err2) console.log(err2);
            GravarSOMfile('voz.mp3', DataImg, function() {
              console.log('FUNCIONA VOZ PROF');
              $("#AudioPlayerProf").attr("src", cordova.file.dataDirectory + "/files/voz.mp3");
              $("#AudioPlayerProf").trigger('play');

            }, function(err) {
              console.log("DEU ERRO VOZ PROF" + err);
            });
          });

          $('#LBrelaTitulo').text("Titulo: " +testeDoc.titulo+" - \""+testeDoc.conteudo.pergunta+"\"");
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


          $('#DivContentorArea').append(testeDoc.conteudo.texto);
          var $container = $('#DivContentorArea'); //Adiciona ao Div

          var words = $("#DivContentorArea").text().split(' ');
          $("#DivContentorArea").html("");
          $.each(words, function(i, val) {
            var $span;
            if (val == "\n")
              $span = $('</br>');
            else
              $span = $('<span data-toggle="collapse" value=" " class="SpansTxt">' + val + ' </span>');
            $span.css("color", "#000000");
            $span.appendTo($container); //Adiciona ao Div
          });
          $("#AudioPlayerProf").trigger('pause');
          $container.on('click', '.SpansTxt', function(ev) {
            var text = $(this).text();
            var $meuSpan = $(this);
            var elem = '<div class="dropdown" > ' +
              '<button class="btn btn-info testMedioDrops" type="button" id="menu1" data-toggle="dropdown" style="width:115px; "> Exatidão ' +
              '<span class="caret"></span></button>' +
              '<ul class="dropdown-menu testMedioDrops" role="menu" aria-labelledby="menu1">' +
              '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').attr(\'value\', \'op1_1\').css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Substituição de letras</a></li>' +
              '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').attr(\'value\', \'op1_2\').css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Substituição de palavras</a></li>' +
              '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').attr(\'value\', \'op1_3\').css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Adições</a></li>' +
              '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').attr(\'value\', \'op1_4\').css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Omissões de letras</a></li>' +
              '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').attr(\'value\', \'op1_5\').css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Omissões de sílabas</a></li>' +
              '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').attr(\'value\', \'op1_6\').css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Omissões de palavras</a></li>' +
              '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').attr(\'value\', \'op1_7\').css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Inversões</a></li>' +
              '</ul>' +
              '</div>' +
              '<div class="dropdown"> ' +
              '<button class="btn btn-info testMedioDrops" type="button" id="menu1" data-toggle="dropdown" style="width:	115px;"> Fluidez ' +
              '<span class="caret"></span></button>' +
              '<ul class="dropdown-menu testMedioDrops" role="menu" aria-labelledby="menu1">' +
              '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').attr(\'value\', \'op2_1\').css(\'color\', \'#3399FF\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Vacilação</a></li>' +
              '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').attr(\'value\', \'op2_2\').css(\'color\', \'#3399FF\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Repetições</a></li>' +
              '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').attr(\'value\', \'op2_3\').css(\'color\', \'#3399FF\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Soletração</a></li>' +
              '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').attr(\'value\', \'op2_4\').css(\'color\', \'#3399FF\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Fragmentação de palavras</a></li>' +
              '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').attr(\'value\', \'op2_5\').css(\'color\', \'#3399FF\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Retificação espontânea</a></li>' +
              '</ul>' +
              '</div> ';
            $meuSpan.popover({
              toggle: "popover",
              content: elem,
              placement: 'top',
              html: true,
              trigger: 'focus'
            });

            var color = $(this).css('color');

            if (color == 'rgb(255, 153, 0)' || color == 'rgb(255, 0, 0)' || color == 'rgb(51, 153, 255)') // =='blue' <- IE hack
            {
              $(this).css("color", "#000000");
              $meuSpan.popover('destroy');
              $meuSpan.attr("value", " ");
              errosTTexto--;
              $('#ContadorDeErros').text("Erros: " + errosTTexto);
              triggerSelec = false;
            } else   if(triggerSelec == false){
              $("#AudioPlayerAluno").trigger('pause');
              $(this).css("color", "#FF9900");
              $meuSpan.popover('show');
              errosTTexto++;
              $('#ContadorDeErros').text("Erros: " + errosTTexto);
              triggerSelec = true;

            }
          });

        });
      });


    },

    events: {
      "click #BackButton": "clickBackButton",
      "click #btnFinalizar": "clickbtnFinalizar",
      "click #btnConfirmarSUB": "clickbtnConfirmarSUB",

    },


    clickbtnConfirmarSUB: function(e) {

      //    document.removeEventListener("backbutton", onBackKeyDown, false); ///RETIRAR EVENTO DO BOTAO
      $('#myModalSUB').modal("hide");
      $('#myModalSUB').on('hidden.bs.modal', function(e) {
        InsertCorrecao(window.localStorage.getItem("CorrecaoID"));
        window.history.back();
      });
    },


    clickbtnFinalizar: function(e) {
      e.stopPropagation();
      e.preventDefault();

      var timex = $('#AudioPlayerAluno').prop("duration");

      if (timex == 0) {
        $("#popUpAviso").empty();
        $("#popUpAviso").append(
          '<div id="qwert" class="alert alert-danger alert-dismissable">' +
          '<button type="button" class="close" data-dismiss="alert"> <span aria-hidden="true">&times;</span></button>' +
          '<strong>Aviso!</strong> Têm que ouvir pelo menos uma vez a leitura do Aluno.' +
          '</div>');
      } else {
        $("#popUpAviso").empty();
        $('#myModalSUB').modal("show");
        var exatidaoTotal= AnalisarTexto().exatidao;
        var fluidezTotal = AnalisarTexto().fluidez;
        var palavrasTotal = AnalisarTexto().totalPalavas;


        $('#LBtotalPalavras').text("Total de Palavras: "+AnalisarTexto().totalPalavas);
        var exPer = Math.round((exatidaoTotal/palavrasTotal)*100);
        var exFlu = Math.round((fluidezTotal/palavrasTotal)*100);
        $('#LBCorrecao').html("Correção: </br>"+
        "&nbsp;&nbsp;&nbsp;&nbsp-Exatidão: "+AnalisarTexto().exatidao+" palavras erradas, acertou: "+(100-exPer)+"% </br>"+
        "&nbsp;&nbsp;&nbsp;&nbsp-Fluidez: "+AnalisarTexto().fluidez+" palavras, acertou: "+(100-exFlu)+"% </br>"+
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp>>> Total:"+(100-(exPer+exFlu))+"% certo <<<\n\n"
      );
      var tempoSeg = $('#AudioPlayerAluno').prop("duration");

      var tempoSegProf = $('#AudioPlayerProf').prop("duration");





       $('#LBCtempoAluno').html("Tempo do Aluno: </br>"+
            "&nbsp;&nbsp;&nbsp;&nbsp-Duração: "+readableDuration(tempoSeg)+" </br>"+
            "&nbsp;&nbsp;&nbsp;&nbsp-Velocidade: "+(Math.round(60*palavrasTotal/tempoSeg))+" ");

      $('#LBCtempoProf').html("Tempo do Professor: </br>"+
      "&nbsp;&nbsp;&nbsp;&nbsp-Duração: "+readableDuration(tempoSegProf)+" </br>"+
      "&nbsp;&nbsp;&nbsp;&nbsp-Velocidade: "+(Math.round(60*palavrasTotal/tempoSegProf))+" ");

      }
    },

    clickBackButton: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.back();

    },


    render: function() {
      this.$el.html(template({}));
      return this;
    }

  });

});
