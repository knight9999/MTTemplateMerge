interface IPanel {

  showPanel(): void;

  addEventListener( name: string , action: ( params: { } ) => void ): void;
// setNextPanel( movePanel : (name : string, params : { [key: string]: any; } ) => void ) : void;
}
