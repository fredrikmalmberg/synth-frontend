# synth-frontend
This project aims to supply a light weight frontend to FluidPatcher (https://github.com/albedozero/fluidpatcher).

## Intro
FluidPatcher is a great way to setup an Rasberry Pi to run as a software synth and relies on performance patches that you create beforehand and switch between if you perform live. For my purposes I used it as a software synth where I wanted to be able to easily switch between different soundofonts without spending a lot of time creating performance patches beforehand. As the RPI lacks a display this is not ideal as you don't know which bank is selected and which patch of that bank is currently running. 
This solution consists of two parts:

1. A modified version of headlesspi.py which is what runs the synth on the RPI
2. A very light Vue based frontend that you need to run on the RPI. 

## Project setup

### Setup for the synth:
Step 1: Setup the RPI according to the instructions found at: https://github.com/albedozero/fluidpatcher
Step 2: Replace headlesspi.py with the version from the fluidpatcher_mod directory in this repo 
Step 3: Restart the RPI
Step 4: Make sure the synth produces sound when used with you midi controller (refer to https://github.com/albedozero/fluidpatcher for troubleshooting this part)
Step 5: Find out the IP of your RPI and test to see if you can communicate with the API 
```
curl -v <IP goes here>:5000/api/
```
It should return something like:
```
[[[1,". Abbey-Steinway"],[2,". UprightPianoKW"]],["Good GM.yaml","Pianos-Lite.yaml","Rhodes.yaml","bank2.yaml"],0,"Pianos-Lite.yaml",6]
```
### Setup for the frontend:
Step 1: Copy all the files from the dist folder in this repo to a location on your RPI
Step 2: Serve that directory as a website using any webserver you like. The easiest solution is to use the built in python server which works ok as this is not a production website we are building. Make sure this starts every time the RPI is rebooted.
```sudo python -m http.server 8000```

Now you should be able to access the frontend using your phone or other device at <IP goes here>:8000

<img src="https://user-images.githubusercontent.com/25374765/215740044-98b1b68b-c5f8-4aa1-8291-2b7342bfd438.png" alt="Screenshot" width="300"/>

