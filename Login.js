console.log("Joined");
let name1;
let email;
let password;


// !signup button listening 
document.getElementById('signup').addEventListener('click', () => {
    // location.href = 'http://127.0.0.1:5500/Signup.html';
    window.open('http://127.0.0.1:5500/Signup.html','_blank');
})

// ! email text space value is fetched
document.getElementById('email').addEventListener('input', (e) => {
    email = e.target.value;
    console.log(email);
});

// ! password text space value is fetched
document.getElementById('password').addEventListener('input', (e) => {
    password = e.target.value;
});

// ! Submit button is listened
document.getElementById('submit').addEventListener('click',async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/auth/login", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
    })
    const json = await response.json();
    console.log(json);
    if(json.success == true) {
        // location.href = 'http://127.0.0.1:5500/exam.html';
        window.open('http://127.0.0.1:5500/exam.html','_blank');

    }
    else {
        let element = document.getElementById('container');
        element.innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Error:</strong> Try to login with correct Credentials
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`
    }
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
});

document.getElementById('button').addEventListener('click',(e)=>{
    let password = document.getElementById('password');
    e.preventDefault(); 
    if(password.type === 'password'){
        password.type = 'text';
        document.getElementById('button').innerText = 'Hide';
    }
    else{
        password.type = 'password';
        document.getElementById('button').innerText = 'Show';
    }
})