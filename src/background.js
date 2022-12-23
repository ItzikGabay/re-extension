'use strict';

import user from '../lib/userStorage';
import { events } from '../lib/utils/events';
import { millisecondsToSecondsFromNow } from '../lib/time';
import { restartExtension } from '../lib/chrome';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const userStorage = user.store;
  const { type } = request;

  if (type === events.UPDATE_EXTENSION) {
    const { LAST_UPDATED } = userStorage;
    const setLastUpdated = () => user.set('LAST_UPDATED', Date.now());

    if (!LAST_UPDATED) {
      setLastUpdated();
      sendResponse({ success: false });
      return true;
    }

    const lastUpdatedInSeconds = millisecondsToSecondsFromNow(LAST_UPDATED);

    if (lastUpdatedInSeconds < 1.5) {
      sendResponse({ success: false });
      return true;
    }

    setLastUpdated();
    (async () => {
      const extensions = await user.getExtensions();
      const response = await Promise.allSettled(
        extensions
          .filter((ext) => !!ext.activated)
          .map(async (extension) => {
            await restartExtension(extension.id);
          })
      );

      console.log('Extension update response:', response);
    })();
    sendResponse({ success: true });
    return true;
  }

  if (type === events.GET_EXTENSIONS) {
    chrome.management.getAll(async function (extensions) {
      const userExtensions = [];
      const currentExt = extensions.find(
        (ext) => ext.id === 'ohaodbigmoodgmhgfanfkebagaemmjgh'
      );

      await restartExtension(
        'ohaodbigmoodgmhgfanfkebagaemmjgh',
        currentExt.type
      );

      for (const ext of extensions) {
        userExtensions.push(ext);
      }

      sendResponse({
        userExtensions,
        currentExt,
        test: true,
      });
    });

    return true;
  }
});

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   console.log('Tab is loading:', { tab, tabId, changeInfo });
//
//   if (changeInfo.status === 'loading') {
//     chrome.management.getAll(async function (extensions) {
//       const currentExt = extensions.find(
//         (ext) => ext.id === 'ohaodbigmoodgmhgfanfkebagaemmjgh'
//       );
//       //await restartExtension(currentExt.id, currentExt.type);
//
//       // chrome.tabs.query(
//       //   {
//       //     active: true,
//       //     lastFocusedWindow: true,
//       //   },
//       //   function (tabs) {
//       //     var tab = tabs[0];
//       //     console.log(tab.url);
//       //     alert(tab.url);
//       //   }
//       // );
//
//       // chrome.tabs.sendMessage({ type: 'REFRESH_PAGE' });
//       // return true;
//     });
//   }
// });
