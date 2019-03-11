/**
 * @fileoverview A tiny LaTeX to html/css renderer
 * Reserves the css m* namespace
 */

/**
 * TeX book p. 158
 * @const
 * @enum {number} Atom type
 */
var Atom = {
  None : -1,
  Ord  : 0,
  Op   : 1,
  Bin  : 2,
  Rel  : 3,
  Open : 4,
  Close: 5,
  Punct: 6,
  Inner: 7
};

/**
 * @const
 * @enum {string}
 */
var Spaces = {
  Regular    : " ",
  ThreePerEm : "\u2004",
  FourPerEm  : "\u2005",
  SixPerEm   : "\u2006",
  ThinSpace  : "\u2009",
  MediumMath : "\u205F"
};

let Macro = {
  "frac"  : [2, (a, b) => "<span class=mfrac><span class=mfnum>" + a + "</span><br><span class=mfline></span>" + b + "</span>"],
  "kldiv" : [2, (a, b) => "<b>D</b><span class=mpl>(</span>" + a + " ∥ " + b + "<span class=mpr>)</span>"],
  "iprod" : [2, (a, b) => Spaces.MediumMath + "<span class=mal>⟨</span>" + a + ", " + b + "<span class=mar>⟩</span>"],
}

/**
 * @const
 * @type {Object<string, Array<Atom, string>>}
 */
let Substitute = {
  "Theta"   : [Atom.Ord  , "<span class=mtht>Θ</span>"],
  "theta"   : [Atom.Ord  , "θ"],
  "Omega"   : [Atom.Ord  , "Ω"],
  "omega"   : [Atom.Ord  , "ω"],
  "delta"   : [Atom.Ord  , "<i>δ</i>"],
  "epsilon" : [Atom.Ord  , "<i>ε</i>"],
  "eps"     : [Atom.Ord  , "<i>ε</i>"],
  "alpha"   : [Atom.Ord  , "<i>α</i>"],
  "?"       : [Atom.Ord  , "?"],
  "mu"      : [Atom.Ord  , "<i>μ</i>"],
  "nu"      : [Atom.Ord  , "<i>ν</i>"],
  "indicate": [Atom.Ord  , "𝟙"],
  "reals"   : [Atom.Ord  , "ℝ"],
  "field"   : [Atom.Ord  , "𝔽"],
  "pi"      : [Atom.Ord  , "π"],
  "log"     : [Atom.Op   , null],
  "exp"     : [Atom.Op   , null],
  "Ham"     : [Atom.Op   , null],
  "Disj"    : [Atom.Op   , null],
  "Pr"      : [Atom.Op   , null],
  "dist"    : [Atom.Op   , null],
  "one"     : [Atom.Op   , "<b>1</b>"],
  "sum"     : [Atom.Op   , "<span class=msum>∑</span>"],
  "infty"   : [Atom.Ord  , "∞"],
  "\\|"     : [Atom.Ord  , "∥"],
  "+"       : [Atom.Bin  , '<span class=mpls>+</span>'],
  "-"       : [Atom.Bin  , '<span class=mmns>−</span>'],
  "/"       : [Atom.Bin  , '<span class=mdiv>/</span>'],
  "cdot"    : [Atom.Bin  , "<span class=mcdot>·</span>"],
  "times"   : [Atom.Bin  , "×"],
  "le"      : [Atom.Bin  , "<span class=mle>≤</span>"],
  "ge"      : [Atom.Bin  , "<span class=mge>≥</span>"],
  "lt"      : [Atom.Bin  , "<span class=mlt><</span>"],
  "gt"      : [Atom.Bin  , "<span class=mgt>></span>"],
  "gtapprox": [Atom.Bin  , "⪆"],
  "*"       : [Atom.Bin  , '<span class=masx>*</span>'],
  "in"      : [Atom.Rel  , "<span class=min>∈</span>"],
  "approx"  : [Atom.Rel  , "<span class=mapx>≈</span>"],
  "mid"     : [Atom.Rel  , "|"],
  "to"      : [Atom.Rel  , "<span class=mto>→</span>"],
  "="       : [Atom.Rel  , '<span class=meq>=</span>'],
  "defeq"   : [Atom.Rel  , "≔"],
  "mapsto"  : [Atom.Rel  , "<span class=mmt>↦</span>"],
  "langle"  : [Atom.Open , "<span class=mal>⟨</span>"],
  "lVert"   : [Atom.Open , "∥"],
  "\\{"     : [Atom.Open , "<span class=mcl>{</span>"],
  "("       : [Atom.Open , '<span class=mpl>(</span>'],
  "["       : [Atom.Open , '<span class=msl>[</span>'],
  "rangle"  : [Atom.Close, "<span class=mar>⟩</span>"],
  "rVert"   : [Atom.Close, "∥"],
  "\\}"     : [Atom.Close, "<span class=mcr>}</span>"],
  ")"       : [Atom.Close, '<span class=mpr>)</span>'],
  "]"       : [Atom.Close, '<span class=msr>]</span>'],
  ","       : [Atom.Punct, ','],
  "colon"   : [Atom.Punct, ":"],
  "ldots"   : [Atom.Inner, "…"],
};

/**
 * TeX book p. 170
 *
 * @type {Array<Array<number>>}
 */
let SpaceTable = [
  [0, 1, 2, 3, 0, 0, 0, 1],
  [1, 1, 9, 3, 0, 0, 0, 1],
  [2, 2, 9, 9, 2, 9, 9, 2],
  [3, 3, 9, 0, 3, 0, 0, 3],
  [0, 0, 9, 0, 0, 0, 0, 0],
  [0, 1, 2, 3, 0, 0, 0, 1],
  [1, 1, 9, 1, 1, 1, 1, 1],
  [1, 1, 2, 3, 1, 0, 1, 1]
];

/**
 * @const {RegExp}
 */
let Alpha = /[a-zA-Z]*/;
/**
 * @const {RegExp}
 */
let Digits = /[0-9]*/;
/**
 * @const {RegExp}
 */
let RightAttachment = /[a-zA-Z._\-,)]*/;
/**
 * @const {RegExp}
 */
let LeftAttachment = /[a-zA-Z.\-(]*$/;

/**
 * @param {Atom} leftAtom
 * @param {Atom} rightAtom
 * @return {string}
 */
function getSpace(leftAtom, rightAtom) {
  if (leftAtom == Atom.None || rightAtom == Atom.None)
    return "";
  /** @const {number} */
  var spaceType = SpaceTable[leftAtom][rightAtom];
  return spaceType == 0 ? "" :
      (spaceType == 3 ? Spaces.ThreePerEm : Spaces.Regular);
}

/**
 * @param {string} texStr to render
 * @param {?string} leftAttach the text before the formula e.g., length-$n$
 * @param {?string} rightAttach the text after the formula e.g., $k$-party
 * @return {string} html output
 */
function renderInline(texStr, leftAttach, rightAttach) {
  /** @const {boolean} */
  let baseMode = leftAttach != null;
  /** @const {number} */
  var n =  texStr.length;
  /** @type {string} */
  var output = "";
  /** @type {Atom} */
  var lastAtom = Atom.None;
  /** @type {string} */
  var char;
  /** @type {number} */
  var code;
  /** @type {number} */
  var i;

  /**
   * @return {string} of next block
   */
  function parseBlock() {
    let block;
    if (texStr.charCodeAt(i) == "{".charCodeAt(0)) {
      ++i;
      /** @const {number} */
      let start = i;
      /** @type {number} */
      let depth = 1;
      while (depth > 0 && i < n) {
        let /** number */ c = texStr.charCodeAt(i++);
        if (c == "{".charCodeAt(0)) {
          ++depth;
        } else if (c == "}".charCodeAt(0)) {
          --depth;
        }
      }
      block = texStr.slice(start, i - 1);
    } else {
      block = texStr.charAt(i);
      i++;
    }
    return block;
  }

  for (i = 0; i < n;) {
    code = texStr.charCodeAt(i);
    char = texStr.charAt(i);
    i++;
    if (code == "\\".charCodeAt(0)) {
      let command = texStr.slice(i).match(Alpha)[0];
      if (command.length == 0) {
        command = texStr.slice(i - 1, i + 1);
        i += 1;
      } else {
        i += command.length;
      }

      let macro = Macro[command];
      if (macro) {
        /** @const {number} */
        let nArgs = macro[0];
        /** @type {Array<string>} */
        let args = new Array(nArgs);
        for (let i = 0; i < nArgs; ++i) {
          args[i] = renderInline(parseBlock(), null, null);
        }
        let result = macro[1].apply(this, args);
        output += result;
        lastAtom = Atom.Op;
      } else {
        let subs = Substitute[command];
        if (subs) {
          output += getSpace(lastAtom, subs[0]);
          output += (subs[1] == null) ? 
              '<span class=mop>' + command + '</span>' : subs[1];
          lastAtom = subs[0];
        } else if (command == "\\;") {
          output += Spaces.Regular;
        } else if (command == "\\,") {
          output += Spaces.MediumMath;
        }
      }
    } else if (code == "^".charCodeAt(0)) {
      /** @type {string} */
      let sup = parseBlock();
      if (texStr.charCodeAt(i) == "_".charCodeAt(0)) {
        ++i;
        /** @type {string} */
        let sub = parseBlock();
        output += '<span class=msupsub><sup class=mssup>' + renderInline(sup, null, null) +
                  '</sup><br><sub class=mssub>' + renderInline(sub, null, null) +
                  '</sub></span>';
      } else {
        output += '<sup class=msup>' + renderInline(sup, null, null) + '</sup>';
      }
      lastAtom = Atom.Ord;
    } else if (code == "_".charCodeAt(0)) {
      let sub = parseBlock();
      if (texStr.charCodeAt(i) == "^".charCodeAt(0)) {
        ++i;
        /** @type {string} */
        let sup = parseBlock();
        output += '<span class=msupsub><sup class=mssup>' + renderInline(sup, null, null) +
                  '</sup><br><sub class=mssub>' + renderInline(sub, null, null) +
                  '</sub></span>';
      } else {
        output += '<sub class=msub>' + renderInline(sub, null, null) + '</sub>';
      }
      lastAtom = Atom.Ord;
    } else if ("0".charCodeAt(0) <= code && code <= "9".charCodeAt(0)) {
      /** @const {string} */
      let number = texStr.slice(i).match(Digits)[0];
      i += number.length;
      output += getSpace(lastAtom, Atom.Ord) + char + number;
      lastAtom = Atom.Ord;
    } else if (code == ' '.charCodeAt(0)) {
    } else {
      let subs = Substitute[char];
      if (subs) {
        /** @type {Atom} */
        let atom = subs[0];
        // In the baseMode, split across relations
        if (baseMode && atom == Atom.Rel) {
          /**
           * TODO(saglam): switch this to literal counter
           * @const {boolean}
           */
          let smallLeftHandSide = (i < 3);
          return '<span class=mw>' + leftAttach + output + 
              getSpace(lastAtom, Atom.Rel) +
              (smallLeftHandSide ? "" : '</span><span class=mw>') +
              subs[1] + getSpace(lastAtom, Atom.Rel) + '</span>' +
              renderInline(texStr.slice(i), "", rightAttach);
        }
        output += getSpace(lastAtom, atom) + subs[1];
        lastAtom = atom;
      } else {
        output += getSpace(lastAtom, Atom.Ord) + '<i>' + char + '</i>';
        lastAtom = Atom.Ord;
      }
    }
  }
  return !baseMode || 
      (leftAttach == "" && rightAttach == "" && output.length <  9) ?
          output :
          '<span class="mw">' + leftAttach + output + rightAttach + '</span>';
}

/**
 * @param {Element} elem to populate
 */
function renderElement(elem) {
  /** @type {Array<string>} */
  let parts = elem.innerHTML.split("$");
  /** @const {number} */
  let n = parts.length;

  if (n % 2 == 0 || n == 1)
    return;

  /** @type {number} */
  let i;
  for (i = 1; i < n; i += 2) {
    /** @const {string} */
    let leftAttach = parts[i - 1].match(LeftAttachment)[0];
    /** @const {string} */
    let rightAttach = parts[i + 1].match(RightAttachment)[0];

    if (leftAttach.length > 0) {
      parts[i - 1] = parts[i - 1].slice(0, -leftAttach.length);
    }
    parts[i + 1] = parts[i + 1].slice(rightAttach.length);
    parts[i] = renderInline(parts[i], leftAttach, rightAttach);
    /** @const {number} */
    let leftPartLen = parts[i - 1].length;
    if (leftAttach == "" && leftPartLen > 0 && parts[i - 1].charCodeAt(leftPartLen - 1) != ">".charCodeAt(0)) {
      parts[i - 1] = parts[i - 1].replace(/\s+$/, '') + Spaces.FourPerEm;
    }
    if (rightAttach == "" && parts[i + 1].length > 0 && parts[i + 1].charCodeAt(0) != "<".charCodeAt(0)) {
      parts[i + 1] = Spaces.FourPerEm + parts[i + 1].replace(/^\s+/, '');
    }
  }
  elem.innerHTML = parts.join("");
}

