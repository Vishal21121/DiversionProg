let warningCount = 0;
let trigger = 0;
let question = 1;
let saved = 0;

const alertCall = () => {
    location.href = 'http://127.0.0.1:5500/End.html'
    window.history = 'none';

}

const width = () => {
    let original = window.screen.width;
    if (original != window.innerWidth) {
        document.getElementById('save').setAttribute('disabled', '');
        document.getElementById('change_buttons').innerHTML = '';
        let elements = document.getElementsByClassName('btn-get');
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.setAttribute('disabled', '');
        }
        warningCount++;
    }
}


// ! video Model starts
const URL = "";

let model, webcam, labelContainer, maxPredictions;
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();


    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    let trigger = 0;
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        // console.log(classPrediction[1]);
        // console.log(classPrediction);
        // console.log(prediction[i].probability.toFixed(2));
        if (prediction[0].probability.toFixed(2) >= 0.90) {

        } else {
            if (prediction[1].probability.toFixed(2) >= 0.90) {
                document.getElementById('container1').innerHTML = `
                <div><p id="question" style="margin: 10px 10px; color: white; width:10px;font-size: 20px;">Question:${question}</p>
                </div>
                <div class="alert alert-danger alert-dismissible fade show" role="alert" id='alert' style="opacity:1;height:43px; margin:auto;">
                <strong>Warning:</strong> Only one hand is visible
              </div>`;
                setTimeout(() => {
                    document.getElementById('alert').style.opacity = 0;

                }, 5000)
                trigger = -1;
            }
            else if (prediction[2].probability.toFixed(2) >= 0.90) {
                document.getElementById('container1').innerHTML = `
                <div><p id="question" style="margin: 10px 10px; color: white; width:10px;font-size: 20px;">Question:${question}</p>
                </div>
                <div class="alert alert-danger alert-dismissible fade show" role="alert" id='alert' style="opacity:1;height:43px; margin:auto;">
                <strong>Warning:</strong> No hand is visible
              </div>`;
                setTimeout(() => {
                    document.getElementById('alert').style.opacity = 0;

                }, 5000)
                trigger = -1;
            }
            else if (prediction[3].probability.toFixed(2) >= 0.90) {
                document.getElementById('container1').innerHTML = `
                <div><p id="question" style="margin: 10px 10px; color: white; width:10px;font-size: 20px;">Question:${question}</p>
                </div>
                <div class="alert alert-danger alert-dismissible fade show" role="alert" id='alert' style="opacity:1;height:43px; margin:auto;">
                <strong>Warning:</strong> Face is not visible
              </div>`;
                setTimeout(() => {
                    document.getElementById('alert').style.opacity = 0;

                }, 5000)
                trigger = -1;
            }
            else if (prediction[4].probability.toFixed(2) >= 0.90) {
                document.getElementById('container1').innerHTML = `
                <div><p id="question" style="margin: 10px 10px; color: white; width:10px;font-size: 20px;">Question:${question}</p>
                </div>
                <div class="alert alert-danger alert-dismissible fade show" role="alert" id='alert' style="opacity:1;height:43px; margin:auto;">
                <strong>Warning:</strong> Two person visible
              </div>`;
                setTimeout(() => {
                    document.getElementById('alert').style.opacity = 0;

                }, 5000)
                trigger = -1;
            }

        }
    }

}
if (trigger == -1) {
    warningCount++;
    if (warningCount == 20) {
        alertCall();
        trigger = 0;
    }
    console.log(warningCount);
}

window.onload = () => {
    // initAudio();
    init();
    width();
}

getVal()
// ! Tab change code
document.addEventListener("visibilitychange", () => {
    let trigger = 0;
    if (document.visibilityState == "visible") {
        console.log("tab is active")
    } else {
        document.getElementById('container1').innerHTML = `
        <div><p id="question" style="margin: 10px 10px; color: white; width:10px; font-size: 20px;">Question:${question}</p>
        </div>
        <div class="alert alert-danger alert-dismissible fade show" role="alert" id='alert' style="opacity:1;height:43px; margin:auto;">
        <strong>Warning!</strong> Don't change your tab
      </div>`;
        trigger = -1;
        setTimeout(() => {
            document.getElementById('alert').style.opacity = 0;

        }, 5000)

    }
    if (trigger == -1) {
        warningCount++;
        if (warningCount == 20) {
            alertCall();
            trigger = 0;
        }
        console.log(warningCount);
    }
});

// ! tab change code ends

if (trigger == -1) {
    warningCount++;
    if (warningCount == 20) {
        alertCall();
        trigger = 0;
    }
    console.log(warningCount);
}
list = [];
async function getVal() {
    const response = await fetch('http://localhost:3000/api/question/get', {
        mode: 'cors',
        method: 'GET'
    })
    // console.log(await val.json())
    data = await response.json()
    list = data.data
}

// ! questions displaying
let question1 = parseInt(document.getElementById('question').innerText.slice(9, 11));
if (question1 === 1) {
    document.getElementById('prev').setAttribute('disabled', '');
}

let para = document.getElementById('para');
let radio1 = document.getElementById('radio1');
let radio2 = document.getElementById('radio2');
let radio3 = document.getElementById('radio3');
let radio4 = document.getElementById('radio4');

let box1 = document.getElementById('box1');
let box2 = document.getElementById('box2');
let time = document.getElementById('time');
let visited = 0;

const markAns = () => {
    console.log("hello")
    let val = localStorage.getItem(document.getElementById('para').innerText)
    if (val != null) {
        for (i = 1; i <= 4; i++) {
            if (val == document.getElementById(`el${i}`).value) {
                document.getElementById(`el${i}`).checked = true
            }
        }
    }
}

// ! Previous button configured 
document.getElementById('prev').addEventListener('click', () => {
    let question1 = parseInt(document.getElementById('question').innerText.slice(9, 11));
    if (question1 > 1) {
        question = question1 - 1;
        document.getElementById('question').innerText = `Question:${question}`
        para.innerText = list[question1 - 2].question;
        radio1.innerHTML = `<input type="radio" class="form-check-input" id="el1" name="optradio" value="${list[question1 - 2].opt1}">${list[question1 - 2].opt1}`;
        console.log(radio1);

        radio2.innerHTML = `<input type="radio" class="form-check-input" id="el2" name="optradio" value="${list[question1 - 2].opt2}">${list[question1 - 2].opt2}`;

        radio3.innerHTML = `<input type="radio" class="form-check-input"id="el3" name="optradio" value="${list[question1 - 2].opt3}">${list[question1 - 2].opt3}`;

        radio4.innerHTML = `<input type="radio" class="form-check-input" id="el4" name="optradio" value="${list[question1 - 2].opt4}">${list[question1 - 2].opt4}`;

        if (parseInt(question1) == 15) {
            document.getElementById('next').removeAttribute('disabled');
        }
    }
    if (question1 == 1) {
        document.getElementById('prev').setAttribute('disabled', '');
    }
    if (document.getElementById(question1).style.backgroundColor != 'green') {
        document.getElementById(question1).style.backgroundColor = 'red'
    }

    markAns()
})

// ! Next button configured
document.getElementById('next').addEventListener('click', () => {
    let question1 = parseInt(document.getElementById('question').innerText.slice(9, 11));
    document.getElementById('prev').removeAttribute('disabled');
    if (question1 < 15) {
        question = question1 + 1;
        document.getElementById('question').innerText = `Question:${question}`
        para.innerText = list[question1].question;
        radio1.innerHTML = `<input type="radio" class="form-check-input" id="el1" name="optradio" value="${list[question1 - 1].opt1}">${list[question1].opt1}`;
        console.log(radio1);

        radio2.innerHTML = `<input type="radio" class="form-check-input" id="el2" name="optradio" value="${list[question1].opt2}">${list[question1].opt2}`;

        radio3.innerHTML = `<input type="radio" class="form-check-input" id="el3" name="optradio" value="${list[question1].opt3}">${list[question1].opt3}`;

        radio4.innerHTML = `<input type="radio" class="form-check-input" id="el4" name="optradio" value="${list[question1].opt4}">${list[question1].opt4}`;
    }
    if (question1 >= 15) {
        document.getElementById('next').setAttribute('disabled', '');
    }
    if (document.getElementById(question1).style.backgroundColor != 'green') {
        document.getElementById(question1).style.backgroundColor = 'red'
    }
    if (parseInt(question1) + 1 === 15) {
        document.getElementById('save').innerText = 'Save and Submit';
        document.getElementById('next').setAttribute('disabled', '');
    }
    markAns()
})

// ! Save and next button configured
document.getElementById('save').addEventListener('click', () => {
    for (i = 1; i <= 4; i++) {
        if (document.getElementById(`el${i}`).checked) {
            // alert(document.getElementById(`el${i}`).value)
            let ques = document.getElementById('para').innerText;
            localStorage.setItem(ques, document.getElementById(`el${i}`).value)
        }
    }
    let question1 = document.getElementById('question').innerText.slice(9, 11);
    console.log(question1)
    document.getElementById(question1).style.backgroundColor = 'green'
    console.log(question1);
    if (parseInt(question1) == 1) {
        document.getElementById('prev').setAttribute('disabled', '');
    }
    if (parseInt(question1) >= 1) {
        document.getElementById('prev').removeAttribute('disabled');
    }
    let value = document.getElementById('question');
    if (question < 15) {
        para.innerText = list[question1].question;
        radio1.innerHTML = `<input type="radio" class="form-check-input" id="el1" name="optradio" value="${list[question1].opt1}">${list[question1].opt1}`;
        console.log(radio1);

        radio2.innerHTML = `<input type="radio" class="form-check-input" id="el2" name="optradio" value="${list[question1].opt2}">${list[question1].opt2}`;

        radio3.innerHTML = `<input type="radio" class="form-check-input" id="el3" name="optradio" value="${list[question1].opt3}">${list[question1].opt3}`;

        radio4.innerHTML = `<input type="radio" class="form-check-input" id="el4" name="optradio" value="${list[question1].opt4}">${list[question1].opt4}`;
        question = parseInt(question1) + 1;
    }

    value.innerText = `Question:${question}`;
    if (parseInt(question1) == 15) {
        trig()
        document.getElementById('save').innerText = 'Save and Submit';
        document.getElementById('next').setAttribute('disabled', '');
    }
    markAns()
    saved = saved + 1;
    console.log(document.getElementById('saved'))
    document.getElementById('saved').innerText = `Saved: ${saved}`
    document.getElementById('unsaved').innerText = `Unsaved: ${15 - saved}`
})

// ! Timer Code
const timeFunction = () => {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let date = new Date().getDate();

    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    let hour = new Date().getHours() + 2;

    var countDownDate = new Date(`${month} ${date}, ${year} ${hour}:${minutes}:${seconds}`);

    // Update the count down every 1 second
    var x = setInterval(function () {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("time").innerText = `Time: ${hours}:${minutes}:${seconds}`;

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            location.href = 'http://127.0.0.1:5500/End.html';
            document.body.innerHTML = `  <div class='jumbotron'><h2>Exam Over</h2></div>`;
        }
    }, 1000);
}

// ! time function call
timeFunction();

// ! Question no button config code
Array.from(document.getElementsByClassName('btn-get')).forEach((element) => {
    element.addEventListener('click', () => {
        visited++;
        question = element.innerText;
        document.getElementById("question").innerText = `Question:${question}`
        box1.innerText = `Visited:${visited}`;
        box2.innerText = `NotVisited:${list.length - visited}`;
        para.innerText = list[element.innerText - 1].question;

        radio1.innerHTML = `<input type="radio" class="form-check-input" id="el1"  name="optradio" value="${list[element.innerText - 1].opt1}">${list[element.innerText - 1].opt1}`;

        radio2.innerHTML = `<input type="radio" class="form-check-input" id="el2"  name="optradio" value="${list[element.innerText - 1].opt2}">${list[element.innerText - 1].opt2}`;

        radio3.innerHTML = `<input type="radio" class="form-check-input" id="el3"  name="optradio" value="${list[element.innerText - 1].opt3}">${list[element.innerText - 1].opt3}`;

        radio4.innerHTML = `<input type="radio" class="form-check-input" id="el4" name="optradio" value="${list[element.innerText - 1].opt4}">${list[element.innerText - 1].opt4}`;

        if (element.style.backgroundColor != 'green') {
            element.style.backgroundColor = 'rgb(183,0,0)';
        }
        let question1 = parseInt(document.getElementById('question').innerText.slice(9, 11));
        if (question1 > 1) {
            document.getElementById('prev').removeAttribute('disabled');
        }
        if (question1 === 15) {
            document.getElementById('save').innerText = 'Save and Submit';
            document.getElementById('next').setAttribute('disabled', '');
            markAns()
        }
        else {
            document.getElementById('save').innerText = 'Save and Continue';
        }
        if (question1 < 15) {
            document.getElementById('next').removeAttribute('disabled');
            markAns()
        }
        if (question1 === 1) {
            document.getElementById('prev').setAttribute('disabled', '');
        }

    })
})

// ! Don't resize your tab
window.addEventListener('resize', () => {
    if (window.screen.width != window.innerWidth) {
        document.getElementById('save').setAttribute('disabled', '');
        document.getElementById('change_buttons').innerHTML = '';
        let elements = document.getElementsByClassName('btn-get');
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.setAttribute('disabled', '');
        }
        warningCount++;
    }
    if (window.screen.width == window.innerWidth) {
        document.getElementById('save').removeAttribute('disabled');
        document.getElementById('change_buttons').innerHTML = `<button class="btn btn-warning" id="prev" style="margin: 5px 5px;" disabled>❮</button>
        <button class="btn btn-warning" id="next" style="margin: 5px 5px;">❯</button>`;
        let elements = document.getElementsByClassName('btn-get');
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.removeAttribute('disabled');
        }
    }
})

async function trig() {
    console.log("hello")
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        await fetch('http://localhost:3000/api/answer/add', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "question": key,
                "answer": value
            })
        })
    }
    localStorage.clear()
}



// ! disabling the keyboard
// document.onkeydown = function (e) {
//     e.preventDefault();
//     return false;
// }

// ! disabling the right click
document.addEventListener('contextmenu', event => event.preventDefault());
