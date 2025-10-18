
async function sendOTPCodeAgain(){
    let userEmail = document.querySelector('.resend-code').getAttribute('data-src');
    let response = await fetch('/auth/local/sendOTP', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail })
    });

    let result = await response.json();
    console.log(result);
}

sendOTPCodeAgain();
document.querySelector('.resend-code').addEventListener('click', sendOTPCodeAgain);