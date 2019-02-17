#!/bin/sh

constDate="$(date +%Y)-01-01"

types="gt300i gt300 gt400 gt700"
mkdir -p build/font
for type in $types; do
  echo ${type}
  hash=$(sha1sum -b font/${type}.woff | cut -c1-40 | base64 | cut -c3-8)
  cp font/${type}.woff build/font/${hash}.woff
  touch --date="${constDate}" build/font/${hash}.woff
  perl -0777 -i -pe "s#${type}#${hash}#g" build/css/gito.css
done

