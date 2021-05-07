import { UIPanel } from '../libs/ui.js';

function MenubarExportToWebAR( editor ) {

	var strings = editor.strings;

	var container = new UIPanel();
	container.setClass( 'menu' );

	var title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/import/exporttowebar' ) );
	title.onClick( function () {

		document.getElementById( 'modal-import-to-mywebar' ).style.display = 'flex';
		document.getElementById( 'modal' ).style.display = 'flex';

	} );
	container.add( title );

	return container;

}


export { MenubarExportToWebAR };
