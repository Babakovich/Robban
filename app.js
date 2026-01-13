document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       SCROLL TO TOP
    =============================== */
    const scrollBtn = document.getElementById("scrollTop");
    if (scrollBtn) {
        window.addEventListener("scroll", () => {
            scrollBtn.style.display = window.scrollY > 50 ? "block" : "none";
        });
        scrollBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ===============================
       HOVER IMAGE ROTATION (DESKTOP)
    =============================== */
    document.querySelectorAll(".gift-item").forEach(item => {
        const images = item.querySelectorAll("img");
        if (images.length <= 1) return;

        let index = 0;
        let timer = null;

        item.addEventListener("mouseenter", () => {
            timer = setInterval(() => {
                images[index].style.opacity = 0;
                index = (index + 1) % images.length;
                images[index].style.opacity = 1;
            }, 1000);
        });

        item.addEventListener("mouseleave", () => {
            clearInterval(timer);
            timer = null;
            images.forEach((img, i) => img.style.opacity = i === 0 ? 1 : 0);
            index = 0;
        });
    });

    /* ===============================
       VIDEO MANAGEMENT
    =============================== */
    const allVideos = document.querySelectorAll("video");

    function stopAllVideos() {
        allVideos.forEach(video => video.pause());
    }

    const videoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) entry.target.pause();
        });
    }, { threshold: 0.25 });

    allVideos.forEach(video => videoObserver.observe(video));

    /* ===============================
       LIGHTBOX
    =============================== */
    const media = Array.from(document.querySelectorAll(".gift-item img, .gift-item video"));
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxVideo = document.getElementById("lightboxVideo");
    const closeBtn = document.getElementById("close");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    let currentIndex = 0;

    media.forEach((item, index) => {
        item.addEventListener("click", () => {
            stopAllVideos();
            currentIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        const item = media[currentIndex];

        lightboxImg.style.display = "none";
        lightboxVideo.style.display = "none";
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;

        if (item.tagName === "IMG") {
            lightboxImg.src = item.src;
            lightboxImg.style.display = "block";
        } else {
            lightboxVideo.src = item.querySelector("source")?.src || item.src;
            lightboxVideo.style.display = "block";
        }

        lightbox.style.display = "flex";
        document.body.classList.add("no-scroll");
    }

    function closeLightbox() {
        stopAllVideos();
        lightbox.style.display = "none";
        document.body.classList.remove("no-scroll");
    }

    prevBtn?.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + media.length) % media.length;
        openLightbox();
    });

    nextBtn?.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % media.length;
        openLightbox();
    });

    closeBtn?.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") prevBtn?.click();
        if (e.key === "ArrowRight") nextBtn?.click();
    });

    /* ===============================
       MOBILE SWIPE
    =============================== */
    if (window.matchMedia("(max-width: 700px)").matches && lightbox) {
        let startX = 0;
        let startY = 0;

        lightbox.addEventListener("touchstart", e => {
            const t = e.touches[0];
            startX = t.clientX;
            startY = t.clientY;
        });

        lightbox.addEventListener("touchend", e => {
            const t = e.changedTouches[0];
            const dx = t.clientX - startX;
            const dy = t.clientY - startY;

            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
                currentIndex = dx < 0
                    ? (currentIndex + 1) % media.length
                    : (currentIndex - 1 + media.length) % media.length;
                openLightbox();
            }

            if (dy > 80) closeLightbox();
        });
    }

    /* ===============================
       SOCIAL MODAL
    =============================== */
    const openSocials = document.getElementById("openSocials");
    const socialModal = document.getElementById("socialModal");
    const closeSocials = document.getElementById("closeSocials");

    if (openSocials && socialModal && closeSocials) {
        openSocials.addEventListener("click", () => {
            socialModal.classList.add("show");
        });

        closeSocials.addEventListener("click", () => {
            socialModal.classList.remove("show");
        });

        socialModal.addEventListener("click", e => {
            if (e.target === socialModal) socialModal.classList.remove("show");
        });
    }

    /* ===============================
       MOBILE DROPDOWN
    =============================== */
    const select = document.getElementById("pageSelect");
    if (select) {
        const currentPage = location.pathname.split("/").pop();
        if (currentPage) select.value = currentPage;

        select.addEventListener("change", function () {
            window.location.href = this.value;
        });
    }

});
