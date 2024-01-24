# Restify

Welcome to Restify! This is a rental booking web application developed for CSC309 at UofT by Kolby C., Tomas H., and Antony L.

## Setup

First, make sure you have access to some form of Linux terminal (ie. WSL, cygwin, etc.). Also, ensure you have up-to-date versions of Python (>=3.0), and pip3. The rest of the setup shell should do the rest.  

To set up the app, using a **Linux terminal**, navigate to the main Restify folder (with `kill.sh`, `run.sh`, and `startup.sh`). Then run:
```
dos2unix startup.sh
dos2unix run.sh
dos2unix kill.sh
dos2unix backend/restify/manage.py
bash startup.sh
```
(Downloading off of GitHub changes line endings of Unix code, hence why we need `dos2unix`). If you do not have dos2unix, run:
```
sudo apt-get update
sudo apt-get install dos2unix
```

If you got an error like `sudo: n: command not found` after `bash startup.sh`, run: `sudo npm install n -g` and then try again.

## To start

Restify can easily be started. To start the app:
```
bash run.sh
```
The app may take a few seconds to startup both the frontend and backend.

The web app will automatically open on your browser, and can be found at http://localhost:3000/

New users and houses should persist through app usage.

## To stop

To stop Restify, in any new terminal (can be Windows, Linux, Mac, etc.), simply run:
```
bash kill.sh
```
The app may take a few seconds to shutdown both the frontend and backend.

Note: If you simply close the original terminal from `run.sh`, the backend will stop but the frontend service (http://localhost:3000/) will continue to run in the background.
