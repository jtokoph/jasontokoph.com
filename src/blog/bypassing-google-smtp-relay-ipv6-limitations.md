---
title: Bypassing Google SMTP Relay IPv6 Limitations
pubDate: 2025-07-06
description: 'Support /64 blocks with an intermediate SMTP relay'
tags: ["email"]
---

> **tl;dr:** Google’s SMTP relay doesn’t allow /64 IPv6 blocks. I worked around it by routing mail through my own Postfix relay with a Docker container on an allowlisted VPS.
>
> [Jump to docker-compose.yml](#docker-compose-yml)

# The Problem

I'm a user of Google Workspace (fka G-Suite) for my personal domains and wanted to be able to send SMTP-based notification emails from various parts of my home-lab/"smart" devices using Google's SMTP servers.

There are a couple ways you can do this:

1. Send emails via `smtp.gmail.com` using an email address and password.
2. Send emails via `smtp-relay.gmail.com`, [Google's relay service](https://support.google.com/a/answer/2956491), by allowlisting (i.e., explicitly permitting) IP ranges.

Number 1 was out of the question as I'm sure as hell not going to provide even an [app specific password](https://support.google.com/accounts/answer/185833) to any of these devices.

That left me with solution 2, which should have been quick and easy, but instead took me down a rabbit hole of IPv6 gotchas.

# Gotcha 1: Every device on my network has its own IPv6 address

I quickly discovered one of the many cool things about IPv6: many ISPs will assign your modem/router an entire `/64` block of IP space for your network. Each device gets its own globally routable IPv6 address, which means I can't just allowlist a single IPv6 address with the Google relay like I could with my mostly static public v4 address.

# Gotcha 2: Google doesn't support allowlisting a `/64`

![Google error message about IP range being too large](/static/bypassing-google-smtp-relay-ipv6-limitations/range-error.png)

When I tried adding my home's assigned IP range to the allowlist in the admin console, Google fired back with an error message:

> [!CAUTION]
> IP range cannot contain more than 65535 addresses.

Google's SMTP relay restricts allowlisted ranges to at most 65,535 addresses — likely to avoid abuse or misconfiguration. A `/64` in IPv6 contains 2<sup>64</sup> addresses (18 quintillion), which is clearly well beyond that.

Unfortunately, my home router doesn’t support manually assigning IPs from a smaller subnet, so I had to find another solution.

# Solution: My own intermediate relay

I've previously allowlisted one of my public server IPs with the Google relay, so I decided to run an intermediate relay on that server. The server has a single static v4 IP and a smaller, more manageable set of IPv6 addresses. This way, I can allowlist the server with Google, and then allowlist my home IP ranges there.

Fortunately, Juan Luis Baptiste [has provided](https://github.com/juanluisbaptiste/docker-postfix) a [docker image](https://hub.docker.com/r/juanluisbaptiste/postfix) with an easily configurable Postfix SMTP relay. Here's the minimal `docker-compose.yml` I used, with comments explaining each line:

##### docker-compose-yml

```yml {10-12}
services:
  smtp-relay:
    image: juanluisbaptiste/postfix:latest
    environment:
      # Point this relay to Google's smtp-relay
      SMTP_SERVER: 'smtp-relay.gmail.com'
      SMTP_PORT: '587'
      # This should be your Google Workspace domain
      SERVER_HOSTNAME: 'tokoph.net'
      # List of IP [ranges] that your relay will allow
      # The line that enables the /64!
      SMTP_NETWORKS: '2603:1234:abcd:5678::/64,123.45.67.89/32'

    # Use a special network configuration (see below)
    networks:
      - smtp-relay

    # Listen on port 25 externally
    ports:
      - 0.0.0.0:25:25
      - :::25:25

    # Restart with docker on server reboot
    restart: unless-stopped

# Make sure ipv6 is enabled
# Docker doesn't enable v6 by default
networks:
  smtp-relay:
    driver: bridge
    enable_ipv6: true
```

This setup has been working reliably for me, and it gives me full control over what devices can send mail. Plus, it sidesteps Google's IPv6 limitation without compromising on security. If you're running into similar issues, this might be the workaround you're looking for.
