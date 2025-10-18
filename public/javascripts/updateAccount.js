const btn = document.querySelector(".save-btn");
const form = document.getElementById('settings-form');

btn.addEventListener('click', function(){
    form.submit();
})