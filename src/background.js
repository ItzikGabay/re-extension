'use strict';

import user from '../lib/userStorage';
import { events } from '../lib/utils/events';
import { millisecondsToSecondsFromNow } from '../lib/time';
import { restartExtension } from '../lib/chrome';

const validateLastUpdated = (lastUpdated) => {
  const setLastUpdated = () => user.set('LAST_UPDATED', Date.now());

  if (!lastUpdated) {
    setLastUpdated();
    return false;
  }

  const lastUpdatedInSeconds = millisecondsToSecondsFromNow(lastUpdated);

  if (lastUpdatedInSeconds < 1.5) {
    return false;
  }

  setLastUpdated();
  return true;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const userStorage = user.store;
  const { LAST_UPDATED } = userStorage;
  const { type } = request;

  if (type === events.UPDATE_EXTENSION) {
    const isValid = validateLastUpdated(LAST_UPDATED);

    if (!isValid) {
      sendResponse({ success: false });
      return true;
    }

    (async () => {
      const result = await user.restartExtensions();
      sendResponse({ success: result });
    })();
    return true;
  }

  if (type === 'REFRESH_ON_INTERVAL') {
    const isValid = validateLastUpdated(LAST_UPDATED);

    if (!isValid) {
      sendResponse({ success: false });
      return true;
    }

    let toUpdate = false;

    setInterval(function () {
      chrome.windows.getLastFocused(async function (window) {
        const isAllTabsUnfocused = !window?.focused;

        if (isAllTabsUnfocused) {
          toUpdate = true;
        }

        if (toUpdate && !isAllTabsUnfocused) {
          const result = await user.restartExtensions();
          console.log('All tabs unfocused, restarting extensions');
          sendResponse({ success: result });
          toUpdate = false;
        }
      });
    }, 3000);

    sendResponse({ success: false });
    return true;
  }
});
