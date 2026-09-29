(function () {
  "use strict";

  var C = window.FAZO_CONFIG;
  if (!C) return;

  var LANGS = ["ru", "uz"];
  var STORAGE_KEY = "fazo-lang";
  var params = new URLSearchParams(location.search);
  var isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var lang = C.defaultLang || "ru";
  var toastTimer;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function fill(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) {
      return vars && vars[k] != null ? vars[k] : m;
    });
  }

  function vars() {
    return {
      open: C.hours.open,
      close: C.hours.close,
      count: C.rating.count,
      value: C.rating.value
    };
  }

  function t(key) {
    var dict = C.i18n[lang] || C.i18n.ru;
    var val = dict[key] != null ? dict[key] : C.i18n.ru[key];
    return Array.isArray(val) ? val : fill(val == null ? "" : val, vars());
  }

  // Русские формы множественного числа: [1, 2–4, 5+]
  function plural(forms, n) {
    if (!Array.isArray(forms)) return fill(forms, vars());
    var m10 = n % 10, m100 = n % 100;
    var i = m10 === 1 && m100 !== 11 ? 0 : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 1 : 2;
    return fill(forms[i], vars());
  }

  /* ---------- Links ---------- */
  var lat = C.coords.lat, lng = C.coords.lng;
  var links = {
    telegramCatalog: C.telegramCatalog,
    telegramManager: C.telegramManager,
    tel: "tel:+" + String(C.phone).replace(/\D/g, ""),
    yandexMaps: "https://yandex.uz/maps/?pt=" + lng + "," + lat + "&z=17&l=map",
    googleMaps: "https://www.google.com/maps/search/?api=1&query=" + lat + "," + lng,
    reviews: C.rating.url
  };
  var mapWidget = "https://yandex.uz/map-widget/v1/?ll=" + lng + "%2C" + lat + "&z=16&pt=" + lng + "%2C" + lat + "%2Cpm2rdm";

  function applyLinks() {
    $$("[data-href]").forEach(function (el) {
      var href = links[el.getAttribute("data-href")];
      if (href) el.setAttribute("href", href);
    });
    $$("[data-phone]").forEach(function (el) { el.textContent = C.phone; });
    $$("[data-rating-value]").forEach(function (el) { el.textContent = C.rating.value; });
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Language ---------- */
  function readStoredLang() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function storeLang(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* private mode */ }
  }

  function setMeta(selector, value) {
    var el = $(selector);
    if (el) el.setAttribute("content", value);
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.title = t("pageTitle");
    setMeta('meta[name="description"]', t("pageDescription"));

    $$("[data-i18n]").forEach(function (el) {
      var text = t(el.getAttribute("data-i18n"));
      if (el.hasAttribute("data-i18n-sep")) {
        // «·» рисуем шрифтом текста, чтобы не качать лишний файл курсивного шрифта
        el.textContent = "";
        text.split("·").forEach(function (part, i) {
          if (i) {
            var sep = document.createElement("span");
            sep.className = "sep";
            sep.textContent = "·";
            el.appendChild(sep);
          }
          el.appendChild(document.createTextNode(part));
        });
      } else {
        el.textContent = text;
      }
    });
    $$("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    $$(".lang__btn").forEach(function (btn) {
      var code = btn.getAttribute("data-lang");
      btn.setAttribute("aria-pressed", String(code === lang));
      btn.setAttribute("aria-label", t(code === "ru" ? "langRu" : "langUz"));
    });

    var count = $("[data-reviews-count]");
    if (count) count.textContent = plural(C.i18n[lang].reviewsCount, Number(C.rating.count));
    var score = $("[data-score]");
    if (score) score.setAttribute("aria-label", t("ratingLabel"));
    var track = $("[data-reviews-track]");
    if (track) {
      track.setAttribute("aria-label", t("reviewsListLabel"));
      $$("[data-review-source]", track).forEach(function (el) { el.textContent = t("reviewsSource"); });
    }
    var frame = $("[data-map] iframe");
    if (frame) frame.title = t("mapFrameTitle");

    updateStatus();
  }

  function setLang(next, fromUser) {
    if (LANGS.indexOf(next) === -1) return;
    lang = next;
    if (fromUser) storeLang(next);
    applyLang();
  }

  /* ---------- Open / closed ---------- */
  function toMinutes(hhmm) {
    var p = String(hhmm).split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1] || "0", 10);
  }

  function nowMinutes() {
    // ?now=HH:MM — только для локальной проверки
    var forced = params.get("now");
    if (isLocal && forced && /^\d{1,2}:\d{2}$/.test(forced)) return toMinutes(forced);
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: C.hours.timezone || "Asia/Tashkent",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
      }).formatToParts(new Date());
      var h = 0, m = 0;
      parts.forEach(function (p) {
        if (p.type === "hour") h = parseInt(p.value, 10) % 24;
        if (p.type === "minute") m = parseInt(p.value, 10);
      });
      return h * 60 + m;
    } catch (e) {
      // Фолбэк: Ташкент — UTC+5 без перехода на летнее время
      var d = new Date();
      return ((d.getUTCHours() + 5) % 24) * 60 + d.getUTCMinutes();
    }
  }

  function isOpenNow() {
    var open = toMinutes(C.hours.open), close = toMinutes(C.hours.close), now = nowMinutes();
    if (open === close) return true;
    return close > open ? now >= open && now < close : now >= open || now < close;
  }

  function updateStatus() {
    var open = isOpenNow();
    var pill = $("[data-status]");
    if (pill) {
      pill.hidden = false;
      pill.classList.toggle("is-open", open);
      $("[data-status-text]", pill).textContent = t(open ? "statusOpen" : "statusClosed");
    }
    var dot = $("[data-status-dot]");
    if (dot) {
      dot.hidden = false;
      dot.classList.toggle("is-open", open);
    }
  }

  /* ---------- Reviews ---------- */
  var STARS = '<span class="stars" aria-hidden="true">' +
    new Array(6).join('<svg width="14" height="14"><use href="#i-star"/></svg>') + "</span>";

  function renderReviews() {
    var track = $("[data-reviews-track]");
    if (!track) return;
    var list = Array.isArray(C.reviews) ? C.reviews : [];
    track.innerHTML = "";
    list.forEach(function (r) {
      var li = document.createElement("li");
      li.className = "review";
      li.innerHTML = STARS +
        '<p class="review__text"></p>' +
        '<p class="review__meta"><span class="review__name"></span>' +
        '<span class="review__source" data-review-source></span></p>';
      $(".review__text", li).textContent = r.text;
      $(".review__name", li).textContent = r.name;
      track.appendChild(li);
    });
    track.hidden = list.length === 0;
  }

  /* ---------- Map ---------- */
  function showMap(btn) {
    var box = btn.closest("[data-map]");
    if (!box || box.querySelector("iframe")) return;
    var frame = document.createElement("iframe");
    frame.src = mapWidget;
    frame.title = t("mapFrameTitle");
    frame.setAttribute("allowfullscreen", "");
    frame.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    box.innerHTML = "";
    box.appendChild(frame);
    box.classList.add("is-loaded");
  }

  /* ---------- Share ---------- */
  function showToast(text) {
    var toast = $("[data-toast]");
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2000);
  }

  function shareUrl() {
    return location.origin + location.pathname;
  }

  function copyFallback(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function copyLink() {
    var url = shareUrl();
    var done = function () { showToast(t("copied")); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done, function () { if (copyFallback(url)) done(); });
    } else if (copyFallback(url)) {
      done();
    }
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: t("pageTitle"), url: shareUrl() }).catch(function (err) {
        if (!err || err.name !== "AbortError") copyLink();
      });
    } else {
      copyLink();
    }
  }

  /* ---------- Analytics ---------- */
  var A = C.analytics || {};

  function loadScript(src) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  function initAnalytics() {
    if (A.yandexMetrikaId) {
      window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
      window.ym.l = Date.now();
      loadScript("https://mc.yandex.ru/metrika/tag.js");
      window.ym(A.yandexMetrikaId, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
    }
    if (A.ga4Id) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", A.ga4Id);
      loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(A.ga4Id));
    }
  }

  function track(name) {
    try {
      if (A.yandexMetrikaId && window.ym) window.ym(A.yandexMetrikaId, "reachGoal", name);
      if (A.ga4Id && window.gtag) window.gtag("event", name, { lang: lang });
    } catch (e) { /* ignore */ }
  }

  /* ---------- Structured data ---------- */
  function injectJsonLd() {
    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var data = {
      "@context": "https://schema.org",
      "@type": "Florist",
      name: C.seo.name,
      url: shareUrl(),
      image: new URL("assets/og-image.jpg", location.href).href,
      telephone: "+" + String(C.phone).replace(/\D/g, ""),
      address: {
        "@type": "PostalAddress",
        streetAddress: C.seo.streetAddress,
        addressLocality: C.seo.addressLocality,
        addressCountry: C.seo.addressCountry
      },
      geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
      openingHoursSpecification: [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days,
        opens: C.hours.open,
        closes: C.hours.close
      }],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: String(C.rating.value).replace(",", "."),
        reviewCount: C.rating.count,
        bestRating: "5"
      },
      sameAs: [C.instagram, C.telegramCatalog].filter(Boolean)
    };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ---------- Init ---------- */
  var urlLang = params.get("lang");
  if (urlLang && LANGS.indexOf(urlLang) !== -1) {
    lang = urlLang;
    storeLang(urlLang);
  } else {
    var stored = readStoredLang();
    if (stored && LANGS.indexOf(stored) !== -1) lang = stored;
  }

  applyLinks();
  renderReviews();
  applyLang();
  injectJsonLd();
  initAnalytics();

  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("[data-track], [data-lang], [data-map-show], [data-share]") : null;
    if (!el) return;
    if (el.hasAttribute("data-lang")) {
      var code = el.getAttribute("data-lang");
      if (code !== lang) track("lang_" + code);
      setLang(code, true);
      return;
    }
    var name = el.getAttribute("data-track");
    if (name) track(name);
    if (el.hasAttribute("data-map-show")) showMap(el);
    if (el.hasAttribute("data-share")) share();
  });

  setInterval(updateStatus, 60000);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") updateStatus();
  });
})();
