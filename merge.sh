#!/bin/sh
(printf '{\n\n'; cat ./src/*.js; printf '\n\n}') > cookie-garden-helper.js
