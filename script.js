'use strict';

// Save re-usable elements to variables
let modalCloseBtns;
let taskCardsProjects;
let taskCardsDays;
const addTaskBtn = document.querySelector('#add-task-btn');
const overlay = document.querySelector('.overlay');
const loadingSpinner = document.querySelector('.loading-spinner');
const adminModal = document.querySelector('.admin-modal');
const newProjectModal = document.querySelector('.new-project-modal');
const editProjectModal = document.querySelector('.edit-project-modal');
const newDayModal = document.querySelector('.new-day-modal');
const editDayModal = document.querySelector('.edit-day-modal');
const projectCancelBtn = document.querySelector('#project-cancel-btn');
const adminCancelBtn = document.querySelector('#admin-cancel-btn');
const adminSaveBtn = document.querySelector('#admin-save-btn');

// State variables
let labelIdCounter =
  document.querySelector('.label-container').childElementCount ?? 0;
let currentModal;

// Loading animation runs, comment out during development (takes 2s on reload)
// init();

///////////////// Add event handlers /////////////////
// admin modal
document.querySelector('.header-user-pic').addEventListener('click', showAdmin);
// - 4 ways of closing the modals - need to be tweaked when other modals are added - see how to re-use general modal closing function for all modals
overlay.addEventListener('click', closeModal);

modalCloseBtns = document.querySelectorAll('.modal__close');
for (let i = 0; i < modalCloseBtns.length; i++) {
  modalCloseBtns[i].addEventListener('click', closeModal);
}

adminCancelBtn.addEventListener('click', closeModal);
projectCancelBtn.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  e.preventDefault;
  if (e.key === 'Escape') {
    closeModal();
  }
});
// - save changes
adminSaveBtn.addEventListener('click', saveAdmin);

// - neProject modal
document
  .querySelector('.new-project')
  .addEventListener('click', showNewProject);

// newDay modal
document.querySelector('.new-day').addEventListener('click', showNewDay);

// editProject modal
taskCardsProjects = document.querySelectorAll(
  '.task-card__progress-bar-container'
);
for (let i = 0; i < taskCardsProjects.length; i++) {
  taskCardsProjects[i].addEventListener('click', showEditProject);
}

// editDay modal
taskCardsDays = document.querySelectorAll(
  '.task-card__tasks-preview-container'
);
for (let i = 0; i < taskCardsDays.length; i++) {
  taskCardsDays[i].addEventListener('click', showEditDay);
}

// Card delete buttons from main screen
let cardDeleteBtns = document.querySelectorAll('.task-card__close');
for (let i = 0; i < cardDeleteBtns.length; i++) {
  cardDeleteBtns[i].addEventListener('click', deleteTaskCard);
}

// - create priority label - admin
document.querySelector('#add-lbl-btn').addEventListener('click', createLabel);
// - delete priority label - admin
document
  .querySelector('.label-container')
  .addEventListener('click', deleteLabel);
// - reset app button
document.getElementById('reset-all-btn').addEventListener('click', resetApp);

// - add task
addTaskBtn.addEventListener('click', addTask);

// - remove task
document
  .querySelector('.modal__tasks-container')
  .addEventListener('click', removeTask);

///////////////// Event functions /////////////////
function init() {
  overlay.classList.remove('hidden');
  loadingSpinner.classList.remove('hidden');
  setTimeout(function () {
    overlay.classList.add('hidden');
    loadingSpinner.classList.add('hidden');
  }, 2000);
}

function showAdmin() {
  adminModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  loadAdmin();
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

// Labels in label container need to be cleared, needs to be added to this function as they're not part of form and not affected by reset()
function closeModal() {
  currentModal.classList.add('hidden');
  overlay.classList.add('hidden');
  document.getElementById('admin').reset();
  document.getElementById('newprojectname').reset();
  document.getElementById('taskinput').reset();
  document.getElementById('tasks').reset();
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

// Event bubbling - make sure clicking on empty container area doesn't delete container
function deleteLabel(e) {
  if (!e.target.classList.contains('label-container')) e.target.remove();
}

// Refresh function needs to be called here when implemented
function resetApp() {
  let decision = confirm('Jeste li sigurni?');
  if (decision == true) {
    localStorage.clear();
    alert('Baza očišćena!');
    closeModal();
  }
}

// Create new task --- TO REVAMP IN REACT
function addTask() {
  let taskText = document.querySelector('#tasktext').value;
  if (taskText) {
    const element = document.createElement('LI');
    const xBtn = document.createElement('SPAN');
    element.classList.add('modal__task');
    xBtn.classList.add('remove-task');
    let textNode = document.createTextNode(taskText);
    let xBtnText = document.createTextNode('x');
    xBtn.appendChild(xBtnText);
    element.appendChild(textNode);
    element.appendChild(xBtn);
    element.onclick = function () {
      this.classList.toggle('checked');
    };
    document.querySelector('.modal__tasks-container').appendChild(element);
    document.querySelector('#tasktext').value = '';
  }
}

// Remove this task
function removeTask(e) {
  if (
    !e.target.classList.contains('modal__tasks-container') &&
    !e.target.classList.contains('modal__task')
  )
    e.target.parentNode.remove();
}

// Very important later, reloads cards on main screen after any save/edit/delete all function has been triggered --- potentially will be replaced with methods since cards will become react elements
function refreshMainScreen() {}

// Placeholder function, needs to recognize task card clicked on - check previously used functions for deleting parent nodes (might be 2 levels up)
function deleteTaskCard() {
  console.log('Deleted!');
}

//// Saving data from forms in modals to LS
// Save user data and labels from admin form
function saveAdmin() {
  const userInput = Array.from(document.querySelectorAll('#admin input'));
  let workMap = new Map();
  for (const [index, formItem] of userInput.entries()) {
    if (formItem.value == '') formItem.value = '-';
    workMap.set(formItem.id, formItem.value);
  }
  // remove values not stored directly in base
  workMap.delete('labelColor');
  workMap.delete('labelName');
  // store to LS
  let userDataObj = {};
  userDataObj = Object.fromEntries(workMap);
  localStorage.setItem('userData', JSON.stringify(userDataObj));
  // Change FE elements and alert user
  // document.querySelector('.header-user-pic').src = userDataObj.profilePicUrl;
  alert('Korisnički podaci uspješno izmijenjeni!');
}

///// Loading LS data on change || when opening forms
// admin modal fill values if available
function loadAdmin() {
  const userDataObj = JSON.parse(localStorage.getItem('userData'));
  const userDataArr = Object.entries(userDataObj);
  for (const [label, input] of userDataArr) {
    document.getElementById(label).value = input;
  }
}

// function loadFE() {
//   const userDataObj = JSON.parse(localStorage.getItem('userData'));
//   document.querySelector('.header-user-pic').src = userDataObj.profilePicUrl;
//   document.querySelector('.header-user-name').textContent =
//     userDataObj.firstName;
// }
