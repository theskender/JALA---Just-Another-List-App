'use strict';
// State variables
let labelIdCounter =
  document.querySelector('.label-container').childElementCount ?? 0;

// Save re-usable elements to variables
const overlay = document.querySelector('.overlay');
const adminModal = document.querySelector('.admin-modal');

// Add event handlers
// - admin modal
document.querySelector('.header-user-pic').addEventListener('click', showAdmin);
// - 4 ways of closing the modals - need to be tweaked when other modals are added - see how to re-use general modal closing function for all modals
overlay.addEventListener('click', closeModal);
document.querySelector('.modal__close').addEventListener('click', closeModal);
document
  .querySelector('#admin-cancel-btn')
  .addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  e.preventDefault;
  if (e.key === 'Escape') {
    closeModal();
  }
});
// - create priority label
document.querySelector('#add-lbl-btn').addEventListener('click', createLabel);
// - delete priority label
document
  .querySelector('.label-container')
  .addEventListener('click', deleteLabel);
// - reset button
document.getElementById('reset-all-btn').addEventListener('click', resetApp);

// Event functions
function showAdmin() {
  adminModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function closeModal() {
  adminModal.classList.add('hidden');
  overlay.classList.add('hidden');
  document.getElementById('admin').reset();
}

function createLabel() {
  let color = document.querySelector('.color-picker').value;
  let text = document.querySelector('#labelname').value;
  if (text) {
    const element = document.createElement('DIV');
    element.classList.add('priority-label');
    element.style.backgroundColor = color;
    labelIdCounter++;
    element.id = `lbl${labelIdCounter}`;
    let textNode = document.createTextNode(text);
    element.appendChild(textNode);
    document.querySelector('.label-container').appendChild(element);
    document.querySelector('#labelname').value = '';
  }
}

function deleteLabel(e) {
  e.target.remove();
}

function resetApp() {
  let decision = confirm('Jeste li sigurni?');
  if (decision == true) {
    localStorage.clear();
    alert('Baza očišćena!');
  }
}
