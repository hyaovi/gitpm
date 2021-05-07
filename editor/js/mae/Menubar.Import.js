import { UIPanel, UIRow } from '../libs/ui.js';

function MenubarWebarImport( editor ) {

	var strings = editor.strings;

	var container = new UIPanel();
	container.setClass( 'menu' );

	var title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/file/import' ) );
	container.add( title );

	var options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	var form = document.createElement( 'form' );
	form.style.display = 'none';
	document.body.appendChild( form );

	var fileInput = document.createElement( 'input' );
	fileInput.multiple = true;
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function () {

		editor.loader.loadFiles( fileInput.files );
		form.reset();

	} );
	form.appendChild( fileInput );

	var option1 = new UIRow();
	option1.setClass( 'option' );
	option1.setTextContent( strings.getKey( 'menubar/import/local' ) );
	option1.onClick( function () {

		fileInput.click();

	} );
	options.add( option1 );

	var option2 = new UIRow();
	option2.setClass( 'option' );

	option2.setTextContent( strings.getKey( 'menubar/import/devar' ) );
	option2.onClick( function () {

		document.getElementById( 'modal-import-mywebar' ).style.display = 'flex';
		document.getElementById( 'modal' ).style.display = 'flex';

	} );
	options.add( option2 );

	return container;


}

export { MenubarWebarImport };
