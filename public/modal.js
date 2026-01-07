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

  // Run necessary scipts from main.js that need to be run on any template load
  if(document.getElementById('ability-div')){
    ability_types_access()
  }

  else if(document.getElementById('help-message')){
    fill_version_num()
    fill_help_text()
  }

  else if (document.getElementById('load-menu')){
    render_saved_list(saved_adversaries);
    render_tags_for_filter();
  }

  initializeEditors(modalBody);

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

/**
 * Validates a specific modal container including inputs and selects
 */
function validateModal(modal) {
    const submitBtn = modal.querySelector('.submit-btn');
    // Finds any input, textarea, or select with the data-required attribute
    const requiredFields = modal.querySelectorAll('input[data-required], select[data-required], textarea[data-required]');
    
    let allValid = true;

    requiredFields.forEach(field => {
        const value = field.value ? field.value.trim() : "";
        
        // If the value is an empty string, it's invalid
        if (value === "") {
            allValid = false;
        }
    });

    submitBtn.disabled = !allValid;
    
    // Visual feedback
    submitBtn.classList.toggle('btn-disabled', !allValid);
    submitBtn.classList.toggle('btn-enabled', allValid);
}

// Global listener for both typing (input) and dropdown changes (change)
['input', 'change'].forEach(eventType => {
    document.addEventListener(eventType, (e) => {
        const modal = e.target.closest('#modal-container');
        if (modal) {
            validateModal(modal);
        }
    });
});