class UserStorage {
  constructor() {
    this._initialize();
  }

  get store() {
    return this.storage;
  }

  _initialize() {
    chrome.storage.sync.get(null, (result) => {
      this.storage = result;
    });
  }

  get(key) {
    this._initialize();
    return this.storage[key];
  }

  set(key, value, cb) {
    chrome.storage.sync.set(this.storage, () => {
      this.storage[key] = value;
      cb?.();
    });
  }
}

export default new UserStorage();
