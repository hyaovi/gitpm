import { AddObjectCommand } from '../commands/AddObjectCommand.js';

function loadImage( url, filename, editor ) {

	var loader = new THREE.TextureLoader();

	loader.load(
		url,
		function ( texture ) {

			var mesh = new THREE.Object3D();

			var texture_ratio = texture.image.width / texture.image.height;

			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

			var material = new THREE.MeshBasicMaterial( {
				map: texture,
				side: THREE.DoubleSide
			} );

			var plane = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), material );

			plane.scale.set( texture_ratio, 1, 1 );

			mesh.add( plane );
			mesh.name = filename;

			editor.execute( new AddObjectCommand( editor, mesh ) );

		},
		undefined,
		function () {

			console.error( 'An error happened.' );

		}
	);

}

export { loadImage };
