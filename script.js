document.addEventListener('DOMContentLoaded', function() {
    var menuIcon = document.querySelector('.menu-icon');
    var nav = document.querySelector('nav');

    menuIcon.addEventListener('click', function() {
        if (nav.style.display === 'none' || nav.style.display === '') {
            nav.style.display = 'block';
        } else {
            nav.style.display = 'none';
        }
    });
});
