---
title: "Self-Review: Audio Player in Js"
description: "Git Best Practices for a Responsible Engineer"
date: 2022-11-27
type: "post"
draft: true
slug: "audio-player-code-review"
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

# Self Review #1: Audio Player lib in JS

> This is the first post in an ongoing series of Self-Code-Review. Where I pick _subjectively_ unique and interesting modules, in different projects, architectures, and languages.

> It’s not always the code that matters, it’s the critiques and observations that we will learn most from.

I know you guys have a tendency to skip through the whole thing only looking for the text in a monospace typeface _(Don’t deny it)_ so I’ve something just for you: A collapsible text that you only have to read if you think it’s starting to get interesting.

<details>
  <summary>What is this? What am I doing here?</summary>
    <p>
        We all have this moment when we look back at older code, take some time to remember that it was us who wrote it, and then feel happy that we can now tell how horrible it is, and how we could improve it now, just to loath it again 6 months in the future.
    <p>
        This is basically it: In every post in this series I’ll provide a mix of a guide on how to build a certain feature/component. And then iterate on it pinpointing what could be better, what could be added, and why some things need to remain the way they are.
    </p>
</details>

## Audio-Player Library

We finally made it here! We want to make a reusable, typical audio player API that we can later use in many contexts be it user interaction or a response to an app event…etc.

We need to define some core functionality that should exist in a standard audio layer:

- play audio _(Oh my goodness, gracious me!)_
- pause audio
- resume audio
- stop audio
- play multiple audio(_s?_)
- repeat/ loop

And to be more realistic we need some way to know what’s actually going on, they call that event listeners:

- onPlay
- onTimeUpdate
- onPause
- onStop

---

## Making some noise

Like a good API, ours shouldn’t make assumptions about who is using it. It shouldn’t matter if it’s a react component or the man sitting inside your TV.

<details>
    <summary>Just hook into an <code>audio</code> tag mate! <i>(you think?)</i></summary>
    <p>We can’t rely on UI (or in this case the <code>DOM</code>) to make our native audio player (even though we can totally do it this way). It’d be much better if our code is self-sufficient and reusable in many scenarios.</p>
</details>

```js
let player = new Audio();
```

Luckily for us, we have a native `Audio` API in Js that we can ~~ab~~use. It gives us primitives that we can build upon much more sophisticated functionalities.

Let’s start simple and `play`

```js
export const play = (url) => {
  stop();
  player.src = url;
  player.play();
};
```

<details>
    <summary>We made some bold decisions here!</summary>
    <p>First we accept the audio to play in the form of a <code>url string</code>. One would think that's not the most future proof choice to make; A wrapper object of sorts that encapsulates the format of audio file to play would be better and can be easier to tweak in the future.</p>
    <p>A counter argument would be that's not very likely that in the context of the project this was built in, it was highly unlikely that this api will be going to do more. Future proofing is always good, but realism and time constrains should always govern all decisions.</p>
    <p>Personally? I think it's not that complex or lengthy to implement a wrapper for our audio.</p>
    <p>We also added a call to <code>stop()</code>! Why? It's the cheap way of running things in order. What is <code>stop()</code>? Glad you asked!</p>
</details>

```js
export const stop = () => {
  player.pause();
  player.currentTime = 0;
};
```

Yes, it's like manually adjusting your tape player.

How can we improve this? I think a sharp **STOP** isn't exactly polite and not what you want to hear, it'd be sweet to add some fading effect. But yeah, total perfectionism.

Two core functionalities remain:

```js
export const resume = () => {
  player.play();
};

export const pause = () => {
  player.pause();
};
```

<details>
    <summary>Now we're ready to discuss a bigger design choice: Why is it all just functions?</summary>
    <p>It's not a paradigm war, if you put this code inside a class, you'll probably instantiate one object to use in your app. For some folk this is known as a <code>static class</code>. And this is just another fancy word for redundancy.</p>
</details>

---

## Event Dispatchers
This is my `onPlay`

```js
export const onPlay = (action) => {
  const cb = () => {
    action(player.src);
  };
  player.addEventListener("play", cb);
  return () => player.removeEventListener("play", cb);
};
```

Simple as it is, it gives the user a way out by returning a function that unsubscribes from the event.

The same applies to other event dispatchers

```js
export const onTimeUpdate = (action) => {
  const cb = () => {
    action(player.src, player.currentTime);
  };
  player.addEventListener("timeupdate", cb);
  return () => player.removeEventListener("timeupdate", cb);
};

export const onPause = (action) => {
  const cb = () => {
    action(player.src);
  };
  player.addEventListener("pause", cb);
  return () => player.removeEventListener("pause", cb);
};

export const onStop = (action) => {
  const cb = () => {
    action(player.src);
  };
  player.addEventListener("ended", cb);
  return () => player.removeEventListener("ended", cb);
};
```

---

## A playlist

Our lib now is good at playing one audio at a time, this is good. It's also useless TBH. How can we make that happen using the primitives we originally had and the ones we created?

We know we don't have a way to add multiple sources to our player, so we have to make our own way of queuing these audio sources
``` js
let queue = [];
```
This simple `queue` holds our audio urls. We can now play one audio after the other as soon as it's finished playing. We have a way to know if an audio is started or stopped. We'll definitely take advantage of that
``` js
const next = () => playlist(queue, false);
```
``` js
export const playlist = (
  urls,
  clear = false,
) => {
  if (clear) {
    queue = [];
    queue.push(...urls);
  }
  if (queue.length !== 0) {
    const upcoming = queue.shift();
    player.src = upcoming;
    player.removeEventListener("ended", next);
    player.addEventListener("ended", next);
    player.play();
  } else {
    player.removeEventListener("ended", next);
  }
};
```
Because we don't have control over when the audio ends (we can't always end it our selves), we can't iterate on the queue and play its contents one by one. So we have to use recursion _(always exciting, isn't it?)_

We first declared a `next()` function that calls `playlist()` again when the `ended` event fires. And we stop doing that when the queue is empty.

We also added the option to start a new playlist by providing a `clear` flag. Neat!

### How to loop?
At first, we could just add another flag and call it a day, but it becomes more complicated
``` js
export const playlist = (
  urls,
  clear = false,
  loop = false,
)
```
Our `next()` now has to support this flag as well but wait! What's it gonna be? `true`? to always loop, or `false`? It can't be `false` though otherwise we'd not have implemented it in the first place.

Here is the part of code that reminds you that nothing can be perfect. You add a hack to support a false sense of dynamic setting of the `loop` flag
``` js
const next = () => playlist(queue, false, false);
const nextLoop = () => playlist(queue, false, true);
```
We'll have to update our logic to fit the new hacky `nextLoop()`
``` js
  if (queue.length !== 0) {
    const upcoming = queue.shift();
    if (loop) {
      queue.push(upcoming);
    }
    player.src = upcoming;
    player.removeEventListener("ended", loop ? nextLoop : next);
    player.addEventListener("ended", loop ? nextLoop : next);
    player.play();
  } else {
    player.removeEventListener("ended", loop ? nextLoop : next);
  }
```

Yep, it lost its beauty. I won't even comment on the `loop ? nextLoop : next` part. You know what's wrong with it and how to improve it.

But it's not even done yet! We still need a way to notify the caller when each audio in the playlist is about to be played. We'll have to accept a callback to do that
``` js
const onPlayNext = (url) => ({});
```
``` js
export const playlist = (
  urls,
  clear = false,
  loop = false,
  onNext = onPlayNext
)
```
And in the function body we modified it a little
``` js
player.play();
queue.length && onNext(upcoming); // readability: 0
```

What saddens me most is that Javascript acts weird when you use default arguments in your functions; Even though we added a default callback in case the user doesn't want to use this feature, this has an effect of permanently calling the default value even if the user supplied their own! _Classic JavaScript eh?_
``` js
let onPlayNext = (url) => ({});
```
``` js
export const playlist = (
  urls,
  clear = false,
  loop = false,
  onNext = onPlayNext
) => {
  onPlayNext = onNext;
  // ...
}
```

<details>
    <summary>This is the ugly fix in case you're wondering. But it brings problems of its own</summary>
    <p>You're now playing with globals that can very easily interleave. Yes I know Js is single-threaded but it's possible to have all sorts of fun race conditions when using the event loop. We'll tap on that later.</p>
</details>

I'll have to ask you to remember that we also have a `play()` function that plays singular audio. It was calling `stop()` before and that was nice. But now that we introduced `playlist()`, our `stop()` won't be as powerful. We have to _reset_ the playlist whenever we call `stop()` just in case it was playing.

We can make life easier for us by adding a `clear()` function that.._clears_
``` js
export const clear = () => {
  queue = [];
  player.removeEventListener("ended", next);
};
```
When we `clear()` the queue, it's pretty clear _(no pun intended)_ that we lost interest in the current queue or audio. We no longer need to play the next audio because there isn't one. that's why we removed the `ended` listener. Now our `stop()` can look like this
``` js
export const stop = () => {
  player.pause();
  player.currentTime = 0;
  clear();
};
```

---

## Afterthoughts
You now reached the state I was in when I first worked on that project. But you much better of its pitfalls and why it is the way it is now. We can now briefly talk improvements:

- This can be safer by declaring the APIs as `async`. Sure it'll introduce complexity but can provide safe access to state
- `loop` shouldn't be a luggage to carry, it can be better represented as a state
- insert yours here!

---

__Ps__: Full code can be found on [GitHub](https://github.com/mhashim6/self-review/tree/audio-player/audio-player)

