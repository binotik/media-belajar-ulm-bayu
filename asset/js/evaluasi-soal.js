const myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
const BUTTON_READY = $('#btn-ready');
const BUTTON_FINISH = $('#btn-finish-evaluation');
const INPUT_NAMA = $('#nama');
const INPUT_KELAS = $('#kelas');
const INPUT_SEKOLAH = $('#sekolah');

firebase.initializeApp(FIREBASE_CONFIG);
const DB = firebase.firestore();
const DB_NILAI = DB.collection('nilai');

myModal.show()

let nama;
let sekolah;
let kelas;

BUTTON_READY.click(function() {
    if (isAllAvailable()) {
        nama = INPUT_NAMA.val();
        sekolah = INPUT_SEKOLAH.val();
        kelas = INPUT_KELAS.val();
        myModal.hide();
    } else {
        alert('Jangan ada yang kosong!');
    }
})

BUTTON_FINISH.on('click', () => generateEvaluationResult());

function isAllAvailable() {
    return isAvailable(INPUT_NAMA) && isAvailable(INPUT_KELAS) && isAvailable(INPUT_SEKOLAH);
}

function isAvailable(input) {
    return input.val() != '' && input.val() != undefined && input.val() != null;
}

function storeData() {
    const data = {
        nama,
        kelas,
        sekolah,
        nilai: score,
        tanggal: new Date()
    }
    DB_NILAI.add(data)
        .then((docRef) => {
            alert('Nilai Tersimpan')
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            alert("Error: ", error);
        });
}

function generateEvaluationResult() {
    accumulateScore();
    const template = `
    <div class="alert alert-success" role="alert">
        <p class="h5">Hai, ${nama} skor kamu: <strong>${score}</strong></p>
        <p class="mb-0">Kamu menjawab ${questionCorrect.length} dari ${questionSum} pertanyaan dengan benar!</p>
    </div>`;
    $('.card-body.overflow-scroll.p-4').html(template);
    storeData();
}