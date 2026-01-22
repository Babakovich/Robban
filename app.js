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
       HOVER IMAGE ROTATION (ALLEEN DESKTOP)
    =============================== */
    const canHover = window.matchMedia("(hover: hover)").matches;

    if (canHover) {
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
    }

    /* ===============================
       LIGHTBOX + SWIPE + SCROLL LOCK
    =============================== */
    const media = Array.from(document.querySelectorAll(".gift-item img, .gift-item video"));
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxVideo = document.getElementById("lightboxVideo");
    const closeBtn = document.getElementById("close");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    let currentIndex = 0;
    let touchStartX = 0;

    function preventScroll(e) {
        e.preventDefault();
    }

    function disableBackgroundScroll() {
        document.body.classList.add("no-scroll");
        document.addEventListener("touchmove", preventScroll, { passive: false });
    }

    function enableBackgroundScroll() {
        document.body.classList.remove("no-scroll");
        document.removeEventListener("touchmove", preventScroll);
    }

    function stopAllVideos() {
        document.querySelectorAll("video").forEach(v => v.pause());
    }

    function openLightbox() {
        const item = media[currentIndex];

        lightboxImg.style.display = "none";
        lightboxVideo.style.display = "none";

        stopAllVideos();

        if (item.tagName === "IMG") {
            lightboxImg.src = item.src;
            lightboxImg.style.display = "block";
        } else {
            lightboxVideo.src = item.querySelector("source")?.src || item.src;
            lightboxVideo.poster = "Afbeeldingen/Afbeelding-video.png";
            lightboxVideo.style.display = "block";
        }

        lightbox.style.display = "flex";
        disableBackgroundScroll();
    }

    function closeLightbox() {
        stopAllVideos();
        lightboxVideo.removeAttribute("src");
        lightboxVideo.load();
        lightbox.style.display = "none";
        enableBackgroundScroll();
    }

    media.forEach((item, i) => {
        item.addEventListener("click", () => {
            currentIndex = i;
            openLightbox();
        });
    });

    prevBtn?.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + media.length) % media.length;
        openLightbox();
    });

    nextBtn?.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % media.length;
        openLightbox();
    });

    closeBtn?.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", e => {
        if (e.target === lightbox) closeLightbox();
    });

    /* ===============================
       SWIPE (AFBEELDINGEN)
    =============================== */
    if (lightboxImg) {
        lightboxImg.addEventListener("touchstart", e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        lightboxImg.addEventListener("touchend", e => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) < 50) return;

            currentIndex = diff > 0
                ? (currentIndex + 1) % media.length
                : (currentIndex - 1 + media.length) % media.length;

            openLightbox();
        });
    }

    /* ===============================
       SOCIAL MODAL
    =============================== */
    const openSocials = document.getElementById("openSocials");
    const socialModal = document.getElementById("socialModal");
    const closeSocials = document.getElementById("closeSocials");

    if (openSocials && socialModal && closeSocials) {
        openSocials.addEventListener("click", () => socialModal.classList.add("show"));
        closeSocials.addEventListener("click", () => socialModal.classList.remove("show"));
        socialModal.addEventListener("click", e => {
            if (e.target === socialModal) socialModal.classList.remove("show");
        });
    }

    /* ===============================
       MOBILE DROPDOWN
    =============================== */
    const select = document.getElementById("pageSelect");
    if (select) {
        select.addEventListener("change", () => {
            window.location.href = select.value;
        });
    }
});
