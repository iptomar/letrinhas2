//var alunos = new PouchDB('http://localhost:5984/alunos');

var alunos_local2 = new PouchDB('alunos_local2', {
  adapter: 'websql'
});


var escolas_local2 = new PouchDB('escolas_local2', {
  adapter: 'websql'
});

var rep = PouchDB.replicate('http://127.0.0.1:5984/alunos', 'alunos_local2', {
  live: true,
  batch_size: 200
});

var repEscolas = PouchDB.replicate('http://127.0.0.1:5984/escolas', 'escolas_local2', {
  live: true,
  batch_size: 100
});

repEscolas.on('change', function(info) {
  console.log(info);
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


repEscolas.on('error', function(err) {
  console.log(err);
});