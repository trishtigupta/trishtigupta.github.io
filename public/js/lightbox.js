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
    const full = a.getAttribute('data-full');
    if(!full) return;
    e.preventDefault();
    open(full, a.getAttribute('data-title'));
  }, { capture: true });
})();
