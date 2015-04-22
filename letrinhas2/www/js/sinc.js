//// Script de Replicacao da Base de dados CouchDb para PouchDb  //////
//##########################################################################

var btnBloqueado = false;
var IP= "192.168.1.64";
//var IP= "ince.pt";

//var IP= "ince.pt";
var escolasVar = "dev_escolas";
var professoresVar = "dev_professores";
var alunosVar = "dev_alunos";
var testesVar = "dev_testes";
var perguntasVar = "dev_perguntas";
var resolucoesVar = "dev_resolucoes";

var alunos_local2 = new PouchDB('alunos_local2');
var escolas_local2 = new PouchDB('escolas_local2');
var professores_local2 = new PouchDB('professores_local2');
var testes_local2 = new PouchDB('testes_local2');
var perguntas_local2 = new PouchDB('perguntas_local2');
var resolucoes_local2 = new PouchDB('resolucoes_local2');

var triger1= false;
var triger2= false;
var triger3= false;
var triger4= false;
var triger5= false;
var triger6= false;
var perc = 0;

function myfunction(){
if (triger1 == true && triger2 == true && triger3 == true && triger4 == true && triger5 == true )
{
  btnBloqueado = false;
//  sinEscolasForev();
//  sinAlunosForev();
//  sinProfsForev();
//  sinTestesForev();
//  sinPerguntasForev();
//  sinCorrecoesForev();
}

}



function sinTestesForev(){
  PouchDB.replicate('http://'+IP+':5984/'+testesVar, 'testes_local2', {
      live: true,
      batch_size: 200,
      retry: true
    }).on('change', function(info) {
      console.log("Testes " + info);
    }).on('error', function(err) {
      console.log("TestesERRO " + err);
    });
}

function sinPerguntasForev(){
   PouchDB.replicate('http://'+IP+':5984/'+perguntasVar, 'perguntas_local2', {
      live: true,
      batch_size: 200,
      retry: true
    }).on('change', function(info) {
      console.log("Perguntas " + info);
    }).on('error', function(err) {
      console.log("PerguntasERRO " + err);
    });
}


function sinCorrecoesForev(){
  var cenas = PouchDB.sync('http://'+IP+':5984/'+resolucoesVar, 'resolucoes_local2', {
     live: true,
     batch_size: 200,
     retry: true
   }).on('change', function(info) {
     console.log("Resolucoes " + info);
   }).on('error', function(err) {
     console.log("ResolucoesERRO " + err);
   });
}




///////////////////////////////////////////////////////////
escolas_local2.info().then(function(info1) {
if (info1.doc_count == 0){
  btnBloqueado = true;
}
else
{
  triger1= true;
  sinAlunos();

}
PouchDB.replicate('http://'+IP+':5984/'+escolasVar, 'escolas_local2', {
    live: false,
    batch_size: 100,
    retry: true
  }).on('change', function(info) {
    console.log("Escolas " + info);
  }).on('complete', function(info) {
    escolas_local2 = new PouchDB('escolas_local2');
    if (info1.doc_count == 0){
      perc += 20;
      triger1= true;
      myfunction();
    }
    console.log("EscolasCOMPLETO " + info);
    sinAlunos();
  }).on('error', function(err) {
    console.log("EscolasERRO " + err);
  });
});
///////////////////////////////////////////////////////////////////////////////
function sinAlunos(){
alunos_local2.info().then(function(info1) {
  if (info1.doc_count == 0){
    btnBloqueado = true;
  }
  else
  {
    triger2= true;
    sinProfs();
  }
PouchDB.replicate('http://'+IP+':5984/'+alunosVar, 'alunos_local2', {
    live: false,
    batch_size: 300,
    retry: true
  }).on('change', function(info) {
    console.log("Alunos " + info);
  }).on('complete', function(info) {
   alunos_local2 = new PouchDB('alunos_local2');
   if (info1.doc_count == 0){
     perc += 20;
     triger2= true;
     myfunction();
   }
    console.log("AlunosCOMPLETO " + info);
    sinProfs();
  }).on('error', function(err) {
    console.log("AlunosERRO " + err);
  });
});
}
/////////////////////////////////////////////////7
function sinProfs(){
professores_local2.info().then(function(info1) {
  if (info1.doc_count == 0){
    btnBloqueado = true;
  }
  else
  {
    triger3= true;
    sinTestes();
  }
 PouchDB.replicate('http://'+IP+':5984/'+professoresVar, 'professores_local2', {
    live: false,
    batch_size: 300,
    retry: true
  }).on('change', function(info) {
    console.log("Profs " + info);
  }).on('complete', function(info) {
   professores_local2 = new PouchDB('professores_local2');
   if (info1.doc_count == 0){
    perc += 20;
    triger3= true;
    myfunction();
  }
    console.log("ProfsCOMPLETO " + info);
    sinTestes();
  }).on('error', function(err) {
    console.log("ProfsERRO " + err);
  });
});

}
//////////////////////////////////////////////////
function sinTestes(){
testes_local2.info().then(function(info1) {
if (info1.doc_count == 0){
  btnBloqueado = true;
 PouchDB.replicate('http://'+IP+':5984/'+testesVar, 'testes_local2', {
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
    sinPerguntas();
  }).on('error', function(err) {
    console.log("TestesERRO " + err);
  });
}else
{
  triger4= true;
  sinPerguntas();
  sinTestesForev();
}
});
}

function sinPerguntas(){
perguntas_local2.info().then(function(info1) {
if (info1.doc_count == 0){
  btnBloqueado = true;
PouchDB.replicate('http://'+IP+':5984/'+perguntasVar, 'perguntas_local2', {
    live: false,
    batch_size: 100,
    retry: true
  }).on('change', function(info) {
    console.log("perguntas " + info);
  }).on('complete', function(info) {
    perguntas_local2 = new PouchDB('perguntas_local2');
    perc += 20;
    console.log("PerguntasCOMPLETO " + info);
    sinCorrecoesForev();
    triger5= true;
    myfunction();
  }).on('error', function(err) {
    console.log("PerguntasERRO " + err);
  });
}else
{
  triger5= true;
  sinCorrecoesForev();
  sinPerguntasForev();
}
});
}
