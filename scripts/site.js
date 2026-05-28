/**
 * Mountain Town Rehab shared site JavaScript.
 * Handles the mobile menu and staff bio dialogs.
 */
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconPath = document.getElementById('menu-icon-path');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');

      if (iconPath) {
        iconPath.setAttribute('d', isHidden ? 'M4 6h16M4 12h16M4 18h16' : 'M6 18L18 6M6 6l12 12');
      }

      menuBtn.setAttribute('aria-expanded', String(!isHidden));
    });

    menuBtn.setAttribute('aria-expanded', 'false');
  }

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  let activeModal = null;
  let lastTrigger = null;

  function getFocusableElements(modal) {
    return Array.from(modal.querySelectorAll(focusableSelector)).filter((element) => {
      return element.offsetParent !== null || element === document.activeElement;
    });
  }

  function getOpenStaffModal() {
    return document.querySelector('.fixed[id^="modal-"]:not(.hidden)');
  }

  function openModal(trigger, modal) {
    activeModal = modal;
    lastTrigger = trigger;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');

    const focusable = getFocusableElements(modal);
    if (focusable.length > 0) {
      window.setTimeout(() => focusable[0].focus(), 0);
    }
  }

  function closeModal(modal) {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    activeModal = null;

    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  function trapFocus(event, modal) {
    const focusable = getFocusableElements(modal);
    if (focusable.length === 0) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  document.body.addEventListener('click', (event) => {
    const closeTrigger = event.target.closest('.modal-close, .modal-backdrop');
    if (closeTrigger) {
      const target = closeTrigger.getAttribute('data-target');
      if (!target || !target.startsWith('modal-')) return;

      const modal = document.getElementById(target);
      if (modal) {
        event.preventDefault();
        closeModal(modal);
      }
      return;
    }

    const openTrigger = event.target.closest('[data-target]');
    if (!openTrigger) return;

    const target = openTrigger.getAttribute('data-target');
    if (!target || !target.startsWith('modal-')) return;

    const modal = document.getElementById(target);
    if (modal) {
      event.preventDefault();
      openModal(openTrigger, modal);
    }
  });

  document.addEventListener('keydown', (event) => {
    const modal = activeModal || getOpenStaffModal();
    if (!modal) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal(modal);
    } else if (event.key === 'Tab') {
      trapFocus(event, modal);
    }
  });
});
