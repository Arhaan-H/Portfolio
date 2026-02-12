(function () {
  "use strict";

  /* ========== LOADER ========== */
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.getElementById("loader").classList.add("hidden");
      animateHero();
    }, 2000);
  });

  /* ========== CURSOR GLOW ========== */
  const glow = document.getElementById("cursor-glow");
  if (window.matchMedia("(hover:hover)").matches) {
    document.addEventListener("mousemove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
  }

  /* ========== PARTICLES ========== */
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  const PARTICLE_COUNT = 80;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,200,255,${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,200,255,${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ========== TYPING EFFECT ========== */
  const typedEl = document.getElementById("typed-text");
  const phrases = [
    "Cloud Computing",
    "Big Data Analytics",
    "AI / ML Enthusiast",
    "Full-Stack Developer",
    "Research Intern @ IIT KGP",
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIdx--);
    } else {
      typedEl.textContent = current.substring(0, charIdx++);
    }

    let delay = isDeleting ? 35 : 70;

    if (!isDeleting && charIdx > current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx < 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(typeLoop, delay);
  }

  /* ========== HERO STAGGER ANIMATION ========== */
  function animateHero() {
    const els = document.querySelectorAll("#hero .anim-fade");
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), i * 200);
    });
    setTimeout(typeLoop, 800);
  }

  /* ========== SCROLL-TRIGGERED COUNTER ANIMATION ========== */
  function animateCounters() {
    document.querySelectorAll(".stat-num").forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      el.textContent = "0";
      let current = 0;
      const increment = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
      }, 40);
    });
  }

  const statsSection = document.querySelector(".hero-stats");
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animateCounters();
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  /* ========== SCROLL PROGRESS ========== */
  const progressBar = document.getElementById("scroll-progress");
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight) * 100 + "%";
  }

  /* ========== NAVBAR SCROLL EFFECTS ========== */
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");

  function onScroll() {
    updateProgress();
    navbar.classList.toggle("scrolled", window.scrollY > 50);

    // Active link highlight
    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute("id");
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ========== MOBILE NAV TOGGLE ========== */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.querySelector(".nav-links");

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("open");
  });
  navLinks.forEach((link) =>
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navMenu.classList.remove("open");
    })
  );

  /* ========== SCROLL REVEAL (Intersection Observer) ========== */
  const revealEls = document.querySelectorAll(
    ".anim-slide-up, .anim-slide-right, .anim-slide-left, .anim-reveal"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // Animate skill bars when visible
          entry.target.querySelectorAll(".skill-fill").forEach((bar) => {
            bar.style.width = bar.dataset.width + "%";
          });
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));

  /* ========== SMOOTH SECTION TRANSITIONS ========== */
  const sectionEls = document.querySelectorAll(".section");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
  );
  sectionEls.forEach((sec) => sectionObserver.observe(sec));

  /* ========== 3D TILT EFFECT ON CARDS ========== */
  const tiltCards = document.querySelectorAll(
    ".project-card, .achievement-card, .skill-category, .resume-card"
  );

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.5s ease";
      setTimeout(() => (card.style.transition = ""), 500);
    });
  });

  /* ========== CONTACT FORM (Web3Forms) ========== */
  const contactForm = document.getElementById("contact-form");
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector("button");
    const originalHTML = btn.innerHTML;

    // Show loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    try {
      const formData = new FormData(contactForm);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        btn.style.background = "linear-gradient(135deg,#22c55e,#16a34a)";
        contactForm.reset();
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      btn.innerHTML = '<i class="fas fa-times"></i> Failed – Try Again';
      btn.style.background = "linear-gradient(135deg,#ef4444,#dc2626)";
      console.error("Contact form error:", err);
    }

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = "";
      btn.disabled = false;
    }, 3000);
  });
})();
