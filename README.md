# Pulse and ECG Monitoring System

This project enables users to measure their heart rate through a wearable bracelet and view these measurements in real-time on a dedicated website. It allows users to monitor their pulse rate and ECG data in real-time, providing a comprehensive overview of their cardiovascular health.

## Project Status

**NOTE:** This project is currently under development. Some features may not be fully implemented or may be subject to change. We appreciate your patience and interest in this project!

## Features

- **Heart Rate Measurement:** Users can measure their heart rate using a bracelet.
- **ECG Data Visualization:** Users can view their ECG data in real-time on the website.
- **Real-Time Reporting:** The system reports heart rate and ECG data through graphs.
- **User Accounts:** Users can log in with their accounts to ensure the privacy and security of their data.
- **Mobile Integration:** The system integrates with mobile devices (Android or iOS) via Bluetooth to transmit heart rate and ECG data from the bracelet to the system through an API.

## How to Use?

1. **Set Up Your Bracelet:** Wear your bracelet and make sure it's configured to work with our project.
2. **Register on the Website:** Visit our system's website and create a user account.
3. **Log In and View Your Data:** Log in with your account to view your heart rate and ECG data in real-time.

## Technical Details

This project utilizes bracelets to collect heart rate and ECG data. The data is transmitted via Bluetooth to a mobile app or directly to a web application. The web application provides an interface for users to view their data.

- **Backend:** Node.js, Express.js
- **Frontend:** Html, Css, Javascript, AngularJS
- **Database:** MongoDB

## Before Installation

Before running the project on your local machine, you need to configure the `config.js` file according to your environment settings.

- Navigate to the root directory of the project.
- Locate the `config.js` file.
- Open `config.js` with your favorite text editor.
- Edit the file to match your local or production environment settings.

## Installation

Follow these steps to run the project on your local machine:

```bash
git clone https://github.com/omerkurgun/KurgunHearthMonitorV2.git
cd Web
npm install
npm run sendMailConsumer
npm run start
