const hamburger = document.querySelector('.nav-toggle')
const navItems = document.querySelector('.nav-list')
hamburger.addEventListener('click',  () => {
  navItems.classList.toggle('open')
})