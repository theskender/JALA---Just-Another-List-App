'use strict';
// Save re-usable elements to variables

// let taskCardsProjects;
// let taskCardsDays;
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
const projectSaveBtn = document.querySelector('#project-save-btn');

// State variables
let currentModal;
let currentModalPrefix = '';

// Loading animation runs, comment out during development (takes 2s on reload)
init();
loadFE();

// ADMIN MODAL
// - save changes admin
adminSaveBtn.addEventListener('click', saveAdmin);
// - reset app button
document.getElementById('reset-all-btn').addEventListener('click', resetApp);

// NEW PROJECT MODAL
// - add task
addTaskBtn.addEventListener('click', addTask);
document
  .querySelector('#add-task-btn-edit-pro')
  .addEventListener('click', addTask);
// - remove task
document
  .querySelector('.modal__tasks-container')
  .addEventListener('click', removeTask);
