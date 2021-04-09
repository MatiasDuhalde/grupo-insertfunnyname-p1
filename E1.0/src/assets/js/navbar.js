window.addEventListener('scroll', () => {
  if (window.scrollY > 120) {
    document.querySelector('.navbar').classList.add('floating-navbar');
  } else {
    document.querySelector('.navbar').classList.remove('floating-navbar');
  }
});

// Add menu toggler for responsiveness
