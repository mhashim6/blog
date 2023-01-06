---
title: "React Props Injection - Self-Review #2"
description: "React Components Dynamic Props Injection"
date: 2023-01-06
type: "post"
draft: false
slug: "react-prop-injection-code-review"
image: "/images/self-review/self-review-2.png"
# caption: "Draft"
categories:
  - Self-Review-Series
  - Tech
  - Guide
tags:
  - React
  - React Native
  - React Props
  - cloneElement
  - Code-Review
---

> This is the second post in an [ongoing series](/categories/self-review-series/) of Self-Code-Review. Where I pick _subjectively_ unique and interesting modules, in different projects, architectures, and languages.

> It’s not always the code that matters, it’s the critiques and observations that we will learn most from.

<details>
  <summary>Note for ReactNative devs</summary>
    <p>
        I know you guys have a nice imagination otherwise you'd not have picked <code>jsx</code> to stare at most of your life. So I need you just to imagine that every <code>&lt;div&gt;</code> is just a <code>&lt;View&gt;</code> and go along with this. Nothing here is specific to <code>reactjs</code>. It's just React.
    </p>
</details>

## The Props distribution issue

You're a good React dev, you want to reuse as much of your components while still maintaining a standardised layouts and characteristics.

So you have multiple Pages/Screens in your app. They're mostly similar in layout but can still be a bit different to suit its needs. And that's the mark of the good designer on your team.

There're many ways to make individual screens maintain the overall app style while being unique. For instance, there could be some common components like a header or a footer; some common styling like a colour accent per screen that matches the overall colour platte of the app.

``` jsx
const Screen = ({themeColor, children}) => (
  <div>
    <Header themeColor/>
    {...children}
    <Footer themeColor/>
  </div>
);
```

But this screen should be composed of multiple types of components that have their own responsibilities. Not only that, these components are reused in other screens/ parts of the app.

``` jsx
const Landing = () => (
  <Screen themeColor="#EDE3D9">
    <DummyChild themeColor="#EDE3D9" />
    <AnotherDummyChild themeColor="#EDE3D9" />
  </Screen>
);

const Login = () => (
  <Screen themeColor="black">
    <DummyChild themeColor="black" />
    <AnotherDummyChild themeColor="black" />
  </Screen>
);
```

### You see the problem here?
How do I maintain the style characteristics of every screen and its children without coupling each screen to its children? In a realistic app you can have a lot more screens and even more children _(good for ya!)_ and not all screens share the same children. It's a mess.


## Enter Prop Injection
We need to dynamically pass props to children without having to writing them manually every time. We also don't want any children to assume which screen they're in; Children should be reusable in different screens. So our aim is close to this
``` jsx
const Screen = ({themeColor, children}) => (
  <div>
    <Header themeColor/>
    {...children themeColor}
    <Footer themeColor/>
  </div>
);

const Landing = () => (
  <Screen themeColor="#EDE3D9">
    <DummyChild />
    <AnotherDummyChild />
  </Screen>
);
```
This code unfortunately doesn't work (in this current form). But it already looks way cleaner and somewhat magical.

We can make it work though! Let's make a function that injects props to passed children
``` jsx
const inject = (props = {}, children) =>
    React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, props) : child
    );
```
Let's get `React.isValidElement(child)` out of the way, it's just for handling stuff like raw strings and it's there for sanity.

What `inject` does is quite simple: It takes some children _(the post will get me into much trouble)_ and dynamically injects the provided prop in each one of them before rendering them. And this is done by cloning the child _(Goodness 🤦🏻‍♂️)_ and injecting the new props.

I know you're probably thinking now _"Oh but this must be quite inefficient!"_. You're right to think so, but it's actually not correct. I'll tap on that later below, but first let's see how will this improve our code
``` jsx
const Screen = ({themeColor, children}) => (
  <div>
    <Header themeColor/>
    {inject({themeColor}, children)}
    <Footer themeColor/>
  </div>
);
```

As you can see, this is the working code for the pseudo `{...children themeColor}`. Now we can simply pass any child to a `Screen` and it'll dynamically inherit the property
```jsx
const Landing = () => (
  <Screen themeColor="#EDE3D9">
    <DummyChild />
    <AnotherDummyChild />
  </Screen>
);
```
Yep nothing changed. Pure magic.

## The Case for `React.cloneElement`
Well at first I was going through this path in an experimental mindset. When I found that's actually a good-enough solution, I started to seriously consider its viability.

Is `React.cloneElement` a resource hog? Well, to my surprise it isn't. I was digging for resources about it and I found out this whole experiment already has a term now in the react community and people had this [performance discussion](https://stackoverflow.com/questions/54922160/react-cloneelement-in-list-performance) already. In fact, some nice guy made a [benchmark](https://gist.github.com/nemoDreamer/21412b28dc65d51e2c5c8561a8f82ce1) for it. So yeah it's good.

---

## Afterthoughts
You now reached the state I was in when I first worked on that project. But you know much better of its pitfalls and why it is the way it is. Let's talk improvements in the comments!


__Ps__: Full code can be found on [GitHub](https://github.com/mhashim6/self-review/tree/main/react-prop-injection)

