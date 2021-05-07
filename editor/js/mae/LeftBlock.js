import { UITabbedPanel, UISpan } from './libs/ui.js';

import { SidebarProperties } from './Sidebar.Properties.js';
import { SidebarScript } from './Sidebar.Script.js';
import { SidebarAnimation } from './Sidebar.Animation.js';


function LeftBlock( editor ) {
	var strings = editor.strings;

	var container = new UITabbedPanel();
	container.setClass( 'left-sidebar' );

	var scene = new UISpan().add(
		new SidebarProperties( editor ),
		new SidebarAnimation( editor ),
		new SidebarScript( editor )
	);

	container.add( scene );

	return container;
}

export { LeftBlock };
