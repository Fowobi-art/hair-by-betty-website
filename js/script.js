// Wait until the page is ready before connecting FAQ and contact-form behaviour.
document.addEventListener('DOMContentLoaded', function () {
  // FAQ accordion: only one answer is open at a time.
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    button.addEventListener('click', function () {
      const isOpen = item.classList.contains('active');

      faqItems.forEach(function (faqItem) {
        faqItem.classList.remove('active');
        const otherAnswer = faqItem.querySelector('.faq-answer');
        otherAnswer.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Contact form: sends a booking request to FormSubmit, with an email fallback.
  const contactForm = document.getElementById('contact-form');
  const contactMessage = document.getElementById('contact-message');

  if (contactForm && contactMessage) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = (formData.get('name') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const service = (formData.get('service') || '').toString().trim();
      const appointmentDate = (formData.get('appointmentDate') || '').toString().trim();
      const appointmentTime = (formData.get('appointmentTime') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        contactMessage.textContent = 'Please fill in your name, email, and message before sending.';
        contactMessage.style.color = '#9f1d1d';
        return;
      }

      const payload = {
        name,
        phone: phone || 'Not provided',
        email,
        service: service || 'Not specified',
        preferredDate: appointmentDate || 'Not specified',
        preferredTime: appointmentTime || 'Not specified',
        message,
      };

      contactMessage.textContent = 'Sending your message...';
      contactMessage.style.color = '#1d1b1a';

      fetch('https://formsubmit.co/ajax/hellohairbybetty@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Form submit failed.');
          }

          contactMessage.textContent = 'Your message has been sent successfully.';
          contactMessage.style.color = '#1d1b1a';
          contactForm.reset();
        })
        .catch(() => {
          const subject = encodeURIComponent(`Booking enquiry: ${service || 'Hair By Betty service'}`);
          const body = encodeURIComponent(
            `Name: ${name}\nPhone: ${phone || 'Not provided'}\nEmail: ${email}\nService: ${service || 'Not specified'}\nPreferred date: ${appointmentDate || 'Not specified'}\nPreferred time: ${appointmentTime || 'Not specified'}\n\nMessage:\n${message}`
          );

          window.location.href = `mailto:hellohairbybetty@gmail.com?subject=${subject}&body=${body}`;
          contactMessage.textContent = 'Your email app is opening. If it does not open, send your message directly to hellohairbybetty@gmail.com.';
          contactMessage.style.color = '#1d1b1a';
          contactForm.reset();
        });
    });
  }
});

// Mobile navigation: opens and closes the dropdown menu on small screens.
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
    });
  });
}

// Gallery lightbox: opens the selected image in a centred modal preview.
const galleryItems = document.querySelectorAll('.gallery-item');

if (galleryItems.length) {
  const modal = document.createElement('dialog');
  modal.className = 'image-modal';
  modal.innerHTML = '<button type="button" aria-label="Close image preview">&times;</button><img alt="" />';
  document.body.appendChild(modal);

  const preview = modal.querySelector('img');
  const closeButton = modal.querySelector('button');

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      preview.src = item.dataset.image;
      preview.alt = item.dataset.alt;
      modal.showModal();
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });
}
