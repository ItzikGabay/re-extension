'use strict';

chrome.runtime.sendMessage({ type: 'GET_EXTENSIONS' }, (response) => {
  console.log('res', response);
});

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'REFRESH_PAGE') {
    console.log('REFRESH_PAGE');
  }

  sendResponse({});
  return true;
});
