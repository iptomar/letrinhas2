define(function(require) {

  "use strict";

  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    tpl = require('text!tpl/summary.html'),

    template = _.template(tpl);

  return Backbone.View.extend({

    events: {
      "click #btnTeste": "clickTeste",
      "click #btn_addfunds": "click",
    },

    clickTeste: function(e) {

      $("#output").html('');
      $("#output").append('Running query ' + $('#sname').val() + '...</br>');
      alunos_local2.info().then(function(info) {
        $("#output").append('Documentos: ' + info.doc_count + '</br>');
      });

      alunos_local2.get($('#sname').val(), function(err, data) {
        if (err) console.log(err);
        $("#output").append('</br>');
        $("#output").append(JSON.stringify(data));
      });

      escolas_local2.getAttachment('a1ccde05f2732ea1f57e3fb2c92cf872', 'escola.png', function(err, data) {


        console.log(data);

        var url = URL.createObjectURL(data);
      //  var img = document.createElement('img');
        //img.src = url;








        document.querySelector("#imagex").src = url;

      });

    },

    click: function(e) {
      console.log('click');
    },

    render: function() {
      //this.$el.html(template(this.model.toJSON()));
      this.$el.html(template({}));

      return this;
    }

  });

});
