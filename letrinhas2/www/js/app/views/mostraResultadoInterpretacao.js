define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/mostraResultadoInterpretacao.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    initialize: function() {

    },

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    desenhaEstatistica: function(idCorr, inic) {
      var self = this;
      resolucoes_local2.get(idCorr, function(err, correcaoDoc) {
        if (err) console.log(err);
        var $containerCorr = $('#carroselT');
        var $div = "";
        if (inic == true)
          $div = $('<div id="EstativDiv" class="item active"></div>');
        else
          $div = $('<div id="EstativDiv" class="item"></div>');

        $div.appendTo($containerCorr); //Adiciona ao Div
        var $containerPrin = $('#EstativDiv');
        var $btn = $('</br><canvas id="canvasGrafico" ></canvas><div id="legendDiv"></div>');
        $btn.appendTo($containerPrin); //Adiciona ao Div
      });
    },

    desenhaJanelas: function(idCorr, inic) {
      var self = this;
      resolucoes_local2.get(idCorr, function(err, correcaoDoc) {
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
          perguntas_local2.get(testeDoc.perguntas[0], function(err, perguntasDoc) {
            if (err) console.log(" ddds" + err);
              console.log(perguntasDoc);
            $('#lbTituloTeste').text("Ver resultados: [ " + perguntasDoc.titulo + " ]");
            var data = new Date(correcaoDoc.dataReso);
            var day = data.getDate().toString();
            var month = data.getMonth().toString();
            var hours = data.getHours().toString();
            var minutes = data.getMinutes().toString();
            day = day.length === 2 ? day : '0' + day;
            month = month.length === 2 ? month : '0' + month;
            hours = hours.length === 2 ? hours : '0' + hours;
            minutes = minutes.length === 2 ? minutes : '0' + minutes;
            var dataFinal = day + "/" + month + "/" + data.getFullYear() + " - " + hours + ":" + minutes;
            var $btn = $('<h3> ' + testeDoc.titulo + ' - (' + dataFinal + ') </h3>' +
              '<div id="Div' + idCorr + '" class="relatorioDiv container">' + perguntasDoc.conteudo.texto + '</div>'
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
                $span = $('<span  data-toggle="collapse" class="SpansTxt" value=" " id="c' + i + '" >' + val + '</span><span> </span>');
              $span.css("color", "#000000");
              $span.appendTo($container); //Adiciona ao Div
            });

            var sapns = $('#Div' + idCorr + ' > .SpansTxt');
            var maxEle = $('#Div' + idCorr + ' > .SpansTxt').length;
            var totalCertasSis = 0;
            var erradasAluno = 0;
            var certasAluno = 0;
            var errosList = correcaoDoc.respostas[0].correcao;
            var respostasAluno = correcaoDoc.respostas[0].conteudo;
            for (var i = 0; i < errosList.length; i++) {
              sapns[errosList[i].posicao].style.color = 'rgb(0, 0, 255)';
              sapns[errosList[i].posicao].style.fontWeight = '700';
              totalCertasSis++;
            }
            for (var i = 0; i < respostasAluno.length; i++) {
              if (sapns[respostasAluno[i].posicao].style.color == 'rgb(0, 0, 255)') {
                sapns[respostasAluno[i].posicao].style.backgroundColor = 'rgb(153, 255, 102)';
                certasAluno++;
              } else {
                sapns[respostasAluno[i].posicao].style.backgroundColor = 'rgb(240, 10, 10)';
                erradasAluno++;
              }
            }

            var nota = (certasAluno * 100) / totalCertasSis;
            var disciplina = perguntasDoc.disciplina;
            //imagem da disciplina e tipo de teste
            var urlDiscp;
            switch (disciplina) {
              case 1:
                urlDiscp = "img/portugues.png";
                break;
              case 2:
                urlDiscp = "img/mate.png";
                break;
              case 3:
                urlDiscp = "img/estudoMeio.png";
                break;
              case 4:
                urlDiscp = "img/ingles.png";
                break;
            }

            var $btn = $('</br>  <nav class="navbar  navbar-fixed-bottom "><div class="row centerEX">' +
              '  <div class="col-md-4">' +
              '      <div class="panel panel-success" style="height: 162px">' +
              '        <div class="panel-heading">' +
              '          Texto:' +
              '        </div>' +
              '          Titulo:' + perguntasDoc.titulo + "</br>" +
              '          Pergunta:' + perguntasDoc.pergunta + "</br>" +
              '          Total Palavras:' + maxEle + "</br>" +
              '          <img id="IMGDisc' + idCorr + '" src="' + urlDiscp + '" style="height:50px;">' +
              '      </div>' +
              '    </div>' +
              '    <div class=" col-md-4">' +
              '      <div class="panel panel-danger" style="height: 162px">' +
              '        <div class="panel-heading">' +
              '          Correção:' +
              '        </div>' +
              '          </br>Acertou: ' + certasAluno + ' palavra(s) de ' + totalCertasSis + ' palavra(s) </br>' +
              '          Errou: ' + erradasAluno + ' palavra(s) (vermelho)</br>' +
              '          Palavras corretas não selecionadas: ' + (totalCertasSis - certasAluno) + ' palavra(s)</br>' +
              '          ---- Nota: ' + nota.toFixed(2) + ' % ---- </br>' +
              '      </div>' +
              '    </div>' +
              '    <div class=" col-md-4">' +
              '      <div class="panel panel-info" style="height: 162px">' +
              '        <div class="panel-heading">' +
              '          Legenda' +
              '        </div></br>' +
              '          <span id="span1_' + idCorr + '">Palavras Fundo Vermelho:</span> Erradas escolhidas pelo aluno!</br>' +
              '          <span id="span2_' + idCorr + '">Palavras cor Azul:</span> Respostas corretas do sistema!</br>' +
              '          <span id="span3_' + idCorr + '">Palavras cor Azul + Fundo Verde:</span> Palavras certas pelo Aluno!</br>' +
              '      </div>' +
              '    </div>' +
              '  </div> </nav>'
            );
            $btn.appendTo($containerPrin); //Adiciona ao Div
            $('#span1_' + idCorr).css("background-color", "#F00A0A");
            $('#span2_' + idCorr).css("color", "#0000FF");
            $('#span3_' + idCorr).css("color", "#0000FF");
            $('#span3_' + idCorr).css("background-color", "#99FF66");
          });
        });
      });
    },

    events: {
      "click #BackButton": "clickBackButton",
      "click #btnNavDisci": "clickbtnNavDisci",
      "click #btnNavMenu": "clickbtnNavMenu",
    },

    render: function() {
      this.$el.html(template({}));

      var self = this;
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

      professores_local2.getAttachment(profId, 'prof.png', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome + " - [ " + escolaNome + " ]");
        $('#imgProf').attr("src", url);
      });

      alunos_local2.getAttachment(alunoId, 'aluno.png', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeAluno').text("[" + turmaNome + " ] -- " + alunoNome);
        $('#imgAluno').attr("src", url);
      });

       self.desenhaEstatistica(resultadoID, true);

      resolucoes_local2.get(resultadoID, function(err, CorrrecaoDoc) {
        if (err) console.log(err);

        window.localStorage.setItem("auxIDtext1", CorrrecaoDoc.id_Teste + ''); //enviar variavel

        // $('#carouselPrincipal').on('slide.bs.carousel', function() {
        //   $('.SpansTxt').popover('hide');
        // });
        /////////////////FUNCAO PARA O SWIPE SO ISTO xD ////////////////////////////////
        $("#carouselPrincipal").swipe({
          //Generic swipe handler for all directions
          swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
            $('#carouselPrincipal').carousel('next');
          },
          swipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
            $('#carouselPrincipal').carousel('prev');
          },
        });
        ////////////////fim ////////////////////////////////

        var $containerIND = $('#IndicatorsCorr');
        var $li = $('<li data-target="#carouselPrincipal" data-slide-to="0" class="active"></li>');
        $li.appendTo($containerIND);

        var count = 0;
        function map(doc) {

          if (doc.nota != -1 && doc.id_Aluno == window.localStorage.getItem("AlunoSelecID") && doc.id_Teste == window.localStorage.getItem("auxIDtext1")) {
            emit([doc.dataReso], doc);
          }
        }
        resolucoes_local2.query({
          map: map
        }, {
          reduce: false
        }, function(errx, response) {
          if (errx) console.log("Erro: " + errx);
          var certasAlunoArr = [];
          var erradasAlunoArr = [];
          var arr3 = [];


          for (var i = 0; i < response.rows.length; i++) {
            var TotalPalav = response.rows[i].value.respostas[0].TotalPalavras;
            var totalCertasSis = response.rows[i].value.respostas[0].correcao.length;
            var totalAlunoResp = response.rows[i].value.respostas[0].conteudo.length;
            var erradasAluno = 0;
            var certasAluno = 0;
            for (var y = 0; y < response.rows[i].value.respostas[0].conteudo.length; y++) {
              for (var w = 0; w < response.rows[i].value.respostas[0].correcao.length; w++) {
                  if(response.rows[i].value.respostas[0].correcao[w].posicao == response.rows[i].value.respostas[0].conteudo[y].posicao)
                  {
                    certasAluno++;
                  }
              }
            }
            erradasAluno =   (totalAlunoResp-certasAluno);

          console.log("totalCertasSis "+ totalCertasSis);

        console.log("certasAluno "+ certasAluno);

        console.log("erradasAluno "+ erradasAluno );

        certasAlunoArr.push(certasAluno);
        erradasAlunoArr.push(erradasAluno);

            var data = new Date(response.rows[i].value.dataReso);
            var day = data.getDate().toString();
            var month = data.getMonth().toString();
            var hours = data.getHours().toString();
            var minutes = data.getMinutes().toString();
            day = day.length === 2 ? day : '0' + day;
            month = month.length === 2 ? month : '0' + month;
            hours = hours.length === 2 ? hours : '0' + hours;
            minutes = minutes.length === 2 ? minutes : '0' + minutes;
            var dataFinal = day + "/" + month + "/" + data.getFullYear() + " - " + hours + ":" + minutes + "h";
            arr3.push(dataFinal);
          }

          for (var i = response.rows.length - 1; i >= 0; i--) {
            count++;
            self.desenhaJanelas(response.rows[i].id, false);
            var $containerIND = $('#IndicatorsCorr');
            var $li = $('<li data-target="#carouselPrincipal" data-slide-to="' + count + '" ></li>');
            $li.appendTo($containerIND);
          }

          var lineChartData = {
            labels: arr3,

            datasets: [{
              label: "Certas do Aluno",
              fillColor: "rgba(255,100,100,0.2)",
              strokeColor: "rgba(255,170,170,1)",
              pointColor: "rgba(255,170,170,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(255,170,170,1)",
              data: certasAlunoArr
            }, {
              label: "Errado pelo Aluno",
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data: erradasAlunoArr
            }]
          }
          var ctx = document.getElementById("canvasGrafico").getContext("2d");
          var myLineChart = new Chart(ctx).Line(lineChartData, {
            responsive: true,
            showScale: true,
            scaleOverride: false,
            // Number - The number of steps in a hard coded scale
              scaleSteps: 5,
            // Number - The value jump in the hard coded scale
           scaleStepWidth: 20,
           // Number - The scale starting value
           scaleStartValue: 0,
           animationEasing: "easeOutBounce",
           multiTooltipTemplate: "<%= datasetLabel %> - <%= value %> Palavra(s)",

            legendTemplate: '<% for (var i=0; i<datasets.length; i++){%>' +
              '<span class="glyphicon glyphicon-stop" style=" color: <%=datasets[i].strokeColor%>; font-size: 24pt">' +
              '</span><span style="font-size: 20pt"> <%if(datasets[i].label){%><%=datasets[i].label%><%}%></span>&nbsp&nbsp&nbsp' +
              '&nbsp&nbsp<%}%>'

          });
          var $containerPrin = $('#legendDiv');
          var $btn = $(myLineChart.generateLegend());
          $btn.appendTo($containerPrin); //Adiciona ao Div
        });
      });


      return this;
    }
  });
});
