const QUESTION_CONTAINER = $('#questionContainer');
const QUESTION_1_URL = 'soal/bab-1-berlatih-1.json';
const QUESTION_2_URL = 'soal/bab-1-berlatih-2.json';

let questions = [];
let currentQuestion = {};

let currentIdx = 0;
let version = 1;

generateQuestion(QUESTION_1_URL);

$(document).on('click', '#btn-jawaban', function() {
    const answer = $('#jawaban').val();
    if (currentQuestion.answer == answer) {
        nextQuestion();
    } else {
        alert('Salah!');
    }
});

function generateQuestion(URL) {
    fetch(`${BASE_URL}/${URL}`)
        .then(res => res.json())
        .then(questionGenerated)
}

function nextQuestion() {
    if (questions.length > currentQuestion.id) {
        currentQuestion = questions[++currentIdx];
        generateTemplateQuestion();
    } else if(version == 1) {
        version++;
        generateQuestion(QUESTION_2_URL);
    } else {
        const template = `
        <div class="alert alert-success" role="alert">
            <p class="h5">Selamat!</p>
            <p class="mb-0">Kamu menjawab boleh melanjutkan!</p>
        </div>`;
        QUESTION_CONTAINER.html(template);
    }
}

function questionGenerated(data) {
    console.log(data);
    questions = data;
    currentIdx = 0;
    currentQuestion = questions[currentIdx];
    if (version == 1) {
        generateTemplateQuestion()
    } else if (version == 2) {
        generateTemplateQuestion()
    }
}

function generateTemplateQuestion() {
    console.log(currentQuestion);
    let template = `<p>Ukurlah besar sudut di bawah ini menggunakan busur derajat dengan tepat!</p>`;
    if (version == 2) {
        template = `<p>Jiplak dan guntinglah gambar sudut berikut pada selembar kertas! Kemudian ukurlah sudut-sudut di bawah ini dengan sudut satuan berikut!</p>`
    }
    template += `
    <div class="row g-3 align-items-center">
        <div class="col-auto">
            <label for="jawaban" class="col-form-label">Jawab</label>
        </div>
        <div class="col-auto">
            <input type="text" id="jawaban" class="form-control" placeholder="Masukkan jawaban">
        </div>
        <div class="col-auto">
            <button class="btn btn-primary" id="btn-jawaban">Periksa</button>
        </div>
    </div>`
    template += `<img src="../../asset/img/materi/${currentQuestion.image}" alt="Gambar" class="w-50 mx-auto d-block my-3">`
    QUESTION_CONTAINER.html(template)
}