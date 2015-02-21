

//##########################################################################
var rep = PouchDB.replicate('http://127.0.0.1:5984/alunos', 'alunos_local2', {
  live: true,
  batch_size: 200,
  retry: true
});

var repEscolas = PouchDB.replicate('http://127.0.0.1:5984/escolas', 'escolas_local2', {
  live: true,
  batch_size: 200,
  retry: true
});

var repProfessores = PouchDB.replicate('http://127.0.0.1:5984/professores', 'professores_local2', {
  live: true,
  batch_size: 200,
  retry: true
});


var alunos_local2 = new PouchDB('alunos_local2', {
  adapter: 'websql'
});


var escolas_local2 = new PouchDB('escolas_local2', {
  adapter: 'websql'
});

var professores_local2 = new PouchDB('professores_local2', {
  adapter: 'websql'
});


//##########################################################################
repEscolas.on('change', function(info) {
  console.log("Escolas "+info);
  var $container = $('#acv');
  var $btn = $('asdadasdasdasd');

  $btn.appendTo($container);

});

rep.on('complete', function(info) {
  console.log(info);
  console.log('COMPLETE!!!');
});

repProfessores.on('change', function(info) {
  console.log("Profes "+info);
});


rep.on('change', function(info) {
  console.log("Alunos "+info);
});



rep.on('error', function(err) {
  console.log("Alunos "+err);
});


repEscolas.on('error', function(err) {
  console.log("Escolas "+err);
});


repProfessores.on('error', function(err) {
  console.log("Profs "+err);
});
