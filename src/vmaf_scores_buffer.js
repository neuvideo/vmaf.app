const BYTES_PER_SAMPLE = Float32Array.BYTES_PER_ELEMENT;

class VmafScoresBuffer {
    /**
     * @constructor
     * @param  {object} wasmModule WASM module generated by Emscripten.
     * @param  {number} length Buffer frame length.
     */
    constructor(wasmModule, length) {
        this._isInitialized = false;
        this._module = wasmModule;
        this._length = length;
        this._allocateHeap();
        this._isInitialized = true;
    }

    /**
     * Allocates memory in the WASM heap and set up views for the
     * data.
     *
     * @private
     */
    _allocateHeap() {
        const dataByteSize = this._length * BYTES_PER_SAMPLE;
        this._dataPtr = this._module._malloc(dataByteSize);
        let startOffset = this._dataPtr / BYTES_PER_SAMPLE;
        let endOffset = startOffset + this._length;
        this._scoredata =
            this._module.HEAPF32.subarray(startOffset, endOffset);
    }

    /**
     * Getter for the buffer length in number of samples.
     *
     * @return {?number} Buffer length (aka number of samples).
     */
    get length() {
        return this._isInitialized ? this._length : null;
    }

    /**
     * Returns the reference to the array of score data.
     *
     * @return {?Array} a channel data array or an
     * array of channel data.
     */
    getScoreData() {
        return this._scoredata;
    }

    /**
     * Returns the base address of the allocated memory space in the WASM heap.
     *
     * @return {number} WASM Heap address.
     */
    getHeapAddress() {
        return this._dataPtr;
    }

    /**
     * Frees the allocated memory space in the WASM heap.
     */
    free() {
        this._isInitialized = false;
        this._module._free(this._dataPtr);
        this._scoredata = null;
    }
}

export default VmafScoresBuffer;

