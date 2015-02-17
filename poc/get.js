var nano = require('nano')('http://127.0.0.1:5984');

var professores = nano.use('professores');
var escolas = nano.use('escolas');
var enunciados = nano.use('enunciados');

/*
professores.get('xpto@gmail.com', function(err, body) {
  if (err) throw err;
  console.log(body);
});
*/

escolas.list(function(err, body) {
  if (err) throw err;
  //console.log(body.rows);

  for (var i = 0; i < body.rows.length; i++) {
    escolas.get(body.rows[i].id, function(err, body) {
      if (err) throw err;
      console.log(require('util').inspect(body,{'depth':null}));
    });
  }
});
