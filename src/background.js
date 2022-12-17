'use strict';

import user from '../lib/userStorage';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const userStorage = user.store;
  const { type } = request;

  if (type === 'GET_EXTENSIONS') {
    chrome.management.getAll(async function (extensions) {
      const userExtensions = [];
      for (const ext of extensions) {
        userExtensions.push(ext);
      }

      sendResponse({
        userExtensions,
      });
    });

    return true;
  }
});
