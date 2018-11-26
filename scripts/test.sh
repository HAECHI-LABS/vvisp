#!/usr/bin/env bash

lerna exec --scope @haechi-labs/haechi-cli -- npm run testAll --stream --exit
lerna exec --scope @haechi-labs/haechi-utils -- npm run testAll --stream --exit
