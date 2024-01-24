#!/bin/bash

# Set the script to stop upon any error
set -e

source ./backend/venv/bin/activate

# run the server
cd backend/restify
./manage.py loaddata demodata.json

./manage.py runserver & npm start --prefix ../../frontend &





