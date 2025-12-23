const overlay = document.getElementById('modal-overlay');
const container = document.getElementById('modal-container');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.getElementById('modal-close');
const triggers = document.querySelectorAll('.modal-trigger');

modalBody.addEventListener('click', (e) => {
  // Check if the clicked element (or its parent) has the 'close-modal' class
  if (e.target.closest('.close-modal')) {
    closeModal();
  }
})

function openModal(targetId) {
  const temp = document.getElementById(targetId);
  if (!temp) return;

  // Clear and Inject
  modalBody.innerHTML = '';
  modalBody.appendChild(temp.content.cloneNode(true));

  // Remove hiding classes, Add showing classes
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  overlay.classList.add('opacity-100', 'pointer-events-auto');
  
  container.classList.remove('scale-90');
  container.classList.add('scale-100');

  // Prevent background scroll
  document.body.classList.add('overflow-hidden');
}

function closeModal() {
  overlay.classList.add('opacity-0', 'pointer-events-none');
  overlay.classList.remove('opacity-100', 'pointer-events-auto');
  
  container.classList.add('scale-90');
  container.classList.remove('scale-100');

  document.body.classList.remove('overflow-hidden');
}

// Event Listeners
triggers.forEach(t => t.addEventListener('click', () => openModal(t.dataset.target)));
closeBtn.addEventListener('click', closeModal);

// Click backdrop to close
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

// Esc to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !overlay.classList.contains('opacity-0')) {
    closeModal();
  }
});