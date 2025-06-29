---
title: SendMeYourIP.com
pubDate: 2025-06-29
description: 'Trying out Phoenix + LiveView for a toy project'
tags: ["phoenix", "elixir", "toy software"]
---

If you've ever needed to look up your own IP address, you'll know that there is no shortage of websites that can tell you. Heck, even the [search](https://duckduckgo.com/?q=what+is+my+ip) [engines](https://www.google.com/search?q=what+is+my+ip) [themselves](https://search.yahoo.com/search?p=what+is+my+ip) will tell you your IP address when you ask. (Although you might need to scroll past the sponsored and AI results first...)

What I couldn't find was a tool to help me ask for _someone else's_ IP address.

# Why did I need someone else's IP?

No, I'm not a stalker or a hacker. I was just trying to add my parents' home IPs to the allowlist for my SMTP relay server so they could use the "Scan to Email" feature of their all-in-one printer. Yes... they use an all-in-one printer from a global brand; for the most part it just works, and being non-technical people, I'm not going to argue with them on that front.

# What's wrong with existing tools?

As I mentioned, my parents aren't techies. I initially texted my dad a link to one of the many existing sites, but after loading the page, he used his browser's share button to share a link back to the homepage with me. He didn't know what part of the page he should be copy/pasting since it's just a bunch of seemingly random numbers and letters, so we finally settled on sharing a screenshot of the results page.

# Toy project time?

[Writing Toy Software Is A Joy](https://blog.jsbarretto.com/post/software-is-joy). For a long time I've been looking for a toy project idea to play around with Elixir and the Phoenix framework. The idea had finally arrived.

This problem, which is likely unique to me, seemed like the perfect candidate because it could be completed in a weekend and had a feature that could justify using Phoenix LiveView.

# The Goal

A site that lets you generate a temporary, unique link that, when viewed and approved by another person, shows you their IP.

# The Result

https://www.sendmeyourip.com

<p>
  <a href="https://www.sendmeyourip.com">
    <img src="/static/send-me-your-ip/homepage-screenshot.png" alt="screenshot of the sendmeyourip.com homepage" style="border: 1px solid #333; padding: 1rem;" />
  </a>
</p>

# Learnings

One of the things I love about toy projects that take you out of your comfort zone is the sheer amount of random things you learn in the process. I'll be posting a few [Tidbits](/introducing-tidbits/) about some of these later:

1. [Testing logging ~in Elixir~ can be tricky](/tidbits/exunit-log-level-macro/)
2. Docker support for IPv6 is "odd". (By default it runs a userland proxy that accepts the IPv6 connection and proxies to your container over IPv4, dropping any hint of the original connecting IP)
3. Cloudflare doesn't support _proxied_ IPv6-only subdomains even if you only have a `AAAA` record. (Cloudflare still accepts IPv4 connections on the subdomain. Enabling `DNS Only` is the workaround)

These are just a couple examples of how I've come to better understand the limitations and inner workings of the tools I use every day.
