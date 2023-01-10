import { restartExtension } from './chrome';

class UserStorage {
  constructor() {
    this._initialize();
  }

  get store() {
    return this.storage;
  }

  // Creating `this.storage` object if not exist in user storage
  _initialize() {
    chrome.storage.sync.get(null, (result) => {
      this.storage = result || {};
    });
  }

  async addExtension(extension) {
    const extensions = await this.getAsync('extensions');
    const updatedExtensions = [
      ...extensions,
      { id: extension, activated: true },
    ];

    this.set('extensions', updatedExtensions);
    this.storage.extensions = updatedExtensions;

    return updatedExtensions;
  }

  async removeExtension(extensionId) {
    const extensions = await this.getAsync('extensions');
    const updatedExtensions = extensions.filter(
      (extension) => extension.id !== extensionId
    );

    this.set('extensions', updatedExtensions);
    this.storage.extensions = updatedExtensions;

    return updatedExtensions;
  }

  async deactivateExtension(extensionId) {
    const extensions = await this.getAsync('extensions');
    const updatedExtensions = extensions.map((extension) => {
      if (extension.id === extensionId) {
        return { ...extension, activated: false };
      }
      return extension;
    });

    this.set('extensions', updatedExtensions);
    this.storage.extensions = updatedExtensions;

    return updatedExtensions;
  }

  async activateExtension(extensionId) {
    const extensions = await this.getAsync('extensions');
    const updatedExtensions = extensions.map((extension) => {
      if (extension.id === extensionId) {
        return { ...extension, activated: true };
      }
      return extension;
    });

    this.set('extensions', updatedExtensions);
    this.storage.extensions = updatedExtensions;

    return updatedExtensions;
  }

  async restartExtensions() {
    const extensions = await this.getExtensions();
    const response = await Promise.allSettled(
      extensions
        .filter((ext) => !!ext.activated)
        .map(async (extension) => await restartExtension(extension.id))
    );

    return response.some((res) => res.status === 'fulfilled');
  }

  async getExtensions() {
    return await this.getAsync('extensions');
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
