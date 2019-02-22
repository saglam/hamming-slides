present: local_deploy
	./hamming --nocompile

local_deploy: build/index.html

build/js/all.js: js/texne.js js/SVGElement.js js/SvgElem.js js/mathplot.js js/entry.js js/reveal.js
	mkdir -p build/js
	java -jar ../../code/bluck-out/java/compiler.jar -W VERBOSE -O ADVANCED \
	     --language_out ECMASCRIPT5_STRICT --charset UTF-8 \
	     --variable_renaming_report build/js/mapping.txt \
	     --js $^ \
	     | uglifyjs -m -o $@

build/css/all.css: font/*.woff css/gito.css css/reveal.css css/theme.css css/texne.css
	mkdir -p build/css
	cp css/gito.css build/css/gito.css
	./sh/fillcss.sh
	cat build/css/gito.css css/reveal.css css/theme.css css/texne.css | csso --output $@
	rm build/css/gito.css

build/index.html: htmlminifier.conf index.html build/css/all.css build/js/all.js
	cp -f index.html build/index.html
	./sh/fillhtml.sh
	html-minifier -c htmlminifier.conf build/index.html > build/tmp.html
	mv -f build/tmp.html build/index.html

aws_deploy: local_deploy
	./sh/aws_deploy.sh

clean:
	rm -rf build

