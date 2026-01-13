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
Object.assign(configs, defaultConfigs);
let changedConfigs = {};

Game.registerMod('Cookie Garden Helper', {
  save: () => {
    Object.assign(configs, changedConfigs);
    return JSON.stringify(changedConfigs);
  },
  load: saveString => {
    changedConfigs = JSON.parse(saveString);
    Object.assign(configs, changedConfigs);
  },
});
