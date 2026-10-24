/* Diagram edges: HTML nodes on a CSS grid, SVG connectors computed from layout.
   data-edges="a>b c>d:v e~f"   >  edge   ~  back edge (dashed, no dot)   :v/:h  break a diagonal tie
   Motion: the hero boots once (copy, then nodes in --i order, then edges draw, then signal dots).
   Every other diagram draws its edges when its case scrolls into view. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ?still: everything in its final state at once, for screenshots. Dots keep flowing.
  var still = /[?&]still\b/.test(location.search);
  if (still) document.documentElement.classList.add('still');
  var uid = 0;

  function rel(el, root) {
    var r = el.getBoundingClientRect();
    return { x: r.left - root.left, y: r.top - root.top, w: r.width, h: r.height };
  }

  function draw(dg) {
    var svg = dg.querySelector('svg.edges');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'edges');
      svg.setAttribute('aria-hidden', 'true');
      dg.appendChild(svg);
    }
    var root = dg.getBoundingClientRect();
    var W = Math.round(root.width), H = Math.round(root.height);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var mid = 'ah' + (dg.dataset.mid || (dg.dataset.mid = ++uid));
    var hero = dg.classList.contains('dg-hero');
    // Already on screen: a redraw (resize, font swap) shows finished edges, no replay.
    var live = reduce || still || dg.classList.contains('booted') || !!dg.closest('.in');

    var specs = (dg.dataset.edges || '').split(/\s+/).filter(Boolean).map(function (s) {
      var force = (s.match(/:(v|h)$/) || [])[1];
      s = s.replace(/:(v|h)$/, '');
      var back = s.indexOf('~') > -1;
      var p = s.split(/[>~]/);
      var A = dg.querySelector('[data-n="' + p[0] + '"]');
      var B = dg.querySelector('[data-n="' + p[1] + '"]');
      if (!A || !B) return null;
      return { a: rel(A, root), b: rel(B, root), back: back, force: force, ai: Number(A.style.getPropertyValue('--i') || 0) };
    }).filter(Boolean);

    // Side choice per edge.
    specs.forEach(function (e) {
      var a = e.a, b = e.b;
      var ox = a.x < b.x + b.w && b.x < a.x + a.w;      // horizontal ranges overlap
      var oy = a.y < b.y + b.h && b.y < a.y + a.h;      // vertical ranges overlap
      var dx = (b.x + b.w / 2) - (a.x + a.w / 2), dy = (b.y + b.h / 2) - (a.y + a.h / 2);
      var horiz;
      if (ox && !oy) horiz = false;
      else if (oy && !ox) horiz = true;
      else if (!ox && !oy) horiz = e.force ? e.force === 'h' : Math.abs(dx) > Math.abs(dy);
      else horiz = false;
      e.loop = e.back && !horiz && Math.abs(dy) > a.h + b.h;   // same column, far apart: loop around the right side
      if (e.loop) { e.sa = 'r'; e.sb = 'r'; }
      else if (horiz) { e.sa = dx > 0 ? 'r' : 'l'; e.sb = dx > 0 ? 'l' : 'r'; }
      else { e.sa = dy > 0 ? 'b' : 't'; e.sb = dy > 0 ? 't' : 'b'; }
    });

    // Spread anchors that share a node side.
    var groups = {};
    function key(r, side) { return [r.x, r.y, side].join(','); }
    specs.forEach(function (e) {
      var ka = key(e.a, e.sa), kb = key(e.b, e.sb);
      (groups[ka] = groups[ka] || []).push({ e: e, end: 'a', other: e.b });
      (groups[kb] = groups[kb] || []).push({ e: e, end: 'b', other: e.a });
    });
    Object.keys(groups).forEach(function (k) {
      var g = groups[k];
      var side = k.split(',')[2];
      g.sort(function (p, q) {
        var cp = side === 'l' || side === 'r' ? p.other.y + p.other.h / 2 : p.other.x + p.other.w / 2;
        var cq = side === 'l' || side === 'r' ? q.other.y + q.other.h / 2 : q.other.x + q.other.w / 2;
        return cp - cq;
      });
      g.forEach(function (p, i) { p.e[p.end + 'f'] = (i + 1) / (g.length + 1); });
    });

    function anchor(r, side, f) {
      if (side === 'l') return { x: r.x, y: r.y + r.h * f };
      if (side === 'r') return { x: r.x + r.w, y: r.y + r.h * f };
      if (side === 't') return { x: r.x + r.w * f, y: r.y };
      return { x: r.x + r.w * f, y: r.y + r.h };
    }

    var defs = '<defs><marker id="' + mid + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>';
    var out = defs;
    specs.forEach(function (e, i) {
      var p1 = anchor(e.a, e.sa, e.af), p2 = anchor(e.b, e.sb, e.bf), d;
      if (e.loop) {
        var off = 44;
        d = 'M' + p1.x + ',' + p1.y + ' C' + (p1.x + off) + ',' + p1.y + ' ' + (p2.x + off) + ',' + p2.y + ' ' + p2.x + ',' + p2.y;
      } else if (e.sa === 'l' || e.sa === 'r') {
        var mx = (p1.x + p2.x) / 2;
        d = 'M' + p1.x + ',' + p1.y + ' C' + mx + ',' + p1.y + ' ' + mx + ',' + p2.y + ' ' + p2.x + ',' + p2.y;
      } else {
        var my = (p1.y + p2.y) / 2;
        d = 'M' + p1.x + ',' + p1.y + ' C' + p1.x + ',' + my + ' ' + p2.x + ',' + my + ' ' + p2.x + ',' + p2.y;
      }
      var pid = mid + 'p' + i;
      var cls = (e.back ? 'back' : '') + (live ? '' : ' draw');
      var delay = hero ? e.ai * 160 + 520 : i * 90;   // hero: after the source node lit up
      out += '<path id="' + pid + '" d="' + d + '" class="' + cls + '" style="--d:' + delay + 'ms" marker-end="url(#' + mid + ')"/>';
      e.pid = pid; e.d = d;
    });
    svg.innerHTML = out;
    specs.forEach(function (e) {
      var p = svg.querySelector('#' + e.pid);
      e.len = p.getTotalLength();
      p.style.setProperty('--len', e.len.toFixed(1));
      // The arrowhead is hidden while .draw is on (CSS); it appears the moment the line reaches the node.
      p.addEventListener('animationend', function () { p.classList.remove('draw'); }, { once: true });
    });

    // Flow dots: HTML elements on CSS offset-path (first frame is computed synchronously, no SMIL flash).
    var layer = dg.querySelector('.dots');
    if (!layer) { layer = document.createElement('div'); layer.className = 'dots'; layer.setAttribute('aria-hidden', 'true'); dg.appendChild(layer); }
    layer.innerHTML = '';
    if (reduce) return;
    var dots = Number(dg.dataset.dots || 1);
    specs.forEach(function (e, i) {
      if (e.back) return;
      var dur = Math.max(1.8, e.len / 110);
      for (var k = 0; k < dots; k++) {
        var d = document.createElement('i');
        d.style.offsetPath = 'path("' + e.d + '")';
        d.style.animationDuration = dur.toFixed(2) + 's';
        d.style.animationDelay = (-(((i * 0.63) + k * dur / dots) % dur)).toFixed(2) + 's';
        layer.appendChild(d);
      }
    });
  }

  var dgs = Array.prototype.slice.call(document.querySelectorAll('.dg'));
  function drawAll() { dgs.forEach(draw); }
  var raf = 0;
  function schedule() { cancelAnimationFrame(raf); raf = requestAnimationFrame(drawAll); }

  drawAll();
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(schedule);
    dgs.forEach(function (d) { ro.observe(d); });
  } else {
    window.addEventListener('resize', schedule);
  }

  // Hero boot: once fonts and layout are stable, or after 1.5 s, whichever comes first.
  var heroSec = document.querySelector('.hero'), heroDg = document.querySelector('.dg-hero');
  var booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    drawAll();
    requestAnimationFrame(function () {
      if (heroSec) heroSec.classList.add('on');
      if (heroDg) {
        heroDg.classList.add('booted');
        setTimeout(function () { heroDg.classList.add('settled'); }, 2800);
      }
    });
  }
  if (reduce || still) {
    boot();
  } else {
    var fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    var loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise(function (res) { window.addEventListener('load', res); });
    Promise.all([fonts, loaded]).then(function () { requestAnimationFrame(function () { requestAnimationFrame(boot); }); });
    setTimeout(boot, 1500);
  }

  // Reveal on scroll (opacity and transform only). A case's diagram draws its edges when it enters.
  var rev = document.querySelectorAll('[data-reveal]');
  if (reduce || still || !('IntersectionObserver' in window)) {
    rev.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rev.forEach(function (el) { io.observe(el); });
  }

  // Nav hairline after scroll.
  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
