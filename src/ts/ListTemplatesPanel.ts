/// <reference path="DataAPIPack.ts"/>
/// <reference path="LoginSetting.ts"/>

class ListTemplatesPanel implements IPanel {

  selector : string;
  apiPack : DataAPIPack;
  siteId : number;
  site : {};
  items : {} [ ];
  selectedItem : {};
//	movePanel : (name:string, params : { [key: string] : any }) => void;
  listeners : { [key : string ] :  ( params : { } ) => void } = {};

  constructor(selector: string, apiPack: DataAPIPack) {
    this.selector = selector;
    this.apiPack = apiPack;
  }

  public showPanel() : void {
    System.loadTemplate( this.selector, "pages/list_templates.html",
      this.createPage()
    );
  }

  public addEventListener( name : string , action : ( params : { } ) => void ) : void {
    this.listeners[name] = action;
  }

//    public setNextPanel( movePanel : (name:string, params : { [key: string] : any }) => void) : void {
//		this.movePanel = movePanel;
//	}

  public createPage() : () => void {
    var panelClass = this.selector;
    return () => {
      var self = this;
      $(panelClass + " .list_title").html(self.site["name"] + "のテンプレート一覧");
      $(panelClass + " .back_link").click( function() {
        self.listeners["back"]( { } );
        return false;
      });
//		self.apiPack.api.donutListTemplates( self.siteId , function(response) {
      new Modal("Loading", "Please wait ... <div class=\"loading\"></div>", function(modal) {
        $(self.selector)[0].appendChild( modal.div );
        self.apiPack.listTemplates( self.siteId , function(response)  {
          if (response.error) {
            modal.showCloseButton();
            modal.setTitle( "Error" );
            modal.setMessage( 'Load data error' );
            return;
          }
          var ul = document.createElement("ul");
          self.items = response.items;
          for (var i = 0; i < self.items.length; i++) {
            var hash = self.items[i];
	//			results += JSON.stringify( hash );
            var li = document.createElement("li");
            $(li).addClass(hash["id"]);
            var span1 = document.createElement("span");
            var text1 = document.createTextNode(hash["id"] + ". ");
            span1.appendChild( text1 );
            var span2 = document.createElement("span");
            var text2 = document.createTextNode(hash["name"]);
            span2.style.cssText = "cursor : pointer;";
            span2.appendChild( text2 );

            li.appendChild(span1);
            li.appendChild(span2);
            (function() {
              var id = hash["id"];
              // var name = hash["name"];
              $(li).click( function() {
                if (self.selectedItem == null || self.selectedItem["id"] != id) {
                  for (var i = 0; i < self.items.length; i++) {
                    var hash = self.items[i];
                    if (hash["id"] != id) {
                      $(panelClass + " ." + hash["id"]).css("background", "");
                    } else {
                      self.selectedItem = hash;
                      $(panelClass + " ." + hash["id"] ).css("background", "#FFCFCF");
                    }
                  }
                } else {
                  for (var i = 0; i < self.items.length; i++) {
                    var hash = self.items[i];
                    $(panelClass + " ." + hash["id"]).css("background", "");
                  }
                  self.selectedItem = null;
                }
                self.listeners["selectTemplate"]({ "site": self.site, "siteId" : self.siteId , "item" : self.selectedItem });
	//				doLoadTemplate( api, num, siteId, id , name );
              });
            })();
            ul.appendChild(li);
          }
          var result : any = $(panelClass + " .list" )[0]; // document.getElementById('list' + num);
          while (result.firstChild) { result.removeChild(result.firstChild); };
          result.appendChild(ul);
            modal.remove();
          });
        });
      };
   }

}
