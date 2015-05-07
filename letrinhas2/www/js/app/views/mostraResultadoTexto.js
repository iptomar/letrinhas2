define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/mostraResultadoTexto.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    initialize: function() {

    },

    getSrcAUDIO: function(obj) {
      var self = this;
      if ($(obj).val() == 0) {
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


    bKey: function(e) {
      $('.SpansTxt').popover('destroy');
      this.auxRemoveAll();
      document.removeEventListener('backbutton', this.boundBKey);
      window.history.back();
    },

    auxRemoveAll: function() {
      var self = this;
      resolucoes_local2.query({
        map: function(doc) {
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
          self.Removefile(response.rows[i].id + '.amr', function() {
            console.log("APAGADO ");
          }, function(err) {
            console.log("DEU ERRO APAGAR" + err);
          });
        }
      });
    },


    //////////// RemoverFicheiro /////////////////
    Removefile: function(name, success, fail) {
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
            var dataFinal = day + "/" + month + "/" + data.getFullYear() + " - " + hours + ":" + minutes;
            var $btn = $('<h3> ' + testeDoc.titulo + ' - (' + dataFinal + ') </h3>' +
              '<div id="Div' + idCorr + '" class="relatorioDiv container">' + perguntasDoc.conteudo.texto + '</div>'
            );
            //
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
            var errosList = correcaoDoc.respostas[0].correcao;
            for (var i = 0; i < errosList.length; i++) {
              if (errosList[i].categoria == "Exatidão") {
                sapns[errosList[i].posicao].style.color = 'rgb(255, 0, 0)';
                $(sapns[errosList[i].posicao]).addClass('SpansTxt');
                $(sapns[errosList[i].posicao]).attr('data-placement', "top");
                $(sapns[errosList[i].posicao]).attr('data-toggle', "popover");
                $(sapns[errosList[i].posicao]).attr('data-container', "body");
                $(sapns[errosList[i].posicao]).attr('data-content', errosList[i].erro);
                $(sapns[errosList[i].posicao]).popover();
                exatidao++;
              } else {
                $(sapns[errosList[i].posicao]).addClass('SpansTxt');
                $(sapns[errosList[i].posicao]).attr('data-placement', "top");
                $(sapns[errosList[i].posicao]).attr('data-toggle', "popover");
                $(sapns[errosList[i].posicao]).attr('data-container', "body");
                $(sapns[errosList[i].posicao]).attr('data-content', errosList[i].erro);
                $(sapns[errosList[i].posicao]).popover();
                fluidez++;
                sapns[errosList[i].posicao].style.color = 'rgb(51, 153, 255)';
              }
            }

            $("#Div" + idCorr).scroll(function() {
              $('.SpansTxt').popover('hide');
            });
            var exPer = Math.round((exatidao / maxEle) * 100);
            var exFlu = Math.round((fluidez / maxEle) * 100);

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
              '          Erros de Exatidão: ' + exatidao + '  - acertou: ' + (100 - exPer) + '% </br>' +
              '          Erros de Fluidez: ' + fluidez + '  - acertou: ' + (100 - exFlu) + '% </br>' +
              '          ---- Total:' + (100 - (exPer + exFlu)) + '% certo ----</br>' +
              '          Palavras corretamente lidas: ' + (correcaoDoc.respostas[0].TotalPalavras - exatidao - fluidez) + ' </br>' +
              '         Expressividade:  - Sinais: ' + correcaoDoc.respostas[0].expresSinais + ' || - Entoação: ' + correcaoDoc.respostas[0].expresEntoacao + ' || - Texto: ' + correcaoDoc.respostas[0].expresTexto + ' </br>' +
              '          Velocidade da leitura: ' + correcaoDoc.respostas[0].velocidade + ' plv/min </br>' +
              '      </div>' +
              '    </div>' +
              '    <div class=" col-md-4">' +
              '      <div class="panel panel-info" style="height: 162px">' +
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
            $btn.appendTo($containerPrin); //Adiciona ao Div

            var myEl = document.getElementById('AU' + idCorr);
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
          });
        });
      });
    },

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },


    //Eventos Click
    events: {
      "click #BackButton": "clickBackButton",
      "click #olox": "olox",

    },

    olox: function(e) {

      console.log("asdasdsadsadsadas");
  //    window.history.back();
    },

    clickBackButton: function(e) {

      e.stopPropagation();
      e.preventDefault();
      var self = this;
      //  document.removeEventListener("backbutton", self.onBKey, false); ///RETIRAR EVENTO DO BOTAO
      $('.SpansTxt').popover('destroy');

      self.auxRemoveAll();
      window.history.back();
    },

    render: function() {
      this.$el.html(template());
      this.boundBKey = this.bKey.bind(this);
      document.addEventListener('backbutton', this.boundBKey);

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
          var exatidaoArr = [];
          var fluidezArr = [];
          var arr3 = [];


          for (var i = 0; i < response.rows.length; i++) {
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
          var $containerPrin = $('#legendDiv');
          var $btn = $(myLineChart.generateLegend());
          $btn.appendTo($containerPrin); //Adiciona ao Div
        });
      });

      return this;
    }
  });
});
