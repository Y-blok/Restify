#!/bin/bash

# Set the script to stop upon any error
set -e

echo "SETUP BACKEND"
echo ""

# cd into proper directory
echo "Enter backend directory"
cd backend

# Setup the virtual environment
echo "Setup venv"
pip3 install virtualenv
virtualenv venv

echo "Activate venv"
source venv/bin/activate

# Setup for pillow installation
sudo apt-get install python3-dev python3-setuptools
sudo apt-get install libtiff5-dev libjpeg8-dev libopenjp2-7-dev zlib1g-dev \
    libfreetype6-dev liblcms2-dev libwebp-dev tcl8.6-dev tk8.6-dev python3-tk \
    libharfbuzz-dev libfribidi-dev libxcb1-dev

# Install Pillow
echo "Install Pillow"
pip3 install --upgrade pip
pip3 install --upgrade Pillow #--no-binary :all:

# Install Django
echo "Install Django"
pip3 install Django

# Install DjangoRestFramework
echo "Install DRF"
pip3 install djangorestframework

# Install simplejwt
echo "Install simplejwt"
pip3 install djangorestframework-simplejwt

echo "Insalling corsheaders"
pip3 install django-cors-headers

# Migrate the backend
echo "Migrating Database"
cd restify
./manage.py migrate


echo "SETUP FRONTEND" 
echo ""

echo "Install npm"
sudo apt install npm
sudo npm install n

echo "Install Node"
sudo n 16.3.0

echo "Install Packages"
cd ../../frontend
npm install