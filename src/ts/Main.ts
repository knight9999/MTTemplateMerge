/// <reference path="typings/chrome/chrome-app.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="mt-data-api.d.ts" />
/// <reference path="system.d.ts" />
/// <reference path="LoginPanel.ts" />
/// <reference path="SeparatePage.ts" />
/// <reference path="DataAPIPack.ts" />

System.setStartFunction(function() {

  var version = System.getVersion();

  $("#version").html("Ver. "+version);

  $("#help").click( function() {
  	System.openUrl( "http://knight9999.github.io/MTTemplateMerge/" );
  } );

  var apiPack1 = new DataAPIPack();
  var apiPack2 = new DataAPIPack();

  var leftLoginPanel : LoginPanel = new LoginPanel("#left_panel",apiPack1);
  var rightLoginPanel : LoginPanel = new LoginPanel("#right_panel",apiPack2);

  var leftSelectBlogPanel : SelectBlogPanel = new SelectBlogPanel("#left_panel",apiPack1);
  var rightSelectBlogPanel : SelectBlogPanel = new SelectBlogPanel("#right_panel",apiPack2);

  var leftListTemplatesPanel : ListTemplatesPanel = new ListTemplatesPanel("#left_panel",apiPack1);
  var rightListTemplatesPanel : ListTemplatesPanel = new ListTemplatesPanel("#right_panel",apiPack2);

  var separatePage : SeparatePage = new SeparatePage(leftLoginPanel,rightLoginPanel);
  var comparePage : ComparePage = new ComparePage();
  comparePage.leftApiPack = apiPack1;
  comparePage.rightApiPack = apiPack2;

  var leftLoginDom = null;
  var rightLoginDom = null;
  var leftSelectBlogDom = null;
  var rightSelectBlogDom = null;
  var leftListTemplateDom = null;
  var rightListTemplateDom = null;

  function removeComponent(selector : string) {
    ( <any> $(selector)[0] ).oldDisplay = $(selector).css("display");
    $(selector).css("display", "none");
    return $(selector).detach();
  }

  function attachComponent(selector : string, component : JQuery) {
    component.appendTo(selector);
    component.css("display", ( <any> component[0] ).oldDisplay );
  }

  leftLoginPanel.addEventListener( "move" , (params : { [key: string] : any }) => {
    leftLoginDom = removeComponent("#left_panel .component_panel");
    leftSelectBlogDom = null;
    leftListTemplateDom = null;
    separatePage.leftPanel = leftSelectBlogPanel;
    separatePage.leftPanel.showPanel();
  } );

  rightLoginPanel.addEventListener( "move" , (params : { [key: string] : any }) => {
    rightLoginDom = removeComponent("#right_panel .component_panel");
    rightSelectBlogDom = null;
    rightListTemplateDom = null;
    separatePage.rightPanel = rightSelectBlogPanel;
    separatePage.rightPanel.showPanel();

  } );

  leftSelectBlogPanel.addEventListener( "back" , (params : { [key: string] : any }) => {
    removeComponent("#left_panel .component_panel");
    attachComponent("#left_panel", leftLoginDom);
  } );

  rightSelectBlogPanel.addEventListener( "back" , (params : { [key: string] : any }) => {
    removeComponent("#right_panel .component_panel");
    attachComponent("#right_panel", rightLoginDom);
  } );

  leftSelectBlogPanel.addEventListener( "move" , (params : { [key: string] : any }) => {
    leftSelectBlogDom = removeComponent("#left_panel .component_panel");
    leftListTemplateDom = null;
    leftListTemplatesPanel.siteId = params["siteId"];
    leftListTemplatesPanel.site = params["site"];
    separatePage.leftPanel = leftListTemplatesPanel;
    separatePage.leftPanel.showPanel();
  } );

  rightSelectBlogPanel.addEventListener( "move" , (params : { [key: string] : any }) => {
    rightSelectBlogDom = removeComponent("#right_panel .component_panel");
    rightListTemplateDom = null;
    rightListTemplatesPanel.siteId = params["siteId"];
    rightListTemplatesPanel.site = params["site"];
    separatePage.rightPanel = rightListTemplatesPanel;
    separatePage.rightPanel.showPanel();
  } );

  leftListTemplatesPanel.addEventListener( "back" , (params : { [key: string] : any }) => {
    separatePage.disableBtnCompare();
    removeComponent("#left_panel .component_panel");
    attachComponent("#left_panel",leftSelectBlogDom);
  } );

  rightListTemplatesPanel.addEventListener( "back" , (params : { [key: string] : any }) => {
  	separatePage.disableBtnCompare();
    removeComponent("#right_panel .component_panel");
    attachComponent("#right_panel",rightSelectBlogDom);
  } );

  leftListTemplatesPanel.addEventListener( "selectTemplate" , (params : { [key: string] : any} ) => {
    separatePage.leftSiteId = params["siteId"];
  	separatePage.leftItem = params["item"];
  	separatePage.check();
  } );

  rightListTemplatesPanel.addEventListener( "selectTemplate" , (params : { [key: string] : any} ) => {
    separatePage.rightSiteId = params["siteId"];
    separatePage.rightItem = params["item"];
  	separatePage.check();
  } );

  var prevPage = null;

  separatePage.addEventListener( "compare" , (params : { } ) => {
	prevPage = removeComponent(".page");
	comparePage.leftSiteId = separatePage.leftSiteId;
	comparePage.rightSiteId = separatePage.rightSiteId;
	comparePage.leftItem = separatePage.leftItem;
	comparePage.rightItem = separatePage.rightItem;
  	comparePage.showPage();
  } );

  comparePage.addEventListener( "back" , (params : { } ) => {
    removeComponent(".page");
    attachComponent("#main", prevPage);
  } );

  separatePage.showPage();

  jQuery(window).resize(
    function () {
    	comparePage.resize();
    }
  );

});


/*
module MT {

  export class DataAPI {

  	hello() : void {
  		console.log( "hello" );

  	}
  }

}


var a = new MT.DataAPI();
a.hello();
*/


/*
class Greeter {
    private greeting: string;
    constructor(message: string) {
	this.greeting = message;
    }
    public greet() {
	console.log("Good! Morning, Hello Hello, " + this.greeting);
    }

}



var greeter = new Greeter("TypeScript");


$(function() {
greeter.greet();
});
*/
