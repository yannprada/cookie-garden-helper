# Cookie Garden Helper

Automate your garden in Cookie Clicker.

# How to use

There are a few ways to load this mod:

## Bookmarklet

1. Copy this code and save it as a bookmark.
2. Paste it in the URL section.
3. To activate, click the bookmark when the game's open.

```javascript
javascript: Game.LoadMod('https://rawgit.com/yannprada/cookie-garden-helper/master/cookie-garden-helper.js');
```

## Userscript

Want the mods to be loaded automatically everytime you open the game? Well for that we have this following script for stuff like _Tampermonkey_ or _Greasemonkey_ that you can use:

```javascript
// ==UserScript==
// @name Cookie Garden Helper
// @namespace Garden
// @include http://orteil.dashnet.org/cookieclicker/
// @include https://orteil.dashnet.org/cookieclicker/
// @include http://orteil.dashnet.org/cookieclicker/beta/
// @include https://orteil.dashnet.org/cookieclicker/beta/
// @version 1
// @grant none
// ==/UserScript==

setInterval(() => {
  if (Game.ready) {
    Game.LoadMod('https://rawgit.com/yannprada/cookie-garden-helper/master/cookie-garden-helper.js');
  }
}, 1000);
```

# How it works

To begin, click the button **_Cookie Garden Helper_**, at the bottom of your garden / farms. There, you can configure how you would like the mod to operate.

The mod loop through each unlocked tile, then tries to auto-harvest or auto-plant, depending on what is activated.

### Auto-harvest

First, it will check if the tile is empty.
If not, it will check if the plant is immortal. If it is, and the **Avoid immortals** option is **ON**, ignore this tile.
If not, it will compute the plant stage. Below is a list of these stages, and the conditions when the plant will be harvested:

- young:
  - if it is a weed, and the option **Remove weeds** is **ON**
  - if the option **Clean garden** is **ON**, the corresponding saved slot is empty and the plant is already unlocked or new
  - if the option **Clean garden** is **ON**, the corresponding saved slot is not empty but the young plant don't match
- mature:
  - if it is a new seed, and the option **New seeds** is **ON**
  - if the option **All** is **ON**
  - if the option **Check CpS Mult** is **ON**, and the current CpS multiplier is above or equal to the one specified at **Mini CpS multiplier**
- dying:
  - if the option **Check CpS Mult** is **ON**, and the current CpS multiplier is above or equal to the one specified at **Mini CpS multiplier**
  - if the plant is dying, the last tick is 60 seconds from expiring, and the option **Dying plants** is **ON**

### Auto-plant

This one will work if:

- the tile is empty
- a plot has been previously saved with the button **Save plot**
- the option **Check CpS Mult** is:
  - **ON**, and the current CpS multiplier is below or equal to the one specified at **Maxi CpS multiplier**
  - **OFF**

**_Note:_** mouse over the message _Plot saved_, to see what was saved.

### Manual tools

This section is pretty obvious. Only one tool is there for now:

- **Plant selected seed**:
  - select a seed you have unlocked
  - click this button to fill all the empty tiles of your plot
  - (don't forget to deselect the seed)

## Sacrifice garden

When you sacrifice your garden, a few things will happen:

- your saved plot will be erased
- the auto-harvest will be toggled OFF
- the auto-plant will be toggled OFF

This is to prevent planting locked seeds, as well as allowing you to verify your configuration before restarting automation.

The rest of your configuration will remain.

## Screenshot

![cookie-garden-helper](https://user-images.githubusercontent.com/20804322/108031853-4be4b700-7010-11eb-9a05-c2127378d936.png)
