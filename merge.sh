#!/bin/sh
(
  printf '{\n\n';
  cat ./src/*.js;
  cat ./index.js;
  printf '\n\n}'
) > cookie-garden-helper.js
