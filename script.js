'use strict';
// Save re-usable elements to variables
let modalCloseBtns;
let taskCardsProjects;
let taskCardsDay;
const overlay = document.querySelector('.overlay');
const adminModal = document.querySelector('.admin-modal');
const newProjectModal = document.querySelector('.new-project-modal');
const editProjectModal = document.querySelector('.edit-project-modal');
const newDayModal = document.querySelector('.new-day-modal');
const editDayModal = document.querySelector('.edit-day-modal');

// State variables
let labelIdCounter =
  document.querySelector('.label-container').childElementCount ?? 0;
let currentModal;

///////////////// Add event handlers /////////////////
// - admin modal
document.querySelector('.header-user-pic').addEventListener('click', showAdmin);
// - 4 ways of closing the modals - need to be tweaked when other modals are added - see how to re-use general modal closing function for all modals
overlay.addEventListener('click', closeModal);

modalCloseBtns = document.querySelectorAll('.modal__close');
for (let i = 0; i < modalCloseBtns.length; i++) {
  modalCloseBtns[i].addEventListener('click', closeModal);
}

document
  .querySelector('#admin-cancel-btn')
  .addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  e.preventDefault;
  if (e.key === 'Escape') {
    closeModal();
  }
});

// - new project
document
  .querySelector('.new-project')
  .addEventListener('click', showNewProject);
// - new day
document.querySelector('.new-day').addEventListener('click', showNewDay);

// - edit project
taskCardsProjects = document.querySelectorAll('.task-card-project');
for (let i = 0; i < taskCardsProjects.length; i++) {
  taskCardsProjects[i].addEventListener('click', showEditProject);
}

// - edit day
taskCardsDay = document.querySelectorAll('.task-card-day');
for (let i = 0; i < taskCardsDay.length; i++) {
  taskCardsDay[i].addEventListener('click', showEditDay);
}

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
  currentModal = adminModal;
}

function showNewProject() {
  newProjectModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  currentModal = newProjectModal;
}

function showNewDay() {
  newDayModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  currentModal = newDayModal;
}

function showEditProject() {
  editProjectModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  currentModal = editProjectModal;
}

function showEditDay() {
  editDayModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  currentModal = editDayModal;
}

// This function needs to become universaliyed down the line (work the same for whichever modal is open)
function closeModal() {
  currentModal.classList.add('hidden');
  overlay.classList.add('hidden');
  document.getElementById('admin').reset();
  currentModal = undefined;
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
