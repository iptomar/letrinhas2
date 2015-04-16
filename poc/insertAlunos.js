var nano = require('nano')('http://127.0.0.1:5984');

var alunos = nano.use('dev_alunos');

var imgData = require('fs').readFileSync('aluno.png');

function insertAluno(counteri) {
  var aluno = {
    'nome': 'Joao'+counteri,
    'numero': counteri,
    'estado': true
  };

  alunos.multipart.insert(aluno, [{
    name: 'aluno.png',
    data: imgData,
    content_type: 'image/png'
  }], aluno.nome, function(err, body) {
    if (!err) {
      console.log('Aluno ' + counteri + ' inserted');
    } else {
      console.log('Aluno ' + counteri + ' failed');
    }
    if (counteri < 200) {
      insertAluno(counteri+1);
    }
  });
}


insertAluno(0);
