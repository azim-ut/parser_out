#!/bin/bash

nohup java -jar parser-1.jar > ../logs/parser.log 2>&1 &
nohup java -jar agents-0.2.jar > ../logs/agents.log 2>&1 &