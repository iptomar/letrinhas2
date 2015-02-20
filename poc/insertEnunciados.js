var nano = require('nano')('http://127.0.0.1:5984');

var professores = nano.use('professores');
var escolas = nano.use('escolas');
var enunciados = nano.use('enunciados');
var alunos = nano.use('alunos');


function insertEnunciados(count) {
  var enunciado = {
    'Titulo': 'Teste' + count,
    '_id': 'Enunciado_N' + count,
    'disciplina':[],
    'tipoTeste':[],
    'Pergunta': 'Leia o seguinte texto:',
    'texto': 'Era uma vez um menino que tinha muito jeito para pintar, e a quem tinham dado uma paleta de tintas e um pincel. \n As cores da paleta eram lindas: o encarnado das papoilas, o azul do céu, o verde do mar, o amarelo dos malmequeres – e ainda outras cores menos vivas, mas nem por isso menos bonitas: o roxo das violetas, o cor-de-rosa das rosas de Abril… O menino ficou encantado com a paleta e resolveu logo pintar um belo quadro. Era no princípio da primavera, o tempo estava muito bonito, o campo todo verde e salpicado de flores… E o menino-pintor lá foi para o campo, disposto a fazer coisas maravilhosas..'
  };
  enunciados.insert(enunciado, function(err, body) {
        if (err) throw err;
        console.log('Enunciado ' + enunciado._id + ' inserted');
        if(count < 15) {
          insertEnunciados(count+1);
        }
      });
    }
  insertEnunciados(0);
