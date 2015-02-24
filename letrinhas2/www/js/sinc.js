//// Script de Replicacao da Base de dados CouchDb para PouchDb  //////
//##########################################################################

var alunos_local2 = new PouchDB('alunos_local2');

var escolas_local2 = new PouchDB('escolas_local2');

var professores_local2 = new PouchDB('professores_local2');

var testes_local2 = new PouchDB('testes_local2');


var repEscolas = PouchDB.sync('http://192.168.1.2:5984/escolas', 'escolas_local2', {
//var repEscolas = PouchDB.replicate('http://127.0.0.1:5984/escolas', 'escolas_local2', {
  live: true,
  batch_size: 100,
  retry: true
});

var repProfessores = PouchDB.sync('http://192.168.1.2:5984/professores', 'professores_local2', {
//var repProfessores = PouchDB.replicate('http://127.0.0.1:5984/professores', 'professores_local2', {
  live: true,
  batch_size: 100,
  retry: true
});

var rep = PouchDB.sync('http://192.168.1.2:5984/alunos', 'alunos_local2', {
//var rep = PouchDB.replicate('http://127.0.0.1:5984/alunos', 'alunos_local2', {
  live: true,
  batch_size: 400,
  retry: true
});
var repTestes = PouchDB.sync('http://192.168.1.2:5984/testes', 'testes_local2', {
//var rep = PouchDB.replicate('http://127.0.0.1:5984/testes', 'alunos_local2', {
  live: true,
  batch_size: 100,
  retry: true
});


//##########################################################################
repEscolas.on('change', function(info) {
  console.log("Escolas "+info);
});


repProfessores.on('change', function(info) {
  console.log("Profes "+info);
});


rep.on('change', function(info) {
  console.log("Alunos "+info);
});

repTestes.on('change', function(info) {
  console.log("Testes "+info);
});

////////////////////////////////////////////////////
////////////////////////////////////////////////////
rep.on('error', function(err) {
  console.log("Alunos "+err);
});


repEscolas.on('error', function(err) {
  console.log("Escolas "+err);
});


repProfessores.on('error', function(err) {
  console.log("Profs "+err);
});

repTestes.on('error', function(err) {
  console.log("Testes "+err);
});
