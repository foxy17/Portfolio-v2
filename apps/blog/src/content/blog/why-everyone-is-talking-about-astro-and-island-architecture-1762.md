---
title: "Why everyone is talking about Astro and island Architecture? 🚀"
description: "If you love exploring different technologies in the web development ocean I am sure Astro must have..."
pubDate: "2022-08-18"
updatedDate: "2022-09-08"
heroImage: "/images/blog/devto/why-everyone-is-talking-about-astro-and-island-architecture-1762/cover.webp"
tags: ["webdev", "javascript", "astro", "nextjs"]
category: "engineering"
---

> Originally published on [Dev.to](https://dev.to/foxy17/why-everyone-is-talking-about-astro-and-island-architecture-1762).

If you love exploring different technologies in the web development ocean I am sure **Astro** must have been popping up a lot in your feed since few months. Astro's V1.0 got launched recently and a lot of people are testing out its capabilities by migrating their blogs or portfolio sites to Astro. 

But there are so frameworks that offer good SEO and lighthouse score so why are people still so hyped up about Astro. Well how would you react if someone told you that you can ship your simple website with zero JavaScript. When I heard this I was blown away but also had many doubts since there are scenarios where I need JavaScript and scenarios where loading JavaScript in a static pages just slows down the site.  

To understand more about this lets deep dive into what Astro does differently than Next.js one of the widely used framework for static site generation.

## Astro is a meta framework 🚀
Unlike other frameworks like Gatsby or Next.js which are built on top of React , you can use components from React, Vue, Svelte and Solid.js directly in Astro. This makes it easy to migrate to Astro when you already have components written in this frameworks.

## Zero JavaScript for static pages

If you load a statically generated Next.js site which does not required any JavaScript based interaction you will still see that in the network tab your browser still loads many JavaScript file that are required by the framework as you can see in the image below.

![JavaScript Files Loaded](/images/blog/devto/why-everyone-is-talking-about-astro-and-island-architecture-1762/image-1.png)
 
The main problem with this is that most of the time the JavaScript being loaded is not actually being used. You can see that almost 50% of my JavaScript is unused on my [portfolio website ](https://www.carnav.in/) which is made using Next.js.

![Unused Javascript](/images/blog/devto/why-everyone-is-talking-about-astro-and-island-architecture-1762/image-2.png)

Now one may argue that this can be minimized by using suspense and lazy loading but even after using those techniques that JavaScript is still loaded later which is not required at all.

**Astro**⚡ by default ships zero JavaScript to the browser. To achieve this Astro renders HTML on the server and strips away any remaining, unused JavaScript. This decreases the sites [Time to interactive](https://web.dev/interactive/) resulting in faster load time for content based websites. Here is one example of the decrease in size by using Astro
{% twitter 1437195415439360003%}

## How does Astro 🐱‍🚀 achieve this? 

We all know that Next.js also uses static site generation just like Astro but still ships with JavaScript so how does Astro manager to ship zero JavaScript. Unlike Next.js which still keeps JavaScript in the HTML statically rendered. Astro strips all of the JavaScript. Next.js requires JavaScript since it runs on top of React and creates a Single Page Application that means JavaScript is loaded every time when the page changes. On the other hand Astro render a Multiple Page Application that means each route in your Astro site is a different HTML page with only static HTML and CSS.

But what if we required JavaScript like in a search bar or image carousel.

This is done by a technique called **[Partial Hydration](https://docs.astro.build/en/concepts/islands/#concept-partial-hydration)** 🐳. Astro allows you to ship JavaScript explicitly only for those components which you want to run in the browser. Astro lets you hydrate only the required individual component without interrupting the rest of the static site. Other SSG frameworks like Gatsby and Next.js do not this feature as they consider your entire website as a single JavaScript application.

## Island Architecture in Astro 🏝️

Astro uses the idea of Island structure, which is about building entire websites using partial hydration. In frameworks like Next.js a website is built into client-side rendered Html, CSS and JavaScript bundles which are then shipped to the user. In **island architecture** static HTML pages are rendered on the server and  slots/placeholders are added around highly dynamic areas for interactivity. These slots contain server-rendered HTML output from the corresponding widgets, which are then hydrated on demand at the client side. 

![Astro Arch](/images/blog/devto/why-everyone-is-talking-about-astro-and-island-architecture-1762/image-3.png) 

> Source: [Astro Docs](https://docs.astro.build/en/concepts/islands/)

This pattern isolates each page into separate small islands, any performance issue in one islands won’t cause any direct impact upon other units and also ensures that  faster faster loading and rendering of lightweight components individually without being barred by other heavier components are loaded individually without being barred by other heavier components.

## Conclusion

Combination of all the features listed above make Astro a good choice for sites which have a lot of static content like  marketing sites, publishing sites, documentation sites and blogs.
