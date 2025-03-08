// background.js - Service Worker for Manifest V3

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "cardEvidence",
    title: "Card Evidence",
    contexts: ["selection"]
  });
});

// Open options page when the extension action button is clicked
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// Handle context menu click event
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "cardEvidence" && info.selectionText && tab?.id) {
    (async () => {   
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["js/content_script.js"]
        });

        const settings = await chrome.storage.sync.get({
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
          fonttype: "Times New Roman"
        });
        
        const payload = {
          url: info.pageUrl,
          text: info.selectionText, 
          selection_text: "",
          preset: settings.preset,
          initials: settings.initials,
          citation: settings.citation,
          citationsize: settings.citationsize,
          evidencesize: settings.evidencesize,
          secondarysize: settings.secondarysize,
          italics: settings.italics ? "true" : "false",
          publisher: settings.publisher ? "true" : "false",
          author: settings.author ? "true" : "false",
          date: settings.date ? "true" : "false",
          fonttype: settings.fonttype
        };
        
        // Encode the parameters correctly
        const queryString = new URLSearchParams(payload).toString();
        const requestUrl = `https://www.decutr.com/card/?${queryString}`;
                
        const response = await fetch(requestUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        let data_json;
        try {
          const jsonResponse = await response.json();
          data_json = jsonResponse.result;
        } catch (error) {
          console.error("Invalid JSON response:", error);
          return chrome.tabs.sendMessage(tab.id, { success: false, error: "Invalid JSON response" });
        }

        chrome.tabs.sendMessage(tab.id, {
          action: "processSelection",
          data: data_json,
          success: true
        });

      } catch (error) {
        console.error("Error processing selection:", error);
        chrome.tabs.sendMessage(tab.id, {
          action: "processSelection",
          success: false,
          error: error.message
        });
      }
    })();
  }
});