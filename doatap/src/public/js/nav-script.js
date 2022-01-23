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


/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("mpla");
}
      
// Close the dropdown if the user clicks outside of it
    window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
    var myDropdown = document.getElementById("myDropdown");
    if (myDropdown.classList.contains('show1')) {
        myDropdown.classList.remove('show1');
          }
        }
      }