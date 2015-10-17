/**
 * @author Andrew Koroluk
 * Original code by Ben Nadel
 * https://gist.githubusercontent.com/bennadel/b35f3a15cb3b03ddbcf8/raw/ab53edb9e35e6da00af2c5a4f2e487a763f60571/test.js
 */

import stream from 'stream';
import nodeUtil from 'util';

/**
 * @class BufferStream
 */
class BufferStream extends stream.Readable {
    /**
     * @constructor
     * @param source {ArrayBuffer}
     */
    constructor(source) {
        if(!Buffer.isBuffer(source)) {
            throw(new Error('Source must be a buffer.'));
        }

        super();

        this._source = source;

        // I keep track of which portion of the source buffer is currently being pushed
        // onto the internal stream buffer during read actions.
        this._offset = 0;
        this._length = source.length;

        // When the stream has ended, try to clean up the memory references.
        this.on("end", this._destroy);
    }

    _destroy() {
        this._source = null;
        this._offset = null;
        this._length = null;
    }

    _read(size) {
        // If we haven't reached the end of the source buffer, push the next chunk onto
        // the internal stream buffer.
        if(this._offset < this._length) {
            this.push(this._source.slice(this._offset, this._offset + size));
            this._offset += size;
        }

        // If we've consumed the entire source buffer, close the readable stream.
        if(this._offset >= this._length) {
            this.push(null);
        }
    }
}

export default BufferStream;
