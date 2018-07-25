
if (Garden.isActive) {
  Main.init();
} else {
  let msg = `You don't have a garden yet. This mod won't work without it!`;
  console.log(msg);
  UI.createWarning(msg);
}
