import userStorage from './userStorage';

export const createExtensionItemElement = (extension) => {
  const li = document.createElement('li');
  li.classList.add('extension-item');

  const wrapperLeft = document.createElement('div');
  const wrapperRight = document.createElement('div');

  const title = document.createElement('h1');
  title.classList.add('extension-title');
  title.textContent = extension.id;

  const description = document.createElement('p');
  description.classList.add('extension-description');
  description.textContent = extension.activated ? 'Activated' : 'Deactivated';

  const removeButton = document.createElement('button');
  removeButton.classList.add('extension-remove');
  removeButton.textContent = 'Remove';
  wrapperRight.appendChild(removeButton);
  removeButton.addEventListener('click', async (e) => {
    e.stopPropagation();
    await userStorage.removeExtension(extension.id);
    li.remove();
  });

  if (extension.activated) {
    li.classList.add('--active');
  }

  li.addEventListener('click', async () => {
    if (extension.activated) {
      await userStorage.deactivateExtension(extension.id);
      description.textContent = 'Deactivated';
      extension.activated = false;
      li.classList.remove('--active');
    } else {
      await userStorage.activateExtension(extension.id);
      description.textContent = 'Activated';
      extension.activated = true;
      li.classList.add('--active');
    }
  });

  wrapperLeft.appendChild(title);
  wrapperLeft.appendChild(description);
  li.appendChild(wrapperLeft);
  li.appendChild(wrapperRight);

  return li;
};
