
function diceRoll(x) {
	return 1+Math.floor(Math.random()*x);
}

function stat() {
	var roll = []	
		for(var i=0; i<4; i++)	roll.push(diceRoll(6));
	var stat = roll.reduce(function(a, b){
return a + b;
}, 0) - Math.min(...roll);
	var modifier = 0
	if(stat > 10){modifier = Math.floor((stat-10)/2)}
	return stat + " +" + modifier
}

function dHundred(){
	document.getElementById("dHundred").innerHTML = diceRoll(100);
	addRoll("dHundred");
	document.getElementById("btnHundred").innerHTML = ("Roll Again");
}
function dTwenty(){
	document.getElementById("dTwenty").innerHTML = diceRoll(20);
	addRoll("dTwenty");
	document.getElementById("btnTwenty").innerHTML = ("Roll Again")
}
function dTwelve(){
	document.getElementById("dTwelve").innerHTML = diceRoll(12);
	addRoll("dTwelve");
	document.getElementById("btnTwelve").innerHTML = ("Roll Again")
}
function dTen(){
	document.getElementById("dTen").innerHTML = diceRoll(10);
	addRoll("dTen");
	document.getElementById("btnTen").innerHTML = ("Roll Again")
}
function dEight(){
	document.getElementById("dEight").innerHTML = diceRoll(8);
	addRoll("dEight");
	document.getElementById("btnEight").innerHTML = ("Roll Again")
}
function dSix(){
	document.getElementById("dSix").innerHTML = diceRoll(6);
	addRoll("dSix");
	document.getElementById("btnSix").innerHTML = ("Roll Again")
}
function dFour(){
	document.getElementById("dFour").innerHTML = diceRoll(4);
	addRoll("dFour");
	document.getElementById("btnFour").innerHTML = ("Roll Again")
}
function dThree(){
	document.getElementById("dThree").innerHTML = diceRoll(3);
	addRoll("dThree");
	document.getElementById("btnThree").innerHTML = ("Roll Again")
}
function dTwo(){
	document.getElementById("dTwo").innerHTML = diceRoll(2);
	addRoll("dTwo");
	document.getElementById("btnTwo").innerHTML = ("Roll Again")
}

function addRoll(x){
// 	insert diceroll into new row div
	var  savedRoll = document.getElementById(x).innerHTML
	var	createDiv = document.createElement("DIV");
	var createH = document.createElement("H3")
	var createText = document.createTextNode(savedRoll);
	createDiv.classList.add("col-lg-1");
	createH.appendChild(createText);
	createDiv.appendChild(createH);
	document.getElementById("dicehis").appendChild(createDiv)
}

function clrHis() {
	document.getElementById("dicehis").innerHTML = ("");
	var	createDiv = document.createElement("DIV");
	var createH = document.createElement("H3")
	var createText = document.createTextNode("Roll History");
	createDiv.classList.add("col-lg-3");
	createH.appendChild(createText);
	createDiv.appendChild(createH);
	document.getElementById("dicehis").appendChild(createDiv);
}

module.exports = {diceRoll:diceRoll,
				  stat:stat}