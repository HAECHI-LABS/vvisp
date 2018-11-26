#!/usr/bin/env bash

ganache-cli --account="0x9741fa712a6912b862c9043f8752ffae513cb01895985998c61620da5aaf2d2d,100000000000000000000000"  > /dev/null &

lerna exec --scope @haechi-labs/haechi-cli -- npm run ci --stream --exit
lerna exec --scope @haechi-labs/haechi-utils -- npm run ci --stream --exit
