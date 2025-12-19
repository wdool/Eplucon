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

Step 3: Setup Project
Navigate to the directory:
> cd homey-app
Install dependencies:
> npm install

Step 4: Build & Run Locally
To build the app and run it on your Homey for testing:
> homey app build
> homey app run

Step 5: Validation (Before Publishing)
Check if your app meets App Store requirements:
> homey app validate --level publish

Step 6: Publish to Homey App Store
Submit your app for review:
> homey app publish

Troubleshooting:
- Use `homey app run` to see live logs in your terminal.
- If "Authentication failed", verify credentials in the pairing wizard.
