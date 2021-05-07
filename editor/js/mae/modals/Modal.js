import { UIDiv } from '../../libs/ui.js';

import { ImportMyWebAR } from './Modal.ImportMyWebAR.js';
import { ExportToWebAR } from './Modal.ExportToWebAR.js';


function Modal( editor ) {

	var container = new UIDiv();
	container.setClass( 'modal' );
	container.setId( 'modal' );

	container.add( new ImportMyWebAR( editor ) );
	container.add( new ExportToWebAR( editor ) );

	return container;

}

export { Modal };
