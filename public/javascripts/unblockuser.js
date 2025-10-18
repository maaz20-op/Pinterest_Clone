
  const unblockButtons = document.querySelectorAll(".unblock-btn");

  unblockButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = btn.getAttribute("data-index");
      const form = document.getElementById("submit-" + index);
      form.submit();
    });
  });

      
  