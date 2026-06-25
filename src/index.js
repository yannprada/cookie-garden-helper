log('startup gate reached', {
  gardenActive: Garden.isActive,
  minigameLoaded: !!Garden.minigame,
});

if (Garden.isActive) {
  Main.init();
} else {
  const msg = "You don't have a garden yet. This mod won't work without it!";
  log('garden inactive warning', { message: msg });
  UI.createWarning(msg);
}
