/**
 * @module SvgElem
 * @fileoverview A wrapper around SVGElement which allows fluent construction
 * Also serves a base class for more involved SVG constructs such as SvgMatrix
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
  if (typeof arg === 'string') {
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
 * @public
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
 * @public
 * @param {SvgElem} child
 * @return {!SvgElem}
 */
SvgElem.prototype.add = function(child) {
  this.elem.appendChild(child.elem);
  return this;
}

/**
 * @public
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
 * @public
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
 * @param {string=} color is optional
 * @extends {SvgElem}
 */
function SvgText(x,  y, content, color) {
  if (content[0] == "$") {
    let /** string */ tex = renderInline(content.slice(1, -1), null, null);
    let /** number */ width = Math.min(Math.max(40, tex.length * 5), 340);
    let f = new SvgElem('foreignObject').withAttributes({"x": x, "y": y - 30, "height": 40, "width": width})
    if (color) {
      f.withAttributes({"color": color});
    }
    f.elem.innerHTML = tex;
    this.elem = f.elem;
  } else {
    /** const {!SvgElem} */
    let t = new SvgElem('text').withAttributes({"x": x, "y": y});
    if (color) {
      t.withAttributes({"fill": color});
    }
    this.elem = t.elem;
    this.elem.textContent = content;
  }
}

/**
 * Creates an cols by rows grid with empty cells.
 * The grid lines are of color palette.s
 * 
 * @private
 * @param {SvgElem} g
 * @param {!number} x
 * @param {!number} y
 * @param {!number} cellWidth
 * @param {!number} cellHeight
 * @param {!number} cols count of the grid
 * @param {!number} rows count of the grid
 * @param {!Object<string, string>} palette mapping color names to color codes
 */
function addGrid(g, x, y, cellWidth, cellHeight, cols, rows, palette) {
  /** @const {number} */
  let height = cellHeight * rows;
  /** @const {number} */
  let width = cellWidth * cols;

  g.add(new SvgElem('rect').withAttributes({
          "x": x,  "y": y,
          "rx": 4, "ry": 4,
          "width": width, "height": height,
          "stroke": palette.s, "fill": "none", "stroke-width": 2}));

  /** @const {number} */
  let offset = 1;
  for (let /** number */ col = 1, /** number */ cx = x + cellWidth; col < cols; ++col, cx += cellWidth) {
    g.add(new SvgElem('path')
          .withAttributes({
            "d"      : "M" + cx + " " + (y + offset) + "v" + (height - 2*offset),
            "stroke" : palette.s, "stroke-width": 2}));
  }

  for (let /** number */ row = 1, /** number */ cy = y + cellHeight; row < rows; ++row, cy += cellHeight) {
    g.add(new SvgElem('path').withAttributes({
            "d"      : "M" + (x + offset) + " " + cy + "h" + (width - 2*offset),
            "stroke" : palette.s, "stroke-width": 2}));
  }
}

/**
 * SVG matrix class
 *
 * @constructor
 * @param {!number} x
 * @param {!number} y
 * @param {!number} cellWidth
 * @param {!number} cellHeight
 * @param {!Array<Array<number>|string>} content of the matrix
 * @param {!Array<Array<number>|string>} colors of each cell
 * @param {!Object<string, string>} palette mapping color names to color codes
 * @extends {SvgElem}
 */
function SvgMatrix(x, y, cellWidth, cellHeight, content, colors, palette) {
  /** @const {number} */
  let rows = content.length;
  /** @const {number} */
  let cols = content[0].length;

  /** @const {!SvgElem} */
  let g = new SvgElem('g');

  /** @const {number} */
  let dx = cellWidth / 2 - 8;
  /** @const {number} */
  let dy = cellHeight / 2 + 11;
  /** @const {number} */
  let offset = 1;
  for (let row = 0, cy = y; row < rows; ++row, cy += cellHeight) {
    for (let col = 0, cx = x; col < cols; ++col, cx += cellWidth) {
      let /** string */ color = colors[row][col];
      if (color != "0") {
        g.add(new SvgElem('rect').withAttributes({"x": cx + offset, "y": cy + offset,
            "width": cellWidth - 2*offset, "height": cellHeight - 2*offset, "fill": palette[color]}));
      }
      g.add(new SvgText(cx + dx, cy + dy, content[row][col], palette.text));
    }
  }

  addGrid(g, x, y, cellWidth, cellHeight, cols, rows, palette);

  this.elem = g.elem;
}

SvgMatrix.prototype.withAttributes = SvgElem.prototype.withAttributes;

/**
 * SVG plot class
 *
 * @constructor
 * @param {!number} x
 * @param {!number} y
 * @param {!number} dataPointWidth
 * @param {!number} height
 * @param {!Array<number>} data
 * @param {!Object<string, string>} palette mapping color names to color codes
 * @param {!Object} dimensions of the plot
 * @extends {SvgElem}
 */
function SvgPlot(x, y, dataPointWidth, height, data, dimensions, palette) {
  /** @const {number} */
  let n = data.length;
  /** @const {number} */
  let width = n * dataPointWidth;
  /** @const {number} */
  let smoothness = dimensions.smoothness;

  let pathD = "M" + x + "," + (y + height - 2)
            + "c" + (dataPointWidth / 4) + "," + (-height * data[0] * 0.8).toFixed(2) + " "
                  + (dataPointWidth / 2 * smoothness) + "," + (-height * data[0]).toFixed(2) + " "
                  + (dataPointWidth / 2) + "," + (-height * data[0]).toFixed(2);

  for (let i = 1; i < n; ++i) {
    pathD += "s" + (dataPointWidth * smoothness) + "," + (height * (data[i-1] - data[i])).toFixed(2) + " "
                 + dataPointWidth + "," + (height * (data[i-1] - data[i])).toFixed(2);
  }
  pathD += "s" + (dataPointWidth / 2 * smoothness).toFixed(2) + "," + (data[n - 1] * smoothness).toFixed(2) + " "
               + (dataPointWidth / 2) + ", " + data[n-1];


  let g = new SvgElem('g').withAttributes({"font-size": 15});

  if (dimensions.grid) {
    let grid = dimensions.grid;
    for (let /** number */ i = 0, /** number */ n = grid.length; i < n; ++i) {
      let yy = (y + height * (1 - grid[i][0]));
      g.add(new SvgElem('path').withAttributes({
                    "stroke": "#666",
                         "d": "M" + x + "," + yy + "h" + width,
              "stroke-width": grid[i][2]}))
      if (grid[i][1]) {
       g.add(new SvgText(x + width + 8, yy + 5, grid[i][1]));
      }
    }
  }

  g.add(new SvgElem('path').withAttributes({
                "stroke": palette.line,
          "stroke-width": dimensions.lineWidth || 4,
                  "fill": palette.area,
                     "d": pathD}))

  this.elem = g.elem;
}

/**
 *
 * @constructor
 * @param {number} x coordinate of the back
 * @param {number} y coordinate of the back
 * @param {number} dx to the head
 * @param {number} dy to the head
 * @extends {SvgElem}
 */
function SvgArrow(x, y, dx, dy, curvature) {
  return new SvgElem('g');
}

