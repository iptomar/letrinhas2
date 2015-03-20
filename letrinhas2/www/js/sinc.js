//// Script de Replicacao da Base de dados CouchDb para PouchDb  //////
//##########################################################################

var btnBloqueado = false;
//var IP= "127.0.0.1";

var IP= "ince.pt";


var alunos_local2 = new PouchDB('alunos_local2');
var escolas_local2 = new PouchDB('escolas_local2');
var professores_local2 = new PouchDB('professores_local2');
var testes_local2 = new PouchDB('testes_local2');
var correcoes_local2 = new PouchDB('correcoes_local2');

var triger1= false;
var triger2= false;
var triger3= false;
var triger4= false;
var triger5= false;
var perc = 0;

function myfunction(){
if (triger1 == true && triger2 == true && triger3 == true && triger4 == true && triger5 == true )
btnBloqueado = false;
}

function sinEscolasForev(){
var repEscolas = PouchDB.sync('http://'+IP+':5984/escolas', 'escolas_local2', {
    live: true,
    batch_size: 100,
    retry: true
  }).on('change', function(info) {
    console.log("Escolas " + info);
  }).on('error', function(err) {
    console.log("EscolasERRO " + info);
  });
}



function sinAlunosForev(){
var repAlunos = PouchDB.sync('http://'+IP+':5984/alunos', 'alunos_local2', {
      live: true,
      batch_size: 300,
      retry: true
    }).on('change', function(info) {
      console.log("Alunos " + info);
    }).on('error', function(err) {
      console.log("AlunosERRO " + info);
    });
}

function sinProfsForev(){
  var repProfs = PouchDB.sync('http://'+IP+':5984/professores', 'professores_local2', {
      live: true,
      batch_size: 200,
      retry: true
    }).on('change', function(info) {
      console.log("Profs " + info);
    }).on('error', function(err) {
      console.log("ProfsERRO " + info);
    });
}

function sinTestesForev(){
  var repProfs = PouchDB.sync('http://'+IP+':5984/testes', 'testes_local2', {
      live: true,
      batch_size: 200,
      retry: true
    }).on('change', function(info) {
      console.log("Testes " + info);
    }).on('error', function(err) {
      console.log("TestesERRO " + info);
    });
}

function sinCorrecoesForev(){
  var repProfs = PouchDB.sync('http://'+IP+':5984/correcoes', 'correcoes_local2', {
      live: true,
      batch_size: 200,
      retry: true
    }).on('change', function(info) {
      console.log("Correcoes " + info);
    }).on('error', function(err) {
      console.log("CorrecoesERRO " + info);
    });
}





escolas_local2.info().then(function(info1) {
if (info1.doc_count == 0){
  btnBloqueado = true;
var repEscolas = PouchDB.sync('http://'+IP+':5984/escolas', 'escolas_local2', {
    live: false,
    batch_size: 100,
    retry: true
  }).on('change', function(info) {
    console.log("Escolas " + info);
  }).on('complete', function(info) {
    escolas_local2 = new PouchDB('escolas_local2');
    perc += 20;
    triger1= true;
    myfunction();
    console.log("EscolasCOMPLETO " + info);
  }).on('error', function(err) {
    console.log("EscolasERRO " + info);
  });
}else{
  triger1= true;
  sinEscolasForev();
}
});


alunos_local2.info().then(function(info1) {

if (info1.doc_count == 0){
  btnBloqueado = true;
var repEscolas = PouchDB.sync('http://'+IP+':5984/alunos', 'alunos_local2', {
    live: false,
    batch_size: 200,
    retry: true
  }).on('change', function(info) {
    console.log("Alunos " + info);
  }).on('complete', function(info) {
   alunos_local2 = new PouchDB('alunos_local2');
    perc += 20;
    console.log("AlunosCOMPLETO " + info);
    triger2= true;
    myfunction();
  }).on('error', function(err) {
    console.log("AlunosERRO " + info);
  });
}else{
  triger2= true;
  sinAlunosForev();
}
});


professores_local2.info().then(function(info1) {

if (info1.doc_count == 0){
  btnBloqueado = true;
var repProfs = PouchDB.sync('http://'+IP+':5984/professores', 'professores_local2', {
    live: false,
    batch_size: 200,
    retry: true
  }).on('change', function(info) {
    console.log("Profs " + info);
  }).on('complete', function(info) {
   professores_local2 = new PouchDB('professores_local2');
    console.log("ProfsCOMPLETO " + info);
    perc += 20;
    triger3= true;
    myfunction();
  }).on('error', function(err) {
    console.log("ProfsERRO " + info);
  });
}else
{
  triger3= true;
  sinProfsForev();
}
});




testes_local2.info().then(function(info1) {
if (info1.doc_count == 0){
  btnBloqueado = true;
var repTestes = PouchDB.sync('http://'+IP+':5984/testes', 'testes_local2', {
    live: false,
    batch_size: 200,
    retry: true
  }).on('change', function(info) {
    console.log("Testes " + info);
  }).on('complete', function(info) {
    testes_local2 = new PouchDB('testes_local2');
    perc += 20;
    console.log("TestesCOMPLETO " + info);
    triger4= true;
    myfunction();
  }).on('error', function(err) {
    console.log("TestesERRO " + info);
  });
}else
{
  triger4= true;
  sinTestesForev();
}
});




correcoes_local2.info().then(function(info1) {
if (info1.doc_count == 0){
  btnBloqueado = true;
var repTestes = PouchDB.sync('http://'+IP+':5984/correcoes', 'correcoes_local2', {
    live: false,
    batch_size: 200,
    retry: true
  }).on('change', function(info) {
    console.log("Correcoes " + info);
  }).on('complete', function(info) {
    correcoes_local2 = new PouchDB('correcoes_local2');
    perc += 20;
    console.log("CorrecoesCOMPLETO " + info);
    triger5= true;
    myfunction();
  }).on('error', function(err) {
    console.log("CorrecoesERRO " + info);
  });
}else
{
  triger5= true;
  sinCorrecoesForev();
}
});
