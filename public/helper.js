// THIS IS A NOTE FROM THE HELPER FILE!
function diceRoll(x) {
	return Math.ceil(Math.random()*x);
}

function stat() {
	rolls = [];
	for(var i=0; i < 4; i++){
		rolls.push(diceRoll(6));
	}
	rolls = rolls.sort((a,b) => b-a);
	rolls.splice(3,1);
	var roll  = rolls.reduce((a,b) => {return a+b}, 0)
	return roll;
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

var rollval = 0

function rollAttr(x, y){
	console.log(x);
	var roll = diceRoll(20);
	var mod = "+" + (Math.floor((x-10)/2) + y);
	rollval = roll + Math.floor((x-10)/2) + y;
	alert("YOU ROLLED: "+ roll + mod + "=" + rollval)
}

function rollWeap(x,y){
	rollval = 0
	for(var i=0; i<x; i++){
		var roll = diceRoll(y)
		rollval += roll
	}
	alert("You did "+ rollval +" Damage!")
}


$(document).ready(function(){
	$(".checkAll").click(function(event) {   
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
	$("#checkAllWeapons").click(function(event) {   
	if(this.checked) {
		// Iterate each checkbox
		$('.weaponCheck:checkbox').each(function() {
			this.checked = true;                        
		});
	} else {
		$('.weaponCheck:checkbox').each(function() {
			this.checked = false;                       
		});
	}
})
	$("#checkAllItems").click(function(event) {   
	if(this.checked) {
		// Iterate each checkbox
		$('.itemCheck:checkbox').each(function() {
			this.checked = true;                        
		});
	} else {
		$('.itemCheck:checkbox').each(function() {
			this.checked = false;                       
		});
	}
})
	$("#checkAllArmour").click(function(event) {   
	if(this.checked) {
		// Iterate each checkbox
		$('.armourCheck:checkbox').each(function() {
			this.checked = true;                        
		});
	} else {
		$('.armourCheck:checkbox').each(function() {
			this.checked = false;                       
		});
	}
})

	$(document).on("click", ".weapAdd", function(e) {
		  //we select the box clone it and insert it after the box
		  var $e = $(e.currentTarget);
		  var _elm = $e.closest(".weaponRow").clone();
		  _elm.find("option[id='firstWeap']").val("Choose...");
		  _elm.find(".minusWeap").show();
		  _elm.find(".plusWeap").hide();
		  _elm.appendTo("#weaponForm");
		});
	$(document).on("click", ".weapSub", function(e) {
		var $e = $(e.currentTarget);
		$e.closest(".weaponRow").remove();
	  });

	$(document).on("click", ".itemAdd", function(e) {
		//we select the box clone it and insert it after the box
		var $e = $(e.currentTarget);
		var _elm = $e.closest(".itemRow").clone();
		_elm.find("option[id='firstItem']").val("Choose...");
		_elm.find(".minusItem").show();
		_elm.find(".plusItem").hide();
		_elm.appendTo("#itemForm");
	  });
	  $(document).on("click", ".itemSub", function(e) {
		var $e = $(e.currentTarget);
		$e.closest(".itemRow").remove();
	  });

	$("#imageBtn").click(function(event){
		$("#imageForm").show();
	});
	$(".closeBtn").click(function(event){
		$("#imageForm").hide();
	});
	$("#charSheet li").click(function(event){
		$("#charSheet a").removeClass("active");
		$(this).find("a").addClass("active");
		$(".charDiv").hide()
		$(".charDiv").eq($(this).index()).show();
		}) ;

	$("#locSheet li").click(function(event){
		$("#locSheet a").removeClass("active");
		$(this).find("a").addClass("active");
		$(".locTab").hide()
		$(".locTab").eq($(this).index()).show();
		}) ;


		$(".rollHit").click(function(e){
			$(e.currentTarget).next($(".hitRoll")).append("<h4>Hit!</h4>")
		})

		$(".rollDam").click(function(event){
			$(".damRoll").html("<h4>Damage:" + rollval + "<h4>")
		})

		$(".weapPlaybtn").popover({
			placement: "bottom",
			container: "body",
			html: true,
			sanitize: false,
			content: function(){
				return $(this).next($(".WeapPlay")).html();
			}
		});
		$(".itemPlaybtn").popover({
			placement: "bottom",
			container: "body",
			html: true,
			sanitize: false,
			content: function(){
				return $(this).next($(".itemPlay")).html();
			}
		});
		$(".AttrPlaybtn").popover({
			placement: "right",
			container: "body",
			html: true,
			sanitize: false,
			content: function(){
				return $(this).next($(".AttrPlay")).html();
			}
		});
		$("input.weaponInventory").change(function(){
			var weap = this.getAttribute("data-weapon-Id");
			var Inv = {"Inventory": $(this).val()}
			$.ajax({
				url:"trial/"+weap,
				method:"PUT",
				data: Inv,
			})
		})
		$("#imgUpload").submit(function(e){
			e.preventDefault();
			$("#imageForm").fadeOut(2000);
			$(this).ajaxSubmit({
				success: function(r){
					$("#preview").fadeOut(3000, function(){
						$("#preview").attr("src", r.character.Image);
						$("#preview").fadeIn(3000);
						$("#imgInput").attr("value", r.character.Image);
					});
				}
			});
		});
		$("#attrRoll").click(function(e){
			var attributes = document.querySelectorAll(".attrval")
			Array.from(attributes).forEach(val => {
				val.innerHTML = stat();
			})
		})
		$('#noteModal').on('show.bs.modal', function(e){
			var modal = $(this);
			var button = $(e.relatedTarget);
			var title = button.data('title');
			var text = button.data('text');
			var user = button.data('user');
			modal.find('.modal-title').text(title);
			modal.find('.modal-body p.text').text(text);
			modal.find('.modal-body p.user').text(`-${user}`);
		})
	});





