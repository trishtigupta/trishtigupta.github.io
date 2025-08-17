(() => {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <img alt="">
    <div class="lightbox-caption" aria-live="polite"></div>
  `;
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(lb));

  const imgEl = () => lb.querySelector('img');
  const capEl = () => lb.querySelector('.lightbox-caption');
  function open(src, title){
    imgEl().src = src;
    imgEl().alt = title || '';
    capEl().textContent = title || '';
    lb.classList.add('open');
  }
  function close(){
    lb.classList.remove('open');
    imgEl().src = '';
  }
  lb.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') close(); });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.gallery-link');
    if(!a) return;
    // On touch devices, first tap toggles overlay; second tap opens lightbox
    if(matchMedia('(hover: none)').matches){
      if(!a.classList.contains('tapped')){
        // Remove tapped from others to keep UI clean
        document.querySelectorAll('a.gallery-link.tapped').forEach(el=>el.classList.remove('tapped'));
        a.classList.add('tapped');
        // Don’t open lightbox on the first tap
        e.preventDefault();
        return;
      }
      // If already tapped, proceed to open and clear tapped state
      a.classList.remove('tapped');
    }
    const full = a.getAttribute('data-full');
    if(!full) return;
    e.preventDefault();
    open(full, a.getAttribute('data-title'));
  }, { capture: true });
  // Clear tapped state if user taps outside links
  document.addEventListener('click', (e)=>{
    if(!e.target.closest('a.gallery-link')){
      document.querySelectorAll('a.gallery-link.tapped').forEach(el=>el.classList.remove('tapped'));
    }
  });
})();
