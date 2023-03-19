---
title: "FP and OOP are close siblings"
description: "OOP and FP are closer than what you think"
date: 2023-03-18
type: "post"
draft: false
image: "/images/fp-oop.png"
caption: image from iStock
categories:
  - Tech
  - Guide
tags:
  - OOP
  - FP
  - Function Currying
  - Closure
  - javascript
---

<iframe style="margin: auto;" width="100%" height="315px"
src="https://www.youtube.com/embed/m31rxlE4CfQ?autoplay=1">
</iframe>

The goal of this post is not to say that you can use both FP and OOP in harmony. Nor do I want to repeat the fact that a paradigm war is idiotic.

I'm here to tell you that FP and OOP are quite close and you can truly understand both if you got to learn a few things about the reasoning behind certain patterns in both worlds.

With this knowledge you can definitely combine the best of both worlds and appreciate the beauty of each "solution".

Yes, OOP and FP are both solutions to the same problem—How to better represent and solve complex problems in the Human world. And my main dish here will be: `Function Currying`.

You can think of this as an<strong>⁽*⁾</strong> _"FP for OOP developers"_ kind of post.

## You don't think you know it, but you actually use it everyday

<details>
  <summary>If you've never heard of Currying, expand to see a quick intro</summary>

A Curried function is basically a function that doesn't accept multiple parameters. Instead, each function takes a single parameter, if you need another, your function must return another "inner" function that accepts the second parameter and so on.

```js
// Typical function
const sum = (n1, n2, n3) => n1 + n2 + n3;

sum(1, 2, 3); // 6
```

```js
// Curried function
const sum = (n1) => (n2) => (n3) => n1 + n2 + n3;

sum(1)(2)(3); // 6
```

This doesn't look pretty, especially because js doesn't have syntactic sugar for currying. And I know it seems pretty stupid. But it's actually brilliant and you've used this same pattern in OOP, just with different semantics.

</details>

What can you achieve with currying? To answer this we'll have to talk about OOP _(bear with me)_. Before OOP, data was put in dummy bags. call it `structs`, `JSON Objects` or whatever, it's essentially a bag. In complex apps _(just like with life)_ abstraction hides away lots of complexity and makes us pay attention to the problem at hand.

To operate on such bags, we write functions that use values from this bag to produce another bag or a primitive value

```js
const user = {
  username: "mhashim6",
  firstName: "Muhammad",
  lastName: "Hashim",
  email: "msg at mhashim6.me",
};

const fullName = (user) => `${user.firstName} ${user.lastName}`;
```

Imagine having only these 2 language features to create your complex representations. How cumbersome and redundant would it be to <u>instantiate</u> multiple users and operate on them without **having globals everywhere** and worrying about which instance still lives and which is no longer needed.

Wouldn't it be much more intuitive to make these data bags **contextual** with their corresponding functionality implicitly tied to the context or the state of the data? This is partially why OOP was designed—to make objects contextual & less dumb. To abstract away most of the data bag content and have contextual actions (methods) instead, much like our real-world objects.

## Enter OOP

With OOP, you could combine data and functionality in an abstraction called `Object`

```js
class User {
  constructor(username, firstName, lastName, email) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  fullName = () => "${this.firstName} ${this.lastName}";
}
```

Notice here, `fullName` no longer receives a parameter; it's bound to a context (constructor parameters that are stored as fields). And each instance of the `User` Object has its own context and set of data fields.

This basic grouping was the first step towards an abstraction that can mimic most complex objects and behaviours without duplicating much of the code or having to carry the context (data fields) with you in every procedure call.

## What does this have to do with FP or Currying?

Everything! Currying is a way to define a long-term context in a function to be implicitly used in other closely-related functions.

Let's make up a problem and solve it to further demonstrate this

```js
class NumberScaler {
  constructor(value) {
    this.field = value;
  }

  scaledBy = (factor) => this.field * factor;
}

const five = new NumberScaler(5);
const fiveScaledBy2 = five.scaledBy(2); // 10
const fiveScaledBy14 = five.scaledBy(14); // 70
```

Here we created a `NumberScaler` Object with a value of `5`. We can now use this object <u>lazily</u> to make more operations on the initial value(s) we passed and thus augmenting the power of the data in the object.

Now imagine we want to do the same with just functions

```js
const numberScaler = (value, factor) => value * factor;

const fiveScaledBy2 = numberScaler(5, 2); // 10
const fiveScaledBy14 = numberScaler(5, 14); // 70
```

It's the same output but notice that we have to <u>eagerly</u> provide our context to the function every time we want to scale the number `5`. If this was a more complex example with many parameters to carry around it'd be hellish to pass them all every time, or to create adhoc bags to hold the parameters to operate on them.

In fact, the accurate OOP equivalent to what we did is

```js
class NumberScaler {
  constructor(value, factor) {
    this.field = value;
    this.factor = factor;
  }

  scaled = () => this.field * this.factor;
}

const fiveScaledBy2 = new NumberScaler(5, 2).scaled(); // 10
const fiveScaledBy14 = new NumberScaler(5, 14).scaled(); // 70
```

Can you spot the difference _(and the problem)_? We can no longer reuse parts of the logic in our object once we created it. We have to create a new one every time we want to scale a number. Which is not "wrong" in a general sense, but it's limiting and will prevent us from doing many things with our object. It's slightly less dumb than the original data bag!

Back to FP, how do we implement an implicit context in our function? We can make use of `closures` to hold our values for us!

```js
const numberScaler = (value) => (factor) => value * factor;

const fiveScaler = numberScaler(5); // returns a new function that accepts a factor parameter to multiply it by 5
const fiveScaledBy2 = fiveScaler(2); // 10
const fiveScaledBy14 = fiveScaler(14); // 70
```

Did you see that? It's as if we created a "constructor" with initial values and then used them later! This is exactly what we did. We partially applied the function `numberScaler` with just one parameter, as if it was a factory of another function that takes whatever `factor` we provide to scale the number `5`. This is called _(drumroll…)_ "**Partial Application**" of Curried Functions.

## Byproducts

Without much change, we can use both models to do really useful and reusable stuff

```js
// OOP
const doubler = new NumberScaler(2);

doubler.scaledBy(5); // 10
doubler.scaledBy(6); // 12
doubler.scaledBy(7); // 14
```

```js
// FP
const doubler = numberScaler(2);

doubler(5); //10
doubler(6); //12
doubler(7); //14
```

Our data bag has become much more versatile and it can do much on its own without writing any custom code. Most importantly, we achieved this both with OOP and FP! Though It's much simpler and way more elegant in FP if I say so myself.

## Retrospection

In both OOP and FP we solved a problem almost the same way using different types of implicit contexts. In OOP we used object fields. In FP we used Function Currying. Not only this allows us to lazily execute our code, it allows us to remove unneeded redundancy as well.

We didn't need to have global data bags. We didn't have to repeat ourselves when executing a procedure. We don't have to worry about destroying the context when we are done with the object instance or the function reference. We only have to care about the abstract representation of our logic.

---

**⁽*⁾** if you read "FP" like "Ef Pe" then it's "an". If you read it like "Functional Programming" then it's "a".
