/*\
|*|
|*|  :: MiniDaemon ::
|*|
|*|  Revision #3 - January 9, 2016
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/API/window.setInterval
|*|  https://developer.mozilla.org/User:fusionchess
|*|  https://github.com/awk34
|*|
|*|  This framework is released under the GNU Lesser General Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/lgpl-3.0.html
|*|
\*/

class MiniDaemon {
    owner = null;
    task = null;
    rate = 100;
    length = Infinity;
    /* These properties should be read-only */
    SESSION = -1;
    INDEX = 0;
    PAUSED = true;
    BACKW = true;

    constructor(oOwner, fTask, nRate, nLen) {
        if(!(this && this instanceof MiniDaemon)) return;
        if(arguments.length < 2) throw new TypeError('MiniDaemon - not enough arguments');
        if(oOwner) this.owner = oOwner;
        this.task = fTask;
        if(isFinite(nRate) && nRate > 0) {
            this.rate = Math.floor(nRate);
        }
        if(nLen > 0) {
            this.length = Math.floor(nLen);
        }
    }

    isAtEnd() {
        return this.BACKW ? isFinite(this.length) && this.INDEX < 1 : this.INDEX + 1 > this.length;
    }

    synchronize() {
        if(this.PAUSED) return;
        clearInterval(this.SESSION);
        this.SESSION = setInterval(MiniDaemon.forceCall, this.rate, this);
    }

    pause() {
        clearInterval(this.SESSION);
        this.PAUSED = true;
    }

    start(bReverse) {
        var bBackw = Boolean(bReverse);
        if(this.BACKW === bBackw && (this.isAtEnd() || !this.PAUSED)) return;
        this.BACKW = bBackw;
        this.PAUSED = false;
        this.synchronize();
    }
}

MiniDaemon.forceCall = function(oDmn) {
    oDmn.INDEX += oDmn.BACKW ? -1 : 1;
    if(oDmn.task.call(oDmn.owner, oDmn.INDEX, oDmn.length, oDmn.BACKW) === false || oDmn.isAtEnd()) {
        oDmn.pause(); return false;
    }
    return true;
};

export default MiniDaemon;
