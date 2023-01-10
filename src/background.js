'use strict';

import user from '../lib/userStorage';
import { events } from '../lib/utils/events';
import { millisecondsToSecondsFromNow } from '../lib/time';
import { restartExtension } from '../lib/chrome';

const validateLastUpdated = (lastUpdated) => {
  const setLastUpdated = () => user.set('LAST_UPDATED', Date.now());

/*
 * This file is responsible for listening to the events that are emitted by the
 * content script and then updating the user storage with the new data.
 *
 * Background file rules:
 * 1. Only one instance of the background file is created.
 * 2. You must send a response (can be empty object {}) to the sender.
 * 3. You must return true after you send a response.
 */
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
