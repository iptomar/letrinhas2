var nano = require('nano')('http://127.0.0.1:5984');

var professores = nano.use('dev_professores');
var imgData = require('fs').readFileSync('prof.png');

function insertProfessor(counter) {
  var prof = {
    'nome': 'Pedro Dias' + counter,
    'password': '123qwe',
    'telefone': '123456789',
    '_id': 'xpto@gmail.com' + counter,
    'estado': true,
    'pin': 1234
  };



  professores.multipart.insert(prof, [{
    name: 'prof.png',
    data: imgData,
    content_type: 'image/png'
  }], prof._id, function(err, body) {
    if (!err) {
      console.log('Professor ' + prof._id + ' inserted');
    } else {
      console.log('Professor ' + prof._id + ' failed');
    }
    if (counter < 20) {
      insertProfessor(counter+1);
    }
  });



}

insertProfessor(0);
