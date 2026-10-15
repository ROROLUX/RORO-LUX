// RORO LUX — mobile navigation and form submission.
(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  Array.prototype.forEach.call(document.querySelectorAll('form[data-endpoint]'), function (form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');

    function show(message, kind) {
      status.textContent = message;
      status.className = 'form-status' + (kind ? ' is-' + kind : '');
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var firstInvalid = null;
      Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (field) {
        var ok = field.type === 'checkbox' ? field.checked
          : field.type === 'email' ? EMAIL.test(field.value.trim())
          : field.value.trim() !== '';
        field.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        var message = firstInvalid.type === 'checkbox'
          ? 'Please tick the box to confirm you would like to receive our emails.'
          : firstInvalid.type === 'email' ? 'Please enter a valid email address.'
          : 'Please complete the highlighted fields.';
        show(message, 'error');
        firstInvalid.focus();
        return;
      }

      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name) return;
        data[el.name] = el.type === 'checkbox' ? el.checked : el.value;
      });

      button.disabled = true;
      show('Sending…');

      fetch(form.getAttribute('data-endpoint'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (body) {
            if (!res.ok) throw new Error(body.error || 'Something went wrong. Please try again.');
            return body;
          });
        })
        .then(function (body) {
          form.classList.add('is-done');
          show(body.message || 'Thank you.', 'success');
          form.reset();
        })
        .catch(function (err) {
          show(err instanceof TypeError
            ? 'We could not send that. Please check your connection and try again.'
            : err.message, 'error');
        })
        .then(function () {
          button.disabled = false;
        });
    });
  });
})();
