local_deploy: build/index.html build/img build/font

.PHONY: build/img build/font

build/font: font/gs*.woff font/gs*.ttf
	mkdir -p build/font
	cp -rf font/gs*.woff build/font/
	cp -rf font/gs*.ttf build/font/

build/img: img/*
	cp -rf img build/img

build/js/all.js: js/texne.js js/reveal.js
	mkdir -p build/js
	# cat $^ > $@
	java -jar ../../code/bluck-out/java/compiler.jar -W VERBOSE -O ADVANCED \
	     --language_out ECMASCRIPT5_STRICT --charset UTF-8 \
	     --js js/texne.js js/reveal.js \
	     | uglifyjs -m -o $@

build/css/all.css: css/reveal.css css/theme.css css/gill-sans.css css/texne.css
	mkdir -p build/css
	cat $^ | csso --output $@

build/index.html: build/css/all.css build/js/all.js
	cp -f index.html build/index.html
	./fillhtml
	html-minifier -c htmlminifier.conf build/index.html > build/tmp.html
	mv -f build/tmp.html build/index.html

debug: local_deploy
	./hamming

present: local_deploy
	./hamming --nocompile

clean:
	rm -rf build

