---
title: "The Responsible Git User"
description: "Git Best Practices for a Responsible Engineer"
date: 2022-11-15
type: "post"
draft: false
slug: "responsible-git-user-guide"
image: "/images/rgu.png"
# caption: "Draft"
categories:
- Tech
- Guide
tags:
- Git
- Best Practices
- Open-Source
- GitHub
- GitFlow
- Trunk Based Development
---

# Who is this for _(whom?)_
It doesn’t matter if you don’t know Git that well, or if you already are an expert on Git and you know your way around and how to tackle the daily awkward situations of reverting a rebase, resolving a conflict _(in the workplace)_, or dragging a teammate in the little whoopsie you made in your (was-once-local) branch.

It also doesn’t matter if you’re pro GitFlow or in favour of trunk-based stuff. This is about how to be a **R**esponsible **G**it **U**ser. Or in short, how to _**RGU**_ _(see what I did there?)_

## Micro commits
> Because no one wants to deal with a dump _(of anything)_.

You see, a well-behaved Git user won’t dump a truckload worth of changes in one single commit. You see, managing a whole dump is never fun; dumps are made to stay the way they are: dumps.

The only transformation you can apply to a dump is to either shape it into a smelly cube to later stack it in a rather symmetric-looking bigger dump, or if you’re a bit flexible you’d typically burn it and pretend it never was. Because no one wants to deal with a dump _(of anything)_.

Instead of putting all your heart in one big concentrated dose and having it broken in the end, make gradual steps to give yourself _(and your ~~loved ones~~ teammates)_ a space to reflect, assess and change.

## Scoped/ Contextual Commits
Okay, now your commits are smaller and easier to manage and review… Wait! At what cost?
Did you make one commit per file? Our goal was not to replace the dump with a chunk of smaller-in-size meaningless dumps; actually, the original dump was easier to manage believe it or not.

> It’s hardly big of a change, and it’s well-scoped and makes sense on its own.

You should instead put more effort into selecting what parts/ files to include in your commit before creating it. For example, You created functionality that relies on some random factor like time.

Now as a responsible engineer you probably created the logic that provides this random factor and wrote some tests for it. Now it’d make sense to include this random function in its own commit; It’s hardly big of a change, and it’s well-scoped and makes sense on its own.

## Valid/ Sane Commits 
Doing better already! But _bro does it even build?_
Remember our last example? Of course you do I was just trying to patronise you _(and it seems to be working, eh?)_ We had two components: A component that merely exists to make my point, and a random-time-function-thingy. Each with their tests of course as a responsible engineer. 

> You’ve produced a history that doesn’t even compile!

Now, what files would you commit first? The random thingy _(with its tests)_ or the fake component _(with its tests)_ that depends on the random thingy? If you commit the component without its dependency then you’ve produced a history that doesn’t even compile! Have we not had enough of that already?

You should always try your best to have a valid and sane history tree; this immensely helps with recovery, traceability, and stability. It’s also basic CI so you get to flex about the buzzwords with your mates!

## Self-explanatory Commits that summarise what they do

## It’s not supposed to be write-only
You’d be amazed to see how many hours one can spend reading a Git history to find when something was done. Now you’ll shout at me: _just use `blame` bro!_ But I’m afraid sometimes even blame can’t do any good with long, and corrupt histories _(Yes I’m very pleased with myself right now)_.

But if you’re a Responsible Git User and you’re investing time in your commits and thinking of them in the grand scheme of things (basically other teammates playing their role in your common history). The history tree will be much simpler and cleaner to the degree that you might be able to blame each other (in corporate) again! Yay!

## Historic Timeline

> Minor details should be there only if you look for them.

You finally get the chance to write History! _(I know enough of this joke already it wasn’t even this funny)_ But what do you write? everything? or EVERYTHING? or important, notable things?

I’m sure many throughout History have sneezed but I bet you were not told that about any famous character in history class.
Not every single detail needs to be available at first sight. Minor details should be there only if you look for them, leaving  space for major events and changes.

Using the previous example one last time, once you’re done with the fake component (and its tests) and you’re ready to add it to the main tree, take a pause, think about this change in a slightly higher-level context and squash the closely related commits into a slightly bigger commit. 

This way the main tree is not flooded with micro commits that served their purpose long ago, and yet you preserved the dozen commits that highlight the major event that you induced. Lovely!

---
Do you know better ways to **_RGU_**? let’s argue in the comments! _(sorry one last time)_.
