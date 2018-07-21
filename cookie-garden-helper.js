{
const moduleName = 'cookieGardenHelper';

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
const uncapitalize = (word) => word.charAt(0).toLowerCase() + word.slice(1);
const clone = (x) => JSON.parse(JSON.stringify(x));
const doc = {
  elId: document.getElementById.bind(document),
  qSel: document.querySelector.bind(document),
  qSelAll: document.querySelectorAll.bind(document),
}


class Config {
  static get default() {
    return {
      autoHarvest: false,
      autoHarvestCheckBuffs: false,
      autoHarvestMiniCpSMult: { value: 1, min: 0 },
      autoPlant: false,
      autoPlantCheckBuffs: false,
      autoPlantMaxiCpSMult: { value: 0, min: 0 },
      savedPlot: [],
    };
  }

  static get storageKey() { return moduleName; }

  static load() {
    let config = window.localStorage.getItem(this.storageKey);
    if (!config) {
      this.save(this.default);
      return this.default;
    }
    return JSON.parse(config);
  }

  static save(config) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(config));
  }
}


class Garden {
  static get minigame() { return Game.Objects['Farm'].minigame; }
  static get active() { return this.minigame !== undefined; }

  static get CpSMult() {
    var res = 1
    for (let key in Game.buffs) {
        if (typeof Game.buffs[key].multCpS != 'undefined') {
            res *= Game.buffs[key].multCpS;
        }
    }
    return res;
  }

  static get selectedSeed() { return this.minigame.seedSelected; }
  static set selectedSeed(seedId) { this.minigame.seedSelected = seedId; }
  static get plot() { return this.minigame.plot; }

  static getPlant(id) { return this.minigame.plantsById[id]; }
  static getTile(x, y) { return this.minigame.getTile(x, y); }

  static tileIsEmpty(x, y) { return this.getTile(x, y)[0] == 0; }

  static plantSeed(seedId, x, y) { this.minigame.useTool(seedId, x, y); }

  static forEachTile(callback) {
    for (let x=0; x<6; x++) {
      for (let y=0; y<6; y++) {
        callback(x, y);
      }
    }
  }

  static harvest(x, y) {
    let [seedId, age] = this.getTile(x, y);
    if (seedId > 0) {
      if (age >= this.getPlant(seedId - 1).mature) {
        this.minigame.harvest(x, y);
      }
    }
  }

  static fillGardenWithSelectedSeed() {
    if (this.selectedSeed > -1) {
      this.forEachTile((x, y) => {
        if (this.tileIsEmpty(x, y)) {
          this.plantSeed(this.selectedSeed, x, y);
        }
      });
    }
  }

  static run(config) {
    this.forEachTile((x, y) => {
      if (config.autoHarvest &&
          (!config.autoHarvestCheckBuffs ||
          this.CpSMult >= config.autoHarvestMiniCpSMult.value)
        ) {
        this.harvest(x, y);
      }
      if (config.autoPlant &&
          (!config.autoPlantCheckBuffs ||
          this.CpSMult <= config.autoPlantMaxiCpSMult.value) &&
          this.tileIsEmpty(x, y)
        ) {
        let [seedId, age] = config.savedPlot[y][x];
        this.plantSeed(seedId - 1, x, y);
      }
    });
  }
}


class UI {
  static makeId(id) { return moduleName + capitalize(id); }
  static get css() {
    return `
#game.onMenu #cookieGardenHelper {
  display: none;
}
#cookieGardenHelper {
  background-color: rgba(0, 0, 0, 0.9);
}
#cookieGardenHelperTools {
  display: none;
}
#cookieGardenHelperTools.visible {
  display: block;
}
#cookieGardenHelperTools:after {
  content: "";
  display: table;
  clear: both;
}
.cookieGardenHelperPanel {
  float: left;
  width: 33%;
}
#cookieGardenHelperTitle {
  font-size: 2em;
  padding: 0.5em;
  text-align: center;
}
#cookieGardenHelperTitle:hover {
  color: lightyellow;
  text-decoration: underline;
}
#cookieGardenHelper h2 {
  font-size: 1.5em;
  padding: 0.5em;
  padding-top: 0;
}
#cookieGardenHelper p {
  font-size: 1.25em;
}
#cookieGardenHelper input[type=checkbox] {
  transform: scale(1.25);
}
#cookieGardenHelper input[type=number] {
  width: 3em;
}
`;
  }

  static checkbox(name, text, title, checked) {
    let id = this.makeId(name);
    return `<p>
  <input type="checkbox" name="${name}" id="${id}"
    ${checked ? 'checked' : ''}/>
  <label for="${id}" title="${title}">${text}</label>
</p>`;
  }

  static numberInput(name, text, title, options) {
    let id = this.makeId(name);
    return `<p>
  <input type="number" name="${name}" id="${id}" value="${options.value}"
    ${options.min !== undefined ? `min="${options.min}"` : ''}
    ${options.max !== undefined ? `max="${options.max}"` : ''} />
  <label for="${id}" title="${title}">${text}</label>
</p>`;
  }

  static button(name, text, title) {
    return `<a class="option" name="${name}" id="${this.makeId(name)}"
      title="${title}">${text}</a>`;
  }

  static build(config) {
    let autoHarvest = config.autoHarvest;
    doc.elId('row2').insertAdjacentHTML('beforebegin', `
<div id="cookieGardenHelper">
  <style>${this.css}</style>
  <div id="cookieGardenHelperTitle" class="title">Cookie Garden Helper</div>
  <div id="cookieGardenHelperTools">
    <div class="cookieGardenHelperPanel">
      <h2>Auto-harvest</h2>
      ${this.checkbox('autoHarvest', 'Activated', '', config.autoHarvest)}
      ${this.checkbox(
        'autoHarvestCheckBuffs', 'Check for buffs',
        'Check for buffs before harvesting (see below)', config.autoHarvestCheckBuffs
      )}
      ${this.numberInput(
        'autoHarvestMiniCpSMult', 'Mini CpS multiplier',
        'Minimum CpS multiplier for the auto-harvest to happen',
        config.autoHarvestMiniCpSMult
      )}
    </div>
    <div class="cookieGardenHelperPanel">
      <h2>Auto-plant</h2>
      ${this.checkbox('autoPlant', 'Activated', '', config.autoPlant)}
      ${this.checkbox(
        'autoPlantCheckBuffs', 'Check for buffs',
        'Check for buffs before planting (see below)', config.autoPlantCheckBuffs
      )}
      ${this.numberInput(
        'autoPlantMaxiCpSMult', 'Maxi CpS multiplier',
        'Maximum CpS multiplier for the auto-plant to happen',
        config.autoPlantMaxiCpSMult
      )}
      ${this.button('savePlot', 'Save plot',
      'Save the current plot; these seeds will be replanted later')}
    </div>
    <div class="cookieGardenHelperPanel">
      <h2>Manual tools</h2>
      ${this.button('fillGardenWithSelectedSeed', 'Plant selected seed',
      'Plant the selected seed on all empty tiles')}
    </div>
  </div>
</div>`);

    doc.elId('cookieGardenHelperTitle').onclick = (event) => {
      doc.elId('cookieGardenHelperTools').classList.toggle('visible');
    };

    doc.qSelAll('#cookieGardenHelper input').forEach((input) => {
      input.onchange = (event) => {
        if (input.type == 'checkbox') {
          Main.handleChange(input.name, input.checked);
        } else if (input.type == 'number') {
          let min = config[input.name].min;
          let max = config[input.name].max;
          if (min !== undefined && input.value < min) { input.value = min; }
          if (max !== undefined && input.value > max) { input.value = max; }
          Main.handleChange(input.name, input.value);
        }
      };
    });

    doc.qSelAll('#cookieGardenHelper a.option').forEach((a) => {
      a.onclick = (event) => {
        Main.handleClick(a.name);
      };
    });
  }
}

class Main {
  static init() {
    this.timerInterval = 1000;
    this.config = Config.load();
    UI.build(this.config);
    this.start();
  }

  static start() {
    this.timerId = window.setInterval(
      () => Garden.run(this.config),
      this.timerInterval
    );
  }

  static stop() { window.clearInterval(this.timerId); }

  static save() { Config.save(this.config); }

  static handleChange(key, value) {
    if (this.config[key].value !== undefined) {
      this.config[key].value = value;
    } else {
      this.config[key] = value;
    }
    this.save();
  }

  static handleClick(key) {
    if (key == 'fillGardenWithSelectedSeed') {
      Garden.fillGardenWithSelectedSeed();
    } else if (key == 'savePlot') {
      this.config['savedPlot'] = clone(Garden.plot);
    }
    this.save();
  }
}

if (Garden.active) { Main.init(); }
}
