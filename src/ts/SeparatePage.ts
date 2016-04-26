/// <reference path="LoginPanel.ts" />

class SeparatePage {

	leftPanel : IPanel;
	rightPanel : IPanel;
	leftSiteId : number;
	rightSiteId : number;
	leftItem : {} = null;
	rightItem : {} = null;
	listeners : { [key : string ] :  ( params : { } ) => void } = {};
	
	constructor(leftPanel:IPanel, rightPanel:IPanel) {
		this.leftPanel = leftPanel;
		this.rightPanel = rightPanel;
	}
	
	public showPage() : void {
	    var self = this;
		$("#main").load("pages/separate.html", {} , () => { 
			this.leftPanel.showPanel();
			this.rightPanel.showPanel();
			$(".compare_form").submit( function() {
			  self.listeners["compare"]( { } );
			  return false;
			});
		});
	}
	
	public addEventListener( name : string , action : ( params : { } ) => void ) : void {
		this.listeners[name] = action;
	}
	public check() : void {
	  if (this.leftItem != null && this.rightItem != null ) {
	    $(".btn_compare").removeAttr("disabled");
	  } else {
	  	this.disableBtnCompare();
	  } 
	}
	public disableBtnCompare() : void {
        $(".btn_compare").attr("disabled","disabled");
	}
}
