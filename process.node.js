'use strict'

const EventEmitter = require('events')
const { Writable } = require('stream');

class Readable extends EventEmitter {
	constructor(options = null) {
		super();
		this._eventName = ['data', 'end', 'error', 'readable', 'close', 'pause', 'resume'];
		this._store = {};

		if(options === null || Object.keys(options).length <= 0) {
			this._options = {
				_highWaterMark: 16384,
				_emitClose: true,
				_autoDestroy: true,
				_encoding: null,
				_objectMode: false,
				_maxListeners: 10
			}
		}

		if(options instanceof Object && Object.keys(options).length > 0) {
			const { 
				highWaterMark, emitClose, autoDestroy, 
				encoding, objectMode, maxListeners 
			} = options;
			const encodingOption = this._switchEncoding(encoding);

			this._options = {
				_highWaterMark: typeof highWaterMark === 'number' ? highWaterMark : 16384,
				_emitClose: typeof emitClose === 'boolean' ? emitClose : true,
				_autoDestroy: typeof autoDestroy === 'boolean' ? autoDestroy : true,
				_encoding: encodingOption,
				_objectMode: typeof objectMode === 'boolean' ? objectMode : false,
				_maxListeners: typeof maxListeners === 'number' ? maxListeners : 10
			}
		}

	}

	_setMaxListeners(number) {
		if(!number) {
			throw new Error("ERROR: MUST HAVE 1 ARGUMENT AND TYPE IS NUMBER (INTEGER)")
		}

		this.setMaxListeners(number);
	}

	_switchEncoding(encoding = 'buffer') {
		if(typeof encoding !== 'string') {
			throw new Error("ERROR: YOUR ENCODING IS INCORRECTLY CONFIGURATION!!!")
		}

		switch(encoding) {
			case 'string': return 'str'; break;
			case 'buffer': return 'buf'; break;
			case 'unit8': return 'unit8'; break;
			case 'unit16': return 'unit16'; break;
			case 'base64': return 'base64'; break;

			default: return 'buf'; break;
		}
	}

	_autoClose(cb = null) {
		const callback = () => {
			this._store['src'] = null;

			console.log(JSON.stringify({
				errno: 0,
				message: 'DATA HAS STOPPED FLOWING'
			}, null, 2));
		}

		if(this._options._emitClose) {
			this.on('close', (typeof cb === 'function' && cb) || callback);
			this.emit('close');
		}
	}

	async _autoDestroy(cb = null) {
		const callback = () => {
			console.log(JSON.stringify({
				errno: 0,
				message: 'STREAM HAS CLOSED'
			}, null, 2));
		}

		if(this._options._autoDestroy) {
			await this._autoClose();

			this.on('destroy', (typeof cb === 'function' && cb) || callback);
			this.emit('destroy');
		}
		
		return Promise.resolve(true);
	}

	_listen(eventName, listener, emitter) {
		const isValidEventName = this._eventName.includes(eventName);

		if(this._store['src'] && this._store.src === null) {
			this.on('end', () => {
				process.exit(1)
			})
		}

		if(this._store['src'] && this._store.src !== null && this._options._objectMode !== true) {
			var wrappedListener = function(listener, listeners) {
				let loop = (async function() {
					for await(let listenor of listeners) {
						listenor()
					}

					listener()
				});

				try {
					loop()
				} catch(e) {
					throw new Error("ERROR: SOMETHING WRONG WHEN LOOP!");
				}

				return listener()
			}
		}

		if(!this._store['listeners']) {
			this._store['listeners'] = [];
		}

		if(this._store['listeners']) {
			this._store['listeners'] = this._store['listeners'].concat([listener]);
		}

		if(isValidEventName === false) {
			throw new Error("ERROR: INVALID EVENT NAME!!")
		}

		const bind = wrappedListener.bind(null, listener, this._store['listeners']);

		this.on(eventName, bind);

		if(emitter) {
			emitter();
		}

		if(this._options._autoDestroy === false && this._options._emitClose) {
			throw new Error("ERROR: DESTROY EVENT IS TRIGGERED AFTER CLOSE EVENT")
		}

		this._autoClose();
		this._autoDestroy().then((value) => value).catch(e => console.log(`e: ${e}`));

		return true;
	}

	emit(eventName) {
		this.emit(eventName);
	}

	_addListener(eventName, listener, startStore, endStore) {
		const isValidEventName = this._eventName.includes(eventName);

		if(!this._store['listeners']) {
			this._store['listeners'] = [];
		}

		if(typeof startStore === 'number' && endStore < startStore || startStore < 0 || startStore > this._store['listeners'].length || endStore < 0 || endStore > this._store['listeners'].length) {
			throw new Error("ERROR: INVALID INDEX");
		}		

		if(isValidEventName === false) {
			throw new Error("ERROR: INVALID EVENT NAME!!");
		}

		if(this._store && this._store['listeners'] && this._store['listeners'] instanceof Array) {
			this._store['listeners'] = [
				...this._store['listeners'].slice(0, startStore), 
				listener, 
				...this._store['listeners'].slice(startStore, endStore)
			];
		}

		return true;
	}

	_removeListener(eventName, removeStart, removeEnd) {
		const isValidEventName = this._eventName.includes(eventName);

		if(!this._store['listeners']) {
			throw new Error("ERROR: YOU HAVEN\'T ADD LISTENER YET!!");
		}

		if(this._store['listeners'] && removeEnd < removeStart|| removeStart < 0 || removeStart > this._store['listeners'].length || removeEnd < 0 || removeStart > this._store['listeners'].length) {
			throw new Error("ERROR: INVALID INDEX");
		}

		if(isValidEventName === false) {
			throw new Error("ERROR: INVALID EVENT NAME!!")
		}

		if(this._store && this._store['listeners'] && this._store['listeners'] instanceof Array && this._store['listeners'].length >= 1) {
			this._store['listeners'].splice(removeStart, removeEnd);
		} 
	}

	_push(data = null) {
		if(this._options._objectMode === false) {
			if(typeof data === "string" || data instanceof Buffer) {
				break;
			} else {
				throw new Error("ERROR: DATA\'S TYPE IS NOT VALID");
			}
		} else {
			break;
		}

		if(typeof data === 'string') {
			const size = Buffer.from(data).length;
			if(size > this._options._highWaterMark) {
				throw new Error("ERROR: SIZE TOO LARGE");
			}
		}

		if(data instanceof Buffer) {
			if(data.length > this._options._highWaterMark) {
				throw new Error("ERROR: SIZE TOO LARGE");
			}
		}

		this._store[src] = data;
	}

	concurrency(...writer) {
		const writers = Array.from(writer);
		const helper = (writable) => writable.write(this._store['src'])

		writers.forEach(writable => {
			if(writable instanceof Writable) {}

			throw new Error("ERROR: ONE OF THEM ISN\'T CORRECT!!");
		});

		let initial = writers.length;

		if(this._store['src']) {
			while(initial !== 0) {
				var id = setInterval(() => {
					writers[initial](); break;
				}, 0)
			}

			clearInterval(id);
		}
	}
};

module.exports = Readable