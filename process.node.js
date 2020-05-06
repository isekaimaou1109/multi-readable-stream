const worker = require('worker_threads');
const EventEmitter = require('events')

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

	listen(eventName, listener, cb) {
		const isValidEventName = this._eventName.includes(eventName);

		if(!this._store['listeners']) {
			this._store['listeners'] = [];
		}

		if(this._store['listeners']) {
			this._store['listeners'] = this._store['listeners'].concat([listener]);
		}

		if(isValidEventName === false) {
			throw new Error("ERROR: INVALID EVENT NAME!!")
		}

		this.on(eventName, )

		return true;
	}

	_addListener(eventName, listener, startStore, endStore) {
		const isValidEventName = this._eventName.includes(eventName);

		if(!this._store['listeners']) {
			this._store['listeners'] = [];
		}

		if(typeof startStore === 'number' && startStore < 0 && startStore > this._store['listeners'].length) {

		}		

		if(isValidEventName === false) {
			throw new Error("ERROR: INVALID EVENT NAME!!")
		}

		if(this._store && this._store['listeners'] && this._store['listeners'] instanceof Array) {
			this._store['listeners'] = [
				...this._store['listeners'].slice(0, startStore), 
				listener, 
				...this._store['listeners'].slice(startStore, endStore)
			];
		} 
	}

	_removeListener(eventName, removeStart, removeEnd) {
		const isValidEventName = this._eventName.includes(eventName);

		if(!this._store['listeners']) {
			throw new Error("ERROR: YOU HAVEN\'T ADD LISTENER YET!!");
		}

		if(this._store['listeners'] && removeStart < 0 || removeStart > this._store['listeners'].length || removeEnd < 0 || removeStart > this._store['listeners'].length) {
			throw new Error("ERROR: INVALID INDEX");
		}

		if(isValidEventName === false) {
			throw new Error("ERROR: INVALID EVENT NAME!!")
		}

		if(this._store && this._store['listeners'] && this._store['listeners'] instanceof Array && this._store['listeners'].length >= 1) {
			
		} 
	}

	_read(size, encoding) {

	}

	_push(data) {

	}
};
