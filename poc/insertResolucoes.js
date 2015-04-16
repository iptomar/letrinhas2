var nano = require('nano')('http://127.0.0.1:5984');
var resolucoes = nano.use('dev_resolucoes');
function insertCorrecao(count) {


  var correcao = {
      'palavra': 'menino',
      'categoria': 'Exatidão',
      'erro': 'Substituição de letras',
      'posicao': '4',
      };

  var resposta = {
    'idpergunta': '1',
    'conteudo': '??????', 
    'correcao': correcao, 
    'fluidez': '2', 
    'expressividade': '2', 
    'compreensao': '2', 
  };


  var correcao = {
    '_id': 'Corr' + count,
    'id_Teste': 'Teste_N7',
    'id_Aluno': 'Joao1',
    'id_Prof': 'xpto@gmail.com0',
    'tipoCorrecao': 'texto',
    'respostas': resposta,
    'nota': '0',
    'observacoes': 'bla bla',
  };
////tipoTeste
////texto - Teste Texto
////lista- Teste Listas
////multimedia - Teste multimedia


 

  resolucoes.insert(correcao, function(err, body) {
    if (!err) {
      console.log('correcao ' + correcao._id + ' inserted');
    }
    if(count < 4) {
      insertCorrecao(count+1);
    }
  });


    }
    insertCorrecao(0);