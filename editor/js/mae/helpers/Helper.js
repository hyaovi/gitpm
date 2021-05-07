import storageHelper from './StorageHelper.js';
import loadersHelper from './LoadersHelper.js';
import axiosAndFormsHelper from './AxiosAndFormsHelper.js';

function readVideoDimensionsFromUrl(url){
	return new Promise((rv, rj) => {
		const video = document.createElement('video');

		const finalize = () => {
			video.oncanplay = undefined;
			video.src = "";
		}

		video.onerror = (event) => {
			rj(event);
			finalize();
		};

		video.oncanplay = () => {
			const {videoHeight, videoWidth} = video;
			rv({
				height: videoHeight,
				width: videoWidth
			});
			finalize();
		};

		video.src = url;
	});
}

function readVideoDimensionsFromInputFile(input_file, file_index = 0){
	return new Promise((rv, rj) => {
		if(!input_file.files[file_index]) rj('no file');
		const file = input_file.files[file_index];
		const url = URL.createObjectURL(file);
		return readVideoDimensionsFromUrl(url).then(rv).catch(rj);
	});
}


export default {
  ...storageHelper,
  ...loadersHelper,
  ...axiosAndFormsHelper,
  readVideoDimensionsFromInputFile,
  readVideoDimensionsFromUrl,
};
