#!/bin/bash
node init.js

node insertAlunos.js
node insertEscolas.js
node insertProfessores.js
node insertEnunciados.js

cd ./web
http-server ./
