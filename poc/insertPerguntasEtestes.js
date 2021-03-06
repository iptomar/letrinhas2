var nano = require('nano')('http://127.0.0.1:5984');

var perguntas = nano.use('dev_perguntas');
var testes = nano.use('dev_testes');
var imgData = require('fs').readFileSync('voz.mp3');

function insertPerguntas(count) {

  var perguntaMultimedia = {
    'idCategoria': Math.floor((Math.random() * 3) + 1),
    'tipoDoCorpo': 'texto',
    'corpo': '4*2=',
    'opcoes': [],
    'opcaoCerta': '2',
  };

  var perguntaInterpretacao = {
 'texto': 'Era um cão que comeu um pão perto do latão, onde vivia o tio António',
 'posicaoResposta': [2, 6, 9],
  };

  var perguntaTexto = {
    'texto': 'Era uma vez um menino que tinha muito jeito para pintar, e a quem tinham dado uma paleta de tintas e um pincel. \n As cores da paleta eram lindas: o encarnado das papoilas, o azul do céu, o verde do mar, o amarelo dos malmequeres – e ainda outras cores menos vivas, mas nem por isso menos bonitas: o roxo das violetas, o cor-de-rosa das rosas de Abril… O menino ficou encantado com a paleta e resolveu logo pintar um belo quadro. Era no princípio da primavera, o tempo estava muito bonito, o campo todo verde e salpicado de flores… E o menino-pintor lá foi para o campo, disposto a fazer coisas maravilhosas..'
  };

  var perguntaPalavras = {
    'palavrasCl1': ['Terço','Cedo','Ação','Desde','Táxi','Flecha','Boxe','Urbe','Enxó','Cartaz','Giro','Plantar','Lembrar','Atum','Bloco','Glote','Trevo','Ringue','Branco','Ente'],
    'palavrasCl2': ['Unção','Globo','Prado','Obter','Pacto','Pneu','Aspeto','Nenhumas','Urtiga','Máximo','Reflexo','Imenso','Predador','Severa','Próximo','Ginete','Impeço','Constipar','Plainete','Flexíveis'],
    'palavrasCl3': ['Problema','Bracejar','Advérbio','Egípcio','Cápsula','Forquilha','Plumagem','Glândula','Florido','Brocado','Cume','Tasca','Sesta','Folga','Açor','Aro','Malha','Limalha'],
  };

  var pergunta = {
    '_id': 'Pergunta_N' + count,
    'titulo': 'Pergunta' + count,
    'pergunta': "Leia o seguinte Texto",
    'disciplina': "Português",
    'professorId':"xpto@gmail.com" + Math.floor((Math.random() * 20) + 1),
    'dataCri': '12-12-2015',
    'anoEscolar': [],
    'tipoTeste': 'texto',
    'conteudo': perguntaTexto,
  };

    
      pergunta.ano_escolar.push({
        'valor' : 1,
      });
       pergunta.ano_escolar.push({
        'valor' : 2,
      });
    
    var aux = 7;
    for (var y = 0; y < 3; y++) {
      perguntaMultimedia.opcoes.push({
        'tipo': 'Texto',
        'conteudo': aux
      });
      aux++;
    }



////tipoTeste
////texto - Teste Texto
////lista- Teste Listas
////multimedia - Teste multimedia



    if(count > 7 && count <= 12) {
      pergunta.conteudo = perguntaMultimedia;
      pergunta.tipoTeste = 'Multimédia';
  }else if(count > 12 && count <= 17) {
      pergunta.conteudo = perguntaPalavras;
      pergunta.tipoTeste = 'Lista';
  }else if(count > 18 && count <= 27) {
      pergunta.conteudo = perguntaInterpretacao;
      pergunta.tipoTeste = 'Interpretação';
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


  perguntas.multipart.insert(pergunta, [attach1], 'Pergunta_N' + count , function(err, body) {

  //testes.multipart.insert(enunciado, [attach1, attach2], 'Teste_N' + count , function(err, body) {
    if (!err) {
      console.log('Pergunta ' + 'Pergunta_N' + count   + ' inserted');
      //INSERIR UM TESTE COM PERGUNTA ASSOCIADA//
var teste = {
    '_id': 'Teste_N' + count,
    'titulo': 'Teste' + count,
    'perguntas': ['Pergunta_N' + count],
    'descricao': 'Teste para alunos com dificuldade a ler',
    'estado': true,
    'data': "27-05-2015",
    'professorId': "xpto@gmail.com0",
    'disciplina': "Português",
    'anoEscolar': 1
  };
       if(count >= 8 && count <= 12) {
  teste= {
    '_id': 'Teste_N' + count,
    'titulo': 'Teste' + count,
    'perguntas': ['Pergunta_N' + count, 'Pergunta_N8'],
    'descricao': 'Teste para alunos com dificuldade a ler',
    'estado': true,
    'data': "27-05-2015",
    'professorId': "xpto@gmail.com0",
    'disciplina': 1,
    'anoEscolar': 1
  };
}

testes.insert(teste, function(err, body) {
  if (!err){
     console.log('--TesteDaPergunta ' + 'Pergunta_N' + count  + ' inserted ')
    } else {
      console.log('--TesteDaPergunta ' + 'Pergunta_N' + count  + ' failed ' + err);
    }
});

 //FIMM INSERIR UM TESTE COM PERGUNTA ASSOCIADA//
    } else {
      console.log('Pergunta ' + 'Pergunta_N' + count  + ' failed' + err);
    }

    if(count < 25) {
      insertPerguntas(count+1);

    }
  });

    }
    insertPerguntas(0);
