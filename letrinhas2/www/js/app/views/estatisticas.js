define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/estatisticas.html'),
    template = _.template(janelas);

  return Backbone.View.extend({
    myLineChart2: null,
    auxVar: "Texto",
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
    ////Criar a pagina inicial do resumo dos testes do aluno
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

          console.log(response)
          var totalTexto = 0;
          var totalLista = 0;
          var totalMultimedia = 0;
          var totalInterpretacao = 0;
          var somaTexto = 0;
          var somaLista = 0;
          var somaMultimedia = 0;
          var somaInterpretacao = 0;

          var quantosResculcoes = 0;
     //////////////umh

       return Promise.all(
         response.rows.map(function (row) {
           var DocResol = row.value;

           return testes_local2.get(DocResol.id_Teste)
             .then(function (doc) {

               if(doc.disciplina == window.localStorage.getItem("DiscplinaSelecionada")) {
                 if (DocResol.tipoCorrecao == "Texto") {
                       totalTexto++;
                       somaTexto += parseFloat(DocResol.nota);
                     }
                     if (DocResol.tipoCorrecao == "Lista") {
                       totalLista++;
                       somaLista += parseFloat(DocResol.nota);
                     }
                     if (DocResol.tipoCorrecao == "Multimédia") {
                       totalMultimedia++;
                       somaMultimedia += parseFloat(DocResol.nota);
                     }
                     if (DocResol.tipoCorrecao == "Interpretação") {
                       totalInterpretacao++;
                       somaInterpretacao += parseFloat(DocResol.nota);
                     }
               }
               // handle doc
               return doc; //????
             });
         })
       )
       .then(function (docs) { // Array com o resultado de cada uma das funções anteriores
        //  console.log(docs);
         var $container = $('#divResumo'); //Adiciona ao Div
           var mediaTexto = somaTexto / totalTexto;

           var mediaLista = somaLista / totalLista;
           var mediaMultimedia = somaMultimedia / totalMultimedia;
           var mediaInterpretacao = somaInterpretacao / totalInterpretacao;
             console.log(mediaLista);

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
             '<span class="badge myspanStatic">Média das Notas: ' + mediaTexto.toFixed(2)  + '%</span><h3> <b>Testes do tipo  [Texto]: ' +
             +totalTexto + '</b></h3></li></ul>';
           /////// ///// //////
           textoParaDiv += '<ul class="list-group"><li class="list-group-item list-group-item-success">' +
             '<span class="badge myspanStatic">Média das Notas: ' + mediaLista.toFixed(2) + '%</span><h3> <b>Testes do tipo  [Lista]: ' +
             +totalLista + '</b></h3></li></ul>';
           /////// ///// //////
           textoParaDiv += '<ul class="list-group"><li class="list-group-item list-group-item-success">' +
             '<span class="badge myspanStatic">Média das Notas: ' + mediaMultimedia.toFixed(2) + '%</span><h3> <b>Testes do tipo  [Multimédia]: ' +
             +totalMultimedia + '</b></h3></li></ul>';
           /////// ///// //////
           textoParaDiv += '<ul class="list-group"><li class="list-group-item list-group-item-success">' +
             '<span class="badge myspanStatic">Média das Notas: ' + mediaInterpretacao.toFixed(2) + ' %</span><h3> <b>Testes do tipo  [Interpretação]: ' +
             +totalInterpretacao + '</b></h3></li></ul>';

           textoParaDiv += '<div style="height: 150px;"</div>';

           var $conteudo = $(textoParaDiv);
           $conteudo.appendTo($container); //Adiciona ao Div
       })
       .catch(function (err) {
         console.log(err);
       });
        }
      });
    },


    desenhaEstatistica: function(tipoTeste, id) {
      var self = this;
      window.localStorage.setItem("nRepeticoes", tipoTeste);
      function map(doc) {
            /////////////////////////////////////////// console.log(self.auxVar);
        if (doc.nota != -1 && doc.id_Aluno == window.localStorage.getItem("AlunoSelecID") && doc.tipoCorrecao == window.localStorage.getItem("nRepeticoes" )) {
          emit([doc.dataReso], doc);
        }
      }

      // function
      resolucoes_local2.query({
        map: map
      }, {
        reduce: false
      }, function(errx, response) {
        if (errx) console.log("Erro: " + errx);
        var arrDados = [];
        var arrLabel = [];
        var contDOcsVal = 0;

        if (response.rows.length != 0) {



          var quantosResculcoes = 0;
            //////////////umh
              return Promise.all(
                response.rows.map(function (row) {
                  var DocResol = row.value;
                  return testes_local2.get(DocResol.id_Teste)
                    .then(function (doc) {

                      if(doc.disciplina == window.localStorage.getItem("DiscplinaSelecionada")) {
                        contDOcsVal++;
                        ///////////RESOLCOES PASSOU A TODAS AS VALIDACOES, O OBJECTIVO
                        ///// AGORA ERA PODER POR EXEMPLO FAZER UM console.log(DocResol.nota) e algo como
                        var data = new Date(DocResol.dataReso);
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
                        arrDados.push(DocResol.nota);
                      }
                      // handle doc

                      return doc; //????
                    });
                })
              )
              .then(function (docs) { // Array com o resultado de cada uma das funções anteriores

                if(contDOcsVal == 0)
                {
                  var $containerPrin = $('#legendDiv'+id);
                  var auxLengda = '<div style="height: 400px;" class="centerEX"> <h1>Sem resoluções para criar estatisticas!</h1></div>';
                  var $btn = $(auxLengda);
                  $btn.appendTo($containerPrin); //Adiciona ao Div
                }
                else {


                if (arrLabel.length == 1) {
                  arrLabel.push(arrLabel[0]);
                  arrDados.push(arrDados[0]);
                }
                var FillColors = "rgba(120,196,140,0.2)"
                var StrokeColor = "rgba(120,196,140,0.2)"

                if(id == 1)
                {
                  FillColors = "rgba(120,196,140,0.2)";
                  StrokeColor = "rgba(127,212,150,1)";
                }
                if(id == 2)
                {
                  FillColors = "rgba(216,200,95,0.2)";
                  StrokeColor = "rgba(242,200,157,1)";
                }
                if(id == 3)
                {
                  FillColors = "rgba(255,100,100,0.2)";
                  StrokeColor = "rgba(255,170,170,1)";
                }
                if(id == 4)
                {
                  FillColors = "rgba(110,192,216,0.2)";
                  StrokeColor = "rgba(145,219,242,1)";
                }

                var lineChartData = {
                  labels: arrLabel,
                  datasets: [{
                    label: "Nota",
                    fillColor: FillColors,
                    strokeColor: StrokeColor,
                    pointColor: StrokeColor,
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(255,170,170,1)",
                    data: arrDados
                  }]
                }
                self.myLineGraData = lineChartData;
                var ctx = document.getElementById("canvasGrafico"+id).getContext("2d");
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
            }  })
              .catch(function (err) {
                console.log(err);
              });


        } else {
          var $containerPrin = $('#legendDiv'+id);
          var auxLengda = '<div style="height: 400px;" class="centerEX"> <h1>Sem resoluções para criar estatisticas!</h1></div>';
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

        if (discplinaSelecionada == 'Português') {
          $('#imgDisciplina').attr("src", "img/portugues.png");
        }
        if (discplinaSelecionada == 'Matemática') {
          $('#imgDisciplina').attr("src", "img/mate.png");
        }
        if (discplinaSelecionada == 'Estudo do Meio') {
          $('#imgDisciplina').attr("src", "img/estudoMeio.png");
        }
        if (discplinaSelecionada == 'Inglês') {
          $('#imgDisciplina').attr("src", "img/ingles.png");
        }
        if (discplinaSelecionada == 'Outras Línguas') {
          $('#imgDisciplina').attr("src", "img/outrasLinguas.png");
        }
        if (discplinaSelecionada == 'Outro') {
          $('#imgDisciplina').attr("src", "img/outro.png");
        }
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
            self.desenhaEstatistica("Texto", 1);
            self.gra1 = true
          }
          if ($('div.active')[0].id == "dvi2" && self.gra2 == false) {
            self.desenhaEstatistica("Lista", 2);
            self.gra2 = true
          }
          if ($('div.active')[0].id == "dvi3" && self.gra3 == false) {
            self.desenhaEstatistica("Multimédia", 3);
            self.gra3 = true
          }
          if ($('div.active')[0].id == "dvi4" && self.gra4 == false) {
            self.desenhaEstatistica("Interpretação", 4);
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
