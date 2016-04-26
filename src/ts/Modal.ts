



class Modal {
	
	div : HTMLElement;
	
	
	constructor(title:string,message:string,callback: (Modal) => void) {
		this.div = document.createElement("div");
		
		var self = this;
		$(this.div).load("pages/modal.html",{},function() {
            // console.log( $(div).find("#openModal").html() );
            $(self.div).find("#openModal .title").html( title );
            $(self.div).find("#openModal .message").html( message );
            $(self.div).find("#openModal .close").click( function() {
                $(self.div).remove();
            } );
            callback( self ); 
        });
    }
    
    public remove() { 
        $(this.div).remove(); 
    } 
        
    public hideCloseButton() { 
      	$(this.div).find("#openModal .close").hide();
    }
        
    public showCloseButton() { 
       	$(this.div).find("#openModal .close").show(); 
    }   
          
    public setTitle(title) { 
      	$(this.div).find("#openModal .title").html( title ); 
    }
        
        
    public setMessage(message) { 
        $(this.div).find("#openModal .message").html( message ); 
    }
		
	
}


