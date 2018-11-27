#!/usr/bin/env bash

lerna exec --scope @haechi-labs/vvisp -- npm run testAll --stream --exit
lerna exec --scope @haechi-labs/vvisp-utils -- npm run testAll --stream --exit
