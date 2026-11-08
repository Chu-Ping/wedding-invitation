import { initLanguageControls, setUIText } from './i18n.js?v=20261108-show-invitation';

const gate = document.querySelector('#password-gate');
const invitation = document.querySelector('#invitation');
const form = document.querySelector('#password-form');
const password = document.querySelector('#invitation-password');
const submit = document.querySelector('#password-submit');
const error = document.querySelector('#password-error');
let opening = false;

initLanguageControls();
submit.disabled = false;
password.focus({ preventScroll: true });
password.addEventListener('input', () => {
  error.hidden = true;
  password.removeAttribute('aria-invalid');
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (opening) return;
  if (password.value !== '20270206') {
    setUIText(error, 'Incorrect password. Please try again.');
    error.hidden = false;
    password.setAttribute('aria-invalid', 'true');
    password.select();
    return;
  }
  opening = true;
  submit.disabled = true;
  password.disabled = true;
  error.hidden = true;
  setUIText(submit, 'Opening…');
  try {
    // Scene logic, model controls, and music are initialized only after entry.
    await import('./app.js?v=20261108-soft-glow');
    await import('./background-music.js');
    password.value = '';
    invitation.inert = false;
    document.documentElement.classList.remove('invitation-locked');
    gate.hidden = true;
    document.querySelector('.hotspot')?.focus({ preventScroll: true });
  } catch {
    opening = false;
    submit.disabled = false;
    password.disabled = false;
    setUIText(submit, 'Enter');
    setUIText(error, 'The invitation could not load. Please try again.');
    error.hidden = false;
  }
});
