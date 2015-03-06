// função para avançar para a página após validação
    function entrar(e){
        e.stopPropagation(); e.preventDefault();
            app.navigate('/paginic', {
            trigger: true
        });
    } 
      

define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/login.html'),
    classList = require('classList.min'),
    template = _.template(janelas);

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

    },

    //Eventos Click
    events: {
      "click #btnEntrar": "btnEntrar",
    },

 // Botão e correspondente validação     
    btnEntrar: function(e) {
        var user=$('#inputEmail').text();
        var password=$('inputPassword').text();
        // correr o servidor à procura
        function map(doc){
            if (doc.id == user){
                emit(doc);
            }
        }
        // consulta à base de dados tabela professores
        professores_local2.query({map:map},{reduce:false},function(error,response){
            if (error) console.log(error);
            else {
                if(response.rows.length > 0){
                    var prof = response.rows[0].key;
                    if (password == prof.password){
                        entrar(e);
                    }else{ alert('Password Incorreta');
                        password.text("");
                        user.text("");
                                                   
                         }
                
                }else alert("utilizador não encontrado");
            
            }
        });      
    },

    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});
