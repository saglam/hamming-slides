/**
 * @module SvgElem
 * @fileoverview An wrapper around SVGElement which allows fluent construction
 */

/**
 * Namespace URI for SVG
 * @const {string}
 */
SvgElem.prototype.Uri = 'http://www.w3.org/2000/svg';

/**
 * @constructor
 * @param {string|!SVGElement} arg can be either an SVGElement 
 * or a SVGElement name in which case a new one is created with the given name.
 */
function SvgElem(arg) {
  if (typeof arg == 'string') {
    this.elem = /** @type {!SVGElement} */ (document.createElementNS(this.Uri, arg));
  } else {
    this.elem = arg;
  }
}

/**
 * @param {string} domId
 * @return {!SvgElem}
 */
function getSvgElem(domId) {
  return new SvgElem(/** @type {!SVGElement} */ (document.getElementById(domId)));
}

/**
 * @param {Object} attrs cointaining various attributes
 * @return {!SvgElem}
 */
SvgElem.prototype.withAttributes = function(attrs) {
  for (var attr in attrs) {
    this.elem.setAttributeNS(null, attr, attrs[attr]);
  }
  return this;
}

/**
 * @param {SvgElem} child
 * @return {!SvgElem}
 */
SvgElem.prototype.add = function(child) {
  this.elem.appendChild(child.elem);
  return this;
}

/**
 * @param {SvgElem} child
 * @param {number} index of the fragment
 * @return {!SvgElem}
 */
SvgElem.prototype.addFrag = function(child, index) {
  child.elem.setAttributeNS(null, "data-fragment-index", index);
  child.elem.classList.add("fragment");
  this.elem.appendChild(child.elem);
  return this;
}

/**
 * @return {!SVGElement}
 */
SvgElem.prototype.unwrap = function() {
  return this.elem;
}

/**
 * @constructor
 * @param {!number} x
 * @param {!number} y
 * @param {string} content
 * @extends {SvgElem}
 */
function SvgText(x,  y, content) {
  this.elem = new SvgElem('text').withAttributes({"x": x, "y": y}).unwrap();
  this.elem.textContent = content;
}

/**
 * Creates an cols by rows grid with empty cells
 * @return {!SvgElem}
 */
function createGrid(x, y, cellWidth, cellHeight, cols, rows, palette) {
  /** @const {number} */
  let height = cellHeight * rows;
  /** @const {number} */
  let width = cellWidth * cols;

  /** @const {!SvgElem} */
  let g = new SvgElem('g').add(new SvgElem('rect').withAttributes({
          "x": x,  "y": y,
          "rx": 2, "ry": 2,
          "width": width, "height": height, "stroke": palette.s, "fill": "none"}));

  /** @const {number} */
  let offset = 1;
  for (let /** number */ col = 1, /** number */ cx = x + cellWidth; col < cols; ++col, cx += cellWidth) {
    g.add(new SvgElem('path')
          .withAttributes({
            "d"      : "M" + cx + " " + (y + offset) + "v" + (height - 2*offset),
            "stroke" : palette.s}));
  }

  for (let /** number */ row = 1, /** number */ cy = y; row < rows; ++row, cy += cellHeight) {
    g.add(new SvgElem('path').withAttributes({
            "d"      : "M" + (x + offset) + " " + cy + "h" + (width - 2*offset),
            "stroke" : palette.s}));
  }
  return g;
}

/**
 * SVG matrix class
 *
 * @constructor
 * @extends {SvgElem}
 */
function SvgMatrix(x, y, cellWidth, cellHeight, content, colors, palette) {
  /** @const {number} */
  let rows = content.length;
  /** @const {number} */
  let cols = content[0].length;

  /** @const {!SvgElem} */
  let g = createGrid(x, y, cellWidth, cellHeight, cols, rows, palette);

  /** @const {number} */
  let dx = cellWidth / 2 - 8;
  let dy = cellHeight / 2 + 11;
  for (let row = 0, cy = y; row < rows; ++row, cy += cellHeight) {
    for (let col = 0, cx = x; col < cols; ++col, cx += cellWidth) {
      let /** string */ color = colors[row][col];
      if (color != "0") {
        g.add(new SvgElem('rect').withAttributes({"x": cx + 1, "y": cy + 1,
            "width": cellWidth - 2, "height": cellHeight - 2, "fill": palette[color]}));
      }
      g.add(new SvgText(cx + dx, cy + dy, content[row][col]));
    }
  }

  this.elem = g.elem;
}

