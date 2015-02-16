var nano = require('nano')('http://127.0.0.1:5984');

nano.db.destroy('professores');
nano.db.destroy('escolas');
nano.db.destroy('enunciados');
nano.db.destroy('alunos');

nano.db.create('professores');
nano.db.create('escolas');
nano.db.create('enunciados');
nano.db.create('alunos');


console.log('Databases reset!');
