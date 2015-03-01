var nano = require('nano')('http://127.0.0.1:5984');

var professores = nano.use('professores');
var escolas = nano.use('escolas');
var testes = nano.use('testes');
var alunos = nano.use('alunos');
var correcoes = nano.use('correcoes');

function insertCorrecao(count) {

  var testeMULTIMEDIA = {
    'opcaoAluno': '1',
  };

  var testeTexto = {
    'exatidao': '1',
    'velocidade': '2', 
    'fluidez': '2', 
    'expressividade': '2', 
    'compreensao': '2', 
  };


  var correcao = {
    '_id': 'Corr' + count,
    'id_Teste': '6f54b0cf4798b3433b7c511485b5ff5e',
    'id_Aluno': 'Joao1',
    'id_Prof': 'xpto@gmail.com0',
    'tipoCorrecao': 'texto',
    'conteudo': testeTexto,
  };
////tipoTeste
////texto - Teste Texto
////lista- Teste Listas
////multimedia - Teste multimedia


 

  correcoes.insert(correcao, function(err, body) {
    if (!err) {
      console.log('correcao ' + correcao._id + ' inserted');
    }
    if(count < 4) {
      insertCorrecao(count+1);
    }
  });


    }
    insertCorrecao(0);