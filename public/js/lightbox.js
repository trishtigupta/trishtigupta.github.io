(() => {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox-btn lightbox-prev" aria-label="Previous">&#10094;</button>
    <div class="lightbox-stage">
      <img alt=""/>
      <div class="lightbox-counter" aria-live="polite"></div>
      <div class="lightbox-caption" aria-live="polite"></div>
    </div>
    <button class="lightbox-btn lightbox-next" aria-label="Next">&#10095;</button>
  `;
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(lb));

  const imgEl = () => lb.querySelector('img');
  const capEl = () => lb.querySelector('.lightbox-caption');
  const countEl = () => lb.querySelector('.lightbox-counter');
  const prevBtn = () => lb.querySelector('.lightbox-prev');
  const nextBtn = () => lb.querySelector('.lightbox-next');

  /** @type {{src:string, srcset?:string, sizes?:string, title?:string}[]} */
  let album = [];
  let index = 0;

  function render(){
    if(!album.length) return;
    const slide = album[index];
    const img = imgEl();
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    if(slide.srcset){ img.setAttribute('srcset', slide.srcset); }
    if(slide.sizes){ img.setAttribute('sizes', slide.sizes); }
    img.src = slide.src;
    img.alt = slide.title || '';
    capEl().textContent = slide.title || '';
    countEl().textContent = `${index+1} / ${album.length}`;
    lb.classList.add('open');
    updateNavState();
  }

  function updateNavState(){
    const single = album.length <= 1;
    prevBtn().style.display = single ? 'none' : '';
    nextBtn().style.display = single ? 'none' : '';
  }

  function openFrom(anchor){
    // Prefer embedded album JSON
    const article = anchor.closest('.gallery-item');
    let slides = [];
    if(article){
      const tpl = article.querySelector('template.album-data');
      if(tpl){
        try { slides = JSON.parse(tpl.innerHTML.trim()); } catch { slides = []; }
      }
    }
    if(!slides || !slides.length){
      // Fallback to single image from data attributes
      const full = anchor.getAttribute('data-full');
      if(!full) return;
      const fullset = anchor.getAttribute('data-fullset') || undefined;
      const sizes = anchor.getAttribute('data-fullsizes') || undefined;
      const title = anchor.getAttribute('data-title') || undefined;
      slides = [{ src: full, srcset: fullset, sizes, title }];
    }
    album = slides;
    index = 0;
    render();
  }

  function close(){
    lb.classList.remove('open');
    imgEl().src = '';
    album = [];
    index = 0;
  }

  function next(){ if(album.length){ index = (index + 1) % album.length; render(); } }
  function prev(){ if(album.length){ index = (index - 1 + album.length) % album.length; render(); } }

  // Click to navigate instead of closing unless clicking backdrop beyond stage/buttons
  lb.addEventListener('click', (e) => {
    const stage = lb.querySelector('.lightbox-stage');
    if(e.target === prevBtn()) { e.stopPropagation(); prev(); return; }
    if(e.target === nextBtn()) { e.stopPropagation(); next(); return; }
    if(stage.contains(e.target)) return; // don't close when clicking the image/caption
    close();
  });
  prevBtn().addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); prev(); });
  nextBtn().addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); next(); });

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    else if(e.key === 'ArrowRight') next();
    else if(e.key === 'ArrowLeft') prev();
  });

  // Touch swipe
  let touchX = null;
  lb.addEventListener('touchstart', (e)=>{ touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e)=>{
    if(touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if(Math.abs(dx) > 40){ dx < 0 ? next() : prev(); }
    touchX = null;
  });

  // Open on gallery click
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.gallery-link');
    if(!a) return;
    // On touch devices, first tap toggles overlay; second tap opens lightbox
    if(matchMedia('(hover: none)').matches){
      if(!a.classList.contains('tapped')){
        document.querySelectorAll('a.gallery-link.tapped').forEach(el=>el.classList.remove('tapped'));
        a.classList.add('tapped');
        e.preventDefault();
        return;
      }
      a.classList.remove('tapped');
    }
    e.preventDefault();
    openFrom(a);
  }, { capture: true });

  // Clear tapped state if user taps outside links
  document.addEventListener('click', (e)=>{
    if(!e.target.closest('a.gallery-link')){
      document.querySelectorAll('a.gallery-link.tapped').forEach(el=>el.classList.remove('tapped'));
    }
  });
})();
