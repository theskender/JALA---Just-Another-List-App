'use strict';
// Save re-usable elements to variables

// const addTaskBtn = document.querySelector('#add-task-btn');
const overlay = document.querySelector('.overlay');
const loadingSpinner = document.querySelector('.loading-spinner');
const adminModal = document.querySelector('.admin-modal');
const newProjectModal = document.querySelector('.new-project-modal');
const editProjectModal = document.querySelector('.edit-project-modal');
const newDayModal = document.querySelector('.new-day-modal');
const editDayModal = document.querySelector('.edit-day-modal');
const projectCancelBtn = document.querySelector('#project-cancel-btn');
const dayCancelBtn = document.querySelector('#day-cancel-btn');
const adminCancelBtn = document.querySelector('#admin-cancel-btn');
const adminSaveBtn = document.querySelector('#admin-save-btn');
const projectSaveBtn = document.querySelector('#project-save-btn');
const daySaveBtn = document.querySelector('#day-save-btn');

// State variables
let currentModal;
let currentModalPrefix = '';
let activeTaskCardId = '';

// Loading animation runs, comment out during development (takes 2s on reload)
init();
loadFE();
