/**
 * @fileoverview A library for plotting and drawing mathematics in SVG format
 *
 */


/**
 * @param {string} x
 * @param {string} y
 * @return {string}
 */
function xor(x, y) {
  let /** string */ z = "";
  for (let /** number */ i = 0, /** number */ n = x.length; i < n; ++i) {
    z += x[i] == y[i] ? "0" : "1";
  }
  return z;
}

