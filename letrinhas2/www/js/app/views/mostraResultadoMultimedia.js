define(function(require) {

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/mostraResultadoMultimedia.html'),
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


          $('#lbTituloTeste').text("Ver resultados: [ " + testeDoc.titulo + " ]");
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
          var $btn = $('<h3> ' + testeDoc.titulo + ' - (' + dataFinal + ') </h3></br></br></br>'+
          '<div class="panel panel-info"><div class="panel-heading centerEX"><h4>Nota: '+correcaoDoc.nota+'%</h4></div></div>'
          );

          $btn.appendTo($containerPrin); //Adiciona ao Div
        });

        for (var i = 0; i < correcaoDoc.respostas.length; i++) {
          perguntas_local2.get(correcaoDoc.respostas[i].idPergunta, obtemDadosParaRow(correcaoDoc.respostas[i]));
        }



        function obtemDadosParaRow(respostasCorrecao) {
          return function(errx, perguntaDoc) {
            if (errx) {
              console.log(errx);
            } else {
              console.log(respostasCorrecao);
              console.log(perguntaDoc);
              var certa = "";
              var cor = "green";
              if (respostasCorrecao.conteudo.escolha == respostasCorrecao.correcao.certa) {
                certa = "Aluno acertou";
                cor = "green";
              } else {
                certa = "Aluno errou";
                cor = "red";
              }

              var tet = '<ul class="list-group"><li style="font-size: 18px;" class="list-group-item">' +
                '<span style="font-size: 18px; background-color:' + cor + ';" class="badge">' + certa + '</span>' +
                perguntaDoc.titulo + ' - ' + perguntaDoc.pergunta +
                '</li></ul>';

              var $btn = $(tet);
              $btn.appendTo($containerPrin); //Adiciona ao Div
            }
          }
        }
      });
    },



    //Eventos Click
    events: {
      "click #BtnVoltar": "clickBtnCancelar",
      //  "click #controlos": "clickControlos",
    },


    render: function() {
      this.$el.html(template());


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
      //  self.desenhaJanelas(resultadoID, false);



      resolucoes_local2.get(resultadoID, function(err, CorrrecaoDoc) {
        if (err) console.log(err);

        window.localStorage.setItem("auxIDtext1", CorrrecaoDoc.id_Teste + ''); //enviar variavel

        $('#carouselPrincipal').on('slide.bs.carousel', function() {
          $('.SpansTxt').popover('hide');
        });
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
          var notax = [];
          var arr3 = [];


          for (var i = 0; i < response.rows.length; i++) {
            console.log(response);
            // append new value to the array
            notax.push(response.rows[i].value.nota);


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
              notax.push(notax[0]);
            }

          var lineChartData = {
            labels: arr3,

            datasets: [{
              label: "Nota",
              fillColor: "rgba(255,100,100,0.2)",
              strokeColor: "rgba(255,170,170,1)",
              pointColor: "rgba(255,170,170,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(255,170,170,1)",
              data: notax
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
           multiTooltipTemplate: "<%= datasetLabel %> - <%= value %> %",

            legendTemplate: '<% for (var i=0; i<datasets.length; i++){%>' +
              '<span class="glyphicon glyphicon-stop" style=" color: <%=datasets[i].strokeColor%>; font-size: 24pt">' +
              '</span><span style="font-size: 20pt"> <%if(datasets[i].label){%><%=datasets[i].label%><%}%></span>&nbsp&nbsp&nbsp' +
              '&nbsp&nbsp<%}%>'
          });
          self.myLineGra = myLineChart;
          var $containerPrin = $('#legendDiv');
          var auxLengda = '<div class="row"><div class="col-md-6">'+myLineChart.generateLegend()+'</div>';
          var $btn = $(auxLengda);
          $btn.appendTo($containerPrin); //Adiciona ao Div

        });
      });
      return this;
    }
  });
});
