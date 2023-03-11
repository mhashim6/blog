---
title: "Android Emulator Tips & Tricks"
description: "Advanced tips for advanced Android Emulator scenarios"
date: 2022-12-10
type: "post"
draft: false
slug: "android-avd-emulator-tips-and-tricks/"
image: "/images/avd-tips-and-tricks/cover.png"
# caption: "Android Studio Preview - Google"
categories:
  - Tech
  - Mobile
  - Guide
tags:
  - Android
  - AVD
  - Emulator
  - ADB
  - shell
---

# What brings me here?
When I do Android stuff, my mind switches to survival mode; I try to make the best of what I have. Assuming you do as well, I present to you some of the tricks I use to make my sure demise a bit less terrible.

## Contents
1. [Native Screenshots on Android Emulator](#avd-screenshots)
   - [Straightforward way](#avd-screenshots-straightforward)
   - [ADB way](#avd-screenshots-adb)
2. [Shaking the Emulator](#avd-shake)
3. [Swiping with 2 fingers](#avd-swipe)

Equipped with these tricks, you may now go on hating on Android as you were, with double the fingers and a good shake.


## Trigger Native Screenshots on AVD {#avd-screenshots}
> This will help you trigger a native screen capture event on a device that you don’t have physical access to (Virtual devices/ emulators).

### Straightforward way {#avd-screenshots-straightforward}
**Support:** Up to `API 29`

#### Steps
1. Hold down the power button on the emulator’s sidebar
2. Click on the Screenshot icon

![screenshot](/images/avd-tips-and-tricks/screenshot.png "screenshot")

### Using ADB {#avd-screenshots-adb}
> This way is quite flexible; it simulates a key press on the device's GPIO buttons (Power, volume…etc).  
**Support:** All API versions

<video controls loop="true">
    <source src="/videos/avd-tips-and-tricks/screenshot2.mov"/>
</video>

#### Steps
1. Configure the adb shell to run with root privileges
```shell
adb root
```

2. Determine your device id:
```shell
adb shell getevent
```

> On the emulator click on any of the volume buttons, and observe the terminal. You should see output similar to this:
> ```shell
> /dev/input/event12: 0001 0072 00000001
> ```

> This makes your device id: `/dev/input/event12`.

3. Start the adb shell
```shell
adb shell
```

4. Copy this script and make sure to substitute the device id with yours.
```shell
cat > /data/local/tmp/snap.sh <<EOF
#!/bin/sh
echo ‘volume key: down’
sendevent /dev/input/event12 1 114 1
echo ‘power key: down’
sendevent /dev/input/event12 1 116 1
sendevent /dev/input/event12 0 0 0
sleep 1
echo ‘volume key: up’
sendevent /dev/input/event12 1 114 0
echo ‘power key: up’
sendevent /dev/input/event12 1 116 0
sendevent /dev/input/event12 0 0 0
EOF
```

> Paste the script in your adb shell _(This script holds down the power and volume-down buttons for one second, then releases them.)_

5. Take Screenshots
```shell
sh /data/local/tmp/snap.sh
```

---

## Shaking the emulator {#avd-shake}
<video controls loop="true">
    <source src="/videos/avd-tips-and-tricks/shake.mov"/>
</video>

This one is simple _(android simple that is)_. _All_ you have to do is:
1. Go to emulator settings (the 3 dots thingy)
2. **Virtual Sensors**
3. **Device Pose**
4. Select **Move**
5. Have fun with any of the sliders

---

## Swiping with 2 fingers {#avd-swipe}

<video controls loop="true">
    <source src="/videos/avd-tips-and-tricks/swipe.mov"/>
</video>

Often we like to swipe with 2 fingers on an emulator. I was writing a script for it. But I found out it’s natively (and horribly) supported now. I’ve recorded a video showing the required keystrokes (yep they’re quite a few) and I’ll also list them here:

1. Hold **⇧ Shift**
2. Hold **⌘ Command**
3. Slightly move your mouse cursor so that you have 2 aligned-circles representing 2 fingers
4. Now Right-Click with your mouse and swipe into the required direction.


> That’s right 4 convoluted steps and they require a mouse _(the trackpad won’t work)_. That’s what you get when working with Android ¯\\_(ツ)_/¯

## Resources
- [StackOverflow _(a real shocker)_](https://stackoverflow.com/questions/44495473/android-how-to-access-emulator-screenshot-via-emulator)
