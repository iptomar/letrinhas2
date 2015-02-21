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

        initialize: function() {

          var profId = window.localStorage.getItem("EscolaProfSelecID");
          var profNome = window.localStorage.getItem("EscolaProfSelecNome");
          var escolaNome = window.localStorage.getItem("EscolaSelecionadaNome");
          var escolaId = window.localStorage.getItem("EscolaSelecionadaID");
          var turmaId = window.localStorage.getItem("TurmaSelecID");
          var turmaNome = window.localStorage.getItem("TurmaSelecNome");


          escolas_local2.get(escolaId, function(err, escolaDoc) {
              if (err) console.log(err);

              document.querySelector("#outputAlunos").innerHTML =
                '<div class="panel panel-default">' +
                '<div class="panel-body">' +
                '<center>---[<b>   ' + escolaNome + '  ---> ' + profNome + ' ---> ' + turmaNome + '  </b>]---</center>' +
                '</div>' +
                '</div>';


              var $container = $('#outputAlunos');

              for (var i = 0; i < escolaDoc.turmas.length; i++) {


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

                          $btn.appendTo($container);

                        });

                      });

                    }
                    break;
                  }

                }

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
              //this.$el.html(template(this.model.toJSON()));
              this.$el.html(template({}));

              return this;
            }

          });

      });
