#!/bin/bash
node init.js

node insertAlunos.js
node insertEscolas.js
node insertProfessores.js
node insertPerguntasEtestes.js
node insertResolucoes.js

#!cd ./web
#!http-server ./
