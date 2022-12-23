export const createExtensionItemElement = (extension) => {
  const li = document.createElement('li');
  const wrapper = document.createElement('div');
  const title = document.createElement('h1');
  title.classList.add('extension-title');
  title.textContent = extension.title;
  const description = document.createElement('p');
  description.classList.add('extension-description');
  description.textContent = 'Activated';

  li.appendChild(wrapper);
  wrapper.appendChild(title);
  wrapper.appendChild(description);

  return li;
};
