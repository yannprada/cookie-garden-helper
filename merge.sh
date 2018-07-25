#!/bin/sh
(
  printf '{\n\n';
  cat ./src/utils.js;
  cat ./src/Config.js;
  cat ./src/Garden.js;
  cat ./src/UI.js;
  cat ./src/Main.js;
  cat ./src/index.js;
  printf '\n\n}'
) > cookie-garden-helper.js
