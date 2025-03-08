

var citation_text = "{author_name}, {publisher}, {published_date}. {url}. {accessed_date}. {initials}";

function init_selects() { 
	
	// [FORMATS]
	var preset_select = document.getElementById("preset");

	$.get("https://www.decutr.com/format/", {type: "format"}, function(formats){
		for (i in formats) {
			var option = document.createElement("option");  
			option.text = option.value = formats[i];
			preset_select.appendChild(option);
		}
	});
	
	// [FONTS ] 
	var font_select = document.getElementById("fonttype");

	// request the json font list 
	// fetch(chrome.runtime.getURL("data/font-families.json")).then( function (response) { 
	// 	return response.json() 
	// }).then( function (data) {  

	// 	// loop through all the font names and add them one by one to the dropdown 
	// 	for (font of data["families"]) {
	// 		var option = document.createElement("option");  
	// 		option.text = option.value = font;
	// 		font_select.appendChild(option);
	// 	}

	// }); 
}

function reset() {
	document.getElementById('preset').value = "Decutr Original";
	document.getElementById('initials').value = "";
	document.getElementById('citation').value = citation_text;
	
	document.getElementById('citation-size').value = "10";
	document.getElementById('evidence-size').value = "12";
	document.getElementById('secondary-size').value = "8";
	
	document.getElementById('italics').checked = true;
	document.getElementById('publisher').checked = true;
	document.getElementById('author').checked = false;
	document.getElementById('date').checked = true;

	document.getElementById('fonttype').value = "Times New Roman";
}

function save_options() {
	// save variables
	chrome.storage.sync.set({
		preset: document.getElementById("preset").value,
		initials: document.getElementById("initials").value,
		citation: document.getElementById("citation").value,

		citationsize: document.getElementById('citation-size').value,
		evidencesize: document.getElementById('evidence-size').value,
		secondarysize: document.getElementById('secondary-size').value,
		
		italics: document.getElementById('italics').checked,
		publisher: document.getElementById('publisher').checked,
		author: document.getElementById('author').checked,
		date: document.getElementById('date').checked,
		
		fonttype: document.getElementById('fonttype').value,

	}, function() { // Update status to let user know options were saved.
		var status = document.getElementById('status');

		status.textContent = "Saved!";
		setTimeout(function() {status.textContent = "";}, 750);
	});
}

// Restores select box and checkbox state using the preferences stored in chrome.storage.
function restore_options() {
	init_selects();

 	chrome.storage.sync.get({
		preset: "Decutr Original",
		initials: "No initials set.",
		citation: citation_text,

		citationsize: "10",
		evidencesize: "12",
		secondarysize: "8",
		
		italics: true,
		publisher: true,
		author: false,
		date: true,

		fonttype: "Times New Roman",


	}, function(items) {

	  document.getElementById('preset').value = items.preset;
	  document.getElementById('initials').value = items.initials;
	  document.getElementById('citation').value = items.citation;
	  
	  document.getElementById('citation-size').value = items.citationsize;
	  document.getElementById('evidence-size').value = items.evidencesize;
	  document.getElementById('secondary-size').value = items.secondarysize;
	  
	  document.getElementById('italics').checked = items.italics;
	  document.getElementById('publisher').checked = items.publisher;
	  document.getElementById('author').checked = items.author;
	  document.getElementById('date').checked = items.date;

	  document.getElementById('fonttype').value = items.fonttype;
	});
}

// event listeners 
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('citation-form').addEventListener('input', save_options);
document.getElementById('font-form').addEventListener('input', save_options);
document.getElementById("reset").addEventListener("click", reset) 