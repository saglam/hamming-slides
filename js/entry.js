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





//svg-proof-idea
{
  getSvgElem('svg-proof-idea')
    .add(new SvgArrow(350,300, 180, -110, -600))
    .add(new SvgArrow(700,430, 40, -240, -600))
    .add(new SvgArrow(520, 37, -210, 90, -400))
    .add(new SvgArrow(730, 37, 210, 100, 500))
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
  getSvgElem('svg-proof-final2')
    .add(new SvgArrow(350,300, 180, -110, -600))
}


