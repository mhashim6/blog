---
title: "Future-proofing AI (and how to deal with uncertainty)"
description: ""
date: 2026-06-07
type: "post"
draft: true
slug: "future-proofing-ai/"
image: "/images/a-time-of-uncertainty.jpg"
caption: "A Time of Uncertainty - James Gleeson"
categories:
  - Tech
  - AI
  - Architecture
tags:
  - LLMs
  - GenAI
  - AI-Native
  - Claude
  - GPT
  - AI Products
---

This is not a guide on how to build a successful AI product. It's about how to be ready for whatever good AI idea(s) come knocking on your door, without going obsolete in a few months and losing all the money you bet on its eternal success.

This being a blog about roots, let's start there. Almost everything loud about AI right now is surface: the models, the wrappers, the patterns everyone swears by this week. Surface changes with the season. Roots don't. Future-proofing is just the unglamorous work of telling one from the other, and only ever building on the latter.

## Facts and observations *(you be the judge of which is which)*

1. AI without (good) context is an enthusiastic genius Boy-Scout yes-man: whimsical, eager, and rarely useful.
2. AI advances faster than you can productionise (_is that even a word?_) an opinion about its current state.
3. Local/ on-machine AI is getting good at a pace that should worry anyone whose entire moat is "we call a OpenAI's APIs".
4. AI providers are not particularly reliable, transparent, or trustworthy. Prices move, models get deprecated, and behaviour shifts under you without a changelog.
5. Every organisation/ team has problems that AI will not magically resolve. It will amplify whatever you already are, dysfunction included.
6. A simple and albeit useful wrapper around an AI workflow is bound to be ~~replaced~~ absorbed by a better "native" implementation from the providers themselves.
7. There are a thousand patterns and workflows people swear by, and they go obsolete about as fast as the new ones emerge.
8. Most of your product's features gain nothing from having AI bolted onto them.
9. Without a human in the loop, it's an infinite loop.
10. Team productivity is subjective; it depends on the value expected from the team. AI doesn't change that, it just hands everyone a new thing to argue about.

Notice the shape of that list. The ground under AI moves constantly, and most of what's being sold to you sits right on the moving part. So the move is old and boring: don't build on the surface, build on the roots.

> Tedium is the fuel for creativity, hype is the bedrock of obsolescence.

## How to take advantage, without being taken advantage of

*Timeless, boring, reusable foundations.*

### Context is the land. Models are renters

> A model is a tenant. Your context is the land it stands on.

The single highest-leverage thing you can own is good, auto-updating, evolving context and knowledge. Models are sliding towards commodity; you'll be able to swap one for another by next quarter. What you can't swap cheaply is the accumulated, well-structured knowledge of your domain, your customers, and your own systems.

Context and knowledge capability is timeless. It predates AI and will outlive whichever model is fashionable when you read this. Own your data. Own the pipeline that keeps it fresh. That's the asset, everything else is renting.

### Good boundaries age better than good models

Build in blocks. Lego architecture, component abstraction that assumes nothing about its underlying implementation. The reason this matters *more* in the AI era, not less: the most advanced tool-calling or integration protocol on earth is still limited by the interface beneath it.

> The fanciest tool-calling protocol is only ever as good as the dumbest API underneath it.

Bad API/ interface design == clunky AI integration, no matter how clever the protocol *(`MCP`, or whatever replaces it next year)*. So design your *why* before your *what*: an interface should express intent, not leak how it currently happens to work. And let your systems natively speak external data-model representations, so that when the right time comes *(and you won't know exactly when)* you're plugging in, not rebuilding.

This is also what "AI-native" actually means, not a chatbot stapled to your homepage. It means your system can be operated by an AI to whatever degree you choose, the same way it's operated by anything else. Well-designed systems are already most of the way there. They just need the right idea *(one that solves a real problem)* and AI placed at the one spot that needed it.

### Model-agnostic is a promise you can't keep without evals

Everyone wants to be model-agnostic. Super lovely word. But swapping a model you can't measure isn't agnosticism, it's gambling with extra steps. If you can't tell whether the new model is better, worse, or just differently wrong, then you are quietly married to whatever you shipped first.

So the foundation underneath "model-agnostic" is the one nobody puts on a slide: evaluation and observability. Build the way to measure equivalence first, and the freedom to swap follows for free. Skip it, and "agnostic" is just a sticker on a locked door.

### Security doesn't get a pass for being new

Security is timeless, and AI mostly invents new doors into old houses. An LLM in your stack is a new, fuzzy, eager-to-please attack surface: prompt injection, data exfiltration smuggled out through a helpful summary, an agent holding real credentials and real permissions to do real damage.

The old rules still apply *(least privilege, validate everything, trust nothing by default)*. They just now apply to a component that will cheerfully argue with you about why it deserves to be trusted. Treat the model as an untrusted user that happens to live inside your firewall.

### AI is not automation, and determinism is still your friend

This is the one I'd put on the wall. Automation is deterministic: same input, same output, every time. AI is not, and that's the whole point of reaching for it. You adopt AI precisely for the fuzzy, judgement-shaped tasks that determinism can't touch.

The discipline is being ruthless about where that fuzziness earns its place. Identify the non-deterministic parts, isolate them, guard them, and wrap them in as much boring determinism as you can stand.

> Strive for determinism. Then fence off the part that refuses to behave, and watch it like a hawk, or an owl.. owls are cool.

The smaller and more grounded you make the unpredictable core, the more you gain. Don't sprinkle AI across your product like seasoning. Put it exactly where a human would otherwise be guessing, and nowhere else.

### Keep a human in the loop *(on purpose, not by accident)*

Fact 9 was a joke with a point inside it (_or perhaps the other way around, I never know_). Without a human somewhere in the loop, an autonomous AI system is just a very confident way to have the lovely Ms.Take.

The foundation here isn't "add a human". It's deciding where the human stands: what the AI is allowed to do alone, what needs a check, and how the system escalates when it isn't sure *(which assumes you built the thing that lets it know it isn't sure, see evals)*. The loop is a design decision, not a disclaimer you bolt on at the end.

### Be cheap to be wrong

You cannot predict the future. You can only make being wrong about it survivable. Every AI bet should be reversible: easy to rip out, no data held hostage, no lock-in you can't escape. This is the BYO *(Bring-Your-Own)* mindset. Your designs, your data, your exits.

Don't aim to be right (_when you don't know how_). Aim to be cheap to be wrong.

### None of this saves a broken organisation

No foundation above will rescue a team that can't state the problem it's solving. AI won't fix unclear ownership, hype-driven roadmaps, or the habit of adding features nobody asked for. It'll just do all of that faster.

The most future-proof thing in the building is still a clear problem statement and someone willing to say "this one doesn't need AI." Boring. Timeless. Works.

## So, nothing new?

Yeppers. Almost nothing here is actually about AI. It's about how you build an ever-evolving solution instead of a finished product, which is the same problem we've always had, now under a louder name. Design with uncertainty, isolate what you can't predict, own your roots, and stay cheap to be wrong.

The surface will keep changing. Let it. You're tending the roots.
