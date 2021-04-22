var preguntas= new Array();
getExamen();
var questions = preguntas;
var currenQ = 0;
var score = 0;
var totalQuestion = questions.length;

var container = document.getElementById('examenContainer');
var pregunta = document.getElementById('question');
var opt1 = document.getElementById('opt1');
var opt2 = document.getElementById('opt2');
var opt3 = document.getElementById('opt3');
var opt4 = document.getElementById('opt4');
var nextButton = document.getElementById('nextbtn');
var homeButton = document.getElementById('homebtn');
var resultCont = document.getElementById('result');

const boton = document.createElement("button");
boton.innerHTML = "Permisos";
boton.style = "bottom:10px;right:10px;position:fixed;z-index:9999;border-radius:20px;order:none;outline:none;background:rgba(14, 44, 2, 0.7);color:white;"
document.body.appendChild(boton);

function loadQuestion(questionIndex) {
    var q = questions[questionIndex];
    pregunta.textContent = (questionIndex + 1) + '. ' + q.question;
    opt1.textContent = " " + q.option1;
    opt2.textContent = " " + q.option2;
    opt3.textContent = " " + q.option3;
    opt4.textContent = " " + q.option4;
};

function loadNextQuestion() {
    var selectedOption = document.querySelector('input[type=radio]:checked');
    if (!selectedOption) {
        Swal.fire(
            'No puedes continuar',
            'Selecciona una respuesta!!',
            'question'
          )
        return;
    }
    var answer = selectedOption.value;
    if (questions[currenQ].answer == answer) {
        score += 10;
    }
    selectedOption.checked = false;
    currenQ++;
    console.log(currenQ, totalQuestion);
    if (currenQ == totalQuestion - 1) {
        nextButton.textContent = 'Calificar';
    }

    if (currenQ == totalQuestion) {
        container.style.display = 'none';
        nextButton.style.display = 'none';
        homeButton.style.display = '';
        resultCont.style.display = '';
        resultCont.textContent = 'Resultado: ' + score;
        return;
    }
    loadQuestion(currenQ);
};

function getExamen() {
    $.ajax({
        async: false,
        url: '/examen/induccions',
        type: 'GET',
        dataType: 'json',
        success: function (quest) {
            preguntas = quest;
        }
    });
        return preguntas;
};

loadQuestion(currenQ);