/// <reference path="mt-data-api.d.ts" />

class DataAPIPack {
	api : any; // mt-data-api
	version : string;
	// methods
	
	public setAPI( baseUrl : string ) : void {
		this.api = new MT.DataAPI[this.version]({
			baseUrl : baseUrl,
			clientId: 'mttemplatemerge'
		});
		if (this.version == 'v1') {
            DataAPIExtensionTemplates.extendEndPoints(this.api);
		}
	}
	
	public authenticate( username : string , password : string , callback : ( response : any ) => void ) {
        this.api.authenticate( { username : username , password : password } , callback );
	}
	
	public listBlogs( callback : (response : any) => void ) {
		this.api.listBlogsForUser('me', callback );
	}
	
	public listTemplates( siteId : number , callback : ( response : any ) => void ) {
		if (this.version == "v1") {
		    this.api.donutListTemplates( siteId , callback );
		} else {
			this.api.listTemplates( siteId , function(response) {
				var items = [];
				for (var i=0;i<response.items.length;i++) {
					var ritem = response.items[i];
					var item = { id : ritem["id"] , name : ritem["name"] };
					items.push( item );
				}
				callback( { items : items } );
			});
		}
	}
	
	public template( siteId : number , templateId : number, callback : (response : any ) => void ) {
		if (this.version == "v1") {
			this.api.donutTemplate( siteId , templateId , callback );
		} else {
			this.api.getTemplate( siteId , templateId , function(response) {
				callback( response );
			});
		}
	}
	
	public updateTemplate( siteId : number , templateId : number, json : any , callback : (response : any) => void ) {
		if (this.version == "v1") {
			this.api.donutUpdateTemplate( siteId, templateId, json, callback);
		} else {
			this.api.updateTemplate( siteId, templateId, json, callback);
		}
	}
}
