define(function(require) {

  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/mostraResultadoLista.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    initialize: function() {

    },

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },


    bKey: function (e) {
      $('.SpansTxt').popover('destroy');
      this.auxRemoveAll();
     document.removeEventListener('backbutton', this.boundBKey);
     window.history.back();
    },

    auxRemoveAll:  function() {
      var self = this;
      resolucoes_local2.query({
          map: function (doc) {
            if (doc.nota != -1 && doc.id_Aluno == window.localStorage.getItem("AlunoSelecID") && doc.id_Teste == window.localStorage.getItem("auxIDtext1")) {
              emit(doc);
            }
          }
        }, {
          reduce: false
        }, function(errx, response) {
          if (errx) console.log("Erro: " + errx);
          console.log(response.rows.length);
          for (var i = 0; i < response.rows.length; i++) {
            console.log("oii");
            console.log(self);
           self.Removefile(response.rows[i].id + '.amr', function() {console.log("APAGADO ");}, function(err) {console.log("DEU ERRO APAGAR" + err);});
          }
        });
    },


    //////////// RemoverFicheiro /////////////////
    Removefile:  function (name, success, fail) {
      var gotFileSystems = function(fileSystem) {
        fileSystem.root.getFile(name, {
          create: false,
          exclusive: false
        }, gotRemoveFileEntry, fail);
      };
      var gotRemoveFileEntry = function(fileEntry) {
        fileEntry.remove(success, fail);
      };
      window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, gotFileSystems, fail);
    },

    getSrcAUDIO: function (obj) {
      var self= this;
      if($(obj).val()==0){
      var aux = obj.id.substring(2);
      resolucoes_local2.getAttachment(aux, 'gravacao.amr', function(err2, DataAudio) {
        if (err2) console.log(err2);
        self.GravarSOMfiD(aux + '.amr', DataAudio, function() {
          obj.src = "" + cordova.file.dataDirectory + "/files/" + aux + ".amr";
          obj.trigger = 'load';
          $(obj).val(1);
          console.log("player carregado com sucesso. id: ");
        }, function(err) {
          console.log("DEU ERRO" + err);
        });
      });
    }
  },


    //////////// GRAVAR SOM VINDO DA BD E PASSAR PARA O PLAYER DE AUDIO /////////////////
    GravarSOMfiD: function(name, data, success, fail) {
      var gotFileSystem = function(fileSystem) {
        fileSystem.root.getFile(name, {
          create: true,
          exclusive: false
        }, function(fileEntry) {
          fileEntry.createWriter(function(writer) {
            writer.onwrite = success;
            writer.onerror = fail;
            writer.write(data);
          }, fail);
        }, fail);
      };
      window.requestFileSystem(window.LocalFileSystem.PERSISTENT, data.length || 0, gotFileSystem, fail);
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

            var contar = 0;
            var colum1 = "";
            var colum2 = "";
            var colum3 = "";
            var erro = " sdfsdfsfa";
            for (var i = 0; i < perguntasDoc.conteudo.palavrasCl1.length; i++) {
              var palavra = perguntasDoc.conteudo.palavrasCl1[i];
              colum1 += '<p id="' + correcaoDoc._id +'-'+contar +'" class="picavel" >' + palavra + '</p>';
              contar++;
            }

            for (var i = 0; i < perguntasDoc.conteudo.palavrasCl2.length; i++) {
              var palavra = perguntasDoc.conteudo.palavrasCl2[i];
              colum2 += '<p id="' + correcaoDoc._id +'-'+contar +'" class="picavel" >' + palavra + '</p>';
              contar++;
            }

            for (var i = 0; i < perguntasDoc.conteudo.palavrasCl3.length; i++) {
              var palavra = perguntasDoc.conteudo.palavrasCl3[i];
              colum3 += '<p id="' + correcaoDoc._id +'-'+contar +'" class="picavel" >' + palavra + '</p>';
              contar++;
            }

            var dataFinal = day + "/" + month + "/" + data.getFullYear() + " - " + hours + ":" + minutes;

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
              '<div id="Div' + idCorr + '" class="relatorioDiv container centerEX"> ' +
              '<div class="col-xs-4">' + colum1 + '</div>' +
              '<div class="col-xs-4">' + colum2 + '</div>' +
              '<div class="col-xs-4">' + colum3 + '</div>' +
              '</div></div>');
            $btn.appendTo($containerPrin); //Adiciona ao Div


            var disciplina = perguntasDoc.disciplina;
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
              var exatidao = 0;
              var fluidez = 0;

              for (var i = 0; i < correcaoDoc.respostas[0].correcao.length; i++) {
                var categoria = correcaoDoc.respostas[0].correcao[i].categoria;
                if (categoria == 'Exatidão') {
                  exatidao++;
                } else {
                  fluidez++;
                }
              }

              var exPer = Math.round((exatidao / correcaoDoc.respostas[0].TotalPalavras) * 100);
              var exFlu = Math.round((fluidez / correcaoDoc.respostas[0].TotalPalavras) * 100);

            var $conteudoWindow = $('</br>  <nav class="navbar  navbar-fixed-bottom "><div class="row centerEX">' +
              '  <div class="col-md-4">' +
              '      <div class="panel panel-success" style="height: 150px">' +
              '        <div class="panel-heading">' +
              '          Texto:' +
              '        </div>' +
              '          Titulo:' + perguntasDoc.titulo + "</br>" +
              '          Pergunta:' + perguntasDoc.pergunta + "</br>" +
              '          Total Palavras:' + correcaoDoc.respostas[0].TotalPalavras + "</br>" +
              '          <img id="IMGDisc' + idCorr + '" src="' + urlDiscp + '" style="height:45px;">' +
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
              '          Palavras corretamente lidas: '+(correcaoDoc.respostas[0].TotalPalavras - exatidao - fluidez)+' </br>' +
              '          Velocidade da leitura: '+correcaoDoc.respostas[0].velocidade+' plv/min </br>' +
              '      </div>' +
              '    </div>' +
              '    <div class=" col-md-4">' +
              '      <div class="panel panel-info" style="height: 150px">' +
              '        <div class="panel-heading">' +
              '          Aluno' +
              '        </div>' +
              '        <label id="LB' + idCorr + '"></label>' +
              '        <img id="IMG' + idCorr + '" src="" style="height:58px;">' +
              '        <audio id="AU' + idCorr + '" val=0 controls="controls"  style="width: 100%"></audio>' +
              '      </div>' +
              '    </div>' +
              '  </div> </nav>'

            );

            $conteudoWindow.appendTo($containerPrin); //Adiciona ao Div

            var myEl = document.getElementById('AU'+ idCorr);
            myEl.addEventListener('click', function() {
              self.getSrcAUDIO(this);
            }, false);

            alunos_local2.getAttachment(correcaoDoc.id_Aluno, 'aluno.png', function(err2, DataImg) {
              if (err2) console.log(err2);
              var url = URL.createObjectURL(DataImg);
              $('#IMG' + idCorr).attr("src", url);
            });

            alunos_local2.get(correcaoDoc.id_Aluno, function(err, alunoDoc) {
              if (err) console.log(err);
              $('#LB' + idCorr).text("Aluno: " + alunoDoc.nome);
            });


            for (var i = 0; i < correcaoDoc.respostas[0].correcao.length; i++) {
              var posicaoX = parseInt(correcaoDoc.respostas[0].correcao[i].posicao);
              var categoria = correcaoDoc.respostas[0].correcao[i].categoria;
              var erro = correcaoDoc.respostas[0].correcao[i].erro;
              var cor;
              if (categoria == 'Exatidão') {
                cor = '#ee2020';
              } else {
                cor = '#3399ff';
              }
              var idPalavras =  correcaoDoc._id +'-'+posicaoX;
               $('#'+idPalavras).css("color", cor);
               $('#'+idPalavras).addClass('SpansTxt');
               $('#' + idPalavras).attr('data-placement', "top");
               $('#' + idPalavras).attr('data-toggle', "popover");
               $('#' + idPalavras).attr('data-container', "body");
               $('#' + idPalavras).attr('data-content', erro);
               $('#' + idPalavras).popover();
            }

            var $container = $('#Div' + idCorr); //Adiciona ao Div
            $("#Div" + idCorr).scroll(function() {
              $('.SpansTxt').popover('hide');
            });
          });
        });
      });
    },


    //Eventos Click
    events: {
      "click #BtnVoltar": "clickBtnCancelar",
      //  "click #controlos": "clickControlos",
    },


    onBKey: function() {
      var self = this;
      $('.SpansTxt').popover('destroy');
      document.removeEventListener("backbutton", self.onBKey, false); ///RETIRAR EVENTO DO BOTAO
      window.history.back();
    },


    clickBtnCancelar: function(e) {
      var self = this;
      e.stopPropagation();
      e.preventDefault();
      document.removeEventListener("backbutton", self.onBKey, false); ///RETIRAR EVENTO DO BOTAO
      $('.SpansTxt').popover('destroy');
      window.history.back();
    },

    render: function() {
      this.$el.html(template());

      var self = this;
      this.boundBKey = this.bKey.bind(this);
      document.addEventListener('backbutton', this.boundBKey);

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

      //  document.addEventListener("backbutton", function() {console.log(this); }, false);

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
    //  self.desenhaJanelas(resultadoID, true);

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

        // var $containerIND = $('#IndicatorsCorr');
        // var $li = $('<li data-target="#carouselPrincipal" data-slide-to="1" ></li>');
        // $li.appendTo($containerIND);


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
          var exatidaoArr = [];
          var fluidezArr = [];
          var arr3 = [];
          for (var i = response.rows.length - 1; i >= 0; i--) {
            var TotalPalav = response.rows[i].value.respostas[0].TotalPalavras;
            var exatidao = 0;
            var fluidez = 0;

            for (var y = 0; y < response.rows[i].value.respostas[0].correcao.length; y++) {
              if (response.rows[i].value.respostas[0].correcao[y].categoria == "Exatidão")
                exatidao++;
              else
                fluidez++;
            }

            var exPer = Math.round((exatidao / TotalPalav) * 100);
            var exFlu = Math.round((fluidez / TotalPalav) * 100);



            // append new value to the array
            exatidaoArr.push((100 - exPer));
            fluidezArr.push((100 - exFlu));

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
            count++;
            self.desenhaJanelas(response.rows[i].id, false);
            var $containerIND = $('#IndicatorsCorr');
            var $li = $('<li data-target="#carouselPrincipal" data-slide-to="' + count + '" ></li>');
            $li.appendTo($containerIND);

          }


          var randomScalingFactor = function() {
            return Math.round(Math.random() * 100)
          };
          var lineChartData = {
            labels: arr3,

            datasets: [{
              label: "Exatidão",
              fillColor: "rgba(255,100,100,0.2)",
              strokeColor: "rgba(255,170,170,1)",
              pointColor: "rgba(255,170,170,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(255,170,170,1)",
              data: exatidaoArr
            }, {
              label: "Fluidez",
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data: fluidezArr
            }]
          }
          var ctx = document.getElementById("canvasGrafico").getContext("2d");
          var myLineChart = new Chart(ctx).Line(lineChartData, {
            responsive: true,

            multiTooltipTemplate: "<%= datasetLabel %> - <%= value %> %",
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
