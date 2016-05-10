// window.localStorage = chrome.storage.local;

(function() {
  var System = {};

  System.loadTemplate = function(selector, url, nextTask) {
    $(selector).load(url,{},nextTask);
  };

  System.setItem = function(name,value,callback) {
    var hash = {};
    hash[name] = value;
    chrome.storage.local.set( hash , callback );
  };

  System.getItem = function(name,callback) {
    chrome.storage.local.get( name , function(result) {
      callback( result[name] )
    });
  };

  System.openUrl = function(url) {
    chrome.browser.openTab( { url : url } );
  };

  System.setStartFunction = function(func) {
    $(document).ready(func);
  }

  System.getVersion = function() {
    var manifest = chrome.runtime.getManifest();
    version = manifest.version;
    return version;
  }

  window.System = System;
})();
