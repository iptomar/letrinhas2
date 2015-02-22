define(function(require) {

      "use strict";

      var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        tpl = require('text!tpl/escolherAluno.html'),
        template = _.template(tpl);

      return Backbone.View.extend({

        highlight: function(e) {
          $('.side-nav__list__item').removeClass('is-active');
          $(e.target).parent().addClass('is-active');
        },

        /////// Funcao executada no inicio de load da janela ////////////
        initialize: function() {
          ////Carrega dados da janela anterior////
          var profId = window.localStorage.getItem("ProfSelecID");
          var profNome = window.localStorage.getItem("ProfSelecNome");
          var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
          var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
          var turmaId = window.localStorage.getItem("TurmaSelecID");
          var turmaNome = window.localStorage.getItem("TurmaSelecNome");

          /// Vai buscar todas as escolas da base de dados //
          escolas_local2.get(escolaId, function(err, escolaDoc) {
              if (err) console.log(err);
              document.querySelector("#outputAlunos").innerHTML =
                '<div class="panel panel-default">' +
                '<div class="panel-body">' +
                '<center>---[<b>   ' + escolaNome + '  ---> ' + profNome + ' ---> ' + turmaNome + '  </b>]---</center>' +
                '</div>' +
                '</div>';
              var $container = $('#outputAlunos'); //Adiciona ao Div

              for (var i = 0; i < escolaDoc.turmas.length; i++) {
                //Se o id do aluno da turma é igual ao id do aluno entao vai buscar seus dados//
                if (escolaDoc.turmas[i].id == turmaId) {
                  for (var y = 0; y < escolaDoc.turmas[i].alunos.length; y++) {
                    var idAlunox = escolaDoc.turmas[i].alunos[y].id;
                    alunos_local2.get(idAlunox, function(err, alunoDoc) {
                    if (err) console.log(err);
                      alunos_local2.getAttachment(idAlunox, 'aluno.png', function(err2, DataImg) {
                          if (err2) console.log(err2);
                          var url = URL.createObjectURL(DataImg);
                          var $btn = $(
                            '<div class="col-md-4">' +
                            '<div class="thumbnail" style="height:160px;"  >' +
                            '<div class="caption">' +
                            "<button id='" + alunoDoc._id + "' type='button' class='btn btn-info btn-lg btn-block btn-aluno' >" +
                            "<img style='height:100px;' src='" + url + "' class='pull-left'/>" + alunoDoc.nome + "</button>" +
                            '</div>' +
                            '</div></br>' +
                            '</div>');
                          $btn.appendTo($container);//Adiciona ao Div
                        });
                      });
                    }
                    break; //Deixa de procurar informacao
                  }
                }
                //// Analisa todos os botoes do div e aqueles que forem botoes de escola escuta o evento click//
                $container.on('click', '.btn-aluno', function(ev) {
                  var $btn = $(this); // O jQuery passa o btn clicado pelo this
                  var self = this;
                  if (Backbone.history.fragment != 'menuTipoOpcao') {
                    utils.loader(function() {
                      ev.preventDefault();
                      window.localStorage.setItem("AlunoSelecNome", $btn[0].innerText + ''); //enviar variavel
                      window.localStorage.setItem("AlunoSelecID", $btn[0].id + ''); //enviar variavel
                      app.navigate('/menuTipoOpcao', {
                        trigger: true
                      });
                    });
                  }
                });
              });
            },

            events: {
              "click #btnTeste": "clickTeste",
              "click #BackButtonEA": "clickBackButtonEA",
            },


            clickBackButtonEA: function(e) {
              window.history.back();
            },

            render: function() {
              this.$el.html(template({}));
              return this;
            }
          });
      });
