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
/*{
  let x = "01101011" + "01010100" + "10111011";
  let y = "00100011" + "01010101" + "10111110";
  let z = xor(x, y);
  let xp = "01" + "01" + "11";
  let yp = "10" + "00" + "11";
  let zp = xor(xp, yp);
  getSvgElem("svg-reduce")
      .add(new SvgElem('g')
          .add(new SvgMatrix(90,   2, 43, 43, [x], [z], palette))
          .add(new SvgText  (10,  31, "x"))
          .add(new SvgText  (36,  34, "=")))
      .add(new SvgElem('g')
          .add(new SvgMatrix(90, 202, 43, 43, [y], [z], palette))
          .add(new SvgText  (10, 231, "y"))
          .add(new SvgText  (36, 234, "=")))
      .addFrag(new SvgElem('g')
          .add(new SvgMatrix(90,  68,172, 43, [xp], [zp], palette))
          .add(new SvgText  (10,  97, "x'"))
          .add(new SvgText  (39, 100, "=")), 4)
      .addFrag(new SvgElem('g')
          .add(new SvgMatrix(90, 134,172, 43, [yp], [zp], palette))
          .add(new SvgText  (10, 163, "y'"))
          .add(new SvgText  (39, 166, "=")), 4);
}*/

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
  let data = [0.12, 0.05, 0.14, 0.01, 0.13, 0.91, 0.07, 0.001, 0.15, 0.04, 0.15, 0.05, 0.13, 0];
  /** @const {!Object} */
  let dimensions = {miny: 0, maxy : 1, smoothness: 0.6, grid: [[0, "0", 3], [0.2, "δ", 0.3], [1, "1", 0.3], [0.8, "1-δ", 0.3]]};

  /** @const {!Array<number>} */
  let data2 = [0.12, 0.05, 0.14, 0.60, 0.70, 0.91, 0.67, 0.4, 0.3, 0.04, 0.15, 0.05, 0.13, 0];

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
          .add(new SvgText(   0, 400, "$a_k\\colon$")), 4)
      .addFrag(new SvgElem('g').withAttributes({"font-size": 24})
          .add(new SvgText(  160, 580, "$a_{k-2}$"))
          .add(new SvgText(  243, 580, "$a_k$"))
          .add(new SvgText(  303, 580, "$a_{k+2}$"))
          .add(new SvgPlot(  30, 480, 40, 70, data2, {smoothness: 0.6, grid: [[0, null, 3]]}, palette1))
          .add(new SvgText( 320, 475, "$a_{k+2}\\cdot a_{k-2}\\ge c\\cdot a_k^2$")), 6)

}

//svg-leaf
{
  let palette1 = {
         s: "#5080c6",
       "b": "#f7faff",
       "r": "#ffdcdc",
      text: "black",
  }

  let x = 60;
  let y = 200
  getSvgElem('svg-leaf').addFrag(new SvgElem('g')
      .add(new SvgMatrix(x + 120, y + 70, 360, 40, [["$x$"], ["$x_0$"], ["$x_{01}$"], ["$x_{011}$"]], ["b", "b", "b", "b"], palette1))
      .add(new SvgMatrix(x +   0, y + 70,  40, 40, ["0","1","1","0"], ["b","b","b","b"], palette1))
      .add(new SvgText  (x +  70, y +160, "$=$"))
      .add(new SvgMatrix(x + 120, y +  0, 360, 40, [["$w$"]], ["b"], palette1).withAttributes({"id": "wvector", "class": "rotated"})), 3);

}

//svg-conv-walk
{
  let fade = {
         s: "#999",
       "b": "#f7faff",
       "r": "#ffdcdc",
      text: "#666",
  }
  
  let normal = {
         s: "#999",
       "b": "#f7faff",
       "r": "#ffdcdc",
      text: "#111",
  }
  let x  = "                 ";
  let xc = "00000000000000000";
  let A = ["01010100101001010",
           "10010101100011101",
           "11101001111010010",
           "10011010000100011"];
  let Ac = [xc, xc, xc, xc];
  let b = ["0", "0", "0", "0"];
  let bc = b;

  getSvgElem('svg-conv-walk')
      .add(new SvgMatrix(230, 30, 43, 43, [x], [xc], normal))
      .add(new SvgMatrix(230, 93, 43, 43, A, Ac, fade))
      .add(new SvgMatrix(100, 93, 43, 43, b, bc, normal))
      .add(new SvgText(175, 58, "$w\\colon$"))
      .add(new SvgText(175, 190, "$=$"));
}


//svg-conv-walk2
{
  let fade = {
         s: "#999",
       "b": "#f7faff",
       "r": "#ffdcdc",
      text: "#666",
  }
  
  let normal = {
         s: "#999",
       "b": "#f7faff",
       "r": "#ffdcdc",
      text: "#111",
  }
  let x  = "1   1   1   1    ";
  let xc = "00000000000000000";
  let A = ["01010100101001010",
           "10010101100011101",
           "11101001111010010",
           "10011010000100011"];
  let Ac = [xc, xc, xc, xc];
  let b = ["1", "1", "0", "0"];
  let bc =["0", "0", "0", "0"];

  getSvgElem('svg-conv-walk2')
      .add(new SvgMatrix(230, 30, 43, 43, [x], [xc], normal))
      .add(new SvgMatrix(230, 93, 43, 43, A, Ac, fade))
      .add(new SvgMatrix(100, 93, 43, 43, b, bc, normal));
}

//svg-mc-example
{
  let normal = {
         s: "#999",
       "b": "#f7faff",
       "r": "#ffdcdc",
      text: "#111",
  }
  let A= [["0", "$\\alpha$", "", "", "", ""],
          ["$\\alpha$", "0", "$\\alpha$", "", "", ""],
          ["", "$\\alpha$", "0", "$\\alpha$", "", ""],
          ["", "", "$\\alpha$", "0", "$\\alpha$", ""],
          ["", "", "", "$\\alpha$", "0", "$\\alpha$"],
          ["", "", "", "", "$\\alpha$", "0"]];

  let Ac= ["000000",
           "000000",
           "000000",
           "000000",
           "000000",
           "000000"];

  let x = 20;
  let y = 250
  getSvgElem('svg-mc-example')
      .add(new SvgMatrix(x + 55, y, 35, 35, A, Ac, normal))
      .add(new SvgText  (x +  0, y+ 117, "$S=$"))
}


//svg-proof-idea
{
  getSvgElem('svg-proof-idea')
    .add(new SvgArrow(350,300, 180, -120))
    .add(new SvgArrow(700,430, 40, -240))
}

//svg-continuous
{
  let y = 100;
  /** @const {SvgElem} */
  let g = getSvgElem("svg-continuous")
      .add(new SvgElem('path').withAttributes({"d": "M50," + y + "h950", "stroke": "black"}));

  let tick = 6;
  for (let x = 60; x <= 1000; x += 40) {
    g.add(new SvgElem('path').withAttributes({"d": "M" + x + "," + (y - tick/2) + "v" + tick, "stroke": "black"}));
  }

  g.add(new SvgText(270, y + 40, "$v=\\indicate_b$"))
   .add(new SvgText(700, y + 40, "$u=\\indicate_0$"))
   .add(new SvgArrow(300, 100, 0, -70, 0))
   .add(new SvgArrow(740, 100, 0, -70, 0))
   .add(new SvgElem('path').withAttributes({
       "stroke-width": "3",
               "fill": "none",
             "stroke": "#08a",
                  "d": "M60,97C700,97 680,40 740,40S780,97 1420,97"}));
}

