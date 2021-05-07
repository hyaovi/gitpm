import { UIPanel } from './libs/ui.js';

import { MenubarAdd } from './Menubar.Add.js';
import { MenubarEdit } from './Menubar.Edit.js';
import { MenubarFile } from './Menubar.File.js';
// import { MenubarExamples } from './Menubar.Examples.js';
// import { MenubarView } from './Menubar.View.js';
// import { MenubarHelp } from './Menubar.Help.js';
import { MenubarPlay } from './Menubar.Play.js';
import { MenubarStatus } from './Menubar.Status.js';

// MAE IMPORTS
import { MenubarWebarImport } from './mae/Menubar.Import.js';
import { MenubarWebarLogo } from './mae/Menubar.Logo.js';
import { MenubarExportToWebAR } from './mae/Menubar.Export.js';
import { MenubarSetting } from './mae/Menubar.Settings.js';

function Menubar( editor ) {

	var container = new UIPanel();
	container.setId( 'menubar' );

	container.add( new MenubarWebarLogo( editor ) );
	container.add( new MenubarFile( editor ) );
	container.add( new MenubarEdit( editor ) );
	container.add( new MenubarAdd( editor ) );
	container.add( new MenubarSetting( editor ) );
	container.add( new MenubarPlay( editor ) );
	// container.add( new MenubarExamples( editor ) );
	// container.add( new MenubarView( editor ) );
	// container.add( new MenubarHelp( editor ) );
	container.add( new MenubarWebarImport( editor ) );
	container.add( new MenubarExportToWebAR( editor ) );

	container.add( new MenubarStatus( editor ) );

	return container;

}

// MAE


export { Menubar };
