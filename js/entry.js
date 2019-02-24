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


let palette = {"1" : "#fee", s: "#DDD"};

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

//svg-praccept
{
  let palette1 = {
         s: "#5080c6",
       "b": "#64aafa",
       "r": "#ffdcdc",
      text: "white",
      //line: "#e1eaff",
      area: "#f1faff",
      line: "#5080c6",
      //area: "#64aafa"
  }

  let palette2 = {
         s: "#fbb",
       "b": "#64aafa",
       "r": "#ffe9e9",
      text: "#035"
  }

  /** @const {!Array<number>} */
  let data = [0.17, 0.1, 0.19, 0.01, 0.13, 0.86, 0.07, 0.001, 0.2, 0.04, 0.2, 0.05, 0, 0];
  /** @const {!Object} */
  let dimensions = {miny: 0, maxy : 1, smoothness: 0.6, grid: [[0, "0", 3], [0.2, "δ", 0.3], [1, "1", 0.3], [0.8, "1-δ", 0.3]]};

  /** @const {!Array<number>} */
  let data2 = [0.17, 0.1, 0.19, 0.60, 0.70, 0.86, 0.67, 0.4, 0.3, 0.04, 0.2, 0.05, 0, 0];

  getSvgElem('svg-praccept')
      .add(new SvgMatrix(269,  30, 40, 40, ["00000000"], ["rrrrrrrr"], palette2))
      .add(new SvgMatrix( 30,  30, 40, 40, ["111111"], ["bbbbbb"], palette1))
      .add(new SvgElem('g')
          .withAttributes({"font-size": 24})
          .add(new SvgText(   43, 100, "0"))
          .add(new SvgText(  243, 100, "k"))
          .add(new SvgText(  563, 100, "n")))
      .addFrag(new SvgElem('g')
          .add(new SvgMatrix(230, 150, 40, 40, ["000000000"], ["rrrrrrrrr"], palette2))
          .add(new SvgMatrix( 30, 150, 40, 40, ["11111"], ["bbbbb"], palette1)), 2)
      .addFrag(new SvgElem('g')
          .add(new SvgElem('g').withAttributes({"font-size": 40})
              .add(new SvgText( -5,  180, "¬"))
              .add(new SvgText(300,  120, "∧"))
              .add(new SvgText(300,  245, "=")))
          .add(new SvgMatrix( 270, 270, 40, 40, ["00000000"], ["rrrrrrrr"], palette2))
          .add(new SvgMatrix(  30, 270, 40, 40, ["00000"], ["rrrrr"], palette2))
          .add(new SvgMatrix( 230, 270, 40, 40, ["1"]  , ["b"  ], palette1)), 3)
      .addFrag(new SvgElem('g')
          .add(new SvgPlot(  30, 360, 40, 70, data, dimensions, palette1))
          .add(new SvgText(   0, 400, "$p_k\\colon$")), 4)
      .addFrag(new SvgElem('g').withAttributes({"font-size": 24})
          .add(new SvgText(  190, 580, "$p_{k-2}$"))
          .add(new SvgText(  243, 580, "$p_k$"))
          .add(new SvgText(  273, 580, "$p_{k+2}$"))
          .add(new SvgPlot(  30, 480, 40, 70, data2, {smoothness: 0.6, grid: [[0, null, 3]]}, palette1))
          .add(new SvgText( 350, 485, "$p_{k+2}p_{k-2}\\ge p_k^2 \\ge c\\cdot(1-\\delta)^2$")), 6)


}

//svg-conv-walk
{
  let x  = "                 ";
  let xc = "00000000000000000";
  let A = ["01010100101001010",
           "10010101100011101",
           "11101001111010010",
           "10011010000100011",
           "00100010000001100"];
  let Ac = [xc, xc, xc, xc, xc];
  let b = ["0", "0", "0", "0", "0"];
  let bc = b;

  getSvgElem('svg-conv-walk')
      .add(new SvgMatrix(230, 30, 43, 43, [x], [xc], palette))
      .add(new SvgMatrix(230, 93, 43, 43, A, Ac, palette))
      .add(new SvgMatrix(100, 93, 43, 43, b, bc, palette));
}

