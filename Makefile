local_deploy: build/index.html

build/js/all.js: js/*.js
	mkdir -p build/js
	# cat $^ > $@
	java -jar ../../code/bluck-out/java/compiler.jar -W VERBOSE -O ADVANCED \
	     --language_out ECMASCRIPT5_STRICT --charset UTF-8 \
	     --js js/texne.js js/reveal.js \
	     | uglifyjs -m -o $@

build/css/all.css: font/*.woff css/gito.css css/reveal.css css/theme.css css/texne.css
	mkdir -p build/css
	cp css/gito.css build/css/gito.css
	./fillcss
	cat build/css/gito.css css/reveal.css css/theme.css css/texne.css | csso --output $@
	rm build/css/gito.css

build/index.html: htmlminifier.conf index.html build/css/all.css build/js/all.js
	cp -f index.html build/index.html
	./fillhtml
	html-minifier -c htmlminifier.conf build/index.html > build/tmp.html
	mv -f build/tmp.html build/index.html

aws_deploy: local_deploy
	rm build/js/all.js
	rm build/css/all.css
	aws s3 sync --metadata-directive REPLACE \
	            --expires 2034-01-01T00:00:00Z \
	            --acl public-read \
	            --content-type application/javascript \
	            --cache-control max-age=2592000,public build/js s3://mert.saglam.id/talks/hamming-ias/js
	aws s3 sync --metadata-directive REPLACE \
	            --expires 2034-01-01T00:00:00Z \
	            --acl public-read \
	            --content-type text/css \
	            --cache-control max-age=2592000,public build/css s3://mert.saglam.id/talks/hamming-ias/css	
	aws s3 sync --metadata-directive REPLACE \
	            --expires 2034-01-01T00:00:00Z \
	            --acl public-read \
	            --content-type image/svg+xml \
	            --cache-control max-age=2592000,public build/img s3://mert.saglam.id/talks/hamming-ias/img	
	aws s3 sync --metadata-directive REPLACE \
	            --expires 2034-01-01T00:00:00Z \
	            --acl public-read \
	            --content-type font/woff \
	            --cache-control max-age=2592000,public build/font s3://mert.saglam.id/talks/hamming-ias/font
	aws s3 cp   --acl public-read \
	            --content-type text/html build/index.html s3://mert.saglam.id/talks/hamming-ias/index.html
	aws cloudfront create-invalidation --distribution-id E18VDHOME7TQW8 --paths '/talks/hamming-ias/index.html'

debug: local_deploy
	./hamming

present: local_deploy
	./hamming --nocompile

clean:
	rm -rf build

