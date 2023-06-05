$(document).ready(function () {

  const quiz = document.getElementById("quiz");
  const quiz_header = document.getElementById("quiz-header");
  const questionElement = document.getElementById("question");
  const a_text = document.getElementById("a_text");
  const b_text = document.getElementById("b_text");
  const c_text = document.getElementById("c_text");
  const d_text = document.getElementById("d_text");
  const submitButton = document.getElementById("submit");
  const answer_correct_incorrect = document.querySelector(".answer-correct-incorrect");
  const btn_logout = document.querySelector(".btn-logout");
  let starttime = document.getElementById("starttime");
  let timer = document.getElementById('time_left');
  let answerElements;
  let currentQuiz = 0;
  let score = 0;
  let quizData = [];
  let randomAnswerArray = [];
  let incorrectAnswersArray = [];
  let correctAnswer = [];
  let sortRandomArray = [];
  let date = new Date();
  let COUNT_START = 10 * 0.2 * 60; // tenths * seconds * hours
  let count = COUNT_START;
  let playing = false;

  $('.link-login-nav').addClass('hide-btn-sub');
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
    // function fetch api
  async function fetchApiQuize() {
    //show spinner
    $.LoadingOverlay('show');
    const response = await fetch("https://the-trivia-api.com/api/questions");
    const result = await response.json();
    quizData = result;
    console.log('quizData in fetch', quizData);
  }
  async function ExaminationFun() {
    await fetchApiQuize();
    $.LoadingOverlay('hide');

    let userFromLocalStorage = JSON.parse(localStorage.getItem('currentUser'));
    if (!userFromLocalStorage) {
      $('#submit').addClass('hide-btn-sub');
      $('.btn-logout').addClass('hide-btn-sub');
      $('.link-login-nav').removeClass('hide-btn-sub');
         return false
     }
    $('.text-link-logout').append(`<h5 class=" currentUser pt-4 px-5">[${userFromLocalStorage.username}]</h5>`);
    for (let i = 0; i < quizData.length; i++) {

      incorrectAnswersArray = quizData[i].incorrectAnswers;
      incorrectAnswersArray.push(quizData[i].correctAnswer);
    }

    function sortRandom(array) {
      let currentIndex = array.length, randomIndex;
      // While there remain elements to shuffle.
      while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
      return array;
    }

    let loadQuiz = () => {
      question.innerText = quizData[0].question;
      let currentQuizData = quizData[currentQuiz];
      questionElement.innerText = currentQuizData.question;
      sortRandomArray = sortRandom(currentQuizData.incorrectAnswers);
      $(".delete-all-answer").remove();
      for (let answer of sortRandomArray) {
        $(".answer-correct-incorrect")
          .append(`<input type="radio" name="answer" class="answer p-4 delete-all-answer" value="${answer}">`)
          .append(`<label  class="answer-text delete-all-answer">${answer}</label></div>`)
          .append(`<br class="delete-all-answer">`);
      }
      answerElements = document.querySelectorAll(".answer");
    }
    loadQuiz();
 
    let getSelected = () => {
      let answer;
      answerElements.forEach((answerElement) => {

        if (answerElement.checked) {

          answer = answerElement.value;
        }
        else {

        }
      });
      return answer;
    };
   
    // function repeat exam
    function reload_examAgain(){
      setTimeout(function () {
        history.go(0);
      }, 5000);
    }
    // timer
    let countdown = function countdown() {
      displayTime();
      if (count == 0 && currentQuiz < quizData.length) {
        playing = false;
        quiz.innerHTML = ` 
        <h2>Game Over</h2><button class="btn-see-scoe">
        Click Here To see your Scor</button>`;
      } else if (!playing) {
        setTimeout(countdown, 100);
        count--;
      } else {
        setTimeout(countdown, 100);
      }
      // function click button play again exam
      $('.btn-see-scoe').on('click', function () {
        quiz.innerHTML = `
      <h2>You answered ${score}/${quizData.length} questions correctly</h2>
      <button class="btn-play-exam">Play Again</button>`;

        let btn_play_exam = document.querySelector('.btn-play-exam');
        btn_play_exam.addEventListener('click', msg_wai)
        // function click button play again exam
        function msg_wai() {
          quiz.innerHTML = `<div class="row alert msg-wait-exam-box d-flex justify-content-center align-items-center" role="alert">
          <div class="col-12 msg-wait-exam"><p>You must wait 5 minutes to start the exam again! </p>
          <p> The duration of the exam is 10 minutes</p> </div>
        </div>`;
          reload_examAgain();
        }
      })
    }
    countdown();
    function displayTime() {

      let tenths = count;
      let sec = Math.floor(tenths / 10);
      let hours = Math.floor(sec / 3600);
      sec -= hours * (3600);
      let mins = Math.floor(sec / 60);
      sec -= mins * (60);

      if (hours < 1) {
        timer.innerHTML = " <p class='text-time'>Timer</p>&nbsp" + LeadingZero(mins) + ':' + LeadingZero(sec);
      }
      else {
        timer.innerHTML = "<p class='text-time'>Timer</p>&nbsp " + hours + ':' + LeadingZero(mins) + ':' + LeadingZero(sec);
      }
    }
    function LeadingZero(Time) {
      return (Time < 10) ? "0" + Time : + Time;
    }
    // function get date
    function getStartDateNow() {
      starttime.innerHTML = "<p class='text-time'>Starte Exam At </p> &nbsp" + date.getHours() + ":" + date.getMinutes()
    }
    getStartDateNow();
    submitButton.addEventListener("click", submitquiz)
    function submitquiz() {

      let answer = "";
      answer = getSelected();
      console.log('answer', answer)
      if (answer) {
        if (answer === quizData[currentQuiz].correctAnswer)
          score++;
        currentQuiz++;

        if (currentQuiz < quizData.length)
          loadQuiz();
        else {
          quiz.innerHTML = `
            <h2>You answered ${score}/${quizData.length} questions correctly</h2>
            <button class="btn-play-again">Play Again</button>
        `;
        }
      }
      // function click button play again exam , display msg wait exam and reload exam
      $('.btn-play-again').on('click', function () {
        quiz.innerHTML = `<div class="alert msg-wait-exam-box d-flex justify-content-center" role="alert">
           <h5 class="my-5 msg-wait-exam">You must wait 5 minutes to start the exam again! <br>
           &nbsp  &nbsp The duration of the exam is 10 minutes</h5>
          </div>`;
         reload_examAgain();
      })
    }
    // function logout
    btn_logout.addEventListener('click', LogOut_Fun)
    function LogOut_Fun() {
      window.location.replace('index.html');
    }
  }
  ExaminationFun();


});



