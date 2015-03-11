define(function(require) {


  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    janelas = require('text!janelas/InsTesTexto.html'),
    classList = require('classList.min'),
    template = _.template(janelas);
    
    var couch = require("node-couchdb");

  return Backbone.View.extend({

    highlight: function(e) {
      $('.side-nav__list__item').removeClass('is-active');
      $(e.target).parent().addClass('is-active');
    },

    initialize: function() {

    },

    //Eventos Click
    //Eventos Click
    events: {
        "click #BackButtonEE": "clickBackButtonEE",
        "click #btnInsTexto":"clickbtnInsTexto",
    },

    clickBackButtonEE: function(e) {
      e.stopPropagation(); e.preventDefault();
      window.history.back();
    },
// inserir dados na BD
      clickbtnInsTexto: function(e) {
      e.stopPropagation(); e.preventDefault();
        var titulo=$("#tit").text();
        var pergunta=$("#perg").text();
        var texto=$("#insTexto").text();
        var conteudo={'pergunta':pergunta,
                      'texto':texto,
                     };
        var teste={'conteudo': conteudo,'titulo':titulo };
        
          
        couch.insert( "testes", teste,function (err,response){
            try{console.log("funciona");}
            catch(err){console.log(err.message);}
        
        });                 
        
            
        /*    
        testes_local2.post(teste,function (err,response){
            try{console.log("funciona");}
            catch(err){console.log(err.message);}
        
        });         
        */        
          
    },
      
      
      
    render: function() {
      this.$el.html(template());
      return this;
    }
  });
});

