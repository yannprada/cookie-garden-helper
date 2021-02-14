class Main {
  static init() {
    this.timerInterval = 1000;
    UI.build(configs);

    // sacrifice garden
    const oldConvert = Garden.minigame.convert;
    Garden.minigame.convert = () => {
      UI.labelToggleState('plotIsSaved', false);
      this.handleToggle('autoHarvest');
      this.handleToggle('autoPlant');
      Game.WriteSave();
      oldConvert();
    };

    this.start();
  }

  static start() {
    this.timerId = window.setInterval(() => Garden.run(configs), this.timerInterval);
  }

  static stop() {
    window.clearInterval(this.timerId);
  }

  static handleChange(key, value) {
    if (value === defaultConfigs[key].value) {
      delete changedConfigs[key];
      configs[key].value = defaultConfigs[key].value;
    } else {
      changedConfigs[key].value = value;
    }
    Game.WriteSave();
  }

  static handleToggle(key) {
    const newValue = !configs[key];
    console.log(key);
    console.log(configs[key]);
    console.log(newValue);
    console.log(defaultConfigs[key]);
    if (newValue === defaultConfigs[key]) {
      delete changedConfigs[key];
      configs[key] = defaultConfigs[key];
    } else {
      changedConfigs[key] = newValue;
    }
    Game.WriteSave();
    UI.toggleButton(key);
  }

  static handleClick(key) {
    if (key === 'fillGardenWithSelectedSeed') {
      Garden.fillGardenWithSelectedSeed();
    } else if (key === 'savePlot') {
      Object.assign(changedConfigs, { savedPlot: Garden.clonePlot() });
      UI.labelToggleState('plotIsSaved', true);
    }
    Game.WriteSave();
  }

  static handleMouseoutPlotIsSaved(element) {
    Game.tooltip.shouldHide = 1;
  }

  static handleMouseoverPlotIsSaved(element) {
    if (configs.savedPlot.length > 0) {
      const content = UI.buildSavedPlot(configs.savedPlot);
      Game.tooltip.draw(element, window.escape(content));
    }
  }
}
