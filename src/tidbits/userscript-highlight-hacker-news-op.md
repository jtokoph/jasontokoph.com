---
title: "Userscript: Highlight Hacker News OP"
pubDate: 2025-06-29
description: 'Userscript (tampermonkey) to highlight replies from original poster'
tags: ["javascript"]
---

My favorite posts on Hacker News (YC) tend to be "Show HN" posts, primarily because they are frequently small projects that solve a personal need of someone like me, but also because there is usually a good back and forth between the author and the community.

I wanted a quick way to highlight which comments had replies from the author and whipped up a short userscript that gets the job done.

```javascript
// ==UserScript==
// @name         Highlight HN OP
// @namespace    https://www.jasontokoph.com
// @version      2025-06-15
// @description  Highlight the username of the original poster on hacker news.
// @author       Jason Tokoph <jason@tokoph.net>
// @match        https://news.ycombinator.com/item*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        none
// ==/UserScript==

// Find all of the user links
const users = document.querySelectorAll('.hnuser');

// Grab the name from the first one (OP)
const opName = users[0].innerText

users.forEach(user => {
  // Update any matching names with the custom style
  if (user.innerText === opName) {
    user.style.color = '#ff6600';
    user.style.fontWeight = 'bold';
    user.style.textDecoration = 'underline';
    user.innerText = `(OP) ${user.innerText}`;
  }
});
```

# Example

[![Screenshot of a hacker news post with the username of the author highlighted](/static/userscript-highlight-hacker-news-op/screenshot.png)](/static/userscript-highlight-hacker-news-op/screenshot.png)

# Usage

- Install Tampermonkey for your browser: https://www.tampermonkey.net/
- Copy/paste the above code into a new userscript or click this install link: [highlight-hacker-news-op.user.js](/static/userscript-highlight-hacker-news-op/highlight-hacker-news-op.user.js)
