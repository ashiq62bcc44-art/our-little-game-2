
/* =====================================================
   ROMANTIC GIRLFRIEND GAME
===================================================== */


/* =====================================================
   SCREEN MANAGEMENT
===================================================== */

const screens = document.querySelectorAll(".screen");

function showScreen(id) {

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");
}


/* =====================================================
   FLOATING HEARTS
===================================================== */

const heartBackground =
    document.getElementById("heart-background");

function createFloatingHeart() {

    const heart = document.createElement("div");

    heart.className = "floating-heart";

    heart.innerHTML =
        Math.random() > 0.5 ? "❤️" : "💗";

    heart.style.left =
        Math.random() * 100 + "%";

    heart.style.fontSize =
        (15 + Math.random() * 25) + "px";

    heart.style.animationDuration =
        (6 + Math.random() * 7) + "s";

    heartBackground.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 14000);
}

setInterval(createFloatingHeart, 600);


/* =====================================================
   AUTO-PROGRESS PAGES
===================================================== */

let welcomeTimer;
let photoTimer;


/* PAGE 1
   Automatically moves after 15 seconds
*/

welcomeTimer = setTimeout(() => {

    if (
        document.getElementById("welcome")
            .classList.contains("active")
    ) {

        showScreen("her-photo");

        startPhotoTimer();
    }

}, 15000);


/* Clicking anywhere on welcome page */

document
    .getElementById("welcome")
    .addEventListener("click", () => {

        clearTimeout(welcomeTimer);

        showScreen("her-photo");

        startPhotoTimer();

    });


/* PAGE 2
   Automatically moves after 10 seconds
*/

function startPhotoTimer() {

    clearTimeout(photoTimer);

    photoTimer = setTimeout(() => {

        if (
            document.getElementById("her-photo")
                .classList.contains("active")
        ) {

            showScreen("heart-game");

            startHeartGame();
        }

    }, 10000);

}


/* Clicking anywhere on photo page */

document
    .getElementById("her-photo")
    .addEventListener("click", () => {

        clearTimeout(photoTimer);

        showScreen("heart-game");

        startHeartGame();

    });


/* =====================================================
   HEART CATCHING GAME
===================================================== */

let heartsCaught = 0;
let heartGameStarted = false;

function startHeartGame() {

    if (heartGameStarted) return;

    heartGameStarted = true;

    heartsCaught = 0;

    document.getElementById("heart-count").textContent =
        heartsCaught;

    spawnHeart();
}


function spawnHeart() {

    const arena =
        document.getElementById("heart-arena");

    arena.innerHTML = "";

    const heart =
        document.createElement("div");

    heart.className = "catch-heart";

    heart.innerHTML =
        ["❤️", "💗", "💖", "💕"][Math.floor(Math.random() * 4)];

    const maxX =
        arena.clientWidth - 55;

    const maxY =
        arena.clientHeight - 55;

    heart.style.left =
        Math.random() * maxX + "px";

    heart.style.top =
        Math.random() * maxY + "px";


    heart.addEventListener("click", () => {

        heartsCaught++;

        document.getElementById("heart-count")
            .textContent = heartsCaught;

        heart.remove();


        if (heartsCaught >= 5) {

            setTimeout(() => {

                showScreen("quiz");

            }, 500);

        } else {

            setTimeout(spawnHeart, 250);

        }

    });


    arena.appendChild(heart);
}


/* =====================================================
   QUIZ
===================================================== */

const quizOptions =
    document.querySelectorAll(".quiz-option");

quizOptions.forEach(option => {

    option.addEventListener("click", () => {

        const correct =
            option.dataset.correct === "true";

        if (correct) {

            option.classList.add("correct");

            document.getElementById("quiz-feedback")
                .textContent =
                "YAYYYYY! You actually remember 😭❤️";

            setTimeout(() => {

                document.getElementById("popup")
                    .classList.add("show");

            }, 700);

        } else {

            option.classList.add("wrong");

            document.getElementById("quiz-feedback")
                .textContent =
                "Nopeee 😭 Try again jaan 👀";

        }

    });

});


/* =====================================================
   QUIZ POPUP
===================================================== */

function closePopup() {

    document.getElementById("popup")
        .classList.remove("show");

    showScreen("envelope");

}


/* =====================================================
   ENVELOPE
===================================================== */

const envelope =
    document.getElementById("envelope-button");

let envelopeOpened = false;

envelope.addEventListener("click", () => {

    if (envelopeOpened) return;

    envelopeOpened = true;

    document.getElementById("love-letter")
        .classList.add("show");

    /*
       After 15 seconds, move to question.
    */

    setTimeout(() => {

        showScreen("question-one");

    }, 15000);

});


/* =====================================================
   ANSWER ONE
===================================================== */

document
    .getElementById("answer-one-button")
    .addEventListener("click", async () => {

        const answer =
            document.getElementById("answer-one")
                .value.trim();

        if (!answer) {

            alert(
                "Jaan, you have to answer this one ❤️"
            );

            return;
        }


        /*
          Save locally as backup.
        */

        localStorage.setItem(
            "girlfriend_answer_1",
            answer
        );


        /*
          If you later connect Formspree,
          this function can send the answer
          to you.
        */

        await submitAnswer(
            "What did you see in me that made you fall in love with me?",
            answer
        );


        showScreen("our-photos");

        startOurPhotoTimer();

    });


/* =====================================================
   OUR PHOTO PAGE
===================================================== */

let ourPhotoTimer;

function startOurPhotoTimer() {

    clearTimeout(ourPhotoTimer);

    ourPhotoTimer = setTimeout(() => {

        if (
            document.getElementById("our-photos")
                .classList.contains("active")
        ) {

            showScreen("question-two");

        }

    }, 10000);

}


document
    .getElementById("our-photos")
    .addEventListener("click", () => {

        clearTimeout(ourPhotoTimer);

        showScreen("question-two");

    });


/* =====================================================
   ANSWER TWO
===================================================== */

document
    .getElementById("answer-two-button")
    .addEventListener("click", async () => {

        const answer =
            document.getElementById("answer-two")
                .value.trim();

        if (!answer) {

            alert(
                "You have to drop a guess first 👀❤️"
            );

            return;

        }


        localStorage.setItem(
            "girlfriend_answer_2",
            answer
        );


        await submitAnswer(
            "What do you think Ashiq loves the most about you?",
            answer
        );


        showScreen("puzzle");

        startMemoryGame();

    });


/* =====================================================
   FORM SUBMISSION
===================================================== */

/*
   IMPORTANT:

   Replace this with your Formspree endpoint
   once you create your form.

   Example:

   const FORMSPREE_ENDPOINT =
       "https://formspree.io/f/XXXXXXXX";
*/

const FORMSPREE_ENDPOINT = "";


async function submitAnswer(question, answer) {

    if (!FORMSPREE_ENDPOINT) {

        console.log(
            "Answer saved locally:",
            question,
            answer
        );

        return;

    }


    try {

        await fetch(
            FORMSPREE_ENDPOINT,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Accept":
                        "application/json"
                },

                body: JSON.stringify({

                    question: question,

                    answer: answer

                })

            }
        );

    } catch (error) {

        console.log(
            "Could not submit answer.",
            error
        );

    }

}


/* =====================================================
   MEMORY MATCHING GAME
===================================================== */

const puzzleSymbols = [

    "❤️",
    "❤️",

    "💌",
    "💌",

    "😘",
    "😘",

    "🥰",
    "🥰",

    "💍",
    "💍",

    "🌹",
    "🌹"

];


let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;


function shuffle(array) {

    return array.sort(
        () => Math.random() - 0.5
    );

}


function startMemoryGame() {

    const board =
        document.getElementById("memory-board");

    board.innerHTML = "";

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    matchedPairs = 0;


    const shuffled =
        shuffle([...puzzleSymbols]);


    shuffled.forEach(symbol => {

        const card =
            document.createElement("div");

        card.className =
            "memory-card";

        card.dataset.symbol =
            symbol;

        card.innerHTML =
            "❓";


        card.addEventListener(
            "click",
            () => flipCard(card)
        );


        board.appendChild(card);

    });

}


function flipCard(card) {

    if (lockBoard) return;

    if (card.classList.contains("matched")) return;

    if (card === firstCard) return;


    card.classList.add("flipped");

    card.innerHTML =
        card.dataset.symbol;


    if (!firstCard) {

        firstCard = card;

        return;

    }


    secondCard = card;

    checkMatch();

}


function checkMatch() {

    const isMatch =
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol;


    if (isMatch) {

        firstCard.classList.add("matched");

        secondCard.classList.add("matched");

        matchedPairs++;

        resetCards();


        if (matchedPairs ===
            puzzleSymbols.length / 2) {

            document.getElementById(
                "puzzle-message"
            ).textContent =
                "YOU DID ITTTT 🥳❤️";


            setTimeout(() => {

                showScreen("final");

                createFinalHearts();

            }, 1500);

        }

    } else {

        lockBoard = true;

        setTimeout(() => {

            firstCard.classList.remove(
                "flipped"
            );

            secondCard.classList.remove(
                "flipped"
            );

            firstCard.innerHTML = "❓";

            secondCard.innerHTML = "❓";

            resetCards();

        }, 900);

    }

}


function resetCards() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


/* =====================================================
   FINAL SCREEN
===================================================== */

function createFinalHearts() {

    for (let i = 0; i < 20; i++) {

        setTimeout(() => {

            createFloatingHeart();

        }, i * 150);

    }

}


function showFinalLove() {

    alert(
        "I LOVE YOU TOO JAAN ❤️💍"
    );

}
