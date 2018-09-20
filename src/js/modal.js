// Modal windows
var modal = document.getElementById('modalBox'),
    shade = document.getElementById('modalCover'),
    openModal = document.getElementById('openModal')
    closeModal = document.getElementById('closeModal');
window.addEventListener('click', function (event) {
  var clicked = event.target;
  if (event.target.classList.contains('open-modal')) {
    modal.style.display = shade.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    shade.setAttribute('aria-hidden', 'false');
  }
  if (event.target.classList.contains('close-modal')) {
    modal.style.display = shade.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    shade.setAttribute('aria-hidden', 'true');
  }
}, false);