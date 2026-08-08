let currentLang = 'pt';
const translations = {};

async function loadTranslations(lang) {
    if (!translations[lang]) {
        try {
            const response = await fetch(`lang/${lang}.json`);
            translations[lang] = await response.json();
        } catch (error) {
            console.error("Erro ao carregar tradução:", error);
            return;
        }
    }
    applyTranslations(lang);
}

function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.innerText = lang === 'pt' ? 'English' : 'Português';
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    loadTranslations(currentLang);
}

function selectPlan(planName) {
    const tabs = ['mensal', 'semestral', 'anual'];
    tabs.forEach(p => {
        const btn = document.getElementById('tab-' + p);
        const card = document.getElementById('card-plan-' + p);

        if (p === planName) {
            if (btn) {
                btn.className = "plan-tab px-3.5 sm:px-7 py-2.5 sm:py-3 rounded-full font-extrabold text-xs md:text-base transition-all duration-300 bg-ambar-orange text-ambar-darkest shadow-xl scale-105 ring-2 ring-white/50 whitespace-nowrap";
            }
            if (card) {
                card.className = "plan-card bg-ambar-cream text-ambar-darkest rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 shadow-2xl border-4 border-ambar-orange transition-all duration-500 flex flex-col justify-between relative opacity-100 scale-100 md:scale-[1.03] z-20 ring-4 ring-ambar-orange/30 shadow-[0_0_40px_rgba(233,142,41,0.4)] cursor-pointer";
            }
        } else {
            if (btn) {
                btn.className = "plan-tab px-3.5 sm:px-7 py-2.5 sm:py-3 rounded-full font-extrabold text-xs md:text-base transition-all duration-300 text-ambar-cream/70 hover:text-white bg-transparent whitespace-nowrap";
            }
            if (card) {
                card.className = "plan-card bg-white/95 text-ambar-darkest rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 shadow-md border-2 border-transparent transition-all duration-500 hidden md:flex flex-col justify-between relative md:opacity-50 md:scale-95 z-0 hover:opacity-90 cursor-pointer";
            }
        }
    });
}

function toggleCurriculo(id, btnElement) {
    const content = document.getElementById(id);
    const textSpan = btnElement.querySelector('.btn-text');
    const arrowIcon = btnElement.querySelector('.icon-arrow');

    if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.opacity = "1";
        content.style.marginTop = "1rem";
        textSpan.innerText = (translations[currentLang] && translations[currentLang]["btn_curr_recolher"]) || "Recolher currículo";
        arrowIcon.style.transform = "rotate(180deg)";
    } else {
        content.style.maxHeight = "0px";
        content.style.opacity = "0";
        content.style.marginTop = "0px";
        textSpan.innerText = (translations[currentLang] && translations[currentLang]["btn_curr_ver"]) || "Ver currículo completo";
        arrowIcon.style.transform = "rotate(0deg)";
    }
}

// Clean hash from URL on anchor clicks so copied links open at the top of the homepage
document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#') {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
                if (history.replaceState) {
                    history.replaceState(null, null, window.location.pathname + window.location.search);
                }
            }
        }
    }
});

function collapseAllModalitiesCards() {
    const allCards = document.querySelectorAll('.carousel-card');
    allCards.forEach(card => {
        card.classList.remove('is-expanded');
        card.classList.remove('w-[85vw]', 'md:w-[850px]', 'h-[650px]', 'md:h-[550px]');
        card.classList.add('w-[280px]', 'md:w-[320px]', 'h-[400px]');

        const imgContainer = card.querySelector('.image-container');
        if (imgContainer) {
            imgContainer.classList.remove('w-[85vw]', 'md:w-[500px]', 'h-[350px]', 'md:h-[550px]');
            imgContainer.classList.add('w-[280px]', 'md:w-[320px]', 'h-[400px]', 'md:h-[400px]');
        }

        const imgMain = card.querySelector('.img-main');
        if (imgMain) imgMain.style.objectFit = 'cover';

        const imgBlur = card.querySelector('.img-blur');
        if (imgBlur) {
            imgBlur.classList.remove('opacity-60');
            imgBlur.classList.add('opacity-0');
        }

        const overlay = card.querySelector('.gradient-overlay');
        if (overlay) overlay.style.opacity = '1';

        const title = card.querySelector('.card-title');
        if (title) {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }

        const content = card.querySelector('.card-content');
        if (content) {
            content.classList.remove('opacity-100');
            content.classList.add('hidden', 'md:flex');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadTranslations('pt');
    selectPlan('anual');
    const track = document.getElementById('carousel-track');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const progressBar = document.getElementById('carousel-progress');

    if (btnNext && btnPrev && track) {
        const scrollAmount = 340;

        btnNext.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        btnPrev.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        let touchStartX = 0;
        let hasCollapsedOnTouch = false;

        track.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length) {
                touchStartX = e.touches[0].clientX;
                hasCollapsedOnTouch = false;
            }
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!hasCollapsedOnTouch && e.touches && e.touches.length && document.querySelector('.carousel-card.is-expanded')) {
                const currentX = e.touches[0].clientX;
                if (Math.abs(currentX - touchStartX) > 15) {
                    collapseAllModalitiesCards();
                    hasCollapsedOnTouch = true;
                }
            }
        }, { passive: true });

        let isScrolling = false;
        track.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const maxScrollLeft = track.scrollWidth - track.clientWidth;
                    const scrollPercentage = (track.scrollLeft / maxScrollLeft) * 100;
                    const barWidth = Math.max(33, scrollPercentage);
                    if (progressBar) {
                        progressBar.style.width = `${barWidth}%`;
                    }
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }

    // Section 2 Mobile Carousel Indicator Dots
    const sec2Carousel = document.getElementById('sec2-carousel');
    const sec2Dots = document.querySelectorAll('#sec2-dots span');
    if (sec2Carousel && sec2Dots.length) {
        let isSec2Scrolling = false;
        sec2Carousel.addEventListener('scroll', () => {
            if (!isSec2Scrolling) {
                window.requestAnimationFrame(() => {
                    const scrollPos = sec2Carousel.scrollLeft;
                    const cardWidth = sec2Carousel.firstElementChild.offsetWidth + 24; // width + gap
                    const activeIndex = Math.min(
                        sec2Dots.length - 1,
                        Math.round(scrollPos / cardWidth)
                    );
                    sec2Dots.forEach((dot, idx) => {
                        if (idx === activeIndex) {
                            dot.classList.remove('bg-ambar-darkest/20', 'w-2.5');
                            dot.classList.add('bg-ambar-red', 'w-6');
                        } else {
                            dot.classList.remove('bg-ambar-red', 'w-6');
                            dot.classList.add('bg-ambar-darkest/20', 'w-2.5');
                        }
                    });
                    isSec2Scrolling = false;
                });
                isSec2Scrolling = true;
            }
        }, { passive: true });
    }
});

function toggleCard(clickedCard) {
    const isAlreadyExpanded = clickedCard.classList.contains('is-expanded');

    collapseAllModalitiesCards();

    if (!isAlreadyExpanded) {
        clickedCard.classList.add('is-expanded');

        clickedCard.classList.remove('w-[280px]', 'md:w-[320px]', 'h-[400px]');
        clickedCard.classList.add('w-[85vw]', 'md:w-[850px]', 'h-[650px]', 'md:h-[550px]');

        const imgContainer = clickedCard.querySelector('.image-container');
        if (imgContainer) {
            imgContainer.classList.remove('w-[280px]', 'md:w-[320px]', 'h-[400px]', 'md:h-[400px]');
            imgContainer.classList.add('w-[85vw]', 'md:w-[500px]', 'h-[350px]', 'md:h-[550px]');
        }

        const content = clickedCard.querySelector('.card-content');
        if (content) {
            content.classList.remove('hidden');
        }

        setTimeout(() => {
            const imgMain = clickedCard.querySelector('.img-main');
            if (imgMain) imgMain.style.objectFit = 'cover';

            const imgBlur = clickedCard.querySelector('.img-blur');
            if (imgBlur) {
                imgBlur.classList.remove('opacity-0');
                imgBlur.classList.add('opacity-60');
            }

            const overlay = clickedCard.querySelector('.gradient-overlay');
            if (overlay) overlay.style.opacity = '0';

            const title = clickedCard.querySelector('.card-title');
            if (title) {
                title.style.opacity = '0';
                title.style.transform = 'translateY(20px)';
            }

            if (content) content.classList.add('opacity-100');
        }, 200);

        setTimeout(() => {
            clickedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 300);
    }
}

function toggleFaq(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('.icon-wrapper');

    if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';

        icon.style.transform = 'rotate(180deg)';
        icon.classList.remove('bg-ambar-orange/20', 'text-ambar-orange');
        icon.classList.add('bg-ambar-orange', 'text-white');
    } else {
        content.style.maxHeight = '0px';
        content.style.opacity = '0';

        icon.style.transform = 'rotate(0deg)';
        icon.classList.remove('bg-ambar-orange', 'text-white');
        icon.classList.add('bg-ambar-orange/20', 'text-ambar-orange');
    }
}
