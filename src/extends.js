Array.prototype.sum = function() {
    let s = 0;
    this.forEach(item => {
        s += item;
    })
    return s;
}


Array.prototype.mean = function() {
    if(this.length>0) {
        return this.sum()/ this.length;
    } else {
        return 0;
    }
}

Array.prototype.min = function() {
    if(this.length>0) {
        let m = this[0];
        this.forEach(item => {
            if(item<m) m = item;
        })
        return m;
    } else {
        throw new Error("invalid min, array is empty.")
    }
}

Array.prototype.max = function() {
    if(this.length>0) {
        let m = this[0];
        this.forEach(item => {
            if(item>m) m = item;
        })
        return m;
    } else {
        throw new Error("invalid max, array is empty.")
    }
}
