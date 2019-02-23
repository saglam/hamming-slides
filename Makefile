present: local_deploy
	./hamming --nocompile

local_deploy: build/index.html build/index.html.gz build/index.html.br

build/js/all.js: js/texne.js js/SVGElement.js js/SvgElem.js js/mathplot.js js/entry.js js/reveal.js
	mkdir -p build/js
	java -jar ../../code/bluck-out/java/compiler.jar -W VERBOSE -O ADVANCED \
	     --language_out ECMASCRIPT5_STRICT \
	     --charset UTF-8 \
	     --use_types_for_optimization \
	     --js $^ \
	     | uglifyjs -m -o $@

build/css/all.css: font/*.woff css/gito.css css/reveal.css css/theme.css css/texne.css
	mkdir -p build/css
	cp -f css/gito.css build/css/gito.css
	./sh/fillcss.sh
	cat build/css/gito.css css/reveal.css css/theme.css css/texne.css | csso --output $@
	rm build/css/gito.css

build/index.html: htmlminifier.conf index.html \
                  build/css/all.css build/css/all.css.gz build/css/all.css.br \
                  build/js/all.js build/js/all.js.gz build/js/all.js.br
	cp -f index.html build/tmp.html
	./sh/fillhtml.sh
	html-minifier -c htmlminifier.conf build/tmp.html > build/index.html
	rm -f build/tmp.html

aws_deploy: local_deploy
	./sh/aws_deploy.sh

clean:
	rm -rf build

%.gz: %
	cp $< $@.tmp
	touch $@.tmp --date="2019-01-01"
	zopfli --force --best --i20 $@.tmp
	mv $@.tmp.gz $<.gz
	rm -f $@.tmp

%.br: %
	cp $< $@.tmp
	touch $@.tmp --date="2019-01-01"
	brotli --force --quality 11 --repeat 20 --input $@.tmp --output $@
	touch $@
	rm $@.tmp

