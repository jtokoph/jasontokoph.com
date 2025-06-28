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
const users = document.querySelectorAll(".hnuser");

// Grab the name from the first one (OP)
const opName = users[0].innerText;

users.forEach((user) => {
	// Update any matching names with the custom style
	if (user.innerText === opName) {
		user.style.color = "#ff6600";
		user.style.fontWeight = "bold";
		user.style.textDecoration = "underline";
		user.innerText = `(OP) ${user.innerText}`;
	}
});
