local_deploy: build/index.html build/img build/font

.PHONY: build/img build/font

build/font: font/gill-sans/gs*.woff font/gill-sans/gs*.ttf
	mkdir -p build/font
	cp -rf font/gill-sans/gs*.woff build/font/
	cp -rf font/gill-sans/gs*.ttf build/font/

build/img: img/*
	cp -rf img build/img

build/js/all.js: js/texne.js js/reveal.js
	mkdir -p build/js
	cat $^ > $@
	#java -jar ../../code/bluck-out/java/compiler.jar -W VERBOSE -O ADVANCED \
	#     --language_out ECMASCRIPT5_STRICT --charset UTF-8 \
	#     --js js/texne.js js/reveal.js \
	#     | uglifyjs -m -o $@

build/css/all.css: css/*.css font/gill-sans/gill-sans.css
	mkdir -p build/css
	cat $^ > $@

build/index.html: build/css/all.css build/js/all.js
	cp -f index.html build/index.html
	./fillhtml
	# html-minifier -c htmlminifier.conf build/index.html > build/tmp.html
	# mv -f build/tmp.html build/index.html

debug: local_deploy
	./hamming

present: local_deploy
	./hamming --fullscreen

clean:
	rm -rf build

