#!/bin/bash

taskkill -f -im parser
taskkill -f -im agents
#ssh-agent -k