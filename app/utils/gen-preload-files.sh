#!/bin/bash

REL_PATH=..
ASSETS_PATH=assets
PRELOAD_FILE=preload.json
IMG_PATH=${ASSETS_PATH}/images
VID_FILE=${ASSETS_PATH}/videos/videos.json
TMP=$(mktemp)

init() {
    if [ ! -d $PRELOAD_DIR ]
    then
        mkdir $PRELOAD_DIR
    fi

    touch $TMP
    echo "{ \"files\": [" >> $TMP
}

clean() {
    cat $VID_FILE >> $TMP
    echo "] }" >> $TMP

    cp -f $TMP ${PWD}/${ASSETS_PATH}/${PRELOAD_FILE}
    echo "Wrote ${ASSETS_PATH}/${PRELOAD_FILE}"
    rm -f $TMP
}

parse_img() {
    count=0

    for file in ${IMG_PATH}/*
    do
        size=$(wc -c "$file" | cut -f 1 -d ' ')

        if [[ $count == 0 ]]
        then
            echo "{" >> $TMP
        else
            echo ",{" >> $TMP
        fi

        echo "\"type\": \"IMAGE\"" >> $TMP
        echo ",\"source\": \"${REL_PATH}/${file}\"" >> $TMP
        echo ",\"size\": ${size}" >> $TMP

        echo "}" >> $TMP

        (( count++ ))
    done

    echo "Parsed ${count} images..."
}

main() {
    init
    parse_img
    clean
}

main
