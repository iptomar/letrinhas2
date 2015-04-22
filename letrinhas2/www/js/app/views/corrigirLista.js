var triggerSelec = false;

function TocarDepoisDeSelec ()
{
  triggerSelec = false;
  $("#AudioPlayerAluno").prop("currentTime",$("#AudioPlayerAluno").prop("currentTime")-1);
  $("#AudioPlayerAluno").trigger('play');
}

define(function(require) {
  "use strict";
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/corrigirLista.html'),
    template = _.template(janelas);

  return Backbone.View.extend({
    totalPalavras:0,
    totalPalavrasErradas:0,//contador de palavras erradas
    triggerSelec:false,

    convert_n2d: function(n){
        if(n<10) return("0"+n);
        else return(""+n);
    },

    convert_n3d: function(n){
      var self=this;
      if(n<100) return("0"+ self.convert_n2d(n) );
      else return(""+n);
    },

    verificaPalavras: function(){
      var self=this;
       if( self.totalPalavrasErradas!=0){
         $("#ContadorDeErros").attr("style","color: #dd0000; visibility:initial");
         $("#ContadorDeErros").text(self.totalPalavrasErradas + " Palavras Erradas");
       }
       else{
         $("#ContadorDeErros").attr("style","visibility:hidden");
       }
     },

    findErr: function(){
      //devolve todas as palavras da classe
      var e=0,f=0,
          todasPalavras=document.getElementsByClassName("picavel");
      for (var i=0; i< todasPalavras.length; i++){
        if($(todasPalavras[i]).val() != ''){
          //selecionar a categoria do erro (Exatidão / fluidez)
          switch (parseInt(($(todasPalavras[i]).val()).charAt(0))){
            case 1:
              e++;
              break;
            case 2:
              f++;
              break;
          }
        }
      }
      return{
        "exatidao": e,
        "fluidez": f
        };
    },

    //////////// Guardar audio vindo do couchDB /////////////////
    GravarSOMfile: function(name, data, success, fail) {
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
    },

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {
      var self = this;
      ////Carrega os dados mais uteis da janela anterior////
      var profId = window.localStorage.getItem("ProfSelecID");
      var profNome = window.localStorage.getItem("ProfSelecNome");
      var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
      var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
      var correcaoID = window.localStorage.getItem("CorrecaoID"); //enviar variavel

      resolucoes_local2.get(correcaoID, function(err, correcaoDoc){
        if(err) console.log(err);

        var data = new Date(correcaoDoc.dataSub);
        $("#titleTestePagina").text("Corrigir teste de lista de palavras, submetido a "+
                                      self.convert_n2d(data.getDate())+
                                      "/"+ self.convert_n2d(data.getMonth()+1)+
                                      "/"+ self.convert_n2d(data.getFullYear())+
                                      " às "+ self.convert_n2d(data.getHours())+
                                      ":"+ self.convert_n2d(data.getMinutes())+
                                      ":"+ self.convert_n2d(data.getSeconds())
                                      );
        alunos_local2.get(correcaoDoc.id_Aluno, function(err, alunoDoc){
          if(err) console.log(err);

          $("#lbNomeAluno").text(alunoDoc.nome);
          $("#LBrelaAluno").text(alunoDoc.nome);

        });
        alunos_local2.getAttachment(correcaoDoc.id_Aluno, 'aluno.png', function(err2, DataImg) {
            if (err2)  console.log(err2);

            var foto = URL.createObjectURL(DataImg);
            $("#alunoFoto").attr("src",foto);
            $("#imgAlunoTitleRela").attr("src",foto);

        });

        testes_local2.get(correcaoDoc.id_Teste, function(err, testeDoc) {
          if (err)  console.log(err);

          $('#lbTituloTeste').text(testeDoc.titulo+" - "+testeDoc.conteudo.pergunta);
          $('#LBrelaTitulo').text(testeDoc.titulo+" - "+testeDoc.conteudo.pergunta);

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
          var s1,allTable, empty=true;
          allTable ="<table style='width:100%; '><tr>";
          self.totalPalavras=0;
          //*id do div com o conteúdo, id="listaAreaConteudo"
          if(testeDoc.conteudo.palavrasCl1.length>0){
            s1="";
            for(var j=0; j<testeDoc.conteudo.palavrasCl1.length;j++){
              s1+="<p id='"+self.convert_n3d(self.totalPalavras)+" 'class='picavel' value=''"
                    +"style='font-weight:bold; font-size:20px'>"
                    + testeDoc.conteudo.palavrasCl1[j] +"</p>";
                    self.totalPalavras++;
            }
            allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
            empty=false;
          }

          if(testeDoc.conteudo.palavrasCl2.length>0){
              s1="";
              for(var j=0; j<testeDoc.conteudo.palavrasCl2.length;j++){
                s1+="<p id='"+ self.convert_n3d(self.totalPalavras) +"'class='picavel' value=''"
                      +"style='font-weight:bold; font-size:20px'>"
                      + testeDoc.conteudo.palavrasCl2[j] +"</p>";
                      self.totalPalavras++;
              }
              allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
              empty=false;
          }

          if(testeDoc.conteudo.palavrasCl3.length>0){
              s1="";
              for(var j=0; j<testeDoc.conteudo.palavrasCl3.length;j++){
                s1+="<p id='"+ self.convert_n3d(self.totalPalavras) +"'class='picavel' value=''"
                      +"style='font-weight:bold; font-size:20px'>"
                      + testeDoc.conteudo.palavrasCl3[j] +"</p>";
                      self.totalPalavras++;
              }
              allTable+=("<td class='well' align='center' valign='top' style='width:30%'>"+s1+"</td>");
              empty=false;
          }

          allTable+="</tr></table>";

          if(!empty){
            //Inserir a tabela no div id=listaAreaConteudo
            $('#listaAreaConteudo').html(allTable);

          }

          testes_local2.getAttachment(testeDoc._id, 'voz.mp3', function(err2, DataImg) {
            if (err2) console.log(err2);
            self.GravarSOMfile('voz.mp3', DataImg, function() {
              console.log('FUNCIONA VOZ PROF');
              $("#AudioPlayerProf").attr("src", cordova.file.dataDirectory + "/files/voz.mp3");
              $("#AudioPlayerProf").trigger('load');
            }, function(err) {
              console.log("DEU ERRO VOZ PROF" + err);
            });
          });
        });


        resolucoes_local2.getAttachment(correcaoID, 'gravacao.amr', function(err2, DataAudio) {
          if (err2) console.log(err2);
          self.GravarSOMfile('gravacao.amr', DataAudio, function() {
            console.log('FUNCIONA');
            $("#AudioPlayerAluno").attr("src", cordova.file.dataDirectory + "/files/gravacao.amr");
            //$("#AudioPlayerAluno").trigger('load');
          }, function(err) {
            console.log("DEU ERRO" + err);
          });
        });

        // Analisa todos os botoes do div
        var $container = $('#listaAreaConteudo');
        $container.on('click', '.picavel', function(ev) {
          var text = $(this).text();

          var $meuSpan = $(this);
          var elem = '<div class="dropdown" > ' +
            '<button class="btn btn-info testMedioDrops" type="button" id="menu1" data-toggle="dropdown" style="width:115px; "> Exatidão ' +
            '<span class="caret"></span></button>' +
            '<ul class="dropdown-menu testMedioDrops" role="menu" aria-labelledby="menu1">' +
            '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').val(11).css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Substituição de letras</a></li>' +
            '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').val(12).css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Substituição de palavras</a></li>' +
            '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').val(13).css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Adições</a></li>' +
            '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').val(14).css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Omissões de letras</a></li>' +
            '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').val(15).css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Omissões de sílabas</a></li>' +
            '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').val(16).css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Omissões de palavras</a></li>' +
            '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').val(17).css(\'color\', \'#FF0000\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Inversões</a></li>' +
            '</ul>' +
            '</div>' +
            '<div class="dropdown"> ' +
            '<button class="btn btn-info testMedioDrops" type="button" id="menu1" data-toggle="dropdown" style="width:	115px;"> Fluidez ' +
            '<span class="caret"></span></button>' +
            '<ul class="dropdown-menu testMedioDrops" role="menu" aria-labelledby="menu1">' +
            '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').val(21).css(\'color\', \'#3399FF\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Vacilação</a></li>' +
            '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').val(22).css(\'color\', \'#3399FF\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Repetições</a></li>' +
            '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').val(23).css(\'color\', \'#3399FF\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Soletração</a></li>' +
            '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').val(24).css(\'color\', \'#3399FF\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Fragmentação de palavras</a></li>' +
            '<li role="presentation"><a role="menuitem" tabindex="-1" class="close-me" onclick="$(this).closest(\'div.popover\').prev().popover(\'hide\').val(25).css(\'color\', \'#3399FF\');TocarDepoisDeSelec();"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span> Retificação espontânea</a></li>' +
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
            self.totalPalavrasErradas--;
            self.verificaPalavras();
            triggerSelec = false;
          } else   if(triggerSelec == false){
            $("#AudioPlayerAluno").trigger('pause');
            $(this).css("color", "#FF9900");
            $meuSpan.popover('show');
            self.totalPalavrasErradas++;
            self.verificaPalavras();
            triggerSelec = true;
          }

        });
      });
      self.totalPalavrasErradas=0;
    },

    events: {
      "click #BtnCancelar": "clickBtnCancelar",
      "click #demoButton": "clickDemoButton",
      "click #playMyTestButton": "clickPlayMyTestButton",
      "click #submitButton": "clickSubmitButton",
      "click #btnConfirmarSUB": "clickbtnConfirmarSUB",
    },




    clickbtnConfirmarSUB: function(e) {
      var self=this;
        $('#myModalSUB').modal("hide");
        $('#myModalSUB').on('hidden.bs.modal', function (e) {
        try{
            var plvr, categ, erro;
            //array para receber os items (palavra e erro)
            var conteudoResultado = new Array();
            //devolve todas as palavras da classe
            var todasPalavras =document.getElementsByClassName("picavel");
            var a=0;
            for (var i=0; i< todasPalavras.length; i++){
              if($(todasPalavras[i]).val() != ''){
                plvr=$(todasPalavras[i]).text();

                //selecionar a categoria do erro (Exatidão / fluidez)
                switch (parseInt(($(todasPalavras[i]).val()).charAt(0))){
                  case 1:
                    categ="Exatidão";
                    break;
                  case 2:
                    categ="Fluidez";
                    break;
                }
                //O erro em si.
                switch (parseInt($(todasPalavras[i]).val())){
                  case 11:erro="Substituição de palavras";break;
                  case 13:erro="Adições";break;
                  case 14:erro="Omissões de letras";break;
                  case 15:erro="Omissões de sílabas";break;
                  case 16:erro="Omissões de palavras";break;
                  case 17:erro="Inversões";break;
                  case 21:erro="Vacilação";break;
                  case 22:erro="Repetições";break;
                  case 23:erro="Soletração";break;
                  case 24:erro="Fragmentação de palavras";break;
                  case 25:erro="Retificação espontânea";break;
                }

                //mini array de 4 campos
                var item = {
                    'palavra': plvr,
                    'categoria': categ,
                    'erro': erro,
                    'posicao':$(todasPalavras[i]).attr("id")
                };

                //colocar o item no array
                conteudoResultado[a] = item;
                a++;
              }
            }

            //Data da correção
            var agora = new Date();
            var tempoSeg = $('#AudioPlayerAluno').prop("duration");

            //retorna o tempo de duração da leitura em segundos,
            //arredondando ao ineiro mais próximo
            var tempoSeg = Math.round($("#AudioPlayerAluno").prop("duration"));
            //(plm) palavras lidas por minuto (não necessário por enquanto)
            //var plm = Math.roud((totalPalavras*60/tempoSeg));
            //palavras corretamente lidas (pcl)
            var pcl= self.totalPalavras - self.totalPalavrasErradas;
            //Velocidade de leitura (VL)
            var vl = Math.round((pcl*60/tempoSeg));

            //Fazer o update
            var CorrID= window.localStorage.getItem("CorrecaoID");
            resolucoes_local2.get(CorrID, function(err, docmnt){
              //total de palavras
              docmnt.TotalPalavras = self.totalPalavras;
              //conteúdo onde estão identificadas as palavras erradas
              docmnt.conteudoResult=conteudoResultado;
              //Data da correção
              docmnt.dataCorr = agora;
              //estado para corrigido!
              docmnt.estado = 1;
              //erros de pontuação (não aplicavel neste tipo de teste)
              docmnt.expresSinais = null;
              //erros de entoação (não aplicavel)
              docmnt.expresEntoacao = null;
              //erros de expressividade do texto (não aplicavel)
              docmnt.expresTexto = null;
              //Velocidade da leitura
              docmnt.velocidade = vl;

              //actualizar o documento (correcao)
              resolucoes_local2.put(docmnt, CorrID, docmnt._rev, function(err, response) {
                if (err) {
                  console.log('Correcao ' + err + ' erro');
                } else {
                  console.log('Parabens InseridoCorrecao');
                }
              });

            });
          }
          catch (err){
            console.log(err);
          }
          window.history.back();
        });
    },


    // Fazer update à correção com os devidos campos preenchidos
    clickSubmitButton: function(e) {
      e.stopPropagation();
      e.preventDefault();
      var self=this;
      window.print();
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

        var analise = self.findErr();
        var exatidaoTotal= analise.exatidao;
        var fluidezTotal = analise.fluidez;

        $('#LBtotalPalavras').text("Total de Palavras: "+self.totalPalavras);
        var exPer = Math.round((exatidaoTotal/self.totalPalavras)*100);
        var exFlu = Math.round((fluidezTotal/self.totalPalavras)*100);
        $('#LBCorrecao').html("Correção: </br>"+
        "&nbsp;&nbsp;&nbsp;&nbsp-Exatidão: "+ exatidaoTotal +" palavras erradas, acertou: "+(100-exPer)+"% </br>"+
        "&nbsp;&nbsp;&nbsp;&nbsp-Fluidez: "+ fluidezTotal +" palavras, acertou: "+(100-exFlu)+"% </br>"+
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp>>> Precisão:"+(100-(exPer+exFlu))+"% certo <<<\n\n"
      );
      var tempoSeg = $('#AudioPlayerAluno').prop("duration");

      var tempoSegProf = $('#AudioPlayerProf').prop("duration");

       $('#LBCtempoAluno').html("Tempo do Aluno: </br>"+
            "&nbsp;&nbsp;&nbsp;&nbsp-Duração: "+Math.round(tempoSeg)+" segundos </br>"+
            "&nbsp;&nbsp;&nbsp;&nbsp-Velocidade: "+(Math.round(60*self.totalPalavras/tempoSeg))+" plv/min. ");

      $('#LBCtempoProf').html("Tempo do Professor: </br>"+
      "&nbsp;&nbsp;&nbsp;&nbsp-Duração: "+Math.round(tempoSegProf)+" segundos</br>"+
      "&nbsp;&nbsp;&nbsp;&nbsp-Velocidade: "+(Math.round(60*self.totalPalavras/tempoSegProf))+" plv/min.");
      $('#myModalSUB').modal("show");
      }
    },

    clickBtnCancelar: function(e) {
     e.stopPropagation(); e.preventDefault();
     window.history.back();
    },

    render: function() {
      this.$el.html(template({}));
      return this;
    }

  });

});
