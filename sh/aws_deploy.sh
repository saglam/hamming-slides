#!/bin/bash

Compression="none gz br"

declare -A CompressionToEncoding
declare -A CompressionToExtension

CompressionToEncoding["none"]=""
CompressionToEncoding["gz"]="--content-encoding gzip"
CompressionToEncoding["br"]="--content-encoding br"

CompressionToExtension["none"]=""
CompressionToExtension["gz"]=".gz"
CompressionToExtension["br"]=".br"

Tasks="css js svg woff2 woff ttf"

declare -A TaskToContentType
declare -A TaskToDirectory

TaskToContentType["js"]="application/javascript"
TaskToContentType["css"]="text/css"
TaskToContentType["svg"]="image/svg+xml"
TaskToContentType["woff2"]="font/woff2"
TaskToContentType["woff"]="font/woff"
TaskToContentType["ttf"]="font/ttf"

TaskToDirectory["js"]="js"
TaskToDirectory["css"]="css"
TaskToDirectory["svg"]="img"
TaskToDirectory["woff2"]="font"
TaskToDirectory["woff"]="font"
TaskToDirectory["ttf"]="font"

for task in $Tasks; do
  for comp in $Compression; do
    aws s3 sync --metadata-directive REPLACE \
                --expires 2034-01-01T00:00:00Z \
                --acl public-read \
                --content-type "${TaskToContentType[$task]}" ${CompressionToEncoding[$comp]} \
                --cache-control "max-age=29030400, public" \
                --exclude="*" \
                --include="*.${task}${CompressionToExtension[$comp]}" \
                --exclude="all.${task}${CompressionToExtension[$comp]}" \
                build/${TaskToDirectory[$task]} \
                s3://mert.saglam.id/talks/hamming-ias/${TaskToDirectory[$task]}
  done
done

for comp in $Compression; do
  aws s3 cp   --metadata-directive REPLACE \
              --acl public-read \
              --cache-control "public" ${CompressionToEncoding[$comp]} \
              --content-type "text/html; charset=utf-8" \
              build/index.html${CompressionToExtension[$comp]} \
              s3://mert.saglam.id/talks/hamming-ias/index.html${CompressionToExtension[$comp]}
done

aws cloudfront create-invalidation \
    --distribution-id E18VDHOME7TQW8 \
    --paths "/talks/hamming-ias/" "/talks/hamming-ias/index.html*"

