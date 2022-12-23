class UserStorage {
  constructor() {
    this._initialize();
  }

  get store() {
    return this.storage;
  }

  _initialize() {
    chrome.storage.sync.get(null, (result) => {
      this.storage = result || {};
    });
  }

  async addExtension(extension) {
    const extensions = await this.getAsync('extensions');
    const extensionsWithNewExtension = [...extensions, extension];
    this.set('extensions', extensionsWithNewExtension);

    return extensionsWithNewExtension;
  }

  getExtensions() {
    return this.get('extensions') || [];
  }

  get(key, cb) {
    return chrome.storage.sync.get(key, (value) => {
      this.storage[key] = value;
      cb?.();
      return value;
    });
  }

  set(key, value, cb) {
    chrome.storage.sync.set({ [key]: value }, () => {
      this.storage[key] = value;
      cb?.();
    });
  }

  getAsync(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([key], function (result) {
        if (result[key] === undefined) {
          chrome.storage.sync.set({ [key]: [] });
          reject();
        } else {
          resolve(result[key]);
        }
      });
    });
  }
}

export default new UserStorage();
