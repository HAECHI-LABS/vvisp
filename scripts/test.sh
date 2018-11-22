#!/usr/bin/env bash

ganache-cli --account="0x9741fa712a6912b862c9043f8752ffae513cb01895985998c61620da5aaf2d2d,100000000000000000000000"  > /dev/null &

lerna exec --scope haechi-cli -- npm run testAll --stream --exit
