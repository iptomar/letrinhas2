//var alunos = new PouchDB('http://localhost:5984/alunos');

var alunos_local2 = new PouchDB('alunos_local2', {
  adapter: 'websql'
});

var rep = PouchDB.replicate('http://127.0.0.1:5984/alunos', 'alunos_local2', {
  live: true,
  batch_size: 200
});

rep.on('change', function(info) {
  console.log(info);
});

rep.on('complete', function(info) {
  console.log(info);
  console.log('COMPLETE!!!');
});

rep.on('error', function(err) {
  console.log(err);
});


$(document).ready(function() {
  $('#sname').keypress(function(event) {
    if (event.which == 13) {
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

      alunos_local2.getAttachment($('#sname').val(), 'rabbit.png', function(err, data) {
        console.log(data);

        var url = URL.createObjectURL(data);
        var img = document.createElement('img');
        img.src = url;
        document.body.appendChild(img);
      });
    }
  });
});
