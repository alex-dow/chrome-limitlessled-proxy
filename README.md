# LimitlessLED Chrome App

A Chrome app that acts as a proxy between chrome extensions and a LimitlessLED-compatible wifi bridge. There are various brands that use the LimitlessLED protocol, the most popular of which is Milight.

Because Chrome extensions can not access the Chrome network stack, a Chrome application is a necessity. Chrome extensions can then send messages to the Chrome application to have it trigger commands on your lights.

## Installation

This software is currently in development and not available on the app store or deployed in a compiled state anywhere.

To install what exists now, you must first clone the repository and build it:

```
$ git clone https://github.com/alex-dow/chrome-limitlessled-proxy.git
$ cd chrome-limitlessled-proxy
$ npm install -g grunt-cli
$ npm install
$ grunt
```

Afterwords, visit chrome://extensions in your Chrome browser and enable developer mode. Once enabled, you will see a button labeled "Load unpacked extensions". Navigate to the directory where you checked out the project.

Once this reaches a stable state, I will attempt to make it available on the Chrome app store.

## Configuration

There is no available configuration at this time. Instead, before building the application, you can edit the file src/background/index.js and edit the MILIGHT_IP and MILIGHT_PORT variables.
