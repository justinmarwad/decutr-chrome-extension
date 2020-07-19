// Get location of where context menu was clicked: https://stackoverflow.com/questions/7703697/how-to-retrieve-the-element-where-a-contextmenu-has-been-executed

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendRequest(tab.id, {method: "getSelection"}, function(response){
    
    //   var url=response.url;
    //   var subject=response.subject;
    //   var text= response.body;

      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('options.html'));
      }

    //   cardEvidence(text, url);
      
    });
});

// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Card Evidence";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context], "id": "context" + context}); 
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedEl", function(clickedEl) {
        // alert(clickedEl);
        // alert(clickedEl.value);

        // elt.value = clickedEl.value;
    });
    
        if (info.pageUrl) {
            url = info.pageUrl;
        } else {
            // alert("Not a webpage, please pick a webpage.");
            url="";
        }

        cardEvidence(info.selectionText, url);
};





// WORK  
function cardEvidence(text, url) {
    if(text==''){
        text="No text selected";
        alert(text);
        //You may choose to pop up a text box allowing the user to enter in a message instead.
    }

    paragraph_text = getParagraphText(text);
    // alert(paragraph_text)

    //From here, you can POST the variables to any web service you choose.    
    
    $.get("https://www.jsmtech.org/decutr/card/", {text: text, paragraph_text: paragraph_text, url: url, initials: userName=localStorage.getItem('initials')}, function(data){
        // alert(data);
        // copyTextToClipboard(data);
        copyFormattedTextToClipboard(data); 
    });

}

// UTILS
function getParagraphText(text) {
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

function copyTextToClipboard(text) {
    var copyFrom = document.createElement("textarea"); 
    copyFrom.textContent = text; 
    document.body.appendChild(copyFrom); 
    copyFrom.select(); 
    
    document.execCommand('copy');
    
    copyFrom.blur(); 
    document.body.removeChild(copyFrom);

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



String.prototype.formatUnicorn = String.prototype.formatUnicorn || function () {"use strict";var str = this.toString();if (arguments.length) {var t = typeof arguments[0]; var key; var args = ("string" === t || "number" === t) ? Array.prototype.slice.call(arguments) : arguments[0]; for (key in args) {str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);}} return str;};


// author_name + ()


// SCHEMA
// author, datePublished