let images = {};

// UI
addImage('images/grass.png',"grass");
addImage('images/ui.png',"ui");
addImage('images/win.png',"win");
addImage('images/title.png',"title");

// Instruction
addImage('images/inst.png',"inst");
addImage('images/key/A.png',"iA");
addImage('images/key/S.png',"iS");
addImage('images/key/D.png',"iD");
addImage('images/key/W.png',"iW");
addImage('images/key/R.png',"iR");
addImage('images/key/Z.png',"iZ");
addImage('images/key/space.png',"iSpace");

// Spawnable Objects
addImage('images/bomb.png',"ub");
addImage('images/bridge.png',"pb");
addImage('images/beaver.png',"pv");

// Buttons
addImage('images/button/start.png',"start");
addImage('images/button/1.png',"b1");
addImage('images/button/2.png',"b2");
addImage('images/button/3.png',"b3");
addImage('images/button/4.png',"b4");
addImage('images/button/5.png',"b5");
addImage('images/button/empty.png',"empty");
addImage('images/button/empty-level.png',"elevel");
addImage('images/button/instruction.png',"instruction");
addImage('images/button/close.png',"close");
addImage('images/button/level.png',"level");
addImage('images/button/levele.png',"levelE");
addImage('images/button/level.png',"level");
addImage('images/button/trans-big.png',"trans-big");
addImage('images/button/trans-small.png',"trans-small");
addImage('images/button/trans-brown.png',"trans-brown");
addImage('images/button/blank.png',"blank");

// Objects
addImage('images/spawn.png',"spawner");
addImage('images/wizard.png',"ww");
addImage('images/bush.png',"@b");
addImage('images/hole.png',"@h");
addImage('images/hole.png',"@H");
addImage('images/flag.png',"ff");
addImage('images/rock.png',"ir");
addImage('images/log.png',"il");
addImage('images/crate.png',"pc");

// Letters
addImage('images/letter/A.png',"bA");
addImage('images/letter/B.png',"bB");
addImage('images/letter/C.png',"bC");
addImage('images/letter/D.png',"bD");
addImage('images/letter/E.png',"bE");
addImage('images/letter/F.png',"bF");
addImage('images/letter/G.png',"bG");
addImage('images/letter/H.png',"bH");
addImage('images/letter/I.png',"bI");
addImage('images/letter/J.png',"bJ");
addImage('images/letter/K.png',"bK");
addImage('images/letter/L.png',"bL");
addImage('images/letter/M.png',"bM");
addImage('images/letter/N.png',"bN");
addImage('images/letter/O.png',"bO");
addImage('images/letter/P.png',"bP");
addImage('images/letter/Q.png',"bQ");
addImage('images/letter/R.png',"bR");
addImage('images/letter/S.png',"bS");
addImage('images/letter/T.png',"bT");
addImage('images/letter/U.png',"bU");
addImage('images/letter/V.png',"bV");
addImage('images/letter/W.png',"bW");
addImage('images/letter/X.png',"bX");
addImage('images/letter/Y.png',"bY");
addImage('images/letter/Z.png',"bZ");

function addImage(url, ref){
    let img = new Image();
    img.src = url;
    images[ref] = img;
}

export {images};