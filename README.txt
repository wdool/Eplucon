Eplucon Heat Pump
=================

This app integrates Eplucon Ecoforest Heat Pumps with Homey.
It allows you to monitor temperatures, pressure, and energy consumption directly from your Homey dashboard.

Connect your heat pump by logging in with your Eplucon Portal credentials.
The app communicates locally with Homey Pro.

INSTALLATION GUIDE
==================

Prerequisites:
- Homey Pro (2016 - 2023 models)
- Computer with Node.js installed (https://nodejs.org)
- Command line interface (Terminal/PowerShell)

Step 1: Install Homey CLI
Run the following command in your terminal:
> npm install -g homey

Step 2: Log in to Homey
Connect your CLI to your Homey account:
> homey login

Step 3: Prepare the Project
Navigate to the project directory in your terminal:
> cd homey-app
Install the required dependencies:
> npm install

Step 4: Run the App
To install and run the app on your Homey Pro:
> homey app install

Step 5: Configure
1. Open the Homey App on your phone/tablet.
2. Go to Devices > + (Add) > Eplucon Heat Pump.
3. Select "Ecoforest Heat Pump".
4. Enter your Eplucon Portal credentials when prompted.

Troubleshooting:
- If you see "Authentication failed", check your username/password.
- Ensure your Homey Pro is online.
