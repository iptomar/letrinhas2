define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/estatisticas.html'),
    template = _.template(janelas);

  return Backbone.View.extend({
    myLineChart2: null,
    gra1: false,
    gra2: false,
    gra3: false,
    gra4: false,


    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

    },

    criaResumo: function() {
      var self = this;

      function map(doc) {
        if (doc.nota != -1 && doc.id_Aluno == window.localStorage.getItem("AlunoSelecID")) {
          emit([doc.dataReso], doc);
        }
      }
      resolucoes_local2.query({
        map: map
      }, {
        reduce: false
      }, function(errx, response) {
        if (errx) console.log("Erro: " + errx);
        if (response.rows.length != 0) {
          var totalTexto = 0;
          var totalLista = 0;
          var totalMultimedia = 0;
          var totalInterpretacao = 0;
          var somaTexto = 0;
          var somaLista = 0;
          var somaMultimedia = 0;
          var somaInterpretacao = 0;
          for (var i = 0; i < response.rows.length; i++) {
            if (response.rows[i].value.tipoCorrecao == "Texto") {
              totalTexto++;
              somaTexto += response.rows[i].value.nota;
            }
            if (response.rows[i].value.tipoCorrecao == "Lista") {
              totalLista++;
              somaLista += response.rows[i].value.nota;
            }
            if (response.rows[i].value.tipoCorrecao == "Multimédia") {
              totalMultimedia++;
              somaMultimedia += response.rows[i].value.nota;
            }
            if (response.rows[i].value.tipoCorrecao == "Interpretação") {
              totalInterpretacao++;
              somaInterpretacao += response.rows[i].value.nota;
            }
          }
          var $container = $('#divResumo'); //Adiciona ao Div
          var mediaTexto = somaTexto / totalTexto;
          var mediaLista = somaLista / totalLista;
          var mediaMultimedia = somaMultimedia / totalMultimedia;
          var mediaInterpretacao = somaInterpretacao / totalInterpretacao;
          if (isNaN(mediaTexto)) {
            mediaTexto = 0;
          }
          if (isNaN(mediaLista)) {
            mediaLista = 0;
          }
          if (isNaN(mediaMultimedia)) {
            mediaMultimedia = 0;
          }
          if (isNaN(mediaInterpretacao)) {
            mediaInterpretacao = 0;
          }
          var textoParaDiv = "";
          textoParaDiv = '<ul class="list-group"><li class="list-group-item list-group-item-success">' +
            '<span class="badge myspanStatic">Média das Notas: ' + mediaTexto + '</span><h3> <b>Testes do tipo  [Texto]: ' +
            +totalTexto + '</b></h3></li></ul>';
          /////// ///// //////
          textoParaDiv += '<ul class="list-group"><li class="list-group-item list-group-item-success">' +
            '<span class="badge myspanStatic">Média das Notas: ' + mediaLista + '</span><h3> <b>Testes do tipo  [Lista]: ' +
            +totalLista + '</b></h3></li></ul>';
          /////// ///// //////
          textoParaDiv += '<ul class="list-group"><li class="list-group-item list-group-item-success">' +
            '<span class="badge myspanStatic">Média das Notas: ' + mediaMultimedia + '</span><h3> <b>Testes do tipo  [Multimédia]: ' +
            +totalMultimedia + '</b></h3></li></ul>';
          /////// ///// //////
          textoParaDiv += '<ul class="list-group"><li class="list-group-item list-group-item-success">' +
            '<span class="badge myspanStatic">Média das Notas: ' + mediaInterpretacao + '</span><h3> <b>Testes do tipo  [Interpretação]: ' +
            +totalInterpretacao + '</b></h3></li></ul>';

          textoParaDiv += '<div style="height: 150px;"</div>';

          var $conteudo = $(textoParaDiv);
          $conteudo.appendTo($container); //Adiciona ao Div
        }
      });
    },




    //
    desenhaEstatistica1: function() {
      var self = this;

      function map(doc) {
        if (doc.nota != -1 && doc.id_Aluno == window.localStorage.getItem("AlunoSelecID") && doc.tipoCorrecao == "Texto") {
          emit([doc.dataReso], doc);
        }
      }
      resolucoes_local2.query({
        map: map
      }, {
        reduce: false
      }, function(errx, response) {
        if (errx) console.log("Erro: " + errx);
        var arrDados = [];
        var arrLabel = [];

        if (response.rows.length != 0) {
          for (var i = 0; i < response.rows.length; i++) {

            var data = new Date(response.rows[i].value.dataReso);
            var day = data.getDate().toString();
            var month = data.getMonth().toString();
            var hours = data.getHours().toString();
            var minutes = data.getMinutes().toString();
            day = day.length === 2 ? day : '0' + day;
            month = month.length === 2 ? month : '0' + month;
            hours = hours.length === 2 ? hours : '0' + hours;
            minutes = minutes.length === 2 ? minutes : '0' + minutes;
            var dataFinal = day + "/" + month + "/" + data.getFullYear() + "-" + hours + ":" + minutes + "h";
            arrLabel.push(dataFinal);
            arrDados.push(response.rows[i].value.nota);
          }


          if (arrLabel.length == 1) {
            arrLabel.push(arrLabel[0]);
            arrDados.push(arrDados[0]);
          }


          var lineChartData = {
            labels: arrLabel,

            datasets: [{
              label: "Nota",
              fillColor: "rgba(255,100,100,0.2)",
              strokeColor: "rgba(255,170,170,1)",
              pointColor: "rgba(255,170,170,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(255,170,170,1)",
              data: arrDados
            }]
          }
          self.myLineGraData = lineChartData;
          var ctx = document.getElementById("canvasGrafico1").getContext("2d");
          var myLineChart = new Chart(ctx).Line(lineChartData, {
            responsive: true,
            bezierCurve: false,
            showScale: true,
            scaleOverride: true,
            // Number - The number of steps in a hard coded scale
            scaleSteps: 5,
            // Number - The value jump in the hard coded scale
            scaleStepWidth: 20,
            // Number - The scale starting value
            scaleStartValue: 0,
            animationEasing: "easeOutBounce",
            tooltipTemplate: "<%if (label){%> Nota:<%= value %>% - <%=label%><%}%>",

            legendTemplate: '<% for (var i=0; i<datasets.length; i++){%>' +
              '<span class="glyphicon glyphicon-stop" style=" color: <%=datasets[i].strokeColor%>; font-size: 24pt">' +
              '</span><span style="font-size: 20pt"> <%if(datasets[i].label){%><%=datasets[i].label%><%}%></span>&nbsp&nbsp&nbsp' +
              '&nbsp&nbsp<%}%>'
          });

          self.myLineGra = myLineChart;
        } else {
          var $containerPrin = $('#legendDiv1');
          var auxLengda = '<div style="height: 400px;" class="centerEX"> <h1>Sem resoluções para criar estatisticas!</h1></div>';
          // auxLengda += '<div class="col-md-6" style="text-align:right;"><button  type="button" id="btnZoom"  class="btn btn-primary btn-lg">Zoom +</button></div></div>';
          var $btn = $(auxLengda);
          $btn.appendTo($containerPrin); //Adiciona ao Div
        }
      });
    },

    desenhaEstatistica2: function() {
      var self = this;

      function map(doc) {
        if (doc.nota != -1 && doc.id_Aluno == window.localStorage.getItem("AlunoSelecID") && doc.tipoCorrecao == "Lista") {
          emit([doc.dataReso], doc);
        }
      }
      resolucoes_local2.query({
        map: map
      }, {
        reduce: false
      }, function(errx, response) {
        if (errx) console.log("Erro: " + errx);
        var arrDados = [];
        var arrLabel = [];

        if (response.rows.length != 0) {
          for (var i = 0; i < response.rows.length; i++) {

            var data = new Date(response.rows[i].value.dataReso);
            var day = data.getDate().toString();
            var month = data.getMonth().toString();
            var hours = data.getHours().toString();
            var minutes = data.getMinutes().toString();
            day = day.length === 2 ? day : '0' + day;
            month = month.length === 2 ? month : '0' + month;
            hours = hours.length === 2 ? hours : '0' + hours;
            minutes = minutes.length === 2 ? minutes : '0' + minutes;
            var dataFinal = day + "/" + month + "/" + data.getFullYear() + "-" + hours + ":" + minutes + "h";
            arrLabel.push(dataFinal);
            arrDados.push(response.rows[i].value.nota);
          }

          if (arrLabel.length == 1) {
            arrLabel.push(arrLabel[0]);
            arrDados.push(arrDados[0]);
          }

          var lineChartData = {
            labels: arrLabel,

            datasets: [{
              label: "Nota",
              fillColor: "rgba(255,100,100,0.2)",
              strokeColor: "rgba(255,170,170,1)",
              pointColor: "rgba(255,170,170,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(255,170,170,1)",
              data: arrDados
            }]
          }
          self.myLineGraData = lineChartData;
          var ctx = document.getElementById("canvasGrafico2").getContext("2d");
          var myLineChart = new Chart(ctx).Line(lineChartData, {
            responsive: true,
            bezierCurve: false,
            showScale: true,
            scaleOverride: true,
            // Number - The number of steps in a hard coded scale
            scaleSteps: 5,
            // Number - The value jump in the hard coded scale
            scaleStepWidth: 20,
            // Number - The scale starting value
            scaleStartValue: 0,
            animationEasing: "easeOutBounce",
            tooltipTemplate: "<%if (label){%> Nota:<%= value %>% - <%=label%><%}%>",

            legendTemplate: '<% for (var i=0; i<datasets.length; i++){%>' +
              '<span class="glyphicon glyphicon-stop" style=" color: <%=datasets[i].strokeColor%>; font-size: 24pt">' +
              '</span><span style="font-size: 20pt"> <%if(datasets[i].label){%><%=datasets[i].label%><%}%></span>&nbsp&nbsp&nbsp' +
              '&nbsp&nbsp<%}%>'
          });

          self.myLineGra = myLineChart;
          // var $containerPrin = $('#legendDiv2');
          // var auxLengda = '<div class="row"><div class="col-md-6">' + myLineChart.generateLegend() + '</div>';
          // // auxLengda += '<div class="col-md-6" style="text-align:right;"><button  type="button" id="btnZoom"  class="btn btn-primary btn-lg">Zoom +</button></div></div>';
          // var $btn = $(auxLengda);
          // $btn.appendTo($containerPrin); //Adiciona ao Div
        } else {
          var $containerPrin = $('#legendDiv2').empty();
          var auxLengda = '<div style="height: 400px;" class="centerEX"> <h1>Sem resoluções para criar estatisticas!</h1></div>';
          // auxLengda += '<div class="col-md-6" style="text-align:right;"><button  type="button" id="btnZoom"  class="btn btn-primary btn-lg">Zoom +</button></div></div>';
          var $btn = $(auxLengda);
          $btn.appendTo($containerPrin); //Adiciona ao Div
        }
      });
    },

    desenhaEstatistica3: function() {
      var self = this;
      console.log("dffffffffffffffffff");

      function map(doc) {
        if (doc.nota != -1 && doc.id_Aluno == window.localStorage.getItem("AlunoSelecID") && doc.tipoCorrecao == "Multimédia") {
          emit([doc.dataReso], doc);
        }
      }
      resolucoes_local2.query({
        map: map
      }, {
        reduce: false
      }, function(errx, response) {
        if (errx) console.log("Erro: " + errx);
        var arrDados = [];
        var arrLabel = [];

        if (response.rows.length != 0) {
          for (var i = 0; i < response.rows.length; i++) {

            var data = new Date(response.rows[i].value.dataReso);
            var day = data.getDate().toString();
            var month = data.getMonth().toString();
            var hours = data.getHours().toString();
            var minutes = data.getMinutes().toString();
            day = day.length === 2 ? day : '0' + day;
            month = month.length === 2 ? month : '0' + month;
            hours = hours.length === 2 ? hours : '0' + hours;
            minutes = minutes.length === 2 ? minutes : '0' + minutes;
            var dataFinal = day + "/" + month + "/" + data.getFullYear() + "-" + hours + ":" + minutes + "h";
            arrLabel.push(dataFinal);
            arrDados.push(response.rows[i].value.nota);
          }
          if (arrLabel.length == 1) {
            arrLabel.push(arrLabel[0]);
            arrDados.push(arrDados[0]);
          }

          var lineChartData = {
            labels: arrLabel,

            datasets: [{
              label: "Nota",
              fillColor: "rgba(255,100,100,0.2)",
              strokeColor: "rgba(255,170,170,1)",
              pointColor: "rgba(255,170,170,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(255,170,170,1)",
              data: arrDados
            }]
          }
          self.myLineGraData = lineChartData;

          var ctx = document.getElementById("canvasGrafico3").getContext("2d");
          console.log(ctx);

          var myLineChart = new Chart(ctx).Line(lineChartData, {
            responsive: true,
            bezierCurve: false,
            showScale: true,
            scaleOverride: true,
            // Number - The number of steps in a hard coded scale
            scaleSteps: 5,
            // Number - The value jump in the hard coded scale
            scaleStepWidth: 20,
            // Number - The scale starting value
            scaleStartValue: 0,
            animationEasing: "easeOutBounce",
            tooltipTemplate: "<%if (label){%> Nota:<%= value %>% - <%=label%><%}%>",

            legendTemplate: '<% for (var i=0; i<datasets.length; i++){%>' +
              '<span class="glyphicon glyphicon-stop" style=" color: <%=datasets[i].strokeColor%>; font-size: 24pt">' +
              '</span><span style="font-size: 20pt"> <%if(datasets[i].label){%><%=datasets[i].label%><%}%></span>&nbsp&nbsp&nbsp' +
              '&nbsp&nbsp<%}%>'
          });

          self.myLineGra = myLineChart;
          // var $containerPrin = $('#legendDiv3');
          // var auxLengda = '<div class="row"><div class="col-md-6">' + myLineChart.generateLegend() + '</div>';
          // // auxLengda += '<div class="col-md-6" style="text-align:right;"><button  type="button" id="btnZoom"  class="btn btn-primary btn-lg">Zoom +</button></div></div>';
          // var $btn = $(auxLengda);
          // $btn.appendTo($containerPrin); //Adiciona ao Div
        } else {
          var $containerPrin = $('#legendDiv3');
          var auxLengda = '<div style="height: 400px;" class="centerEX"> <h1>Sem resoluções para criar estatisticas!</h1></div>';
          // auxLengda += '<div class="col-md-6" style="text-align:right;"><button  type="button" id="btnZoom"  class="btn btn-primary btn-lg">Zoom +</button></div></div>';
          var $btn = $(auxLengda);
          $btn.appendTo($containerPrin); //Adiciona ao Div
        }
      });
    },


    desenhaEstatistica4: function() {
      var self = this;
      console.log("d");

      function map(doc) {
        if (doc.nota != -1 && doc.id_Aluno == window.localStorage.getItem("AlunoSelecID") && doc.tipoCorrecao == "Interpretação") {
          emit([doc.dataReso], doc);
        }
      }
      resolucoes_local2.query({
        map: map
      }, {
        reduce: false
      }, function(errx, response) {
        if (errx) console.log("Erro: " + errx);
        var arrDados = [];
        var arrLabel = [];

        if (response.rows.length != 0) {
          for (var i = 0; i < response.rows.length; i++) {

            var data = new Date(response.rows[i].value.dataReso);
            var day = data.getDate().toString();
            var month = data.getMonth().toString();
            var hours = data.getHours().toString();
            var minutes = data.getMinutes().toString();
            day = day.length === 2 ? day : '0' + day;
            month = month.length === 2 ? month : '0' + month;
            hours = hours.length === 2 ? hours : '0' + hours;
            minutes = minutes.length === 2 ? minutes : '0' + minutes;
            var dataFinal = day + "/" + month + "/" + data.getFullYear() + "-" + hours + ":" + minutes + "h";
            arrLabel.push(dataFinal);
            arrDados.push(response.rows[i].value.nota);
          }
          if (arrLabel.length == 1) {
            arrLabel.push(arrLabel[0]);
            arrDados.push(arrDados[0]);
          }

          var lineChartData = {
            labels: arrLabel,

            datasets: [{
              label: "Nota",
              fillColor: "rgba(255,100,100,0.2)",
              strokeColor: "rgba(255,170,170,1)",
              pointColor: "rgba(255,170,170,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(255,170,170,1)",
              data: arrDados
            }]
          }
          self.myLineGraData = lineChartData;

          var ctx = document.getElementById("canvasGrafico4").getContext("2d");
          console.log(ctx);

          var myLineChart = new Chart(ctx).Line(lineChartData, {
            responsive: true,
            bezierCurve: false,
            showScale: true,
            scaleOverride: true,
            // Number - The number of steps in a hard coded scale
            scaleSteps: 5,
            // Number - The value jump in the hard coded scale
            scaleStepWidth: 20,
            // Number - The scale starting value
            scaleStartValue: 0,
            animationEasing: "easeOutBounce",
            tooltipTemplate: "<%if (label){%> Nota:<%= value %>% - <%=label%><%}%>",

            legendTemplate: '<% for (var i=0; i<datasets.length; i++){%>' +
              '<span class="glyphicon glyphicon-stop" style=" color: <%=datasets[i].strokeColor%>; font-size: 24pt">' +
              '</span><span style="font-size: 20pt"> <%if(datasets[i].label){%><%=datasets[i].label%><%}%></span>&nbsp&nbsp&nbsp' +
              '&nbsp&nbsp<%}%>'
          });

          self.myLineGra = myLineChart;
          // var $containerPrin = $('#legendDiv4');
          // var auxLengda = '<div class="row"><div class="col-md-6">' + myLineChart.generateLegend() + '</div>';
          // // auxLengda += '<div class="col-md-6" style="text-align:right;"><button  type="button" id="btnZoom"  class="btn btn-primary btn-lg">Zoom +</button></div></div>';
          // var $btn = $(auxLengda);
          // $btn.appendTo($containerPrin); //Adiciona ao Div
        } else {
          var $containerPrin = $('#legendDiv4');
          var auxLengda = '<div style="height: 400px;" class="centerEX"> <h1>Sem resoluções para criar estatisticas!</h1></div>';
          // auxLengda += '<div class="col-md-6" style="text-align:right;"><button  type="button" id="btnZoom"  class="btn btn-primary btn-lg">Zoom +</button></div></div>';
          var $btn = $(auxLengda);
          $btn.appendTo($containerPrin); //Adiciona ao Div
        }
      });
    },

    events: {
      "click #BackButtonMO": "clickBackButtonMO",

    },

    clickBackButtonMO: function(e) {
      e.stopPropagation();
      e.preventDefault();
      window.history.back();
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

      professores_local2.getAttachment(profId, 'prof.jpg', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeProf').text(profNome + " - [ " + escolaNome + " ]");
        $('#imgProf').attr("src", url);

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
        $('#carouselPrincipal').on('slid.bs.carousel', function() {
          if ($('div.active')[0].id == "dvi1" && self.gra1 == false) {
            self.desenhaEstatistica1();
            self.gra1 = true
          }
          if ($('div.active')[0].id == "dvi2" && self.gra2 == false) {
            self.desenhaEstatistica2();
            self.gra2 = true
          }
          if ($('div.active')[0].id == "dvi3" && self.gra3 == false) {
            self.desenhaEstatistica3();
            self.gra3 = true
          }
          if ($('div.active')[0].id == "dvi4" && self.gra4 == false) {
            self.desenhaEstatistica4();
            self.gra4 = true
          }
        });
      });



      alunos_local2.getAttachment(alunoId, 'aluno.jpg', function(err2, DataImg) {
        if (err2) console.log(err2);
        var url = URL.createObjectURL(DataImg);
        $('#lbNomeAluno').text("[" + turmaNome + " ] -- " + alunoNome);
        $('#imgAluno').attr("src", url);
      });


      self.criaResumo();






      return this;
    }
  });

});
