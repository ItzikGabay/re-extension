'use strict';

import './popup.css';
import user from '../lib/userStorage';
import { ERRORS } from '../lib/utils/errors';
import { CONSTANTS } from '../lib/utils/constants';

(function () {
  document.addEventListener('DOMContentLoaded', async function () {
    const addExtensionBtn = document.getElementById(
      CONSTANTS.ADD_EXTENSION_BUTTON_ID
    );

    addExtensionBtn.addEventListener('click', function (e) {
      const inputValue = document.getElementById(
        CONSTANTS.ADD_EXTENSION_INPUT_ID
      ).value;
      user.addExtension(inputValue);
    });

    const extensions = await user
      .getAsync(CONSTANTS.EXTENSIONS_STORAGE_KEY)
      .catch(() => console.log(ERRORS.NO_EXTENSION_FOUND));

    document.querySelector('.list').innerHTML =
      '<ul>' +
      extensions
        .map((extension) => {
          return `<li>${extension}</li>`;
        })
        .join('\n') +
      '</ul>';
  });
})();
