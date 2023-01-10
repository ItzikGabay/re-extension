'use strict';

import UserStorage from '../lib/userStorage';

const initializeUpdate = async () => {
  console.log('[auto-refresher] init');
  const mode = await UserStorage.getAsync('mode');

  try {
    chrome.runtime.sendMessage({ type: mode }, (response) => {
      if (response.success) {
        window.location.reload();
      }
      return true;
    });
  } catch (e) {
    console.log(e);
  }
};

initializeUpdate();
