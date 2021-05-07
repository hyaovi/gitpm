export default class MediaLoader {
	constructor() {
		this.loadMetaTimeout = undefined;
		this.stalledReloadTimeout = undefined;
		this.inited = false;
		this.debug = window.WEBAR_DEBUG ?? false;
	}

	async play({ get_media_allow_promise_callback, refresh_media_allow_promise_callback }) {
		const m = this.media;
		try {
			await m.play();
		} catch (e) {
			if(get_media_allow_promise_callback)
				await get_media_allow_promise_callback();
			try {
				await m.play();
			} catch (e) {
				console.log('media can not play', e);
				if (refresh_media_allow_promise_callback) {
					refresh_media_allow_promise_callback();
				} else {
					await new Promise((rv) => setTimeout(rv, 500));
				}
			}
		}
	}

	async setup({
		muted = undefined,
		loop = undefined,
		autoplay = undefined,
		volume = 1,
		get_media_allow_promise_callback = undefined,
		refresh_media_allow_promise_callback = undefined,
	}) {
		const m = this.media;

		if (
			typeof autoplay !== 'undefined'
			&& autoplay
			&& typeof muted !== 'undefined'
			&& !muted
			&& get_media_allow_promise_callback
		) await get_media_allow_promise_callback();

		if (typeof loop !== 'undefined') m.loop = loop;
		// if (typeof autoplay != "undefined") m.autoplay = autoplay;
		if (typeof muted !== 'undefined') m.muted = muted;
		if (typeof volume !== 'undefined') m.volume = volume;

		if (typeof autoplay !== 'undefined') {
			if (!autoplay) {
				m.pause();
			} else if (m.paused) {
				await this.play({ get_media_allow_promise_callback, refresh_media_allow_promise_callback });
				await this.setup({
					muted,
					loop,
					autoplay,
					volume,
					get_media_allow_promise_callback,
					refresh_media_allow_promise_callback,
				});
			}
		}

		return m;
	}

	reload(url, settings) {
		this.media.src = '';
		setTimeout(() => {
			const new_promise = this.load(url, settings);
			new_promise.then(this.loader_resolve).catch(this.loader_reject);
		}, 0);
	}

	load(url, settings = {}) {
		return new Promise((resolve, reject) => {
			if (!this.loader_resolve) this.loader_resolve = resolve;
			if (!this.loader_reject) this.loader_reject = reject;
			document.body.append(this.media);
			Object.assign(this.media, {
				style: 'width: 1px; height: 1px; position: absolute; opacity: 0.05; display: none;',
				controls: true,
				autoplay: true,
				muted: true,
				loop: false,
				playsInline: true,
				crossOrigin: 'anonymous',
				onended: () => {
					if (this.media.loop){
						// rewind
						this.media.currentTime = 0;
						this.media.play();
					}
				},
				onerror: (e) => {
					if (this.debug) console.log('media error', e, url);
					reject(e);
					this.inited = true;
				},
				oncanplay: () => {
					if (this.debug) console.log('can play media! ', this.media, url);
					// have enough data to play
					this.play(settings);
				},
				onloadedmetadata: () => {
					if (this.debug) console.log('media loadedmetadata ', this.media, url);
					clearTimeout(this.loadMetaTimeout);
				},
				onloadstart: () => {
					if (this.debug) console.log('media loadstart ', this.media, url);
					this.loadMetaTimeout = setTimeout(
						() => this.media.onerror('load metadata timeout'),
						60 * 1000,
					);
				},
				onloadeddata: () => {
					if (this.debug) console.log('media first frame ready', this.media, url);
					clearTimeout(this.stalledReloadTimeout);
					this.stalledReloadTimeout = undefined;
				},
				onstalled: () => {
					if (this.debug) console.log('media stalled', this.media, url);
					if (this.inited || this.stalledReloadTimeout) {
						return;
					}
					this.stalledReloadTimeout = setTimeout(
						() => this.reload(url, settings),
						Math.random() * 2500 + 500,
					);
				},
				onplaying: () => {
					if (this.debug) {
						console.log(
							`playing media`,
							this.media,
						);
						if (this.media instanceof HTMLVideoElement){
							console.log(`video dimensions ${this.media.videoWidth}x${this.media.videoHeight}!`);
						}
					}

					if (this.inited) {
						return;
					}
					this.inited = true;

					this.media.pause();

					if (this.debug) console.log('resolve media');
					resolve(this.media);

					// XXX s.yaglov to access from browserstack dev console
					if (!window.loaded_medias) window.loaded_medias = [];
					window.loaded_medias.push(this.media);
				},
			});

			this.media.src = url;

			return this.media;
		}).then(() => this.setup(settings));
	}
}
