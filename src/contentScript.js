'use strict';

const initializeUpdate = async () => {
  console.log('[auto-refresher] initialize');

  // try {
  //   chrome.runtime.sendMessage({ type: 'UPDATE_EXTENSION' }, (response) => {
  //     if (response.success) {
  //       console.log('Extension updated successfully');
  //       window.location.reload();
  //     }
  //
  //     return true;
  //   });
  // } catch (e) {
  //   console.log(e);
  // }
};

initializeUpdate();
