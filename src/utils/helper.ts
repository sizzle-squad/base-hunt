if (Object.hasOwn(BigInt.prototype, 'toJSON') === false) {
  Object.defineProperty(BigInt.prototype, 'toJSON', {
    get() {
      'use strict';
      return () => String(this);
    },
  });
}
