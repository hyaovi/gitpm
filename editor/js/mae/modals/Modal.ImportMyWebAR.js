import { UIPanel, UIRow } from '../../libs/ui.js';
import storageHelper from '../helpers/StorageHelper.js';
import axiosAndFormsHelper from '../helpers/AxiosAndFormsHelper.js';
// import storageHelper from '/mae/helpers/StorageHelper.js';
// import axiosAndFormsHelper from '/mae/helpers/AxiosAndFormsHelper.js';

const EXTENSION_IMAGES = [ 'png', 'gif', 'jpg', 'jpeg' ];
const EXTENSION_3D = [ 'glb', 'fbx', 'dae', 'obj' ];
const EXTENSION_VIDEO = [
	'3gp',
	'avi',
	'flv',
	'm4v',
	'mkv',
	'mov',
	'mp4',
	'mpg',
	'mpeg',
	'mts',
	'webm',
	'wmv',
	'vob',
];

const extensions = {
	'image': EXTENSION_IMAGES,
	'3d': EXTENSION_3D,
	'video': EXTENSION_VIDEO,
};

var userFiles = {
	'image': [],
	'3d': [],
	'video': [],
};

let _editor;
let strings;

var container = new UIPanel();
container.setClass( 'modal-import-mywebar' );
container.setId( 'modal-import-mywebar' );

var elem = new UIPanel();
elem.setClass( 'content-modal-box' );

// var fileSelect = {};

async function fetchUserFilesByType( type ) {

	const files = await storageHelper.storageList( {
		ext: extensions[ type ],
	} );

	return files;

}

async function loadFile( type ) {

	const type_3d = '3d',
		type_image = 'image',
		type_video = 'video';

	axiosAndFormsHelper.axiosInstance( axios );

	const [ images, videos, objects ] = await Promise.all( [
		fetchUserFilesByType( type_image ),
		fetchUserFilesByType( type_video ),
		fetchUserFilesByType( type_3d ),
	] );

	userFiles[ 'image' ] = [ ...images ];
	userFiles[ '3d' ] = [ ...objects ];
	userFiles[ 'video' ] = [ ...videos ];

	elem.dom.innerHTML = '';

	for ( var i = 0, l = userFiles[ type ].length; i < l; i ++ ) {

		var object = userFiles[ type ][ i ];

		var option_1 = new UIRow();
		option_1.setClass( 'option object-elem' );

		var option_img = new UIRow();
		option_img.onClick( function ( event ) {

			const storage_file = JSON.parse( event.target.dataset.data );

			fetch( storage_file.url ).then( resp => resp.arrayBuffer().then( function ( buffer ) {

				var file = new File( [ buffer ], storage_file.filename, {
					type: 'text/plain',
				} );

				_editor.loader.loadFile(
					file
				);

				document.getElementById( 'modal' ).style.display = 'none';
				document.getElementById( 'modal-import-mywebar' ).style.display = 'none';


			} ) );

		} );

		option_img.dom.dataset.data = JSON.stringify( object );

		const exextension = object.name.split( '.' ).pop();

		var block_name = new UIRow();
		block_name.setClass( 'name-image' );
		block_name.setTextContent( object.name );


		option_img.setClass( 'option object-image' );
		option_img.add( block_name );

		if ( exextension == 'jpg' || exextension == 'png' || exextension == 'jpeg' ) {

			option_img.dom.style.backgroundImage = `url( ${object.url} )`;

		} else {

			option_img.dom.style.background = 'linear-gradient(180deg, #d0d0d0 0%, #e9e9e9 100%)';

		}

		option_1.add( option_img );

		elem.add( option_1 );

	}

}

function ImportMyWebAR( editor ) {

	_editor = editor;
	strings = editor.strings;

	var options = new UIPanel();
	options.setClass( 'menu-modal-box' );
	container.add( options );

	var left = new UIRow();
	left.setClass( 'option left-block' );
	options.add( left );

	var option1 = new UIRow();
	option1.setClass( 'option text-header' );
	option1.setTextContent( strings.getKey( 'menubar/import/local' ) );

	var option2 = new UIRow();
	option1.setClass( 'option button-modal' );
	option1.setTextContent( 'Image' );
	option1.onClick( function () {

		console.log( 'Image' );
		loadFile( 'image' );

	} );

	var option3 = new UIRow();
	option2.setClass( 'option button-modal' );
	option2.setTextContent( '3D' );
	option2.onClick( function () {

		console.log( '3D' );
		loadFile( '3d' );

	} );

	left.add( option1 );
	left.add( option2 );
	left.add( option3 );

	var right = new UIRow();
	right.setClass( 'option right-block' );

	var option3 = new UIRow();
	option3.setClass( 'option close' );
	option3.dom.style.color = 'white';
	option3.dom.innerHTML = '<svg height="18px" viewBox="0 0 329.26933 329" width="18px" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path></svg>';
	option3.onClick( function () {

		document.getElementById( 'modal' ).style.display = 'none';
		document.getElementById( 'modal-import-mywebar' ).style.display = 'none';

	} );
	right.add( option3 );

	options.add( left );
	options.add( right );

	container.add( elem );

	return container;

}

loadFile( 'image' );

export { ImportMyWebAR };
