var nano = require('nano')('http://127.0.0.1:5984');

var professores = nano.use('professores');
var escolas = nano.use('escolas');
var testes = nano.use('testes');
var alunos = nano.use('alunos');
var imgData = require('fs').readFileSync('voz.mp3');

function insertTestes(count) {

  var testeMULTIMEDIA = {
    'pergunta': 'Escolha a imagem correcta:',
    'opc1': 'aaaaa',
    'opc2': 'bbbbb',
    'opc3': 'ccccc',
  };

  var testeTexto = {
    'pergunta': 'Leia o seguinte texto:',
    'texto': 'Era uma vez um menino que tinha muito jeito para pintar, e a quem tinham dado uma paleta de tintas e um pincel. \n As cores da paleta eram lindas: o encarnado das papoilas, o azul do céu, o verde do mar, o amarelo dos malmequeres – e ainda outras cores menos vivas, mas nem por isso menos bonitas: o roxo das violetas, o cor-de-rosa das rosas de Abril… O menino ficou encantado com a paleta e resolveu logo pintar um belo quadro. Era no princípio da primavera, o tempo estava muito bonito, o campo todo verde e salpicado de flores… E o menino-pintor lá foi para o campo, disposto a fazer coisas maravilhosas..'
  };

  var teste = {
    '_id': 'Teste_N' + count,
    'titulo': 'Teste' + count,
    'disciplina': Math.floor((Math.random() * 4) + 1),
    'professorId':"xpto@gmail.com" + Math.floor((Math.random() * 20) + 1),
    'tipoTeste': '12-12-2015',
    'grau_escolar': '1',
    'tipoTeste': 'texto',
    'conteudo': testeTexto,
  };
////tipoTeste
////texto - Teste Texto
////lista- Teste Listas
////multimedia - Teste multimedia

  if(count > 4) {
    teste.conteudo = testeMULTIMEDIA;
    teste.tipoTeste = 'multimedia';
  }

  var attach1 = {
    name: 'voz.mp3',
    data: imgData,
    content_type: 'image/mp3'
  };

  var attach2 = {
    name: 'b.mp3',
    data: imgData,
    content_type: 'image/mp3'
  };


  testes.multipart.insert(teste, [attach1], 'Teste_N' + count , function(err, body) {

  //testes.multipart.insert(enunciado, [attach1, attach2], 'Teste_N' + count , function(err, body) {
    if (!err) {
      console.log('Testes ' + 'Teste_N' + count   + ' inserted');
    } else {
      console.log('Testes ' + 'Teste_N' + count  + ' failed' + err);
    }

    if(count < 7) {
      insertTestes(count+1);

    }
  });

    }
    insertTestes(0);
