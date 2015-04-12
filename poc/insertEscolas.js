var nano = require('nano')('http://127.0.0.1:5984');

var escolas = nano.use('dev_escolas');

var imgData = require('fs').readFileSync('escola.png');


function insertEscola(counter, uids) {
  var escola = {
    'nome': 'escolaxpto',
    'morada': 'blabla',
    'turmas': []
  };

  for (var i = 0; i < 20; i++) {

 nano.request({db: "_uuids"}, function(_,uuids){
      var ids = uuids['uuids'][0];



    var turma = {
      '_id': ids,
      'ano': 1,
      'anoLectivo': 2014,
      'nome': 'turma A',
      'alunos': [],
      'professores': []
    };


    for (var y = 0; y < 40; y++) {
      var idaluno = Math.floor((Math.random() * 200) + 1);
      turma.alunos.push({
        'id': "Joao"+idaluno
      });
    }
   

for (var z = 0; z < 2; z++) {
    var idaluno = Math.floor((Math.random() * 20) + 1);
    turma.professores.push({
      'id': "xpto@gmail.com"+idaluno
    });
  }

 escola.turmas.push(turma);

    });
  }


  nano.request({db: "_uuids"}, function(_,uuids){
      var ids = uuids['uuids'][0];
      escola.nome = 'escola'+ counter;

  escolas.multipart.insert(escola, [{
    name: 'escola.png',
    data: imgData,
    content_type: 'image/png'
  }], ids , function(err, body) {
    if (!err) {
      console.log('Escola ' + escola.nome  + ' inserted');
    } else {
      console.log('Escola ' + escola.nome  + ' failed' + err);
    }

    if(counter < 15) {
      insertEscola(counter+1, 1);

    }
  });

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
