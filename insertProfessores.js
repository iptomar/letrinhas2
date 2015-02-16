var nano = require('nano')('http://127.0.0.1:5984');

var professores = nano.use('professores');
var escolas = nano.use('escolas');
var enunciados = nano.use('enunciados');
var alunos = nano.use('alunos');

function insertProfessor(counter) {
  var prof = {
    'nome': 'Pedro Dias' + counter,
    'password': '123qwe',
    'telefone': '123456789',
    '_id': 'xpto@gmail.com' + counter,
    'photo': 'path',
    'estado': true,
    'pin': 1234
  };
  professores.insert(prof, function(err, body) {
    if (err) throw err;
    console.log('Professor ' + prof._id + ' inserted');
    if(counter < 10) {
      insertProfessor(counter+1);
    }
  });
}

insertProfessor(0);
