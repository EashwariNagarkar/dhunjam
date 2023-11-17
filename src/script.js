const triggerPassword = document.querySelector('.fa-eye');

const showPassword = trigger => {
  trigger.addEventListener('click', () => {
    if (trigger.previousElementSibling.getAttribute('type') === 'password') {
      trigger.previousElementSibling.setAttribute('type', 'text');
      trigger.classList.remove('fa-eye');
      trigger.classList.add('fa-eye-slash');
    } else if (trigger.previousElementSibling.getAttribute('type') === 'text') {
      trigger.previousElementSibling.setAttribute('type', 'password');
      trigger.classList.remove('fa-eye-slash');
      trigger.classList.add('fa-eye');
    }
  });
};

showPassword(triggerPassword);