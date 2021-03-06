define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/mostraResultadoInterpretacao.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({
    myLineGra: null,
    myLineGraData: null,

    initialize: function() {

    },

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

      /////Prepara o ambiente oara receber as estatisitcas
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

      /////Desenhas as diferentes janelas com as resoluçoes dos testes
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
              var $spanVazio;

              if (val.indexOf("\n") != -1) {
                $span = $('<span data-toggle="collapse" value=" " id="c' + i + '" class="SpansTxt">' + val.substring(0, val.indexOf("\n") - 1) +
                  '</span></br><span data-toggle="collapse" value=" " id="c' + i + '" class="SpansTxt">' + val.substring(val.indexOf("\n")) + '</span>');
                // console.log($span );
                $span.css("color", "#000000");
                $span.appendTo($container); //Adiciona ao Div
                $spanVazio = $('<span> </span>');
                $spanVazio.appendTo($container);
              } else {
                $span = $('<span data-toggle="collapse" value=" " id="c' + i + '" class="SpansTxt">' + val + '</span>');
                $spanVazio = $('<span> </span>');
                $span.css("color", "#000000");
                $span.appendTo($container); //Adiciona ao Div
                $spanVazio.appendTo($container);
              }
            });

            var sapns = $('#Div' + idCorr + ' > .SpansTxt');
            var maxEle = $('#Div' + idCorr + ' > .SpansTxt').length;
            console.log(maxEle);
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

            var nota = correcaoDoc.nota;

            var disciplina = perguntasDoc.disciplina;
            //imagem da disciplina e tipo de teste
            var urlDiscp;
            switch (disciplina) {
              case "Português":
              urlDiscp = "img/portugues.png";
              break;
              case "Matemática":
              urlDiscp = "img/mate.png";
              break;
              case "Estudo do Meio":
              urlDiscp = "img/estudoMeio.png";
              break;
              case "Inglês":
              urlDiscp = "img/ingles.png";
              break;
              case "Outro":
              urlDiscp = "img/outro.png";
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
              '          ---- Nota: ' + nota + ' % ---- </br>' +
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
      "click #btnZoom": "btnZoom",
    },

    btnZoom: function(e) {
        var self = this;
        if ($('#btnZoom').text() == "Zoom +")
        {
          $('#btnZoom').text("Zoom -")
          self.myLineGra.options.scaleOverride = false;

        }else {
          $('#btnZoom').text("Zoom +")
          self.myLineGra.options.scaleOverride = true;
        }
        var ctx = document.getElementById("canvasGrafico").getContext("2d");
        var myLineChart = new Chart(ctx).Line(self.myLineGraData, self.myLineGra.options)
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

      professores_local2.getAttachment(profId, 'prof.jpg', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome + " - [ " + escolaNome + " ]");
        $('#imgProf').attr("src", url);
      });

      alunos_local2.getAttachment(alunoId, 'aluno.jpg', function(err2, DataImg) {
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
            certasAlunoArr.push(response.rows[i].value.nota);

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
          if (arr3.length == 1)
          {
            arr3.push(arr3[0]);
            certasAlunoArr.push(certasAlunoArr[0]);
          }


          var lineChartData = {
            labels: arr3,

            datasets: [{
              label: "Nota do Aluno",
              fillColor: "rgba(255,100,100,0.2)",
              strokeColor: "rgba(255,170,170,1)",
              pointColor: "rgba(255,170,170,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(255,170,170,1)",
              data: certasAlunoArr
            }]
          }
          self.myLineGraData = lineChartData;
          var ctx = document.getElementById("canvasGrafico").getContext("2d");
          var myLineChart = new Chart(ctx).Line(lineChartData, {
            responsive: true,
            bezierCurve : false,
            showScale: true,
            scaleOverride: true,
            // Number - The number of steps in a hard coded scale
              scaleSteps: 5,
            // Number - The value jump in the hard coded scale
           scaleStepWidth: 20,
           // Number - The scale starting value
           scaleStartValue: 0,
           animationEasing: "easeOutBounce",

           tooltipTemplate: "<%= datasetLabel %> - <%= value %> %",

            legendTemplate: '<% for (var i=0; i<datasets.length; i++){%>' +
              '<span class="glyphicon glyphicon-stop" style=" color: <%=datasets[i].strokeColor%>; font-size: 24pt">' +
              '</span><span style="font-size: 20pt"> <%if(datasets[i].label){%><%=datasets[i].label%><%}%></span>&nbsp&nbsp&nbsp' +
              '&nbsp&nbsp<%}%>'

          });
          self.myLineGra = myLineChart;
          var $containerPrin = $('#legendDiv');
          var auxLengda = '<div class="row"><div class="col-md-6">'+myLineChart.generateLegend()+'</div>';
          auxLengda += '<div class="col-md-6" style="text-align:right;"><button  type="button" id="btnZoom"  class="btn btn-primary btn-lg">Zoom +</button></div></div>';
          var $btn = $(auxLengda);
          $btn.appendTo($containerPrin); //Adiciona ao Div

        });
      });


      return this;
    }
  });
});
