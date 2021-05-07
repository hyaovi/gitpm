import { UIPanel, UIRow, UIInput, UIText } from '../libs/ui.js';
import { SidebarSettings } from '../Sidebar.Settings.js';


function MenubarSetting( editor ) {

	var config = editor.config;
	var strings = editor.strings;

	var container = new UIPanel();
	container.setClass( 'menu' );

	var title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/settings' ) );
	container.add( title );

	var options = new UIPanel().setWidth( '300px' );
	options.setClass( 'options' );
	container.add( options );

	var option = new UIRow();
	option.add( new SidebarSettings( editor ) );
	options.add( option );

	var titleRow = new UIRow();
	titleRow.setMarginLeft( '10px' );

	var title = new UIInput( config.getKey( 'project/title' ) ).setLeft( '100px' ).setWidth( '150px' ).onChange( function () {

		config.setKey( 'project/title', this.getValue() );

	} );

	titleRow.add( new UIText( strings.getKey( 'sidebar/project/title' ) ).setWidth( '90px' ) );
	titleRow.add( title );

	option.add( titleRow );

	return container;

}

export { MenubarSetting };
