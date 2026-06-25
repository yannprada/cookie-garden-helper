class Main {
  static init() {
    diagnostics.initCalls += 1;
    log('Main.init called', {
      existingTimerId: diagnostics.timerId,
      gardenActive: Garden.isActive,
      minigameLoaded: !!Garden.minigame,
    });

    if (diagnostics.initialized) {
      log('Main.init skipped; mod already initialized', { timerId: diagnostics.timerId });
      return;
    }

    diagnostics.initialized = true;

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
    diagnostics.starts += 1;
    log('Main.start called', {
      interval: this.timerInterval,
      existingTimerId: diagnostics.timerId,
    });

    if (diagnostics.timerId) {
      log('Main.start skipped; timer already exists', { timerId: diagnostics.timerId });
      return;
    }

    this.timerId = window.setInterval(() => Garden.run(configs), this.timerInterval);
    diagnostics.timerId = this.timerId;
    log('Main.start created timer', { timerId: diagnostics.timerId });
  }

  static stop() {
    log('Main.stop called', { timerId: diagnostics.timerId });
    window.clearInterval(diagnostics.timerId);
    diagnostics.timerId = null;
    diagnostics.initialized = false;
  }

  static handleChange(key, value) {
    const defaultConfig = defaultConfigs[key];
    const currentConfig = configs[key];
    const parsedValue = typeof defaultConfig.value === 'number' ? Number(value) : value;

    if (parsedValue === defaultConfig.value) {
      delete changedConfigs[key];
      currentConfig.value = defaultConfig.value;
    } else {
      currentConfig.value = parsedValue;
      changedConfigs[key] = { ...currentConfig, value: parsedValue };
    }
    Game.WriteSave();
  }

  static handleToggle(key) {
    const newValue = !configs[key];
    log('Main.handleToggle called', {
      key,
      currentValue: configs[key],
      newValue,
      defaultValue: defaultConfigs[key],
    });
    if (newValue === defaultConfigs[key]) {
      delete changedConfigs[key];
      configs[key] = defaultConfigs[key];
    } else {
      configs[key] = newValue;
      changedConfigs[key] = newValue;
    }
    Game.WriteSave();
    UI.toggleButton(key);
  }

  static handleClick(key) {
    if (key === 'fillGardenWithSelectedSeed') {
      Garden.fillGardenWithSelectedSeed();
    } else if (key === 'savePlot') {
      const savedPlot = Garden.clonePlot();
      Object.assign(configs, { savedPlot });
      Object.assign(changedConfigs, { savedPlot });
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
