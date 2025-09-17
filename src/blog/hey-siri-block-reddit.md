---
title: "Hey Siri. Block Reddit."
description: "Configuring NextDNS with HomeKit via Homebridge"
pubDate: 2025-09-16
tags: ["homebridge", "nextdns"]
---

![Screenshot of Apple Home app with Reddit block switch](/static/hey-siri-block-reddit/reddit-block.png)

> **tl;dr:** I made a Homebridge plugin for NextDNS that creates virtual switches to toggle denylist entries.
>
> [Jump to Getting Started](#getting-started)

# The Problem

I recently noticed that I had been wasting lots of time mindlessly browsing Reddit during the day and was looking for a way to block it. I already point all of my devices to NextDNS for DNS level ad-blocking and figured I could use it to curb my Reddit habit as well. NextDNS makes this easy by allowing you to add specific domains to a "denylist", resulting in DNS queries for those domains to return as non-existent.

The problem is: **I'm lazy**... and toggling those rules through the NextDNS dashboard takes a few clicks. When I genuinely need to access Reddit, I don’t want the hassle of logging in and clicking around.

My laziness led me to a fun weekend project: a Homebridge plugin for NextDNS that lets me enable and disable blocked domains using Siri or the Apple Home app. The result is [homebridge-nextdns](https://www.npmjs.com/package/homebridge-nextdns).

# The Solution

[Homebridge](https://www.homebridge.io) is an open-source platform that allows you to integrate a wide variety of non-HomeKit devices and services into Apple’s HomeKit ecosystem. With this plugin installed, you can expose specific domains in your NextDNS configuration as virtual switches in HomeKit.

For example, I keep Reddit blocked by default. The plugin gives me a HomeKit switch called "Reddit Block" and when it’s toggled on, Reddit is blocked. When I toggle it off, Reddit is unblocked again. That means I can simply say, "Hey Siri, turn on Reddit block" and it just works. (To really get the title of this post to work, you'd have to set up a shortcut that listens for "Unblock Reddit" that toggles the switch).

# Getting started

If you already run Homebridge you can search for `nextdns` in the Plugin section of the UI or run `npm install -g homebridge-nextdns`.

Configuration requires 3 items:

1. Your NextDNS API Key which can be obtained at the bottom of: https://my.nextdns.io/account
2. Your NextDNS profile ID that you want to configure via HomeKit. This is found in the URL when viewing one of your profiles: https://my.nextdns.io/IDHERE/setup
3. A list of domains you want quick toggles for.

For more information here are links to the repo and npm page:

* GitHub repository: [https://github.com/jtokoph/homebridge-nextdns](https://github.com/jtokoph/homebridge-nextdns)
* npm package: [https://www.npmjs.com/package/homebridge-nextdns](https://www.npmjs.com/package/homebridge-nextdns)

# Final thoughts

This project started as a personal experiment and as a bit of a joke, but I suspect others who use NextDNS for productivity, parenting, or network management might find it useful too. If you’re looking for a way to integrate NextDNS domain control into HomeKit, give [homebridge-nextdns](https://www.npmjs.com/package/homebridge-nextdns) a try.

Feedback and contributions are welcome on GitHub.
