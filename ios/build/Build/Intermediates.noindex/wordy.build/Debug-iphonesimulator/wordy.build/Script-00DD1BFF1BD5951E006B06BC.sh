#!/bin/sh
export NODE_BINARY='node --max_old_space_size=8192'
../node_modules/react-native/packager/react-native-xcode.sh
