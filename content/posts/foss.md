---
title: "Impact of my Open Source Projects"
description: "I searched for usages of my FOSS projects and was humbled by the results"
date: 2022-07-30
type: "post"
draft: false
image: "https://github.com/mhashim6/blog/blob/main/static/images/foss_wordcloud.png?raw=true"
categories:
- Career
- Personal
- Tech
- Pondering
slug: impact-of-my-open-source-projects
tags: 
- Open-Source
- Raspberry Pi
- Android
- Kotlin
- Java
- Data
---

# Hi, I'm Muhammad Hashim!
But also in this particular context I'm known as [`mhashim6`](https://github.com/mhashim6). And this is a breakdown of some of my FOSS projects and how they're used by the devs of the GitHub community.

_This data was obtained using [GitHub's global code search utility](https://github.com/search?p=2&q=mhashim6.&type=Code)._

## [Open Hadith Data](https://github.com/mhashim6/Open-Hadith-Data)
When I first made this, there was no _actual_ open and free dataset for Hadith (الأحاديث النبوية). And this was the objective of this repo. And I later used it to build my very first public Android App–[The Two Authentic books (الصحيحان: البخاري ومسلم)](https://play.google.com/store/apps/details?id=mhashim6.android.thetwoauthentics&hl=en)

### Notable Projects that use __Open Hadith Data__

#### [Ahadeeth](https://github.com/MuwaffaqImam/ahadeeth)
A cross-platform mobile and web app for Hadith

#### [OpenHadith](https://github.com/tarekeldeeb/OpenHadith)
This python project provides various operations and insights on the hadith dataset

#### [The9Books](https://github.com/mghanii/The9Books)
> API to access Hadiths of Bukhari, Muslim, Abu-Dawud, Ahmed Ibn-Hanbal, Muwataa, Ibn-Maja, Al Tirmidhi, Al Nasai, Al Darimi

---
## [Pi4K](https://github.com/mhashim6/Pi4K)
I developed `Pi4K` as complement to the father lib of `JVM` on the RaspberryPi—[`Pi4J`](https://www.pi4j.com) \
It's a kotlin DSL that makes developing for _RPIs_ not just fun, but also simple and concise.

### Notable Projects that use __Pi4K__

#### [KotlinOnPi](https://github.com/pete32/KotlinOnPi)
Which is a companion repository for this [great article](https://pete32.medium.com/kotlin-or-java-on-a-raspberry-pi-de092d318df9) on how to start developing on the RaspberryPi from absolute zero using `Kotlin/JVM`.

#### [VR-CAR](https://github.com/lhwdev/project-vrcar)
> 🚗 A project for school club; remoted car with Raspberry PI whose vision can be seen by VR (maybe stale; maybe hard).

I'm really glad my project helped these guys with their school project.

#### [Gate Project](https://github.com/Zelgius0880/GateProject)
A cool project that used my work as starting point to build a smart IoT system

---

## [Simple-ADB](https://github.com/mhashim6/Simple-ADB) & [System-Command-Executor](https://github.com/mhashim6/Commander)
`Simple-ADB` was my first ever public app that I built with Java. The objective was simple: one Graphical `ADB` Client to rule them all. And to my surprise, It actually became the #1 client till this very day. \
`System-Command-Executor` was the component that wrapped native system commands in my client, I later decided to make it an independent `lib` to be re-used in other projects.

### Notable Projects that use __Simple-ADB__ & __System-Command-Executor__

#### [auto-motion](https://github.com/teamxenox/auto-motion)
> A tool to edit your lengthy screen records, automatically.

#### [Forget-Windows-Use-Linux](https://github.com/Carbon-Fusion/build_fwul)
> FWUL - The most reliable adb/fastboot live system ever - to manage ANY Android without driver hassle
---
## [intellij-drumroll](https://github.com/mhashim6/intellij-drumroll)
> An Intellij Platform Plugin that plays a drum roll sound on compile/build. and other equally-fun sounds when build has errors, or warnings.

### People that use __intellij-drumroll__ or are inspired by it

#### [intellij-build-webhook-notifier](https://github.com/hbmartin/intellij-build-webhook-notifier)
> Call a configurable webhook on build start, error, or success. Useful for sending push notifications, blinking lights, etc.

I was really glad to read this line by the author:
> Significant inspiration drawn from intellij-drumroll by mhashim6

#### Turns out there are plenty of people who used __intellij-drumroll__ as a part of their portable development starter-kit. I picked:
- [`panfx`](https://github.com/panfx/ideaSetting)
- [`Baneeishaque`](https://github.com/Baneeishaque/gp-vnc-pcman-zsh-as-gh-chrome-idea-pycharm-conda3-hb-scrcpy-r-lfs-zilla-gram-matlab-mysql-phpstorm)

---

# Honorable Mentions

## [RemoveTashkeel.java](https://gist.github.com/mhashim6/7d96f7ea274c9eb7e509798a332d78ac)
I wrote this `gist` in 2017 to publicly document how to get rid of Arabic diacritics (تشكيل) using Java as an example. And it got listed in numerous _Awesome-x_-like repos.

### Notable Projects that use __RemoveTashkeel.java__

#### [QuranyApp](https://github.com/MahmoudMabrok/QuranyApp)
> Open Source HolyQuran app that provide Read, Listen, Tafseer, Test all of them and app is very small size.
---
## [LC3-Virtual-Machine](https://github.com/mhashim6/LC3-Virtual-Machine)
> LC-3 VM Python implementation [school project].

### Projects that use __LC3-Virtual-Machine__

#### [cosc2804-apr22-assignment2](https://github.com/mchldann/cosc2804-apr22-assignment2)
> LC-3 Minecraft Virtual Machine

Yet another school project : )

---

## [Android-SeparatorView](https://github.com/mhashim6/Android-SeparatorView)
This `lib` is as simple as its name, it's just a simple UI component that separates views in Android. Because at the time of this `lib`, this was kind of a hassle to do in Android. \
I found it used in numerous _sample_ apps, demos, and illustrations. I picked [MVVM-Demo](https://github.com/MeteorStart/MVVM-Demo) Randomly.


# How do I feel about it
If you know anything about me, then you must know that I'm derived by a __certain purpose__. And to see some of my works are used to serve this purpose is literally the best thing that could happen to me in my life. because this purpose is my life; without it I'm no more.