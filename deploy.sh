#!/bin/bash

sudo apt update
sudo apt upgrade
sudo apt install nodejs
sudo apt install npm
sudo apt install unzip
sudo apt install wget

wget https://www.dropbox.com/s/prntzl5zf4vienm/mncrscnt-bot-master.zip
unzip mncrscnt-bot-master.zip
cd mncrscnt-bot-master/

npm install node-telegram-bot-api
npm install npm i axios
npm init
node index.js