(function(){
  const sentinel = document.getElementById('infinite-scroll-sentinel');
  const gallery = document.getElementById('gallery');
  let nextLink = document.getElementById('next-page');
  let nextURL = nextLink ? nextLink.getAttribute('href') : null;
  let loading = false;

  if(!sentinel || !gallery) return;

  function markOrientation(scope){
    (scope || document).querySelectorAll('.gallery-item img').forEach(img => {
      function apply(){
        const item = img.closest('.gallery-item');
        if(!item) return;
        const w = img.naturalWidth, h = img.naturalHeight;
        if(w && h){
          if(w > h){ item.classList.add('landscape'); }
          else { item.classList.remove('landscape'); }
        }
      }
      if(img.complete){ apply(); }
      else { img.addEventListener('load', apply, { once:true }); }
    });
  }
  // initial pass
  markOrientation(document);

  async function loadMore(){
    if(loading || !nextURL) return;
    loading = true;
    try{
      const res = await fetch(nextURL, { credentials: 'same-origin' });
      if(!res.ok) throw new Error('HTTP '+res.status);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
  const items = doc.querySelectorAll('.gallery-item');
  items.forEach(el => gallery.appendChild(el));
  markOrientation(gallery);
      const newNext = doc.getElementById('next-page');
      nextURL = newNext ? newNext.getAttribute('href') : null;
    }catch(err){
      console.error('Infinite scroll error:', err);
      nextURL = null;
    }finally{
      loading = false;
    }
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        loadMore();
      }
    });
  },{ rootMargin: '600px 0px 600px 0px' });
  io.observe(sentinel);
})();
