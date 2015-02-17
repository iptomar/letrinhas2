#!/bin/bash
node init.js
node insertAlunos.js
node insertEscolas.js
node insertProfessores.js

cd ./web
http-server ./
