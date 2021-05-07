import VideoLoader from './VideoLoader';
import AudioLoader from './AudioLoader';

import { THREEx } from '@webar/webar.module.js';


class ModelLoader {
	constructor() {
		this.debug = false;
	}

	load(url, ext, onprogress = null) {
		return new Promise((resolve, reject) => {
			let model_name;
			const m = url.match(/\/([^\/]+)\.([^\.?]+)(\?.*)?$/);
			if (m) {
				if (typeof ext !== 'string') {
					ext = m[2].toLowerCase();
				}
				model_name = m[1];
			}
			let loader;
			let promise = new Promise((rv) => rv());
			let onload = (model) => {
				if (this.debug) console.log('loaded model ', url, model);
				resolve({
					mesh: model.scene,
					animations: model.animations ?? [],
				});
			};
			switch (ext) {
			case 'gltf':
			case 'glb':
				loader = new THREEx.GLTFLoader();
				break;
			case 'fbx':
				loader = new THREEx.FBXLoader();
				onload = (model) => {
					resolve({
						mesh: model,
						animations: model.animations ?? [],
					});
				};
				break;
			case 'dae':
				loader = new THREEx.ColladaLoader();
				break;
			case 'mtl':
				loader = new THREEx.MTLLoader();
				onload = (mtl) => {
					resolve(mtl);
				};
				break;
			case 'obj':
				loader = new THREEx.OBJLoader2();
				const mtl_url = new URL(url);
				mtl_url.pathname = mtl_url.pathname.replace(
					new RegExp(`.${ext}$`),
					'.mtl',
				);
				promise = new ModelLoader()
					.load(mtl_url.href)
					.catch((error) => console.warn('mtl load error', error));
				promise = promise.then((mtl_result) => {
					if (!mtl_result) return;
					loader.setModelName(model_name);
					loader.setLogging(true, true);
					loader.addMaterials(
						THREEx.MtlObjBridge.addMaterialsFromMtlLoader(mtl_result),
						true,
					);
				});
				onload = (model) => {
					resolve({
						mesh: model,
						animations: model.animations ?? [],
					});
				};
				break;
			default:
				reject(`unsupported extension ${JSON.stringify(ext)}`);
			}

			promise.then(() => loader.load(
				url,
				onload,
				// called while loading is progressing
				onprogress, /* function(xhr) {                        if (this.debug) console.log(
                            (xhr.loaded / xhr.total) * 100 + "% loaded"
                        );
                    } */
				// called when loading has errors
				(error) => {
					reject(error);
				},
				null,
			));
		});
	}
}

export default {
	AudioLoader,
	VideoLoader,
	ModelLoader,
};
