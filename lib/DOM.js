import userStorage from './userStorage';

const _createTitle = (text, className = 'extension-title') => {
  const titleElement = document.createElement('h1');
  titleElement.textContent = text;
  text.classList.add(className);

  return titleElement;
};

const _createSubtitle = (text, className = 'extension-description') => {
  const subtitleElement = document.createElement('p');
  subtitleElement.classList.add(className);
  subtitleElement.textContent = text;

  return subtitleElement;
};

const _createItem = (className = 'extension-item') => {
  const li = document.createElement('li');
  li.classList.add(className);

  return li;
};

const _createDiv = (className) => {
  const div = document.createElement('div');

  if (className) {
    div.classList.add(className);
  }

  return div;
};

export const createExtensionItemElement = (extension) => {
  // Container
  const li = _createItem();
  const wrapperLeft = _createDiv();
  const wrapperRight = _createDiv();

  const title = _createTitle(extension.id);
  const description = _createSubtitle(
    extension.activated ? 'Activated' : 'Deactivated'
  );

  const removeButton = document.createElement('button');
  removeButton.classList.add('extension-remove');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', async (e) => {
    e.stopPropagation();
    await userStorage.removeExtension(extension.id);
    li.remove();
  });

  // Add class of activated only if the extension is activated
  // with the reloader
  if (extension.activated) {
    li.classList.add('--active');
  }

  li.addEventListener('click', async () => {
    const { activated } = extension;

    if (activated) {
      await userStorage.deactivateExtension(extension.id);
      description.textContent = 'Deactivated';
      extension.activated = false;
      li.classList.remove('--active');
    }

    if (!activated) {
      await userStorage.activateExtension(extension.id);
      description.textContent = 'Activated';
      extension.activated = true;
      li.classList.add('--active');
    }
  });

  wrapperRight.appendChild(removeButton);
  wrapperLeft.appendChild(title);
  wrapperLeft.appendChild(description);

  li.appendChild(wrapperLeft);
  li.appendChild(wrapperRight);

  return li;
};
