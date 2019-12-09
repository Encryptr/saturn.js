class Attribute {
  constructor(array, itemSize, normalized = false, dynamic = false) {
    
    this._array = null;
    this._normalized = null;;
    this._dynamic = null;;
    this._itemSize = itemSize;
    
    this.array = array;
    this.normalized = normalized;
    this.dynamic = dynamic;
    
  }
  get array() {
    
    return this._array;
  
  }
  set array(array) {
    
    if (ArrayBuffer.isView(array)) {
      
      if (array.length % this._itemSize === 0) {
        
        this._array = array;
      
      } else {
      
        console.warn('Attribute.js: (.set array) invalid array length');
      
      }
      
    } else {
    
      console.warn('Attribute.js: (.set array) expected a TypedArray');
    
    }
    
  }
  get normalized() {
    
    return this._normalized;
  
  }
  set normalized(value) {
    
    this._normalized = Boolean(value);
  
  }
  get dynamic() {
    
    return this._dynamic;
  
  }
  set dynamic(value) {
    
    this._dynamic = Boolean(value);
  
  }
  get itemSize() {
    
    return this._itemSize;
  
  }
}

export { Attribute };