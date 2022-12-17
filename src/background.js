'use strict';

import user from '../lib/userStorage';
import { events } from '../lib/utils/events';

async function restartExtension(extensionId, extensionType) {
  await chrome.management.setEnabled(extensionId, false);
  await chrome.management.setEnabled(extensionId, true);

  if (extensionType === 'packaged_app') {
    await chrome.management.launchApp(extensionId);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const userStorage = user.store;
  const { type } = request;

  if (type === events.UPDATE_EXTENSION) {
    const { LAST_UPDATED } = userStorage;

    if (!LAST_UPDATED) {
      return user.set('LAST_UPDATED', Date.now());
    }

    const lastUpdated = new Date(LAST_UPDATED);
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 0) {
      return;
    }

    user.set('LAST_UPDATED', Date.now());
    restartExtension('ohaodbigmoodgmhgfanfkebagaemmjgh', 'none');
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
