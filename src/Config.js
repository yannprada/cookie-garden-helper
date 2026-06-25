const defaultConfigs = {
  autoHarvest: false,
  autoHarvestAllMature: false,
  autoHarvestNewSeeds: true,
  autoHarvestAvoidImmortals: true,
  autoHarvestWeeds: true,
  autoHarvestCleanGarden: false,
  autoHarvestCheckCpSMult: false,
  autoHarvestMiniCpSMult: {
    value: 1,
    min: 0,
  },
  autoHarvestDying: true,
  autoHarvestDyingSeconds: 60,
  autoHarvestCheckCpSMultDying: false,
  autoHarvestMiniCpSMultDying: {
    value: 1,
    min: 0,
  },
  autoPlant: false,
  autoPlantCheckCpSMult: false,
  autoPlantMaxiCpSMult: {
    value: 0,
    min: 0,
  },
  savedPlot: [],
};
const configs = {};
Object.assign(configs, clone(defaultConfigs));
let changedConfigs = {};

const applySavedConfigs = savedConfigs => {
  changedConfigs = savedConfigs && typeof savedConfigs === 'object' ? savedConfigs : {};
  Object.assign(configs, clone(defaultConfigs), changedConfigs);
};

const modApi = {
  init: () => {
    log('mod init called');
  },
  save: () => {
    log('save called', { changedConfigKeys: Object.keys(changedConfigs) });
    Game.modSaveData[modName] = JSON.stringify(changedConfigs);
    return Game.modSaveData[modName];
  },
  load: saveString => {
    log('load called', { saveLength: saveString ? saveString.length : 0 });
    if (!saveString) {
      applySavedConfigs({});
      return;
    }

    try {
      applySavedConfigs(JSON.parse(saveString));
    } catch (error) {
      log('load failed', { error: error.message, saveString });
      applySavedConfigs({});
    }
  },
};

if (Game.mods && Game.mods[modName]) {
  log('registerMod skipped; updating existing mod api');
  Object.assign(Game.mods[modName], modApi);
  if (Game.modSaveData && Game.modSaveData[modName]) {
    Game.mods[modName].load(Game.modSaveData[modName]);
  }
} else {
  log('registerMod called');
  Game.registerMod(modName, modApi);
}
