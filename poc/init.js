var nano = require('nano')('http://127.0.0.1:5984');

nano.db.destroy('dev_professores');
nano.db.destroy('dev_escolas');
nano.db.destroy('dev_alunos');
nano.db.destroy('dev_perguntas');
nano.db.destroy('dev_testes');
nano.db.destroy('dev_resolucoes');

nano.db.create('dev_professores');
nano.db.create('dev_escolas');
nano.db.create('dev_alunos');
nano.db.create('dev_perguntas');
nano.db.create('dev_testes');
nano.db.create('dev_resolucoes');

console.log('Databases reset!');
