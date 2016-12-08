
//--------------------------------------------------------------------------- Event listeners


//--------------------------------------------------------------------------- Add Thread
function addThread() {
		
		var title = document.getElementsByName('user');
		var description = document.getElementsByName('description');
		var tBun = document.getElementsByName('TBun');
		/*var patty = document.getElementsByName('description');
		var BBun = document.getElementsByName('description');
		var Border = document.getElementsByName('description');*/
		console.log(title, " ", description, " ", tBun);
		alert(title[1].value + " " + description[1].value + " " + tBun[0]._jscLinkedInstance.rgb); 
};


