#!/bin/sh

docker exec JDK /bin/sh -c "javac usr/src/dockerTest/Main.java"
docker exec JDK /bin/sh -c "cd usr/src/dockerTest; java Main > output.txt"

