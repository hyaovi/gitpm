import MediaLoader from './MediaLoader';

export default class AudioLoader extends MediaLoader {
	constructor() {
		super();
		this.media = document.createElement('audio');
	}
}
