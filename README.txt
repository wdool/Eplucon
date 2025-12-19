Eplucon Heat Pump
=================

This app integrates Eplucon Ecoforest Heat Pumps with Homey.
It allows you to monitor temperatures, pressure, and energy consumption directly from your Homey dashboard.

Connect your heat pump by logging in with your Eplucon Portal credentials.
The app communicates locally with Homey Pro.

INSTALLATION & DEVELOPMENT GUIDE
================================

Prerequisites:
- Homey Pro (2016 - 2023 models)
- Computer with Node.js installed (https://nodejs.org)
- Command line interface (Terminal/PowerShell)

Step 1: Install Homey CLI
> npm install -g homey

Step 2: Log in to Homey
> homey login

Step 3: Setup Project (CRITICAL - DO NOT SKIP)
Navigate to the homey-app directory:
> cd /path/to/homey-app

Install dependencies BEFORE building:
> npm install

This installs node-fetch and other required packages.

Step 4: Build & Run Locally
Build the app:
> homey app build

Run it on your Homey for testing:
> homey app run

Step 5: Validation (Before Publishing)
Check if your app meets App Store requirements:
> homey app validate --level publish

Step 6: Publish to Homey App Store
Submit your app for review:
> homey app publish

TROUBLESHOOTING
===============

ERROR: "npm error missing: node-fetch@^2.6.7"
SOLUTION: You forgot Step 3. Run `npm install` in the homey-app folder, then try building again.

WARNING: "Could not find a Homey Compose app.json manifest"
This is normal and can be ignored. The build process handles it automatically.

ERROR: "Authentication failed" during pairing
Check your Eplucon Portal username and password are correct.

TIP: Use `homey app run` to see live logs and debug issues in real-time.
