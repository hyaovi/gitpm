import MediaLoader from './MediaLoader';

export default class VideoLoader extends MediaLoader {
	constructor() {
		super();
		this.media = document.createElement('video');
	}
}
