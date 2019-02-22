#!/bin/sh

aws s3 sync --metadata-directive REPLACE \
            --expires 2034-01-01T00:00:00Z \
            --acl public-read \
            --content-type application/javascript \
            --exclude="all.js" \
            --cache-control max-age=29030400,public build/js s3://mert.saglam.id/talks/hamming-ias/js

aws s3 sync --metadata-directive REPLACE \
            --expires 2034-01-01T00:00:00Z \
            --acl public-read \
            --content-type text/css \
            --exclude="all.css" \
            --cache-control max-age=29030400,public build/css s3://mert.saglam.id/talks/hamming-ias/css	

aws s3 sync --metadata-directive REPLACE \
            --expires 2034-01-01T00:00:00Z \
            --acl public-read \
            --content-type image/svg+xml \
            --cache-control max-age=29030400,public build/img s3://mert.saglam.id/talks/hamming-ias/img	

aws s3 sync --metadata-directive REPLACE \
            --expires 2034-01-01T00:00:00Z \
            --acl public-read \
            --content-type font/woff \
            --cache-control max-age=29030400,public build/font s3://mert.saglam.id/talks/hamming-ias/font

aws s3 cp   --acl public-read \
            --content-type text/html build/index.html s3://mert.saglam.id/talks/hamming-ias/index.html

aws cloudfront create-invalidation --distribution-id E18VDHOME7TQW8 --paths '/talks/hamming-ias/'
