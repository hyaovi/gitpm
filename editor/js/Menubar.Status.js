import * as THREE from '../../build/three.module.js';

import { UIPanel, UIText } from './libs/ui.js';
import { UIBoolean } from './libs/ui.three.js';

import { MenubarLanguageRow } from './mae/MenubarLanguageRow.js';


function MenubarStatus( editor ) {

	var strings = editor.strings;

	var container = new UIPanel();
	container.setClass( 'menu right' );
	container.setDisplay( 'flex' );

	var autosave = new UIBoolean( editor.config.getKey( 'autosave' ), strings.getKey( 'menubar/status/autosave' ) );
	autosave.text.setColor( '#fff' );
	autosave.onChange( function () {

		var value = this.getValue();

		editor.config.setKey( 'autosave', value );

		if ( value === true ) {

			editor.signals.sceneGraphChanged.dispatch();

		}

	} );
	const languageRow = new MenubarLanguageRow( editor );

	container.add( autosave );
	container.add( languageRow );

	editor.signals.savingStarted.add( function () {

		autosave.text.setTextDecoration( 'underline' );

	} );

	editor.signals.savingFinished.add( function () {

		autosave.text.setTextDecoration( 'none' );

	} );

	var version = new UIText( 'r' + THREE.REVISION );
	version.setClass( 'title' );
	version.setOpacity( 0.5 );
	container.add( version );
	version.setDisplay( 'none' );
	console.log( version );

	return container;

}

export { MenubarStatus };
