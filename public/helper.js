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

function D100(){
	document.getElementById("dHundred").innerHTML = diceRoll(100);
	addRoll("dHundred");
	document.getElementById("btnHundred").innerHTML = ("Roll Again");
}
function D20(){
	document.getElementById("dTwenty").innerHTML = diceRoll(20);
	addRoll("dTwenty");
	document.getElementById("btnTwenty").innerHTML = ("Roll Again")
}
function D12(){
	document.getElementById("dTwelve").innerHTML = diceRoll(12);
	addRoll("dTwelve");
	document.getElementById("btnTwelve").innerHTML = ("Roll Again")
}
function D10(){
	document.getElementById("dTen").innerHTML = diceRoll(10);
	addRoll("dTen");
	document.getElementById("btnTen").innerHTML = ("Roll Again")
}
function D8(){
	document.getElementById("dEight").innerHTML = diceRoll(8);
	addRoll("dEight");
	document.getElementById("btnEight").innerHTML = ("Roll Again")
}
function D6(){
	document.getElementById("dSix").innerHTML = diceRoll(6);
	addRoll("dSix");
	document.getElementById("btnSix").innerHTML = ("Roll Again")
}
function D4(){
	document.getElementById("dFour").innerHTML = diceRoll(4);
	addRoll("dFour");
	document.getElementById("btnFour").innerHTML = ("Roll Again")
}
function D3(){
	document.getElementById("dThree").innerHTML = diceRoll(3);
	addRoll("dThree");
	document.getElementById("btnThree").innerHTML = ("Roll Again")
}
function D2(){
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

$(document).ready(function(){
	$("#checkAll").click(function(event) {   
	if(this.checked) {
		// Iterate each checkbox
		$(':checkbox').each(function() {
			this.checked = true;                        
		});
	} else {
		$(':checkbox').each(function() {
			this.checked = false;                       
		});
	}
})

		$(document).on("click", '.fa-plus', (function(e) {
		  //we select the box clone it and insert it after the box
		  var $e = $(e.currentTarget);
		  var _elm = $e.closest(".weaponRow").clone();
		  _elm.find("option[id='first']").val("Choose...");
		  _elm.find('.minus').show();
		  _elm.find('.plus').hide();
		  _elm.appendTo('#weaponForm');
		}))
	$(document).on("click", ".fa-minus", function(e) {
		var $e = $(e.currentTarget);
		$e.closest('.weaponRow').remove();
	  });
	$("#imageBtn").click(function(event){
		$("#imageForm").show();
	});
	$(".closeBtn").click(function(event){
		$("#imageForm").hide();
	})
	$("#WeapBtn").click(function(event){
		$("a .Charshow").removeClass(".active");
		$("#WeapBtn").addClass(".active")
		$("#Bio").hide();
		$("#WepCard").show();
	})
	$("#BioBtn").click(function(event){
		$("a .Charshow").removeClass(".active");
		$("#BioBtn").addClass(".active")
		$("#Bio").show();
		$("#WepCard").hide();
	})
});


