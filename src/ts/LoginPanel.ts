
class LoginPanel implements IPanel {

	selector : string;
	apiPack : DataAPIPack;
	setting : LoginSetting;
	listeners : { [key : string ] :  ( params : { } ) => void } = {};
	
	constructor(selector:string,apiPack:DataAPIPack) {
		this.selector = selector;
		this.apiPack = apiPack;
	}

	public showPanel() : void {
		$( this.selector ).load("pages/login.html",{},
			this.createLoginFunc()
		);
	}

	public addEventListener( name : string , action : ( params : { } ) => void ) : void {
		this.listeners[name] = action;
	}

	public createLoginFunc() : ()=>void {
		var panelClass = this.selector;
		return () => {
		    var self = this;
		    self.showSettings(null);
			$(panelClass + " .login_form").submit( function() {

				var form = this;
				new Modal("Loading","Please wait ... <img src=\"/img/spinner.gif\">", function(modal) { 
					$(self.selector)[0].appendChild( modal.div );

	                self.setting = new LoginSetting();
	                self.setting.name = form.elements.name.value;
	                self.setting.url = form.elements.url.value;
	                self.setting.account = form.elements.account.value;
	                self.setting.password = form.elements.password.value;
	                self.setting.version = form.elements.version.value;
	                
                    self.apiPack.version = self.setting.version;
                    try {
                    self.apiPack.setAPI( self.setting.url );
                      self.apiPack.authenticate( self.setting.account, self.setting.password , function(response) {
                        if (response.error) {
                        	modal.showCloseButton();
                        	modal.setTitle( "Error" );
	                        var code = response.error.code;
	                        var msg;
	                        if (code === 404) {
	                          msg = 'Cannot access to Data API CGI script. Please confirm URL for Data API Scrpt.';
	                        } else if (code === 401 ) {
	                          msg = 'Failed to sign in to Movable Type. Please confirm your Username or Password.';
	                        } else {
	                          msg = response.error.message;
	                        }
	                        modal.setMessage( msg );
//	                        $(panelClass + " .login_result").html( msg );
	                    } else {
                            modal.remove();
//	                        $(panelClass + " .login_result").html( "login ok" );
	                        self.apiPack.api.storeTokenData(response);
	                        self.listeners["move"]( {} );
	                    }
	                  });
	                } catch (e) {
	                  modal.showCloseButton();
	                  modal.setTitle( "Error" );
	                  modal.setMessage( "Invalid data" );
	                }
	                console.log( "SUBMIT" + self.selector + " " + form.elements.name.value);
                	
                });
				
				return false;
			});
			
			$(panelClass + " .saveButton").click( function() {
              var $form = $(panelClass + " .login_form");
              var setting : {}  = {} ;
			  var name = $form.find("[name=name]").val();
			  if (! name) { return ; }
			  setting["url"] = $form.find("[name=url]").val();
			  setting["account"] = $form.find("[name=account]").val();
			  setting["password"] = $form.find("[name=password]").val();
			  setting["version"] = $form.find("[name=version]").val();
			  
			  self.loadSettings( function( args : {} ) {
			    if (args == null) {
			      args = {};
			    }
			    args[name] = setting;
			    self.saveSettings( args , function() {
			      console.log("save ok");
			      self.showSettings(null);
			    });
			  
			  } );
			  console.log("save is clicked , " + setting["account"] + ", " + setting["url"] );
			  return false;
			});
			
			$(panelClass + " .deleteButton").click( function() {
			  console.log("delete is clicked");
              var $form = $(panelClass + " .login_form");
              var name = $form.find("[name=name]").val();
              if (! name) { return ; }
	          self.loadSettings( function( args : {} ) {
                if (args == null) {
                  args = {};
                }
                delete args[name];
                self.saveSettings( args , function() {
                  console.log("delete ok");
                  self.showSettings(null);
                });
              
              } );
			  return false;
			});
		};
	}
	
	public loadSettings( callback : ( args : {} ) => void ) : void {
        var panelClass = this.selector;
        var name = panelClass + ".list";
        chrome.storage.local.get( name , function(result:any) { 
          callback( result[name] )
         });	
	} 
	
	public saveSettings( args : {} , callback : () => void ) : void {
        var panelClass = this.selector;
        var name = panelClass + ".list";
        var hash : {} = {};
        hash[name] = args;
        chrome.storage.local.set( hash , callback );
	}

    public showSettings( callback : () => void ) : void {
        var panelClass = this.selector;
        $(panelClass + " .settings").empty();
        var $form = $(panelClass + " .login_form");
        var self = this;        
        this.loadSettings( function( args : {} ) {
            for( var key in args ) {
                var $div = $("<div/>");
                (function() {
                  var name = key;
                  var setting = args[key];
                  $div.text( key );
                  $div.css( "cursor" , "pointer");
                  var $thisDiv = $div;
                  $div.mouseover( function() {
                  	$thisDiv.css("background-color","#AFAFAF");
                  }).mouseout( function() {
                    $thisDiv.css("background-color","");
                  });
                  $div.click( function() {
                    $form.find("[name=name]").val( name );
                    $form.find("[name=url]").val( setting["url"] );
                    $form.find("[name=account]").val( setting["account"] );
                    $form.find("[name=password]").val( setting["password"]);
                    $form.find("[name=version]").val( setting["version"]);
                  });
                })();
                $(panelClass + " .saved_settings .values").append( $div ) ;
            }
            if (callback) {
              callback();
            }
        });
    
    }	
    
}
