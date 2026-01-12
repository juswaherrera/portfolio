// ---------- Nav hover-follow (NO active orb) ----------
const nav = document.querySelector(".nav");
const hoverOrb = document.querySelector(".nav-orb--hover");
const links = Array.from(document.querySelectorAll(".nav-link"));
const snap = document.querySelector(".snap");

// helper: place hover highlight matching the link size
function placeHoverOnEl(el, smooth = true) {
  if (!nav || !hoverOrb || !el) return;

  const linkRect = el.getBoundingClientRect();
  const navRect  = nav.getBoundingClientRect();

  const padX = 10;
  const padY = 6;

  const w = linkRect.width + padX * 2;
  const h = linkRect.height + padY * 2;

  hoverOrb.style.width = `${w}px`;
  hoverOrb.style.height = `${h}px`;

  const x = (linkRect.left - navRect.left) - padX;

  if (!smooth) {
    const old = hoverOrb.style.transition;
    hoverOrb.style.transition = "none";
    hoverOrb.style.transform = `translate(${x}px, -50%)`;
    hoverOrb.getBoundingClientRect();
    hoverOrb.style.transition = old;
  } else {
    hoverOrb.style.transform = `translate(${x}px, -50%)`;
  }
}

// set active based on hash (text highlight only)
function setActive(hash) {
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === hash));
}

// Hover-follow
links.forEach(a => {
  a.addEventListener("mouseenter", () => {
    if (!hoverOrb) return;
    hoverOrb.style.opacity = "1";
    placeHoverOnEl(a, true);
  });

  a.addEventListener("mousemove", () => {
    if (!hoverOrb) return;
    hoverOrb.style.opacity = "1";
    placeHoverOnEl(a, true);
  });
});

nav?.addEventListener("mouseleave", () => {
  if (!hoverOrb) return;
  hoverOrb.style.opacity = "0";
});

// Click: set active + pop
links.forEach(a => {
  a.addEventListener("click", () => {
    const hash = a.getAttribute("href");
    if (hash && hash.startsWith("#")) setActive(hash);

    if (hoverOrb) {
      hoverOrb.animate(
        [
          { transform: hoverOrb.style.transform + " scale(1)" },
          { transform: hoverOrb.style.transform + " scale(1.05)" },
          { transform: hoverOrb.style.transform + " scale(1)" }
        ],
        { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
    }
  });
});

// Load
window.addEventListener("load", () => {
  setActive(location.hash || "#home");
});

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll("[data-reveal]");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-visible");
  });
}, { threshold: 0.16 });
revealEls.forEach(el => io.observe(el));

// ---------- Update nav while scrolling ----------
const sections = Array.from(document.querySelectorAll("section.section"));
if (snap) {
  const secObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target?.id) {
      const hash = `#${visible.target.id}`;
      setActive(hash);
      history.replaceState(null, "", hash);
    }
  }, { root: snap, threshold: [0.25, 0.45, 0.6] });

  sections.forEach(s => secObserver.observe(s));
}

// ================= PROJECT MODAL =================
const projectModal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc  = document.getElementById("modalDesc");
const modalVisit = document.getElementById("modalVisit");

window.openProjectModal = function(e){
  e.preventDefault();

  const card = e.currentTarget;
  const title = card?.dataset?.title || "Project";
  const desc  = card?.dataset?.desc  || "";
  const url   = card?.dataset?.url   || "#";

  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc)  modalDesc.textContent  = desc;

  if (modalVisit) {
    if (!url || url === "#") {
      modalVisit.style.display = "none";
      modalVisit.removeAttribute("href");
    } else {
      modalVisit.style.display = "inline-flex";
      modalVisit.href = url;
    }
  }

  if (projectModal) {
    projectModal.classList.add("is-open");
    projectModal.setAttribute("aria-hidden", "false");
  }
  document.body.style.overflow = "hidden";
  return false;
};

window.closeProjectModal = function(){
  if (projectModal) {
    projectModal.classList.remove("is-open");
    projectModal.setAttribute("aria-hidden", "true");
  }
  document.body.style.overflow = "";
};

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && projectModal?.classList.contains("is-open")) {
    closeProjectModal();
  }
});

// ================== GALAXY PARTICLES (CANVAS) ==================
const canvas = document.getElementById("particles");
if (canvas) {
  const ctx = canvas.getContext("2d");

  let w = 0, h = 0;
  function resizeCanvas(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particles = [];
  const COUNT = 80;
  function rand(min, max){ return Math.random() * (max - min) + min; }

  for (let i = 0; i < COUNT; i++){
    particles.push({
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      r: rand(0.6, 2.2),
      vx: rand(-0.12, 0.12),
      vy: rand(0.05, 0.25),
      a: rand(0.15, 0.55),
    });
  }

  function draw(){
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(5,7,11,0.12)";
    ctx.fillRect(0, 0, w, h);

    for (const p of particles){
      p.x += p.vx;
      p.y += p.vy;

      if (p.y > h + 10) p.y = -10;
      if (p.x > w + 10) p.x = -10;
      if (p.x < -10) p.x = w + 10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}
