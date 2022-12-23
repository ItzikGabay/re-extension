'use strict';

import './popup.css';
import user from '../lib/userStorage';
import { ERRORS } from '../lib/utils/errors';
import { CONSTANTS } from '../lib/utils/constants';
import { createExtensionItemElement } from '../lib/DOM';

const updateExtensionList = async () => {
  const extensions = await user
    .getAsync(CONSTANTS.EXTENSIONS_STORAGE_KEY)
    .catch(() => console.log(ERRORS.NO_EXTENSION_FOUND));

  const ul = document.createElement('ul');
  extensions?.forEach((extension) => {
    ul.appendChild(createExtensionItemElement(extension));
  });

  const listElement = document.querySelector('.list');
  listElement.textContent = '';
  listElement.appendChild(ul);
};

(function () {
  document.addEventListener('DOMContentLoaded', async function () {
    const addExtensionBtn = document.getElementById(
      CONSTANTS.ADD_EXTENSION_BUTTON_ID
    );

    addExtensionBtn.addEventListener('click', async function (e) {
      try {
        const input = document.getElementById(CONSTANTS.ADD_EXTENSION_INPUT_ID);
        await user.addExtension(input.value);
        input.value = '';
        await updateExtensionList();
      } catch (e) {
        console.log(e);
      }
    });

    const pageRefreshBtn = document.getElementById('page_refresh');
    const intervalBtn = document.getElementById('interval');
    const mode = await user.getAsync('mode');
    console.log('mode', mode);

    mode === 'REFRESH_ON_INTERVAL'
      ? (intervalBtn.checked = true)
      : (pageRefreshBtn.checked = true);

    pageRefreshBtn.addEventListener('change', function (e) {
      user.set('mode', 'UPDATE_EXTENSION');
    });

    intervalBtn.addEventListener('change', function () {
      user.set('mode', 'REFRESH_ON_INTERVAL');
    });

    await updateExtensionList();
  });
})();
