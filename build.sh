#!/bin/bash
#set -v # do not expand variables
set -x # output
set -e # stop on error
set -u # stop if you use an uninitialized variable

TODAY=`date +%Y-%m-%d-%H-%M-%S`

export PATH=$PATH:/home/daniele/hack/android/android-studio/gradle/gradle-4.6/bin
export ANDROID_HOME=/home/daniele/Android/Sdk
ionic cordova build android
