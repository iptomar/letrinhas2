var nano = require('nano')('http://127.0.0.1:5984');

nano.db.destroy('professores');
nano.db.destroy('escolas');
nano.db.destroy('testes');
nano.db.destroy('alunos');
nano.db.destroy('testeMultimedia');
nano.db.destroy('testeTexto');

nano.db.create('professores');
nano.db.create('escolas');
nano.db.create('testes');
nano.db.create('alunos');
nano.db.create('testeMultimedia');
nano.db.create('testeTexto');


console.log('Databases reset!');
