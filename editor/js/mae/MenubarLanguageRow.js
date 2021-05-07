import { UIRow, UISelect } from '../libs/ui.js';

function MenubarLanguageRow( editor ) {

	var config = editor.config;

	var options = {
		ru: 'Русский',
		en: 'English',
		fr: 'Francais',
		zh: '中文',
	};

	var languageRow = new UIRow();

	var language = new UISelect();
	language.setOptions( options );
	language.setBackground( 'none' );
	language.setColor( '#fff' );

	if ( config.getKey( 'language' ) !== undefined ) {

		language.setValue( config.getKey( 'language' ) );

	}

	language.onChange( function ( ) {

		var value = this.getValue();

		editor.config.setKey( 'language', value );

		location.reload();

	} );

	languageRow.add( language );

	return languageRow;

}

export { MenubarLanguageRow };
