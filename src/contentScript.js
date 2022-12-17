'use strict';

import user from '../lib/userStorage';
const userStorage = user.storage;

const initializeUpdate = async () => {
  try {
    chrome.runtime.sendMessage({ type: 'UPDATE_EXTENSION' }, (response) => {
      console.log('Response from UPDATE_EXTENSION:', response);
      return true;
    });
  } catch (e) {
    console.log(e);
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { type } = request;

  // Refresh page event
  if (type === 'REFRESH_PAGE') {
    console.log('REFRESH_PAGE');
    sendResponse({});
    return true;
  }
});

initializeUpdate();
