console.log("hello");

let name1;
let email;
let password;

// ! name text space value is fetched  
document.getElementById('name').addEventListener('input', (e) => {
    name1 = e.target.value;
    console.log(name1);
});

// ! email text space value is fetched  
document.getElementById('email').addEventListener('input', (e) => {
    email = e.target.value;
    console.log(email);
});

// ! password text space value is fetched  
document.getElementById('password').addEventListener('input', (e) => {
    password = e.target.value;
});

// !  submit button is listened.
document.getElementById('submit').addEventListener('click', async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/auth/createuser", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name1, email: email, password: password }),
    })
    const json = await response.json();
    console.log(json);
    if (json.success == true) {
        // location.href = 'http://127.0.0.1:5500/exam.html';
        window.open('http://127.0.0.1:5500/login.html', '_blank');

    }
    else {
        if (json.type == 'error') {
            let element = document.getElementById('container');
            element.innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
       <strong>Error:</strong> ${json.errors[0]['msg']}
       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
     </div>`
        } else {
            let element = document.getElementById('container');
            element.innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
           <strong>Error:</strong> This email id is already registered
           <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
         </div>`
        }

    }

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
});

document.getElementById('button').addEventListener('click', (e) => {
    let password = document.getElementById('password');
    e.preventDefault();
    if (password.type === 'password') {
        password.type = 'text';
        document.getElementById('button').innerText = 'Hide';
    }
    else {
        password.type = 'password';
        document.getElementById('button').innerText = 'Show';
    }
})