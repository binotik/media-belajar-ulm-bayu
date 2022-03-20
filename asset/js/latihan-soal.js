const QUESTION_CONTAINER = $('#questionContainer');
const QUESTION_LIST_CONTAINER = $('#questionList');
const QUESTION_ANSWERED_CONTAINER = $('#questionAnswered');
const QUESTION_CURRENT_CONTAINER = $('#questionCurrent');
const QUESTION_EVALUATED_BUTTON = $('#btn-finish');

let score = 0;
let questions = [];
let questionSum = 0;
let questionActive = {};
let questionAnswered = [];
let questionCorrect = [];

fetch(`${BASE_URL}/${QUESTION_URL}`)
    .then(res => res.json())
    .then(questionGenerated)

$(document).on('click', '.btn-question', function() {
    const id = $(this).data('id');
    if (id == questionActive.id) return;
    
    questionActive = questions.find(question => question.id === id);
    if (jQuery.isEmptyObject(questionActive)) return;

    generateActiveQuestionContainer();
    QUESTION_CURRENT_CONTAINER.html(questionActive.id);
})

QUESTION_EVALUATED_BUTTON.on('click', () => generateResult());

$(document).on('change', '.form-check-input', function() {
    const answer = {
        question: questionActive.id,
        answer: $(this).data('opsi')
    };
    if (isAnswered()) {
        questionAnswered = questionAnswered.map(question => {
            if (question.question === questionActive.id) {
                return answer;
            }
            
            return question;
        });
    } else {
        questionAnswered.push(answer);
        $(`.btn-question[data-id=${questionActive.id}]`).removeClass('btn-outline-primary').addClass('btn-primary');
        QUESTION_ANSWERED_CONTAINER.html(`${questionAnswered.length}/${questionSum}`);
    }

    if (questionSum === questionAnswered.length) {
        if (typeof BUTTON_FINISH === 'undefined') {
            QUESTION_EVALUATED_BUTTON.removeClass('disabled');
        } else {
            BUTTON_FINISH.removeClass('disabled');
        }
    }
})


// FUNCTIONS
function questionGenerated(data) {
    questions = data;
    questionSum = questions.length;
    questionActive = questions[0];
    if (questionSum <= 0) return;

    generateQuestionListContainer();

    if (jQuery.isEmptyObject(questionActive)) return;
    generateActiveQuestionContainer();
}

function accumulateScore() {
    questionCorrect = [];
    questions.forEach(question => {
        const id = question.id;
        const answer = questionAnswered.find(quest => quest.question === id);
        if (answer.answer == question.jawaban) {
            questionCorrect.push(question);
        }
    });
    score = parseInt((questionCorrect.length / questionSum) * 100);
}

function isAnswered() {
    return questionAnswered.find(question => question.question === questionActive.id);
}

// TEMPLATES
function generateActiveQuestionContainer() {
    const availableAnswer = isAnswered();
    let template = `<p>${questionActive.pertanyaan}</p>`;
    if (questionActive.gambar) {
        template += `<img src="../../asset/img/soal/${questionActive.gambar}" alt="Gambar" class="mx-auto w-50 d-block my-3">`;
    }
    questionActive.opsi.forEach(option => {
        let isChecked = availableAnswer ? availableAnswer.answer == option.id : false;
        template += `<div class="form-check">
                        <input class="form-check-input" type="radio" data-opsi="${option.id}" data-soal="${questionActive.id}" name="opsi"
                            id="opsi-${option.id}" ${isChecked ? 'checked' : ''}>
                        <label class="form-check-label" for="opsi-${option.id}">
                            ${option.id.toUpperCase()}. ${option.nilai}
                        </label>
                    </div>`;
    })
    QUESTION_CONTAINER.html(template);
    QUESTION_ANSWERED_CONTAINER.html(`${questionAnswered.length}/${questionSum}`);
}

function generateResult() {
    accumulateScore();
    const template = `
    <div class="alert alert-success" role="alert">
        <p class="h5">Skor kamu: <strong>${score}</strong></p>
        <p class="mb-0">Kamu menjawab ${questionCorrect.length} dari ${questionSum} pertanyaan dengan benar!</p>
    </div>`;
    $('.card-body.overflow-scroll.p-4').html(template);
    $('.btn-next').removeClass('disabled');
}

function generateQuestionListContainer() {
    let template = ``
    questions.forEach(question => {
        template += `<div class="col-lg-3 pb-3">
                        <button class="btn btn-outline-primary w-100 btn-question" data-id="${question.id}">${question.id}</button>
                    </div>`;
    })
    QUESTION_LIST_CONTAINER.html(template);
}