# cookie-garden-helper

Automate your garden in Cookie Clicker

## How to use

Copy this code and save it as a bookmark. Paste it in the URL section.
To activate, click the bookmark when the game's open.

```javascript
javascript: (function () {
    Game.LoadMod('https://rawgit.com/yannprada/cookie-garden-helper/master/cookie-garden-helper.js');
}());
```

## How it works

The mod loop through each unlocked tile, then tries to auto-harvest
or auto-plant, depending on what is activated.

### Auto-harvest

First, it will check if the tile is empty.

If not, it will check if the plant is immortal. If it is, and the **Avoid immortals** option is **ON**, ignore this tile.

If not, it will compute the plant stage. Below is a list of these stages, and
the conditions when the plant will be harvested:

- young:
  - if it is a weed, and the option **Remove weeds** is **ON**
- mature:
  - if it is a new seed, and the option **New seeds** is **ON**
  - if the option **Check CpS Mult** is **ON**, and the current CpS multiplier
  is above or equal to the one specified at **Mini CpS multiplier**
- dying:
  - if the plant is dying, and the option **Dying plants** is **ON**

### Auto-plant

This one will work if:

- the tile is empty
- a plot has been previously saved with the button **Save plot**
- the option **Check CpS Mult** is:
  - **ON**, and the current CpS multiplier is
below or equal to the one specified at **Maxi CpS multiplier**
  - **OFF**

### Manual tools

This section is pretty obvious. Only one tool is there for now:

- **Plant selected seed**:
  - select a seed you have unlocked
  - click this button to fill all the empty tiles of your plot
  - (don't forget to deselect the seed)

## Screenshot

![Screenshot - UI of the mod cookie-garden-helper](/img/cookie-garden-helper.png?raw=true "UI")
