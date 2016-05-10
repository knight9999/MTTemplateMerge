/// <reference path="typings/jquery/jquery.d.ts" />

class ComparePage {

    leftApiPack : DataAPIPack;
    rightApiPack : DataAPIPack;
    leftSiteId : number;
    rightSiteId : number;
    leftItem : {} = null;
    rightItem : {} = null;
    leftJson : {} = null;
    rightJson : {} = null;
    leftText : string = null;
    rightText : string = null;
    width : number;
    height : number;
    listeners : { [key : string ] :  ( params : { } ) => void } = {};

  constructor() {

  }

  public showPage() : void {
    var self = this;

    System.loadTemplate("#main", "pages/compare.html", () => {
      new Modal("Loading", "Please wait ... <img src=\"/img/spinner.gif\">", function(modal) {
        $('#comparePage')[0].appendChild( modal.div );
        self.width = $("#compare_result").width();
        self.height = $("#compare_result").height();

        console.log("WIDTH : " + self.width);
        console.log("HEIGHT : " + self.height);
        self.leftJson = null;
        self.rightJson = null;
        self.leftText = null;
        self.rightText = null;

        $(".back_form").submit( function() {
          console.log("Back!");
          self.listeners["back"]( { } );
          return false;
        });

        $(".save_left").submit( function() {
          console.log("SaveLeft");
          $(".btn_save_left").attr("disabled", "disabled");
          var newText = $('#compare_result').mergely('get', 'lhs');
          self.leftJson["text"] = newText;
          self.leftApiPack.updateTemplate(self.leftSiteId, self.leftItem['id'], self.leftJson,
            function(json) {
              self.leftText = newText;
            }
          );
          return false;
        });

        $(".save_right").submit( function() {
          console.log("SaveRight");
          $(".btn_save_right").attr("disabled", "disabled");
          var newText = $('#compare_result').mergely('get', 'rhs');
          self.rightJson["text"] = newText;
          self.rightApiPack.updateTemplate(self.rightSiteId, self.rightItem['id'], self.rightJson ,
            function(json) {
              self.rightText = newText;
            }
          );
          return false;
        });

        self.leftApiPack.template( self.leftSiteId , self.leftItem["id"] , function(response) {
          if (!response.error) {
            self.leftJson = response;
            var text: string = response.text;
            self.leftText = text;
            self.loadFinish(modal);
          } else {
            self.loadError(modal);
          }
        });

        self.rightApiPack.template( self.rightSiteId , self.rightItem["id"] , function(response) {
          if (!response.error) {
            self.rightJson = response;
            var text: string = response.text;
            self.rightText = text;
            self.loadFinish(modal);
          } else {
            self.loadError(modal);
          }
        });

      });
    });
  }

  public loadFinish(modal) : void {
    var self = this;
    if (this.leftText != null && this.rightText != null) {
      $('#compare_result').mergely( {
        cmsettings: {
          readonly: false,
          lineNumbers: true
        },
        editor_width : (self.width - 50) / 2 + "px",
        editor_height : self.height + "px",

        loaded : function() {
          modal.remove();
          var lhs_cm = $('#compare_result').mergely('cm', 'lhs');
          lhs_cm.refresh();
          var rhs_cm = $('#compare_result').mergely('cm', 'rhs');
          rhs_cm.refresh();
        },
        lhs: function(setValue) {
          setValue( self.leftText ); //比較元テキスト
        },
        rhs: function(setValue) {
          setValue( self.rightText ); //比較先テキスト
        },
        autoresize: false
      });
      var lhs_cm = $('#compare_result').mergely('cm', 'lhs');
      lhs_cm.on('change', function() {
        var newText = $('#compare_result').mergely('get', 'lhs');
        if (newText != self.leftText) {
          console.log("LHS changed");
          $(".btn_save_left").removeAttr("disabled");
        } else {
          $(".btn_save_left").attr("disabled", "disabled");
        }
      });
      var rhs_cm = $('#compare_result').mergely('cm', 'rhs');
      rhs_cm.on('change', function() {
        var newText = $('#compare_result').mergely('get', 'rhs');
        if (newText != self.rightText) {
          console.log("RHS changed");
          $(".btn_save_right").removeAttr("disabled");
        } else {
          $(".btn_save_right").attr("disabled", "disabled");
        }
      });
      self.resize();

    }
  }

  public loadError(modal) : void {
    modal.showCloseButton();
    modal.setTitle( "Error" );
    modal.setMessage( 'Load data error' );
  }

  public addEventListener( name : string , action : ( params : { } ) => void ) : void {
    this.listeners[name] = action;
  }

  public resize(): void {
    var self = this;
    var je = $('#compare_result');
    if (je.length > 0) {
      var x = jQuery.data(je.get(0), 'mergely');
      if (x != null) {
        self.width = $("#compare_result").width();
        self.height = $("#compare_result").parent().height();
        var width = (self.width - 50) / 2 + "px";
        var height = self.height + "px";

        var list = je.find("div");
        list.find(".CodeMirror").css("height", height);
        var je2 = list.eq(0);
        je2.css('height', height);
        je2.find("canvas").attr("height", height );

        var je3 = je2.next();
        je3.css('width', width );
        je3.css('height', height);

        var je4 = je3.next();
        je4.css('height', height);
        je4.find("canvas").attr("height", height);

        var je5 = je4.next();
        je5.css('width', width);
        je5.css('height', height);

        var je6 = je5.next();
        je6.css('height' , height);

        je.mergely('options', { width: width, height: height } );
        je.mergely('resize');
      }
    }
  }

}
