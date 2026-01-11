// --- Smooth active nav + pill movement ---
const nav = document.querySelector(".nav");
const pill = document.querySelector(".nav-pill");
const links = Array.from(document.querySelectorAll(".nav-link"));
const snap = document.querySelector(".snap");

function movePillTo(el) {
  const r = el.getBoundingClientRect();
  const nr = nav.getBoundingClientRect();
  const left = r.left - nr.left;
  pill.style.width = `${r.width}px`;
  pill.style.left = `${left}px`;
}

function setActive(hash) {
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === hash));
  const active = links.find(a => a.classList.contains("active")) || links[0];
  movePillTo(active);
}

window.addEventListener("load", () => {
  setActive("#home");
  if (location.hash) setActive(location.hash);
});

window.addEventListener("resize", () => {
  const active = links.find(a => a.classList.contains("active")) || links[0];
  movePillTo(active);
});

links.forEach(a => {
  a.addEventListener("click", () => {
    setActive(a.getAttribute("href"));
  });
});

// --- Reveal on scroll ---
const revealEls = document.querySelectorAll("[data-reveal]");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-visible");
  });
}, { threshold: 0.16 });

revealEls.forEach(el => io.observe(el));

// --- Update nav active while scrolling ---
const sections = Array.from(document.querySelectorAll("section.section"));
const secObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (visible?.target?.id) {
    setActive(`#${visible.target.id}`);
    history.replaceState(null, "", `#${visible.target.id}`);
  }
}, { root: snap, threshold: [0.25, 0.45, 0.6] });

sections.forEach(s => secObserver.observe(s));

// --- Simple demo actions ---
window.openProject = (name) => {
  alert(`Open project: ${name}\n\n(Replace this with a modal or separate project page.)`);
};

window.fakeSend = (e) => {
  e.preventDefault();
  const note = document.getElementById("formNote");
  note.textContent = "✅ Message sent (demo). Hook this up to EmailJS / Formspree / backend.";
  setTimeout(() => (note.textContent = ""), 4500);
  e.target.reset();
  return false;
};
