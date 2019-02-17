#!/bin/bash

constDate="$(date +%Y)-01-01"
cssMd5=$(sha1sum -b build/css/all.css | cut -c1-40 | base64 | cut -c3-8)
jsMd5=$(sha1sum -b build/js/all.js | cut -c1-40 | base64 | cut -c3-8)
mkdir -p build/css build/js build/img
cp build/css/all.css build/css/${cssMd5}.css
cp build/js/all.js build/js/${jsMd5}.js
perl -0777 -i -pe "s#<!-- build:css -->\n?([\s\S]*?)\n?<!-- endbuild -->#<link rel=stylesheet href=\"css/${cssMd5}.css\">#" build/index.html
perl -0777 -i -pe "s#<!-- build:js -->\n?([\s\S]*?)\n?<!-- endbuild -->#<script async src=\"js/${jsMd5}.js\"></script>#" build/index.html
touch --date="${constDate}" build/css/${cssMd5}.css
touch --date="${constDate}" build/js/${jsMd5}.js
brotli --quality 11 --force --input build/css/${cssMd5}.css   --output build/css/${cssMd5}.css.br
brotli --quality 11 --force --input build/js/${jsMd5}.js      --output build/js/${jsMd5}.js.br
zopfli --i20 --best --keep --force build/css/${cssMd5}.css
zopfli --i20 --best --keep --force build/js/${jsMd5}.js
touch --date="${constDate}" build/css/${cssMd5}.css.gz
touch --date="${constDate}" build/js/${jsMd5}.js.gz

for file in img/*; do
  echo ${file}
  if grep -q ${file} build/index.html; then
    svgo --enable={sortAttrs,removeTitle,cleanupIDs} -i ${file} -o build/${file}
    hash=$(sha1sum -b build/${file} | cut -c1-40 | base64 | cut -c3-8)
    mv -f build/${file} build/img/${hash}.svg
    touch --date="${constDate}" build/img/${hash}.svg
    brotli --quality 11 --force --input build/img/${hash}.svg --output build/img/${hash}.svg.br
    zopfli --i20 --best --keep --force build/img/${hash}.svg
    touch --date="${constDate}" build/img/${hash}.svg.gz
    perl -0777 -i -pe "s#${file}#img/${hash}.svg#" build/index.html
  fi
done

