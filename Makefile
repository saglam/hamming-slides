local_deploy: build/index.html

build/js/all.js: js/texne.js js/reveal.js
	mkdir -p build/js
	java -jar ../../code/bluck-out/java/compiler.jar -W VERBOSE -O ADVANCED \
	     --language_out ECMASCRIPT5_STRICT --charset UTF-8 \
	     --js js/texne.js js/reveal.js \
	     | uglifyjs -m -o $@

build/css/all.css: css/*.css font/gill-sans/gill-sans.css
	mkdir -p build/css
	cat $^ | csso --output $@

build/index.html: build/css/all.css build/js/all.js

debug: local_deploy
	./hamming

present: local_deploy
	./hamming --fullscreen

clean:
	rm -rf build

