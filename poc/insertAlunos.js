var nano = require('nano')('http://127.0.0.1:5984');

var alunos = nano.use('dev_alunos');

var imgData = require('fs').readFileSync('aluno.png');

function insertAluno(counteri) {

var turma;

if (counteri >= 0 && counteri <= 50)
turma = "Turma0-1";
if (counteri >50 && counteri <= 100)
turma = "Turma0-2";
if (counteri >100 && counteri <= 150)
turma = "Turma0-3";
if (counteri >150 && counteri <= 200)
turma = "Turma0-4";


  var aluno = {
    'nome': 'Joao'+counteri,
    'numero': counteri,
    'estado': true,
    'turma': turma
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
