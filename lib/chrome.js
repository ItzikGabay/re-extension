export function sendToCurrentTab({ type }) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    chrome.tabs.sendMessage(
      tab.id,
      {
        type: 'REFRESH_PAGE',
      },
      (response) => {
        console.log('Response from content script: ', response);
      }
    );
  });
}

export async function restartExtension(extensionId, extensionType) {
  await chrome.management.setEnabled(extensionId, false);
  await chrome.management.setEnabled(extensionId, true);

  if (extensionType === 'packaged_app') {
    await chrome.management.launchApp(extensionId);
  }
}
