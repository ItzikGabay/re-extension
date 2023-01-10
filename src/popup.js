'use strict';

import './popup.css';
import user from '../lib/userStorage';
import { ERRORS } from '../lib/utils/errors';
import { CONSTANTS } from '../lib/utils/constants';
import { createExtensionItemElement } from '../lib/DOM';
import { events } from '../lib/utils/events';

const createExtensionsListContainer = async (list) => {
  const ul = document.createElement('ul');

  list?.forEach((extension) => {
    ul.appendChild(createExtensionItemElement(extension));
  });

  // Remove all children from the list
  const listElement = document.querySelector('.list');
  listElement.textContent = '';

  // Add the new list
  listElement.appendChild(ul);
};

(function () {
  document.addEventListener('DOMContentLoaded', async () => {
    const extensions = await user
      .getAsync(CONSTANTS.EXTENSIONS_STORAGE_KEY)
      .catch(() => console.log(ERRORS.NO_EXTENSION_FOUND));

    const addExtensionBtn = document.getElementById(
      CONSTANTS.ADD_EXTENSION_BUTTON_ID
    );

    addExtensionBtn.addEventListener('click', async () => {
      try {
        const input = document.getElementById(CONSTANTS.ADD_EXTENSION_INPUT_ID);
        await user.addExtension(input.value);
        input.value = '';

        await createExtensionsListContainer(extensions);
      } catch (e) {
        console.log(e);
      }
    });

    const pageRefreshBtn = document.getElementById('page_refresh');
    const intervalBtn = document.getElementById('interval');
    const mode = await user.getAsync('mode');

    mode === events.REFRESH_ON_INTERVAL
      ? (intervalBtn.checked = true)
      : (pageRefreshBtn.checked = true);

    pageRefreshBtn.addEventListener('change', () => {
      user.set('mode', events.UPDATE_EXTENSION);
    });

    intervalBtn.addEventListener('change', () => {
      user.set('mode', events.REFRESH_ON_INTERVAL);
    });

    await createExtensionsListContainer(extensions);
  });
})();
