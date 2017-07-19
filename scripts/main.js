// Creating parent menu
chrome.contextMenus.create({
    "title": 'Search "%s" on',
    "contexts":["selection"],
    "id": "parent",
});

getAppURL = () => {
  chrome.history.search({text: 'edcast.com', maxResults: 10}, function(data) {
      data.map(function(page, index){
          if(page.url.includes('edcast.com')){
            return page.url;
          }
      });
  });
}

// This function will execute when a user clicks on a menu item
sourceClickHandler = (source) => {  
  let searchURL; // declaring variables
  chrome.tabs.getSelected(null, function(tab){ // getting the active tab of user
    let index = tab.index + 1; // getting the index of active tab & incrementing it by 1 to open the new tab just beside this
    chrome.tabs.executeScript(tab.id, {file: "scripts/getSelection.js"}, function(result){ // executing a script inside the DOM to get the current selection
      switch(source.type){
        case "url": 
          searchURL = source.url + '/' + result[0];    
          break;
        case "multiTenant": 
          let sourceUrl = getAppURL();
          console.log(sourceUrl);
          searchURL = sourceUrl + '?' + source.paramName + '=' + result[0];
          break;
        default: 
          searchURL = source.url + '?' + source.paramName + '=' + result[0];    
      }   
      chrome.tabs.create({ url: searchURL, index: index }); // opening a current tab
    });
  });
}

// looping through all sources to create different menu items
sources.map(function(source, index){
  chrome.contextMenus.create({
      "title": source.name || '',
      "contexts":["selection"],
      "parentId": "parent",
      "onclick": ()=>{sourceClickHandler(source)}
  });
});