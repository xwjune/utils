#!/bin/sh

npm run build:lib && \
npm run build:umd && \
npm run build:umd:min
