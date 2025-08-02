    document.querySelector(".editicon").addEventListener("click", function () {
      document.querySelector(".editForm input").click();
    });

    document.querySelector(".editForm input").addEventListener("change", function () {
      document.querySelector(".editForm").submit();
    });
