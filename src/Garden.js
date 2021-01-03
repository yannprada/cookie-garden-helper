class Garden {
  static get minigame() {
    return Game.Objects.Farm.minigame;
  }

  static get isActive() {
    return this.minigame !== undefined;
  }

  static get CpSMult() {
    let res = 1;
    // eslint-disable-next-line no-restricted-syntax
    for (const key in Game.buffs) {
      if (typeof Game.buffs[key].multCpS !== 'undefined') {
        res *= Game.buffs[key].multCpS;
      }
    }
    return res;
  }

  static get secondsBeforeNextTick() {
    return (this.minigame.nextStep - Date.now()) / 1000;
  }

  static hasHarvestBenefit(plant) {
    return typeof plant.onHarvest === 'function';
  }

  static get selectedSeed() {
    return this.minigame.seedSelected;
  }

  static set selectedSeed(seedId) {
    this.minigame.seedSelected = seedId;
  }

  static clonePlot() {
    const plot = clone(this.minigame.plot);
    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        const seedId = plot[x][y][0];
        const plant = this.getPlant(seedId);
        if (plant && !plant.plantable) {
          plot[x][y] = [0, 0];
        }
      }
    }
    return plot;
  }

  static getPlant(id) {
    return this.minigame.plantsById[id - 1];
  }

  static getTile(x, y) {
    const tile = this.minigame.getTile(x, y);
    return { seedId: tile[0], age: tile[1] };
  }

  static getPlantStage(tile) {
    const plant = this.getPlant(tile.seedId);
    if (tile.age < plant.mature) {
      return 'young';
    }
    if (tile.age + Math.ceil(plant.ageTick + plant.ageTickR) < 100) {
      return 'mature';
    }
    return 'dying';
  }

  static tileIsEmpty(x, y) {
    return this.getTile(x, y).seedId === 0;
  }

  static plantSeed(seedId, x, y) {
    const plant = this.getPlant(seedId + 1);
    if (plant.plantable) {
      this.minigame.useTool(seedId, x, y);
    }
  }

  static forEachTile(callback) {
    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        if (this.minigame.isTileUnlocked(x, y)) {
          callback(x, y);
        }
      }
    }
  }

  static harvest(x, y) {
    this.minigame.harvest(x, y);
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

  static handleYoung(config, plant, x, y) {
    if (plant.weed && config.autoHarvestWeeds) {
      this.harvest(x, y);
    }
    let seedId = config.savedPlot.length > 0 ? config.savedPlot[y][x][0] : [0, 0];
    seedId -= 1;
    if (
      config.autoHarvestCleanGarden &&
      ((plant.unlocked && seedId === -1) || (seedId > -1 && seedId !== plant.id)) &&
      plant.plantable
    ) {
      this.harvest(x, y);
    }
  }

  static handleMature(config, plant, x, y) {
    if (!plant.unlocked && config.autoHarvestNewSeeds) {
      this.harvest(x, y);
    } else if (
      config.autoHarvestCheckCpSMult &&
      this.hasHarvestBenefit(plant) &&
      this.CpSMult >= config.autoHarvestMiniCpSMult.value
    ) {
      this.harvest(x, y);
    }
  }

  static handleDying(config, plant, x, y) {
    if (config.autoHarvestCheckCpSMultDying && this.CpSMult >= config.autoHarvestMiniCpSMultDying.value) {
      this.harvest(x, y);
    } else if (config.autoHarvestDying && this.secondsBeforeNextTick <= config.autoHarvestDyingSeconds) {
      this.harvest(x, y);
    }
  }

  static run(config) {
    this.forEachTile((x, y) => {
      if (config.autoHarvest && !this.tileIsEmpty(x, y)) {
        const tile = this.getTile(x, y);
        const plant = this.getPlant(tile.seedId);

        if (plant.immortal && config.autoHarvestAvoidImmortals) {
          // do nothing
        } else {
          const stage = this.getPlantStage(tile);
          switch (stage) {
            case 'young':
              this.handleYoung(config, plant, x, y);
              break;
            case 'mature':
              this.handleMature(config, plant, x, y);
              break;
            case 'dying':
              this.handleDying(config, plant, x, y);
              break;
            default:
              console.log(`Unexpected plant stage: ${stage}`);
          }
        }
      }

      if (
        config.autoPlant &&
        (!config.autoPlantCheckCpSMult || this.CpSMult <= config.autoPlantMaxiCpSMult.value) &&
        this.tileIsEmpty(x, y) &&
        config.savedPlot.length > 0
      ) {
        const seedId = config.savedPlot[y][x][0];
        if (seedId > 0) {
          this.plantSeed(seedId - 1, x, y);
        }
      }
    });
  }
}
