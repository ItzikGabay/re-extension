'use strict';

import UserStorage from '../lib/userStorage';

const initializeUpdate = async () => {
  console.log('[auto-refresher] init');
  const userMode = await UserStorage.getAsync('mode');

  try {
    chrome.runtime.sendMessage({ type: userMode }, (response) => {
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
