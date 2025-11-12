const urls = ['http://localhost:16468/status','http://localhost:16468/libros','http://localhost:16468/autores'];

(async ()=>{
  for (const u of urls) {
    try {
      const res = await fetch(u, {timeout:5000});
      const text = await res.text();
      console.log('=== ' + u + ' ===');
      console.log('Status:', res.status);
      console.log(text);
      console.log('\n');
    } catch (err) {
      console.error('ERROR fetching', u, err.message || err);
    }
  }
})();
