'use strict';

const initializeUpdate = async () => {
  console.log('[auto-refresher] initialize');

  try {
    // UPDATE_EXTENSION
    chrome.runtime.sendMessage({ type: 'REFRESH_ON_INTERVAL' }, (response) => {
      if (response.success) {
        console.log('Extension updated successfully');
        window.location.reload();
      }

      return true;
    });
  } catch (e) {
    console.log(e);
  }

  // window.setInterval(checkBrowserFocus, 1000);

  // function checkBrowserFocus() {
  //   chrome.windows.getCurrent(function (browser) {
  //     console.log(browser.focused);
  //   });
  // }
};

initializeUpdate();
