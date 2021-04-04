// Todo: Get location of where context menu was clicked: https://stackoverflow.com/questions/7703697/how-to-retrieve-the-element-where-a-contextmenu-has-been-executed

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.pageUrl) url = request.pageUrl; else url="";
    
    data = cardEvidence(request.selectedText, url)

    // sendResponse({ data: data })// Callback

    // return true; 
});


chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendRequest(tab.id, {method: "getSelection"}, function(response){

      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('options.html'));
      }
      
    });
});

// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
  var id = chrome.contextMenus.create({"title": "Card Evidence", "contexts":["page", "link", "selection"], "id": "context"}); 
});
  
// add click event
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    
    if (info.pageUrl) {
        url = info.pageUrl;
    } else {
        alert("Not a webpage, please pick a webpage.");
        url="";
    }

    data = cardEvidence(info.selectionText, url);
});




// WORK  
function cardEvidence(text, url) {
    paragraph_text = getParagraphText(text);
    
    chrome.storage.sync.get({
		preset: "Decutr Original",
		initials: "No initials set.",
		citation: "",

		citationsize: "10",
		evidencesize: "12",
		secondarysize: "8",
		
		italics: true,
		publisher: true,
		author: false,
		date: true,

		fonttype: "Times New Roman",

	}, function(item) {
        
        
        $.get("https://www.decutr.com/card/", {
                text: text, paragraph_text: paragraph_text, url: url, 
                preset: item.preset,
                initials: item.initials,
                citation: item.citation,
        
                citationsize: item.citationsize,
                evidencesize: item.evidencesize,
                secondarysize: item.secondarysize,
                
                italics: item.italics,
                publisher: item.publisher,
                author: item.author,
                date: item.date,
                
                fonttype: item.fonttype,

        }, function(data){
            copyFormattedTextToClipboard(data);
            if (data) return data; else return false; 
        });
    });
}

// UTILS
function getParagraphText(text) {``
    if (window.getSelection) {
        selection = window.getSelection();
    } else if (document.selection) {
        selection = document.selection.createRange();
    }
    var parent = selection.anchorNode;
    while (parent != null && parent.localName != "P") {
        parent = parent.parentNode;
    }
    if (parent == null) {
        return "";
    } else {
        return parent.innerText || parent.textContent;
    }
}


// This function expects an HTML string and copies it as rich text.
function copyFormattedTextToClipboard (html) {
    // Create container for the HTML
    // [1]
    var container = document.createElement('div')
    container.innerHTML = html
  
    // Hide element
    // [2]
    container.style.position = 'fixed'
    container.style.pointerEvents = 'none'
    container.style.opacity = 0
  
    // Detect all style sheets of the page
    var activeSheets = Array.prototype.slice.call(document.styleSheets)
      .filter(function (sheet) {
        return !sheet.disabled
    })
   
    // Mount the container to the DOM to make `contentWindow` available
    // [3]
    document.body.appendChild(container)
  
    // Copy to clipboard
    // [4]
    window.getSelection().removeAllRanges()
  
    var range = document.createRange()
    range.selectNode(container)
    window.getSelection().addRange(range)
  
    // [5.1]
    document.execCommand('copy')
  
    // [5.2]
    for (var i = 0; i < activeSheets.length; i++) activeSheets[i].disabled = true
  
    // [5.3]
    document.execCommand('copy')
  
    // [5.4]
    for (var i = 0; i < activeSheets.length; i++) activeSheets[i].disabled = false
  
    // Remove the container
    // [6]
    document.body.removeChild(container)
}