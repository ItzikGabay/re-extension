import userStorage from './userStorage';

export const createExtensionItemElement = (extension) => {
  const li = document.createElement('li');
  const wrapper = document.createElement('div');
  const title = document.createElement('h1');
  title.classList.add('extension-title');
  title.textContent = extension.id;
  const description = document.createElement('p');
  description.classList.add('extension-description');
  description.textContent = extension.activated ? 'Activated' : 'Deactivated';

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

  li.appendChild(wrapper);
  wrapper.appendChild(title);
  wrapper.appendChild(description);

  return li;
};
