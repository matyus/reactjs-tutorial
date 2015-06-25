#!/bin/bash

clear

echo "Watching .jsx files"

jsx --watch --extension jsx src/ build/

