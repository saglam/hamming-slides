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
  ThreePerEm : " ",
  FourPerEm  : " ",
  SixPerEm   : " "
};

/**
 * @const
 * @type {Object<string, Array<Atom, string>>}
 */
var Substitute = {
  "Theta"  : [Atom.Ord  , "<span class=mtht>Θ</span>"],
  "theta"  : [Atom.Ord  , "θ"],
  "Omega"  : [Atom.Ord  , "Ω"],
  "omega"  : [Atom.Ord  , "ω"],
  "delta"  : [Atom.Ord  , "δ"],
  "epsilon": [Atom.Ord  , "ε"],
  "eps"    : [Atom.Ord  , "ε"],
  "?"      : [Atom.Ord  , "?"],
  "in"     : [Atom.Rel  , "<span class=min>∈</span>"],
  "log"    : [Atom.Op   , null],
  "exp"    : [Atom.Op   , null],
  "Ham"    : [Atom.Op   , null],
  "Disj"   : [Atom.Op   , null],
  "colon"  : [Atom.Punct, ":"],
  "reals"  : [Atom.Ord  , "ℝ"],
  "field"  : [Atom.Ord  , "𝔽"],
  "cdot"   : [Atom.Bin  , "·"],
  "times"  : [Atom.Bin  , "×"],
  "le"     : [Atom.Bin  , "≤"],
  "ge"     : [Atom.Bin  , "≥"],
  "lt"     : [Atom.Bin  , "<"],
  "gt"     : [Atom.Bin  , ">"],
  "to"     : [Atom.Rel  , "<span class=mto>→</span>"],
  "mapsto" : [Atom.Rel  , "<span class=mmt>↦</span>"],
  "ldots"  : [Atom.Inner, "…"],
  "langle" : [Atom.Open , "<span class=mal>⟨</span>"],
  "rangle" : [Atom.Close, "<span class=mar>⟩</span>"],
  "lVert"  : [Atom.Open , "∥"],
  "rVert"  : [Atom.Close, "∥"],
  "infty"  : [Atom.Ord  , "∞"],
  "\\|"    : [Atom.Ord  , "∥"],
  "\\{"    : [Atom.Open , "<span class=mcl>{</span>"],
  "\\}"    : [Atom.Close, "<span class=mcr>}</span>"],
  "*"      : [Atom.Bin   , '<span class=masx>*</span>'],
  "("      : [Atom.Open , '<span class=mpl>(</span>'],
  ")"      : [Atom.Close, '<span class=mpr>)</span>'],
  "["      : [Atom.Open , '<span class=msl>[</span>'],
  "]"      : [Atom.Close, '<span class=msr>]</span>'],
  "="      : [Atom.Rel  , '<span class=meq>=</span>'],
  "+"      : [Atom.Bin  , '+'],
  "-"      : [Atom.Bin  , '−'],
  "/"      : [Atom.Bin  , '<span class=mdiv>/</span>'],
  ","      : [Atom.Punct, ',']
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
let RightAttachment = /[a-zA-Z._\-,]*/;
/**
 * @const {RegExp}
 */
let LeftAttachment = /[a-zA-Z.\-]*$/;

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
  var baseMode = leftAttach != null
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

      let subs = Substitute[command];
      if (subs) {
        output += getSpace(lastAtom, subs[0]);
        output += (subs[1] == null) ? 
            '<span class=mop>' + command + '</span>' : subs[1];
        lastAtom = subs[0];
      }
    } else if (code == "^".charCodeAt(0)) {
      /** @type {string} */
      let sup;
      if (texStr.charCodeAt(i) == "{".charCodeAt(0)) {
        /** @const {number} */
        let supEnd = texStr.indexOf("}", i);
        sup = texStr.slice(i + 1, supEnd);
        i = supEnd + 1;
      } else {
        sup = texStr.charAt(i);
        i++;
      }
      output += '<sup class=msup>' + renderInline(sup, null, null) + '</sup>';
    } else if (code == "_".charCodeAt(0)) {
      let sub;
      if (texStr.charCodeAt(i) == "{".charCodeAt(0)) {
        /** @const {number} */
        let subEnd = texStr.indexOf("}", i);
        sub = texStr.slice(i + 1, subEnd);
        i = subEnd + 1;
      } else {
        sub = texStr.charAt(i);
        i++;
      }
      if (texStr.charCodeAt(i) == "^".charCodeAt(0)) {
        i++;
        /** @type {string} */
        let sup;
        if (texStr.charCodeAt(i) == "{".charCodeAt(0)) {
          /** @const {number} */
          let supEnd = texStr.indexOf("}", i);
          sup = texStr.slice(i + 1, supEnd);
          i = supEnd + 1;
        } else {
          sup = texStr.charAt(i);
          i++;
        }
        output += '<span class=msupsub><sup class=mssup>' + renderInline(sup, null, null) +
                  '</sup><br><sub class=mssub>' + renderInline(sub, null, null) +
                  '</sub></span>';
      } else {
        output += '<sub class=msub>' + renderInline(sub, null, null) + '</sub>';
      }
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

