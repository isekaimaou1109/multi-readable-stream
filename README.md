## Usage:

```javascript
    const { Readable } = require('multi-readable-stream');
    const instance = new Readable({
        /* Options:
         * highWaterMark: the size of data (threshold - default: 16384)
         * emitClose: auto close (default: true)
         * autoDestroy: auto destroy (default: true)
         * encoding: 'buffer'
         */
    });

    /* list of event names: ['data', 'end', 'error', 'readable', 'close', 'pause', 'resume'];
     */

    instance._listen('data', (src) => {
        console.log(src.toString())
    });

    instance._push(Buffer.alloc(4));
```

__Just Custom Readable__