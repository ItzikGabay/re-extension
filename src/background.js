'use strict';

import user from '../lib/userStorage';
import { events } from '../lib/utils/events';
import { validateUpdateStatus } from '../lib/time';

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
    const isValid = validateUpdateStatus(LAST_UPDATED, () =>
      user.set('LAST_UPDATED', Date.now())
    );

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

  if (type === events.REFRESH_ON_INTERVAL) {
    // Validating last update status
    const isValid = validateUpdateStatus(LAST_UPDATED, () =>
      user.set('LAST_UPDATED', Date.now())
    );

    if (!isValid) {
      sendResponse({ success: false });
      return true;
    }

    let hasToUpdate = false;

    setInterval(function () {
      chrome.windows.getLastFocused(async function (window) {
        const isTabsUnfocused = !window?.focused;

        if (isTabsUnfocused) {
          hasToUpdate = true;
        }

        if (hasToUpdate && !isTabsUnfocused) {
          hasToUpdate = false;

          const hasRestarted = await user.restartExtensions();
          sendResponse({ success: hasRestarted });
        }
      });
    }, 3000);

    sendResponse({ success: false });
    return true;
  }
});
