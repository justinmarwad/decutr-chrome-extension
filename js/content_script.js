
// bind Ctrl-Alt-C to the copying evidence citation 
Mousetrap.bind('ctrl+alt+c', function(e) {
   
    // there's selected text, set that to the selectedText 
    if (window.getSelection) var selectedText = window.getSelection().toString();
    else var selectedText = ""; // no selected text, only do citation 

    var url = window.location.href; 

    chrome.runtime.sendMessage( {selectedText: selectedText, pageUrl: url}, function(response) {
        alert(response.data);

    });

    return false;
});

