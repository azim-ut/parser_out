/**
 * Copyright (c) 2012 (rxtx). All rights reserved.
 * @author rxtxup@gmail.com (Eugene Shementov)
 */
 
function setPAC(data) {
  var config = {
    mode: "pac_script",
    pacScript: {
      data: data
    }
  };
  chrome.proxy.settings.set({value: config, scope: 'regular'});
}

function loadPACfile() {
  var self = this;
  var address = chrome.extension.getURL('proxy.pac');
  var client = new XMLHttpRequest();
  client.onreadystatechange = function() {
    if(this.readyState == 4){
				self.setPAC.call(self, this.responseText);				
	  }
  }
  client.open("GET", address);
  client.send();
}

loadPACfile();