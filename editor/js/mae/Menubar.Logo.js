import { UIPanel } from '../libs/ui.js';

function MenubarWebarLogo( editor ) {

	var strings = editor.strings;
	var container = new UIPanel();
	container.setClass( 'menu' );



	var title = new UIPanel();
	var logoUrl = '/editor/images/mae/logo.png';

	title.setClass( 'title menu-logo' );
	// title.setTextContent( strings.getKey( 'menubar/mywebar/logo' ) );

	const img = document.createElement( 'img' );
	img.src = logoUrl;
	img.classList.add( 'logo-img' );
	console.log( { img, title } );
	title.dom.appendChild( img );
	// title.dom.innerHTML = `<img src="${logoUrl}" alt="MyWebar" style="height: auto;width: 100%;max-height: 40px;" />`;

	title.onClick( function () {

		console.log( 'click logo' );

	} );
	container.add( title );

	return container;

}

export { MenubarWebarLogo };
