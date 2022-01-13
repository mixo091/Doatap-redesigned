const Menu = document.getElementById('nav-menu')
toggleMenu = document.getElementById('toggle-menu')
closeMenu = document.getElementById('close-menu')

toggleMenu.addEventListener('click' , () => {
    Menu.classList.toggle('show')
    toggleMenu.classList.toggle('dissapear')
     
})

closeMenu.addEventListener('click' , () => {
    Menu.classList.toggle('show')
    toggleMenu.classList.toggle('dissapear')
})