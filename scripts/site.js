/**
 * Mountain Town Rehab — Shared site JavaScript
 * Handles mobile menu toggle, modal open/close, and keyboard accessibility.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ===== Mobile Menu Toggle =====
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconPath = document.getElementById('menu-icon-path');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');

      // Swap hamburger ↔ close icon
      if (isHidden) {
        iconPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
      } else {
        iconPath.setAttribute('d', 'M6 18L18 6M6 6l12 12');
      }

      // Accessibility: announce expanded state
      menuBtn.setAttribute('aria-expanded', String(!isHidden));
    });

    // Set initial aria state
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
  }

  // ===== Modal Open / Close =====
  // Works for any card with [data-target] → matching modal ID,
  // and any .modal-close / .modal-backdrop with [data-target].

  let lastTrigger = null; // track which element opened the modal

  // Open modal when a card is clicked
  document.querySelectorAll('[data-target]').forEach(trigger => {
    // Skip close buttons and backdrops — they have their own handler below
    if (trigger.classList.contains('modal-close') || trigger.classList.contains('modal-backdrop')) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = trigger.getAttribute('data-target');
      const modal = document.getElementById(target);
      if (modal) {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        lastTrigger = trigger;
      }
    });
  });

  // Close modal via close button or backdrop click
  document.querySelectorAll('.modal-close, .modal-backdrop').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      const modal = document.getElementById(target);
      if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        // Restore focus to the triggering element
        if (lastTrigger) {
          lastTrigger.focus();
          lastTrigger = null;
        }
      }
    });
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.fixed[id^="modal-"]:not(.hidden)').forEach(modal => {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        if (lastTrigger) {
          lastTrigger.focus();
          lastTrigger = null;
        }
      });
    }
  });

});
