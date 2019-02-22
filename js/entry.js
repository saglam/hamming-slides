/**
 * @fileoverview JavaScript entry point
 *
 */

/**
 * @const {NodeList<!Element>}
 */
let texnify = document.getElementsByClassName("texnify");

for (let i = 0, texnifyLen = texnify.length; i < texnifyLen; i++) {
  renderElement(texnify[i]);
}


let palette = {"1" : "#fee", s: "#BBB"};

// svg-def
{
  let /** string */ x = "100110101101110";
  let /** string */ y = "101100100101100";
  let /** string */ z = xor(x, y);

  getSvgElem("svg-def")
      .add(new SvgMatrix(80,  30, 40, 40, [x], [z], palette))
      .add(new SvgMatrix(80, 130, 40, 40, [y], [z], palette))
      .add(new SvgText  (14,  61, "x"))
      .add(new SvgText  (14, 161, "y"))
      .add(new SvgText  (40,  64, "="))
      .add(new SvgText  (40, 164, "="));
}

// svg-reduce
{
  let /** string */ x = "01101011" + "01010100" + "10111011";
  let /** string */ y = "00100011" + "01010101" + "10111110";
  let /** string */ z = xor(x, y);
  let /** string */ xp = "01" + "01" + "11";
  let /** string */ yp = "10" + "00" + "11";
  let /** string */ zp = xor(xp, yp);
  getSvgElem("svg-reduce")
      .addFrag(new SvgElem('g')
          .add(new SvgMatrix(90,   2, 43, 43, [x], [z], palette))
          .add(new SvgText  (10,  31, "x"))
          .add(new SvgText  (36,  34, "=")), 3)
      .addFrag(new SvgElem('g')
          .add(new SvgMatrix(90, 202, 43, 43, [y], [z], palette))
          .add(new SvgText  (10, 231, "y"))
          .add(new SvgText  (36, 234, "=")), 3)
      .addFrag(new SvgElem('g')
          .add(new SvgMatrix(90,  68,172, 43, [xp], [zp], palette))
          .add(new SvgText  (10,  97, "x'"))
          .add(new SvgText  (39, 100, "=")), 4)
      .addFrag(new SvgElem('g')
          .add(new SvgMatrix(90, 134,172, 43, [yp], [zp], palette))
          .add(new SvgText  (10, 163, "y'"))
          .add(new SvgText  (39, 166, "=")), 4);
}

//svg-conv-walk
{
  let x  = "                 ";
  let xc = "00000000000000000";
  let A = [x, x, x, x, x];
  let Ac = [xc, xc, xc, xc, xc];
  let b = ["0", "0", "0", "0", "0"];
  let bc = b;
  
  getSvgElem('svg-conv-walk')
      .add(new SvgMatrix(230, 30, 43, 43, [x], [xc], palette))
      .add(new SvgMatrix(230, 93, 43, 43, A, Ac, palette))
      .add(new SvgMatrix(100, 93, 43, 43, b, bc, palette));
}

