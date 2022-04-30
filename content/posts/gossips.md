---
title: "Gossips: An Event-Bus in a Chatty Neighborhood"
description: "Using Metaphorical Programming in an event-bus"
date: 2020-06-19T11:11:11+01:00
type: "post"
draft: false
image: "https://github.com/mhashim6/blog/blob/main/static/images/gossip.png?raw=true"
---

![Gossips Doodle](/images/gossip.png)
*[image by balasoiu @ freepik](https://www.freepik.com/balasoiu)*

In this post we'll tackle a common issue: _simple_ communication between system components. With a slightly controversial, themed, domain-driven design.

Let's say our project is an Android app, and we need a functionality that requires two fragments to communicate. You know Android, social distancing between components is the norm out there. We'll use this as an excuse to write an Event Bus.

I chose an analogy for the entire thing: **Gossips**; It fits with the nature of the library, and the way it'll be used–A global pub-sub component to enable cross-component communication.

### Just Why?

> The intention of this "experiment" is to explore how expressive programming languages can be. And how close can we model our real world using logical statements and constructs. It really is amusing how software engineers have created such expressive constructs that we use in our code. This experiment is heavily triggered and inspired by [JavaFX's Theater analogy](https://medium.com/@juliemmasam/javafx-and-the-theatre-metaphor-179243704581).

### Show me the code

The spine of almost every event bus out there is a form of the [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern). And we won't be any different. First, We'll have to make our `Observable` or the `Publisher` as it's called in a slightly [different context](https://medium.com/better-programming/observer-vs-pub-sub-pattern-50d3b27f838c). Our `Observable` is a source of **gossips**, in a chatty neighborhood. Where rumors and gossips are the main source of entertainment:

```kotlin
interface Gossips<T> {
    fun spread(gossip: T)
    fun listen(onNext: (gossip: T) -> Unit): Subscription
    fun unSubscribe(subscription: Subscription)
    fun unSubscribeAll()
}
```

> Here we define our interface for the source of gossips. Like any respected event bus, Gossips should be able to `publish`/**`spread()`** `events`/**`gossips`**. We also want users to be able to `subscribe`/**`listen()`** to `events`/**`gossips`** the moment they come out, so that they can react accordingly. For the convenience of our users, we want them to be able to unsubscribe from these types of gossips.

Next, we want to implement the mechanism by which users can interact with our source of gossip. We need to create the `Subscription` and the `Receiver` components:

```kotlin
interface Subscription {
    fun cancel()
    val isCanceled: Boolean
}
```

> Here we provide our `subscriper`s/**`listener`s** with a way to cancel their subscriptions.

```kotlin
interface Receiver<in T> {
    fun psst(gossip: T)
}
```

> And here, we provide our nosy neighbors with a way to stay up to date with the latest screw-ups in the neighborhood. By the social act of whispering and an eloquent `psst()` function.

Often the two are combined, and we will do just that. Whether it's a good combination of qualities or not isn't relevant to the topic of this article.

```kotlin
internal class Neighbor<in T>(private val source: Gossips<T>, private val react: (gossip: T) -> Unit) : Subscription,
    Receiver<T> {
	override var isCanceled: Boolean = false

    override fun psst(gossip: T) {
        react(gossip)
    }

    override fun cancel() {
        source.unSubscribe(this)
        isCanceled = true
    }
}
```

> Our `Neighbor`s thrive on a `source` of gossips. They also have their own way/function of `react`ing to them. Since a `Neighbor` is both a `Receiver` and a `Subscription` to our gossips, it implements their qualities: `psst()`, and `cancel()`.

Now what's left is to define how our bus actually works, by writing an implementation of our `Gossips` interface:

```kotlin
internal class GossipsImpl<T> : Gossips<T> {
    private val neighbors by lazy { mutableSetOf<Neighbor<T>>() }

    override fun spread(gossip: T) {
        neighbors.forEach { neighbor ->
            neighbor.psst(gossip)
        }
    }

    override fun listen(onNext: (gossip: T) -> Unit): Subscription {
        val neighbor = Neighbor(source = this, react = onNext)
        neighbors.add(neighbor)
        return neighbor
    }

    override fun unSubscribe(subscription: Subscription) {
        neighbors.remove(subscription)
    }

    override fun unSubscribeAll() {
        neighbors.forEach { it.cancel() }
        neighbors.clear()
    }
}
```

> We store a set of `Neighbor`s, and we keep them up to date whenever a new `gossip` is out. We add new neighbors to this set whenever they are interested in `listen`ing to our gossips. We also remove them whenever they feel they had enough and want to `unsubscribe`.

### Tying it all together

An example of how it looks like in action is quite amusing:

```kotlin
object State {
    val resultGossips: Gossips<GenericResult> = Gossips.create()
}
```

> We define a State object, that lives the entirety of our app's life-cycle. and houses all our gossips, so that we can easily spread and `listen` to them (don't judge):

```kotlin
fun onAttach(){
    resultGossips.listen { showResults(it) }
}
```

> We listen to our gossips of interest, in an entry point in our app's life-cycle. Similarly, we can unsubscribe when we feel like it:

```kotlin
fun onDetach() {
    super.onDetach()
    subscriptions.cancel()
}
```

We can spread gossips when we need to communicate (or realistically when we're bored):

```kotlin
fun onButtonClick(){
    resultGossips.spread(GenericResult("something something"))
}
```

And we're done! A full-fledged event bus in a really tiny codebase. But we all know that we don't really care about the event bus itself; tell me your thoughts about the metaphor! Are you at all interested in this? Does this trigger you? I'd love a discussion in this topic.
