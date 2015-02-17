var nano = require('nano')('http://127.0.0.1:5984');

var professores = nano.use('professores');
var escolas = nano.use('escolas');
var enunciados = nano.use('enunciados');
var alunos = nano.use('alunos');


function insertEscola(counter) {
  var escola = {
    'nome': 'escolaxpto',
    'logotipo': 'path',
    'morada': 'blabla',
    'professores': [],
    'turmas': []
  };

  for (var i = 0; i < 100; i++) {
    var turma = {
      'ano': 1,
      'anoLectivo': 2014,
      'nome': 'turma A',
      'alunos': []
    };


    for (var y = 0; y < 40; y++) {
      var idaluno = Math.floor(Math.random() * (1500 * 40)) + 1;
      turma.alunos.push({
        'id': idaluno
      });
    }

    escola.turmas.push(turma);
  }


  escola.nome = 'EscolaNome' + counter;
  escolas.insert(escola, function(err, body) {
    if (!err) {
      console.log('Escola ' + escola.nome + ' inserted');
    }
    if(counter < 15) {
      insertEscola(counter+1);
    }
  });

}

insertEscola(0);

/*
var obj = db.get('dockerode', function(err, body) {
  if (!err) {
    var length = body["contributors"].length;
    console.log(body["contributors"][length-1]);
  }
});
*/
