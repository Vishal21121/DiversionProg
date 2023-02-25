let warningCount = 0;
let trigger = 0;
let question = 1;

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
            document.getElementById('container1').innerHTML = `
        <div><p id="question" style="margin: 10px 10px; color: white; width:10px;font-size: 20px;">Question:${question}</p>
        </div>
        <div class="alert alert-danger alert-dismissible fade show" role="alert" id='alert' style="opacity:1;height:43px; margin:auto;">
        <strong>Warning:</strong> Your face is not visible
      </div>`;
            setTimeout(() => {
                document.getElementById('alert').style.opacity = 0;

            }, 5000)
            trigger = -1;
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

// ! Audio model starts

// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// the link to your model provided by Teachable Machine export panel
const URL_Audio = "https://teachablemachine.withgoogle.com/models/VYSX1Z1Wk/";

async function createModel() {
    const checkpointURL = URL_Audio + "model.json"; // model topology
    const metadataURL = URL_Audio + "metadata.json"; // model metadata

    const recognizer = speechCommands.create(
        "BROWSER_FFT", // fourier transform type, not useful to change
        undefined, // speech commands vocabulary feature, not useful for your models
        checkpointURL,
        metadataURL);

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded();

    return recognizer;
}

async function initAudio() {
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels
    const labelContainer = document.getElementById("label-container");
    for (let i = 0; i < classLabels.length; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizer.listen(result => {
        let trigger = 0;
        const scores = result.scores; // probability of prediction for each class
        // render the probability scores per class
        for (let i = 0; i < classLabels.length; i++) {
            const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
            // console.log(classPrediction);
        }
        if (result.scores[1].toFixed(2) >= 0.70) {
            document.getElementById('container1').innerHTML = `
            <div><p id="question" style="margin: 10px 10px; color: white; width:10px;font-size: 20px;">Question:${question}</p>
            </div>
            <div class="alert alert-danger alert-dismissible fade show" role="alert" id='alert' style="opacity:1;height:43px; margin:auto;">
            <strong>Warning:</strong> You are talking to someone
          </div>`;
            setTimeout(() => {
                document.getElementById('alert').style.opacity = 0;

            }, 5000)
            trigger = -1;
        }
        if (result.scores[1].toFixed(2) >= 0.70) {
            document.getElementById('container1').innerHTML = `
            <div><p id="question" style="margin: 10px 10px; color: white; width:10px; font-size:20px">Question:${question}</p>
            </div>
            <div class="alert alert-danger alert-dismissible fade show" role="alert" id='alert' style="opacity:1;height:43px; margin:auto;">
            <strong>Warning:</strong> You are talking to someone
          </div>`;
            setTimeout(() => {
                document.getElementById('alert').style.opacity = 0;

            }, 5000)
            trigger = -1;
        }
        if (trigger == -1) {
            warningCount++;
            if (warningCount == 20) {
                alertCall();
                trigger = 0;
            }
            console.log(warningCount);
        }
    }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });

}

// window.onload = () => {
//     initAudio();
//     init();
//     width();
// }

getVal()
// ! Tab change code
// document.addEventListener("visibilitychange", () => {
//     let trigger = 0;
//     if (document.visibilityState == "visible") {
//         console.log("tab is active")
//     } else {
//         document.getElementById('container1').innerHTML = `
//         <div><p id="question" style="margin: 10px 10px; color: white; width:10px; font-size: 20px;">Question:${question}</p>
//         </div>
//         <div class="alert alert-danger alert-dismissible fade show" role="alert" id='alert' style="opacity:1;height:43px; margin:auto;">
//         <strong>Warning!</strong> Don't change your tab
//       </div>`;
//         trigger = -1;
//         setTimeout(() => {
//             document.getElementById('alert').style.opacity = 0;

//         }, 5000)

//     }
//     if (trigger == -1) {
//         warningCount++;
//         if (warningCount == 20) {
//             alertCall();
//             trigger = 0;
//         }
//         console.log(warningCount);
//     }
// });

// ! tab change code ends

window.onblur = () => {
    let trigger = 0;

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
list = [];
async function getVal(){
    const response = await fetch('http://localhost:3000/api/question/get',{
        mode:'cors',
        method:'GET'
    })
    // console.log(await val.json())
    data = await response.json()
    list = data.data
}

// ! questions displaying
// let list = [
//     { question: 'Which one of the following river flows between Vindhyan and Satpura ranges?', opt1: 'Narmada', opt2: 'Mahanadi', opt3: 'Son', opt4: 'Netravati' },

//     { question: ' The Central Rice Research Station is situated in?', opt1: 'Chennai', opt2: 'Cuttack', opt3: 'Bangalore', opt4: 'Quilon' },

//     { question: 'Who among the following wrote Sanskrit grammar?', opt1: ' Kalidasa', opt2: 'Charak', opt3: 'Panini', opt4: 'Aryabhatt' },

//     { question: 'Which among the following headstreams meets the Ganges in last?', opt1: 'Alaknanda', opt2: 'Pindar', opt3: 'Mandakini', opt4: 'Bhagirathi' },

//     { question: 'The metal whose salts are sensitive to light is?', opt1: ' Zinc', opt2: 'Silver', opt3: 'Copper', opt4: 'Aluminum' },

//     { question: 'Patanjali is well known for the compilation of –', opt1: 'Yoga Sutra', opt2: 'Panchatantra', opt3: 'Brahma Sutra', opt4: 'Ayurveda' },

//     { question: 'River Luni originates near Pushkar and drains into which one of the following?', opt1: 'Rann of Kachchh', opt2: 'Arabian Sea', opt3: 'Gulf of Cambay', opt4: 'Lake Sambhar' },

//     { question: 'Which one of the following rivers originates in Brahmagiri range of Western Ghats?', opt1: 'Pennar', opt2: 'Cauvery', opt3: 'Krishna', opt4: 'Tapti' },

//     { question: 'The country that has the highest in Barley Production?', opt1: 'China', opt2: 'India', opt3: 'Russia', opt4: 'France' },

//     { question: 'Tsunamis are not caused by', opt1: 'Hurricanes', opt2: 'Earthquakes', opt3: 'ndersea landslides', opt4: 'Volcanic eruptions' },

//     { question: 'Chambal river is a part of –', opt1: ' Sabarmati basin', opt2: 'Ganga basin', opt3: 'Narmada basin', opt4: 'Godavari basin' },

//     { question: 'D.D.T. was invented by?', opt1: 'Mosley', opt2: 'Rudolf', opt3: 'Karl Benz', opt4: 'Dalton' },

//     { question: 'Indus river originates in –', opt1: 'Kinnaur', opt2: 'Ladakh', opt3: 'Nepal', opt4: 'Tibet' },

//     { question: 'The hottest planet in the solar system?', opt1: 'Mercury', opt2: 'Venus', opt3: 'Mars', opt4: 'Jupiter' },

//     { question: 'Where was the electricity supply first introduced in India –', opt1: 'Mumbai', opt2: 'Dehradun', opt3: 'Darjeeling', opt4: 'Chennai' }
// ]

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

// ! Previous button configured 
document.getElementById('prev').addEventListener('click', () => {
    let question1 = parseInt(document.getElementById('question').innerText.slice(9, 11));
    if (question1 > 1) {
        question = question1 - 1;
        document.getElementById('question').innerText = `Question:${question}`
        para.innerText = list[question1 - 2].question;
        radio1.innerHTML = `<input type="radio" class="form-check-input" name="optradio" value="${list[question1 - 2].opt1}">${list[question1 - 2].opt1}`;
        console.log(radio1);

        radio2.innerHTML = `<input type="radio" class="form-check-input" name="optradio" value="${list[question1 - 2].opt2}">${list[question1 - 2].opt2}`;

        radio3.innerHTML = `<input type="radio" class="form-check-input" name="optradio" value="${list[question1 - 2].opt3}">${list[question1 - 2].opt3}`;

        radio4.innerHTML = `<input type="radio" class="form-check-input" name="optradio" value="${list[question1 - 2].opt4}">${list[question1 - 2].opt4}`;
    }
    if (question1 == 1) {
        document.getElementById('prev').setAttribute('disabled', '');
    }
})

// ! Next button configured
document.getElementById('next').addEventListener('click', () => {
    let question1 = parseInt(document.getElementById('question').innerText.slice(9, 11));
    document.getElementById('prev').removeAttribute('disabled');
    if (question1 < 15) {
        question = question1 + 1;
        document.getElementById('question').innerText = `Question:${question}`
        para.innerText = list[question1].question;
        radio1.innerHTML = `<input type="radio" class="form-check-input" name="optradio" value="${list[question1 - 1].opt1}">${list[question1].opt1}`;
        console.log(radio1);

        radio2.innerHTML = `<input type="radio" class="form-check-input" name="optradio" value="${list[question1].opt2}">${list[question1].opt2}`;

        radio3.innerHTML = `<input type="radio" class="form-check-input" name="optradio" value="${list[question1].opt3}">${list[question1].opt3}`;

        radio4.innerHTML = `<input type="radio" class="form-check-input" name="optradio" value="${list[question1].opt4}">${list[question1].opt4}`;
    }
    if (question1 >= 15) {
        document.getElementById('next').setAttribute('disabled', '');
    }
})

// ! Save and next button configured
document.getElementById('save').addEventListener('click', () => {
    let question1 = document.getElementById('question').innerText.slice(9, 11);
    console.log(question1);
    if (parseInt(question1) == 1) {
        document.getElementById('prev').setAttribute('disabled', '');
    }
    if (parseInt(question1) >= 1) {
        document.getElementById('prev').removeAttribute('disabled');
    }
    para.innerText = list[question1].question;
    radio1.innerHTML = `<input type="radio" class="form-check-input" name="optradio" value="${list[question1].opt1}">${list[question1].opt1}`;
    console.log(radio1);

    radio2.innerHTML = `<input type="radio" class="form-check-input" name="optradio" value="${list[question1].opt2}">${list[question1].opt2}`;

    radio3.innerHTML = `<input type="radio" class="form-check-input" name="optradio" value="${list[question1].opt3}">${list[question1].opt3}`;

    radio4.innerHTML = `<input type="radio" class="form-check-input" name="optradio" value="${list[question1].opt4}">${list[question1].opt4}`;
    let value = document.getElementById('question');
    question = parseInt(question1) + 1;
    value.innerText = `Question:${question}`;
    if (parseInt(question1) + 1 === 15) {
        document.getElementById('save').innerText = 'Save and Submit';
        document.getElementById('next').setAttribute('disabled', '');
    }

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

        radio1.innerHTML = `<input type="radio" class="form-check-input"  name="optradio" value="${list[element.innerText - 1].opt1}">${list[element.innerText - 1].opt1}`;

        radio2.innerHTML = `<input type="radio" class="form-check-input"  name="optradio" value="${list[element.innerText - 1].opt2}">${list[element.innerText - 1].opt2}`;

        radio3.innerHTML = `<input type="radio" class="form-check-input"  name="optradio" value="${list[element.innerText - 1].opt3}">${list[element.innerText - 1].opt3}`;

        radio4.innerHTML = `<input type="radio" class="form-check-input"  name="optradio" value="${list[element.innerText - 1].opt4}">${list[element.innerText - 1].opt4}`;

        element.style.backgroundColor = 'rgb(183,0,0)';
        let question1 = parseInt(document.getElementById('question').innerText.slice(9, 11));
        console.log(question1);
        if (question1 > 1) {
            document.getElementById('prev').removeAttribute('disabled');
        }
        if (question1 === 15) {
            document.getElementById('save').innerText = 'Save and Submit';
            document.getElementById('next').setAttribute('disabled', '');
        }
        else {
            document.getElementById('save').innerText = 'Save and Continue';
        }
        if (question1 < 15) {
            document.getElementById('next').removeAttribute('disabled');
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



// ! disabling the keyboard
// document.onkeydown = function (e) {
//     e.preventDefault();
//     return false;
// }

// ! disabling the right click
document.addEventListener('contextmenu', event => event.preventDefault());
 