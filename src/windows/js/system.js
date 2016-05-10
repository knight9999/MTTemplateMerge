// window.localStorage = chrome.storage.local;

(function() {
  var System = {};



  System.loadTemplate = function(selector, url, nextTask) {
    var element = $(selector)[0];
    WinJS.xhr(
      {
        url: url,
        responseType: "text",
        type: "GET"
      }
    ).done(
      function completed(result) {
        element.innerHTML = result.responseText;
        nextTask();
      }
    );


  };

  System.setItem = function(name,value,callback) {
    if (value == null) {
      localStorage.removeItem(name);
    } else {
      localStorage.setItem( name , JSON.stringify(value));
    }
    callback();
  };

  System.getItem = function(name,callback) {
    var text = localStorage.getItem( name );
    var value = {};
    if (text != null) {
      value = JSON.parse( text );
    }
    callback( value );
  };

  System.openUrl = function(url) {
    var uri = new Windows.Foundation.Uri(url);
    Windows.System.Launcher.launchUriAsync(uri).then(
      function (success) {

      }
    );
  };

  System.setStartFunction = function(func) {
    document.addEventListener("deviceready",func,false);
  }

  System.getVersion = function() {
    var package = Windows.ApplicationModel.Package.current;
    var packageId = package.id;
    var version = packageId.version;
    return version.major + "." + version.minor + "." +
           version.build + "." + version.revision;
  }

  window.System = System;
})();
