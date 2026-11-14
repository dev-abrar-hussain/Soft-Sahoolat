(function () {
  'use strict';

  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
    });
  }

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-copy');
      navigator.clipboard.writeText(value).then(function () {
        var original = button.textContent;
        button.textContent = 'Copied';
        window.setTimeout(function () { button.textContent = original; }, 1400);
      });
    });
  });

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
}());
