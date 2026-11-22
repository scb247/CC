/* Crop Circle theme scripts: mobile menu, hero thread preview, product page preview, Catch the Glow game. */
(function () {
  'use strict';

  /* Glow colours as "r,g,b". Keep in step with snippets/thread-colour.liquid. */
  var THREAD_COLOURS = {
    blue:   { hex: '#2F6FED', glow: '127,179,255' },
    green:  { hex: '#2E9E52', glow: '57,255,107' },
    red:    { hex: '#E5484D', glow: '255,110,110' },
    white:  { hex: '#EDE6D3', glow: '255,251,234' },
    pink:   { hex: '#EC6BA3', glow: '255,156,199' },
    orange: { hex: '#F0932B', glow: '255,177,87' }
  };

  function store(key, value) {
    try {
      if (value === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { return null; }
  }

  /* ---------- mobile menu ---------- */
  function initMenu() {
    var header = document.querySelector('[data-header]');
    var btn = document.querySelector('[data-menu-btn]');
    if (!header || !btn) return;
    btn.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  /* ---------- hero thread dots ---------- */
  function initHero() {
    var row = document.querySelector('[data-hero-threads]');
    if (!row) return;
    var hero = row.closest('.hero') || document.documentElement;
    row.querySelectorAll('button').forEach(function (b) {
      var apply = function () { hero.style.setProperty('--glow-rgb', b.dataset.glow); };
      b.addEventListener('mouseenter', apply);
      b.addEventListener('focus', apply);
      b.addEventListener('click', apply);
    });
  }

  /* ---------- money ---------- */
  function formatMoney(cents, format) {
    format = format || '£{{amount}}';
    var value = (cents / 100);
    function withDelims(n, decimals, thousands, decimal) {
      var parts = n.toFixed(decimals).split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
      return parts.join(decimal);
    }
    return format.replace(/\{\{\s*(\w+)\s*\}\}/, function (_, key) {
      switch (key) {
        case 'amount_no_decimals': return withDelims(value, 0, ',', '.');
        case 'amount_with_comma_separator': return withDelims(value, 2, '.', ',');
        case 'amount_no_decimals_with_comma_separator': return withDelims(value, 0, '.', ',');
        default: return withDelims(value, 2, ',', '.');
      }
    });
  }

  /* ---------- product designer ---------- */
  function initDesigner(root) {
    var dataEl = root.querySelector('[data-product-json]');
    if (!dataEl) return;
    var data = JSON.parse(dataEl.textContent);
    var variants = data.variants || [];
    var threadIndex = data.threadIndex;

    var form = root.querySelector('[data-product-form]');
    var idInput = root.querySelector('[data-variant-id]');
    var priceEl = root.querySelector('[data-price]');
    var addBtn = root.querySelector('[data-add-btn]');
    var status = root.querySelector('[data-form-status]');
    var stage = root.querySelector('[data-stage]');
    var fieldsets = root.querySelectorAll('[data-option-index]');

    function selectedOptions() {
      var out = [];
      fieldsets.forEach(function (fs) {
        var i = Number(fs.dataset.optionIndex);
        var checked = fs.querySelector('input:checked') || fs.querySelector('select');
        out[i] = checked ? checked.value : null;
      });
      return out;
    }

    function findVariant(opts) {
      return variants.find(function (v) {
        return v.options.every(function (o, i) { return opts[i] == null || opts[i] === o; });
      });
    }

    /* Grey out values that have no in-stock variant given the other current choices. */
    function updateAvailability(opts) {
      fieldsets.forEach(function (fs) {
        var i = Number(fs.dataset.optionIndex);
        fs.querySelectorAll('input[type=radio]').forEach(function (input) {
          var trial = opts.slice(); trial[i] = input.value;
          var match = variants.find(function (v) {
            return v.options.every(function (o, j) { return trial[j] === o; });
          });
          var label = input.nextElementSibling;
          var soldOut = !match || !match.available;
          if (label) label.title = soldOut ? input.value + ' — sold out' : '';
          input.dataset.soldOut = soldOut ? 'true' : 'false';
          if (label) label.style.opacity = soldOut ? '.45' : '';
        });
      });
    }

    function setThread(name, glow, hex) {
      var key = String(name || '').toLowerCase();
      var c = THREAD_COLOURS[key] || {};
      glow = glow || c.glow; hex = hex || c.hex;
      if (glow && stage) stage.style.setProperty('--glow-rgb', glow);
      if (hex && stage) stage.style.setProperty('--thread-hex', hex);
      var cap = root.querySelector('[data-caption-thread]');
      if (cap && name) cap.textContent = name;
    }

    function onOptionChange() {
      var opts = selectedOptions();
      opts.forEach(function (v, i) {
        var dd = root.querySelector('[data-summary-option="' + i + '"]');
        if (dd && v != null) dd.textContent = v;
      });
      updateAvailability(opts);
      if (threadIndex >= 0) {
        var t = root.querySelector('[data-option-index="' + threadIndex + '"] input:checked');
        if (t) setThread(t.value, t.dataset.glow, t.dataset.hex);
      }
      var v = findVariant(opts);
      status.textContent = ''; status.classList.remove('error');
      if (!v) {
        addBtn.disabled = true; addBtn.textContent = 'Unavailable';
        return;
      }
      idInput.value = v.id;
      addBtn.disabled = !v.available;
      addBtn.textContent = v.available ? 'Add to cart' : 'Sold out';
      if (priceEl) {
        var html = formatMoney(v.price, data.moneyFormat);
        if (v.compare_at_price && v.compare_at_price > v.price) {
          html += ' <s>' + formatMoney(v.compare_at_price, data.moneyFormat) + '</s>';
        }
        priceEl.innerHTML = html;
      }
      try {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', v.id);
        window.history.replaceState({}, '', url.toString());
      } catch (e) { /* ignore */ }
    }

    root.addEventListener('change', function (e) {
      if (e.target.closest('[data-option-index]')) onOptionChange();
    });

    /* Hover a thread swatch to preview it without selecting. */
    if (window.matchMedia('(hover: hover)').matches && threadIndex >= 0) {
      var threadSet = root.querySelector('[data-option-index="' + threadIndex + '"]');
      if (threadSet) {
        threadSet.querySelectorAll('.swatch').forEach(function (sw) {
          var input = sw.querySelector('input');
          sw.addEventListener('mouseenter', function () { setThread(input.value, input.dataset.glow, input.dataset.hex); });
        });
        threadSet.addEventListener('mouseleave', function () {
          var t = threadSet.querySelector('input:checked');
          if (t) setThread(t.value, t.dataset.glow, t.dataset.hex);
        });
      }
    }

    /* Lights on/off */
    root.querySelectorAll('[data-lights]').forEach(function (b) {
      b.addEventListener('click', function () {
        var off = b.dataset.lights === 'off';
        document.body.classList.toggle('lights-off', off);
        root.querySelectorAll('[data-lights]').forEach(function (x) {
          x.setAttribute('aria-pressed', String(x.dataset.lights === (off ? 'off' : 'on')));
        });
        var cap = root.querySelector('[data-caption-light]');
        if (cap) cap.textContent = off ? 'Glowing in a dark room' : 'In daylight';
      });
    });

    /* Quantity */
    var qty = root.querySelector('[data-qty-input]');
    root.querySelectorAll('[data-qty]').forEach(function (b) {
      b.addEventListener('click', function () {
        var n = Math.max(1, Math.min(20, (Number(qty.value) || 1) + Number(b.dataset.qty)));
        qty.value = n;
      });
    });

    /* Add to cart without leaving the page; falls back to a normal form post. */
    if (form && window.fetch) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        addBtn.disabled = true;
        status.classList.remove('error');
        status.textContent = 'Adding…';
        fetch((window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/') + 'cart/add.js', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        })
          .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
          .then(function (res) {
            if (!res.ok) throw new Error(res.body.description || res.body.message || 'Could not add to cart');
            status.innerHTML = 'Added. <a href="' + ((window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/') + 'cart') + '">View cart</a>';
            return fetch('/cart.js').then(function (r) { return r.json(); }).then(function (cart) {
              var link = document.querySelector('.cart-link');
              if (!link) return;
              var count = link.querySelector('[data-cart-count]');
              if (!count) {
                count = document.createElement('span');
                count.className = 'cart-count'; count.setAttribute('data-cart-count', '');
                link.appendChild(count);
              }
              count.textContent = cart.item_count;
              link.setAttribute('aria-label', 'Cart, ' + cart.item_count + ' items');
            });
          })
          .catch(function (err) {
            status.classList.add('error');
            status.textContent = err.message;
          })
          .finally(function () {
            var v = findVariant(selectedOptions());
            addBtn.disabled = !(v && v.available);
          });
      });
    }

    onOptionChange();
  }

  /* ---------- Catch the Glow ---------- */
  function initGame(wrap) {
    var canvas = wrap.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var scoreEl = wrap.querySelector('[data-score]');
    var bestEl = wrap.querySelector('[data-best]');
    var missEl = wrap.querySelector('[data-misses]');
    var overlay = wrap.querySelector('[data-overlay]');
    var colours = Object.keys(THREAD_COLOURS).map(function (k) { return THREAD_COLOURS[k].glow; });
    var orbs = [], score = 0, misses = 0, running = false, last = 0, spawnIn = 0;
    var best = Number(store('cc-glow-best')) || 0;
    bestEl.textContent = best;

    function reset() { orbs = []; score = 0; misses = 0; spawnIn = 0; scoreEl.textContent = 0; missEl.textContent = 0; }

    function start() {
      reset(); running = true; overlay.hidden = true; last = performance.now();
      requestAnimationFrame(tick);
    }

    function end() {
      running = false;
      if (score > best) { best = score; store('cc-glow-best', best); bestEl.textContent = best; }
      wrap.querySelector('[data-overlay-title]').textContent = 'Lights out';
      wrap.querySelector('[data-overlay-text]').textContent = 'You caught ' + score + ' orb' + (score === 1 ? '' : 's') + '. Charge up and go again.';
      overlay.hidden = false;
    }

    function tick(now) {
      if (!running) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      var speedUp = 1 + score * 0.04;
      spawnIn -= dt;
      if (spawnIn <= 0) {
        orbs.push({ x: 40 + Math.random() * (W - 80), y: -30, r: 22 + Math.random() * 10, v: (90 + Math.random() * 80) * speedUp, c: colours[Math.floor(Math.random() * colours.length)] });
        spawnIn = Math.max(0.35, 1.1 - score * 0.02);
      }
      ctx.clearRect(0, 0, W, H);
      for (var i = orbs.length - 1; i >= 0; i--) {
        var o = orbs[i];
        o.y += o.v * dt;
        if (o.y - o.r > H) {
          orbs.splice(i, 1); misses++; missEl.textContent = misses;
          if (misses >= 5) { end(); return; }
          continue;
        }
        var g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * 2.2);
        g.addColorStop(0, 'rgba(' + o.c + ',1)');
        g.addColorStop(0.4, 'rgba(' + o.c + ',.55)');
        g.addColorStop(1, 'rgba(' + o.c + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r * 2.2, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(tick);
    }

    canvas.addEventListener('pointerdown', function (e) {
      if (!running) return;
      var rect = canvas.getBoundingClientRect();
      var x = (e.clientX - rect.left) * (W / rect.width);
      var y = (e.clientY - rect.top) * (H / rect.height);
      for (var i = orbs.length - 1; i >= 0; i--) {
        var o = orbs[i];
        if (Math.hypot(o.x - x, o.y - y) <= o.r * 1.6) {
          orbs.splice(i, 1); score++; scoreEl.textContent = score;
          return;
        }
      }
    });

    wrap.querySelectorAll('[data-start]').forEach(function (b) { b.addEventListener('click', start); });
  }

  function boot() {
    initMenu();
    initHero();
    document.querySelectorAll('[data-product-designer]').forEach(initDesigner);
    document.querySelectorAll('[data-glow-game]').forEach(initGame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* Re-run when sections are edited in the theme editor. */
  document.addEventListener('shopify:section:load', function (e) {
    e.target.querySelectorAll('[data-product-designer]').forEach(initDesigner);
    e.target.querySelectorAll('[data-glow-game]').forEach(initGame);
    if (e.target.querySelector('[data-header]')) initMenu();
    if (e.target.querySelector('[data-hero-threads]')) initHero();
  });
})();
