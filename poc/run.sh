#!/bin/bash
node init.js

node insertAlunos.js
node insertEscolas.js
node insertProfessores.js
node insertTestes.js
node insertCorrecoes.js

#!cd ./web
#!http-server ./
