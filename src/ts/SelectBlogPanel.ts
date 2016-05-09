/// <reference path="DataAPIPack.ts"/>
/// <reference path="LoginSetting.ts"/>

class SelectBlogPanel implements IPanel {

	selector : string;
	apiPack : DataAPIPack;
	listeners : { [key : string ] :  ( params : { } ) => void } = {};
	list : {};

	constructor(selector:string,apiPack:DataAPIPack) {
		this.selector = selector;
		this.apiPack = apiPack;
	}

	public showPanel() : void {
		System.loadTemplate( this.selector, "pages/select_blog.html",
			this.createPage()
		);
	}

	public addEventListener( name : string , action : ( params : { } ) => void ) : void {
		this.listeners[name] = action;
	}

    public createPage() : ()=>void {
		var panelClass = this.selector;
		return () => {
			var self = this;
			new Modal("Loading","Please wait ... <img src=\"/img/spinner.gif\">", function(modal) {
                $(self.selector)[0].appendChild( modal.div );
//			    self.apiPack.api.listBlogsForUser('me', function(response) {
                self.apiPack.listBlogs( function(response) {
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
//			        $(panelClass + " .result").html( msg );

				  } else {
                    modal.remove();
//				 	$(panelClass + " .result").html( "api ok" );

					var $blogListBox = $(panelClass + " .form-blog-list");
					$blogListBox.children().remove();
	                $blogListBox.append($('<option>').html('Select blog...').val("null"));
	                self.list = {};
	                response.items.forEach( function(x, i) {
	                	self.list[x.id] = { "name" : x.name };
	        			$blogListBox.append($('<option>').html(x.name).val(x.id));
	                });
					$blogListBox.removeAttr('disabled');
				  }
				});
			});
            $(panelClass + " .select_blog_form").submit( function() {
              var siteId : string = $(panelClass + " .form-blog-list option:selected").val();
              if (siteId != "null") {
                  self.listeners["move"]( { "siteId" : siteId , "site" : self.list[siteId] });
              }
              return false;
            });
            $(panelClass + " .back_link").click( function() {
              self.listeners["back"]( { } );
              return false;
            });
		};
	}
}
