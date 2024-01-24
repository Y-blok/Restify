#!/bin/bash

# Set the script to stop upon any error
set -e

backend=$(lsof -ti tcp:8000)
frontend=$(lsof -ti tcp:3000)
kill $backend
kill $frontend