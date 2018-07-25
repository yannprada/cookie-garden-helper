
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
  text-indent: 0;
  padding-left: 0.7em;
}
#cookieGardenHelper input[type=number] {
  width: 3em;
}
#cookieGardenHelper a.toggleBtn:not(.off) .toggleBtnOff {
  display: none;
}
#cookieGardenHelper a.toggleBtn.off .toggleBtnOn {
  display: none;
}
#cookieGardenHelper .warning {
    padding: 1em;
    font-size: 1.5em;
    background-color: orange;
    color: white;
}
#cookieGardenHelper .warning .closeWarning {
    font-weight: bold;
    float: right;
    font-size: 2em;
    line-height: 0.25em;
    cursor: pointer;
    transition: 0.3s;
}
#cookieGardenHelper .warning .closeWarning:hover {
    color: black;
}
`;
  }

  static numberInput(name, text, title, options) {
    let id = this.makeId(name);
    return `
<input type="number" name="${name}" id="${id}" value="${options.value}" step=0.5
  ${options.min !== undefined ? `min="${options.min}"` : ''}
  ${options.max !== undefined ? `max="${options.max}"` : ''} />
<label for="${id}" title="${title}">${text}</label>`;
  }

  static button(name, text, title, toggle, active) {
    if (toggle) {
      return `<a class="toggleBtn option ${active ? '' : 'off'}" name="${name}"
                 id="${this.makeId(name)}" title="${title}">
        ${text}
        <span class="toggleBtnOn">ON</span>
        <span class="toggleBtnOff">OFF</span>
      </a>`;
    }
    return `<a class="btn option" name="${name}" id="${this.makeId(name)}"
      title="${title}">${text}</a>`;
  }

  static toggleButton(name) {
    let btn = doc.qSel(`#cookieGardenHelper a.toggleBtn[name=${name}]`);
    btn.classList.toggle('off');
  }

  static createWarning(msg) {
    doc.elId('row2').insertAdjacentHTML('beforebegin', `
<div id="cookieGardenHelper">
  <style>${this.css}</style>
  <div class="warning">
    <span class="closeWarning">&times;</span>
    ${msg}
  </div>
</div>`);
    doc.qSel('#cookieGardenHelper .closeWarning').onclick = (event) => {
      doc.elId('cookieGardenHelper').remove();
    };
  }

  static build(config) {
    doc.elId('row2').insertAdjacentHTML('beforebegin', `
<div id="cookieGardenHelper">
  <style>${this.css}</style>
  <div id="cookieGardenHelperTitle" class="title">Cookie Garden Helper</div>
  <div id="cookieGardenHelperTools">
    <div class="cookieGardenHelperPanel">
      <h2>
        Auto-harvest
        ${this.button('autoHarvest', '', '', true, config.autoHarvest)}
      </h2>
      <p>
        ${this.button(
          'autoHarvestAvoidImmortals', 'Avoid immortals',
          'Do not harvest immortal plants', true,
          config.autoHarvestAvoidImmortals
        )}
      </p>
      <p>
        ${this.button(
          'autoHarvestWeeds', 'Remove weeds',
          'Remove weeds as soon as they appear', true,
          config.autoHarvestWeeds
        )}
      </p>
      <p>
        ${this.button(
          'autoHarvestNewSeeds', 'New seeds',
          'Harvest new seeds as soon as they are mature', true,
          config.autoHarvestNewSeeds
        )}
      </p>
      <p>
        ${this.button(
          'autoHarvestCheckCpSMult', 'Check CpS mult',
          'Check the CpS multiplier before harvesting (see below)', true,
          config.autoHarvestCheckCpSMult
        )}
      </p>
      <p>
        ${this.numberInput(
          'autoHarvestMiniCpSMult', 'Mini CpS multiplier',
          'Minimum CpS multiplier for the auto-harvest to happen',
          config.autoHarvestMiniCpSMult
        )}
      </p>
      <p>
        ${this.button(
          'autoHarvestDying', 'Dying plants',
          'Harvest dying plants', true,
          config.autoHarvestDying
        )}
      </p>
    </div>
    <div class="cookieGardenHelperPanel">
      <h2>
        Auto-plant
        ${this.button('autoPlant', '', '', true, config.autoPlant)}
      </h2>
      <p>
        ${this.button(
          'autoPlantCheckCpSMult', 'Check CpS mult',
          'Check the CpS multiplier before planting (see below)', true,
          config.autoPlantCheckCpSMult
        )}
      </p>
      <p>
        ${this.numberInput(
          'autoPlantMaxiCpSMult', 'Maxi CpS multiplier',
          'Maximum CpS multiplier for the auto-plant to happen',
          config.autoPlantMaxiCpSMult
        )}
      </p>
      <p>
        ${this.button('savePlot', 'Save plot',
        'Save the current plot; these seeds will be replanted later')}
      </p>
    </div>
    <div class="cookieGardenHelperPanel">
      <h2>Manual tools</h2>
      <p>
        ${this.button('fillGardenWithSelectedSeed', 'Plant selected seed',
        'Plant the selected seed on all empty tiles')}
      </p>
    </div>
  </div>
</div>`);

    doc.elId('cookieGardenHelperTitle').onclick = (event) => {
      doc.elId('cookieGardenHelperTools').classList.toggle('visible');
    };

    doc.qSelAll('#cookieGardenHelper input').forEach((input) => {
      input.onchange = (event) => {
        if (input.type == 'number') {
          let min = config[input.name].min;
          let max = config[input.name].max;
          if (min !== undefined && input.value < min) { input.value = min; }
          if (max !== undefined && input.value > max) { input.value = max; }
          Main.handleChange(input.name, input.value);
        }
      };
    });

    doc.qSelAll('#cookieGardenHelper a.toggleBtn').forEach((a) => {
      a.onclick = (event) => {
        Main.handleToggle(a.name);
      };
    });

    doc.qSelAll('#cookieGardenHelper a.btn').forEach((a) => {
      a.onclick = (event) => {
        Main.handleClick(a.name);
      };
    });
  }
}
