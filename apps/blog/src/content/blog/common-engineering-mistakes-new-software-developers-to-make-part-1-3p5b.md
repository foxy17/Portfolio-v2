---
title: "Common Engineering mistakes new Software developers to make: Part-1"
description: "As new software developers, people tend to think of themselves just as a developer and often forget..."
pubDate: "2022-08-06"
updatedDate: "2022-08-10"
heroImage: "/images/blog/devto/common-engineering-mistakes-new-software-developers-to-make-part-1-3p5b/cover.webp"
tags: ["beginners", "career", "programming"]
category: "engineering"
---

> Originally published on [Dev.to](https://dev.to/foxy17/common-engineering-mistakes-new-software-developers-to-make-part-1-3p5b).

As new software developers, people tend to think of themselves just as a developer and often forget about the engineering aspect of their profession. Software development involves writing and understand code to build a software. Software engineering means using engineering concepts to develop software that is scalable, extensible, and maintainable in long run.

Many software engineers especially the ones who have just started with development often focus solely on the development problem and thus their software is rarely scalable or maintainable in long run. A lot of developers have a tough time understanding their own code which they would have written a month back which does not scale well when they start working in a team. In a team often others stumble upon your code when they have to use it or refactor it. It would be a big hassle if you have to explain what you have written to someone new every time such a situation arises. Thus when working in a team with senior engineers who review your code new developers often end up with multiple comments and requested changes on their review. Trust me I have been there, my PR once had around 40+ comments on GitHub when I was doing my first internship.
![My first PR as an inter](/images/blog/devto/common-engineering-mistakes-new-software-developers-to-make-part-1-3p5b/image-1.png)

So far I have worked in multiple early stage startups and done few freelancing gigs and have seen many new developers struggle with few points that I will share. I recommend developers to read the book **Clean Code : Robert C Martin** as it's more approachable, especially for new developers.

## Mistake 1 - Most widespread mistake
**Poorly naming variables, functions, or any such identifiers.**

> Inevitably, code comments become lies over time. In practice, few people update comments when things change. Strive to make your code readable and self-documenting through good naming practices and known programming style.
[Source](https://opensource.com/article/17/5/30-best-practices-software-development-and-testing)

I cannot stress this enough but name your variables according to what they are being used for. I have seen some people using variable names like -

```
var a , final c, const b
```

this is not at all scalable when you work in a team. For example, suppose you have written a function that doubles a number only if it is a multiple of 3. There are two ways to name the function.

```
function double(num){//code to double multiple of 3}

function doubleMultipleOfThree(num){//code to double multiple of 3}
```

Suppose someone in your team has used the first function name and you come across a code block where it is used while debugging the code.

```
if(number > 0) double(number);
```
You would expect the end result of this line to be double of whatever number is passed. But then you run it , the end result is not the same. So then you would have to go to the function body of double and read the whole function to understand what it does. This increases the time and effort for debugging/refactoring the code.

Supposed if the function name would have been `doubleMultipleOfThree` you would have easily figured out by the name itself what the function does and would not have to go to the function definition to understand it. Same principle applies to naming variables in your code.

## Mistake 2 - Not understand GIT

Two main advantages of using Git at software development:

1. Tracking the changes and updates. We are able to see who made which changes. Git also provides when and why a change was made.
 
2. Allowing to work collaboratively. Software development projects usually require many people to work together. Git provides the developers with a systematic way of doing that. Thus, the developers focus on the project instead of extensive communication sessions between the other developers.

Most of the people are proficient with using GIT to achieve the first point, they can push, pull, commit and create a branch. This works fine when you are working alone, but when working in teams there are bunch of other commands and concepts that are used.

- Since in teams many people are working on the same code there may be cases that changes in same files are made by two people. Which create merge conflicts. 
- Sometimes you may need to rebase a branch instead of merging to it to keep the GIT history clean. 
- You may need to stash your changes so that you can quicky switch to other branch without losing your changes.

These are few of the many scenarios that happen in team. So one need to have at least basic understanding of commands like :- 

1. Rebase 
2. Stash
3. Merge
4. Status 
5. Log
6. Diff
7. Revert

These are the ones I can list but there are many more commands that a developer should know the functionality of even if they don't remember the syntax or arguments for them. Its even better if you understand how GIT branching works and how commands like merge and rebase affect it.
