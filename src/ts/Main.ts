/// <reference path="typings/chrome/chrome-app.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="mt-data-api.d.ts" />
/// <reference path="system.d.ts" />
/// <reference path="LoginPanel.ts" />
/// <reference path="SeparatePage.ts" />
/// <reference path="DataAPIPack.ts" />

System.setStartFunction(function() {

  var manifest = chrome.runtime.getManifest();
  var version = manifest.version;

  $("#version").html("Ver. "+version);

  $("#help").click( function() {
  	chrome.browser.openTab( { url : "http://knight9999.github.io/MTTemplateMerge/" } );
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

  leftLoginPanel.addEventListener( "move" , (params : { [key: string] : any }) => {
    leftLoginDom = $("#left_panel .component_panel").detach();
    leftSelectBlogDom = null;
    leftListTemplateDom = null;
    separatePage.leftPanel = leftSelectBlogPanel;
    separatePage.leftPanel.showPanel();
  } );

  rightLoginPanel.addEventListener( "move" , (params : { [key: string] : any }) => {
    rightLoginDom = $("#right_panel .component_panel").detach();
    rightSelectBlogDom = null;
    rightListTemplateDom = null;
  	separatePage.rightPanel = rightSelectBlogPanel;
  	separatePage.rightPanel.showPanel();

  } );

  leftSelectBlogPanel.addEventListener( "back" , (params : { [key: string] : any }) => {
    $("#left_panel .component_panel").detach();
    leftLoginDom.appendTo("#left_panel");
  } );

  rightSelectBlogPanel.addEventListener( "back" , (params : { [key: string] : any }) => {
    $("#right_panel .component_panel").detach();
    rightLoginDom.appendTo("#right_panel");
  } );

  leftSelectBlogPanel.addEventListener( "move" , (params : { [key: string] : any }) => {
    leftSelectBlogDom = $("#left_panel .component_panel").detach();
    leftListTemplateDom = null;
    leftListTemplatesPanel.siteId = params["siteId"];
    leftListTemplatesPanel.site = params["site"];
    separatePage.leftPanel = leftListTemplatesPanel;
    separatePage.leftPanel.showPanel();
  } );

  rightSelectBlogPanel.addEventListener( "move" , (params : { [key: string] : any }) => {
    rightSelectBlogDom = $("#right_panel .component_panel").detach();
    rightListTemplateDom = null;
    rightListTemplatesPanel.siteId = params["siteId"];
    rightListTemplatesPanel.site = params["site"];
    separatePage.rightPanel = rightListTemplatesPanel;
    separatePage.rightPanel.showPanel();
  } );

  leftListTemplatesPanel.addEventListener( "back" , (params : { [key: string] : any }) => {
    separatePage.disableBtnCompare();
    $("#left_panel .component_panel").detach();
    leftSelectBlogDom.appendTo("#left_panel");
  } );

  rightListTemplatesPanel.addEventListener( "back" , (params : { [key: string] : any }) => {
  	separatePage.disableBtnCompare();
    $("#right_panel .component_panel").detach();
    rightSelectBlogDom.appendTo("#right_panel");
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
	prevPage = $(".page").detach();
	comparePage.leftSiteId = separatePage.leftSiteId;
	comparePage.rightSiteId = separatePage.rightSiteId;
	comparePage.leftItem = separatePage.leftItem;
	comparePage.rightItem = separatePage.rightItem;
  	comparePage.showPage();
  } );

  comparePage.addEventListener( "back" , (params : { } ) => {
	$(".page").detach();
  	prevPage.appendTo("#main");
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
