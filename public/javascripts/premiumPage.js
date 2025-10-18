// Select all plan buttons
const planButtons = document.querySelectorAll(".plan-btn");
const mainCard = document.querySelector(".card");

let payButton = null; // dynamic button reference
let selectedPlan = null;
let selectedAmount = null;

// Helper to remove previous dynamic button
function removePayButton() {
  if (payButton && payButton.parentNode) {
    payButton.remove();
    payButton = null;
  }
}

// Add dynamic pay button when plan selected
planButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // remove previous selected states
    planButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");

    // get selected plan + amount
    const text = btn.innerText;
    if (text.includes("499")) {
      selectedPlan = "Silver";
      selectedAmount = 499;
    } else if (text.includes("699")) {
      selectedPlan = "Gold";
      selectedAmount = 699;
    } else if (text.includes("999")) {
      selectedPlan = "Diamond";
      selectedAmount = 999;
    }

    // remove old pay button if exists
    removePayButton();

    // create new pay button dynamically
    payButton = document.createElement("button");
    payButton.classList.add("pay-btn");
    payButton.textContent = `Pay Now ₹${selectedAmount}`;
    mainCard.appendChild(payButton);

    // Add event listener for dynamic Pay button
    payButton.addEventListener("click", async () => {
      const paymentData = {
        plan: selectedPlan,
        amount: selectedAmount,
      };

      try {
        const res = await fetch("/api/v1/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        });

        const jsonData = await res.json();
        if (jsonData.statusCode === 200) {
         let paymentUi = jsonData.data[0]
         window.location.href = paymentUi;
        } else {
          console.log("failed to redirect!")
        }
      } catch (err) {
        console.error(err);
        alert("❌ Error: Backend not responding!");
      }
    });
  });
});
