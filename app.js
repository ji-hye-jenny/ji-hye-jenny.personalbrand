/**
 * Jenny Personal Branding Website — Interactive Logic
 * Liquid Glass Effects, 3D Tilt, Clipboard Actions & Ambient Lights
 */

document.addEventListener('DOMContentLoaded', () => {
  initCurrentYear();
  initCursorGlow();
  initGlassCardInteractions();
  initEmailCopy();
});

/**
 * Automatically update current copyright year in footer
 */
function initCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Global smooth ambient cursor follower for desktop users
 */
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorGlow) return;

  // Check if device supports hover / fine pointer
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isFinePointer || prefersReducedMotion) {
    cursorGlow.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      isMoving = true;
      cursorGlow.style.opacity = '1';
    }
  });

  window.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
    isMoving = false;
  });

  // RAF smoothing loop
  function updateCursor() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;

    requestAnimationFrame(updateCursor);
  }

  requestAnimationFrame(updateCursor);
}

/**
 * 3D Tilt and Liquid Specular Highlight Tracking on Glass Cards
 */
function initGlassCardInteractions() {
  const cards = document.querySelectorAll('.tilt-card');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS custom properties for liquid specular refraction
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Calculate subtle 3D Tilt (only if fine pointer & motion allowed)
      if (isFinePointer && !prefersReducedMotion) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        // Subtle tilt limit (max 6 degrees)
        const rotateX = -deltaY * 6;
        const rotateY = deltaX * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (!prefersReducedMotion) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      }
    });
  });
}

/**
 * Copy Email to Clipboard with Liquid Glass Toast Alert
 */
function initEmailCopy() {
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const emailTextEl = document.getElementById('emailText');
  const toast = document.getElementById('glassToast');

  if (!btnCopyEmail || !emailTextEl || !toast) return;

  const emailToCopy = emailTextEl.textContent.trim();
  let toastTimeout = null;

  btnCopyEmail.addEventListener('click', async () => {
    let copySuccessful = false;

    // Clipboard API with legacy fallback
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(emailToCopy);
        copySuccessful = true;
      } catch (err) {
        copySuccessful = fallbackCopyText(emailToCopy);
      }
    } else {
      copySuccessful = fallbackCopyText(emailToCopy);
    }

    if (copySuccessful) {
      triggerCopySuccessUI(btnCopyEmail, toast);
    }
  });

  function triggerCopySuccessUI(button, toastEl) {
    const originalText = button.querySelector('.btn-text');
    const originalHtml = originalText.textContent;

    // Button visual feedback
    button.style.borderColor = 'var(--lavender-400)';
    button.style.background = 'var(--lavender-100)';
    button.style.color = 'var(--lavender-deep)';
    originalText.textContent = 'Copied! ✓';

    // Show Liquid Glass Toast
    toastEl.classList.add('show');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
      button.style.borderColor = '';
      button.style.background = '';
      button.style.color = '';
      originalText.textContent = originalHtml;
    }, 3200);
  }

  function fallbackCopyText(text) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      return false;
    }
  }
}
