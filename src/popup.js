'use strict';

import './popup.css';

(function () {
  function updateCounter({ type }) {
    // Communicate with content script of
    // active tab by sending a message
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      chrome.tabs.sendMessage(
        tab.id,
        {
          type: 'COUNT',
          payload: {
            count: newCount,
          },
        },
        (response) => {
          console.log('Current count value passed to contentScript file');
        }
      );
    });
  }
  // document.addEventListener('DOMContentLoaded', restoreCounter);
})();
