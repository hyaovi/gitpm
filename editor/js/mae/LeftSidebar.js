import { UITabbedPanel, UISpan, UIPanel } from '../libs/ui.js';

import { SidebarScene } from '../Sidebar.Scene.js';
import { SidebarProperties } from '../Sidebar.Properties.js';
import { SidebarScript } from '../Sidebar.Script.js';
import { SidebarAnimation } from '../Sidebar.Animation.js';
import { SidebarProject } from '../Sidebar.Project.js';
import { SidebarSettings } from '../Sidebar.Settings.js';

function LeftSidebar( editor ) {

	// var strings = editor.strings;

	var container = new UIPanel();
	container.setId( 'left-sidebar' );
	container.addClass( 'p-1' );

	var scene = new UISpan().add(
		// new SidebarScene( editor ),
		new SidebarProperties( editor ),
		// new SidebarAnimation( editor ),
		// new SidebarScript( editor )
	);
	// var project = new SidebarProject( editor );
	// var settings = new SidebarSettings( editor );
	container.add( scene );

	// container.addTab( 'scene', strings.getKey( 'sidebar/scene' ), scene );
	// container.addTab( 'project', strings.getKey( 'sidebar/project' ), project );
	// container.addTab( 'settings', strings.getKey( 'sidebar/settings' ), settings );
	// container.select( 'scene' );

	return container;

}

export { LeftSidebar };
