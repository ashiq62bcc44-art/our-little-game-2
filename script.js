/* =====================================================
   YOUR FORMSPREE ENDPOINT
   ===================================================== */

const FORMSPREE_ENDPOINT = "https://formspree.io/f/moeqldol";


/* =====================================================
   SCREEN SYSTEM
   ===================================================== */

const screens = document.querySelectorAll(".screen");

function showScreen(id) {
    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const target = document.getElementById(id);

    if (target) {
        target.classList.add("active");
    }
}


/* =====================================================
   FLOATING BACKGROUND HEARTS
   ===================================================== */

const heartsBackground = document.querySelector(".hearts-bg");

for (let i = 0; i < 25; i++) {

    const heart = document.createElement("div");

    heart.className = "bg-heart";
    heart.textContent = Math.random() > 0.5 ? "♡" : "♥";

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (12 + Math.random() * 25) + "px";
    heart.style.animationDuration = (7 + Math.random() * 8) + "s";
    heart.style.animationDelay = Math.random() * 8 + "s";

    heartsBackground.appendChild(heart);
}


/* =====================================================
   WELCOME PAGE
   ===================================================== */

let welcomeTimer = setTimeout(() => {
    if (document.getElementById("welcome").classList.contains("active")) {
        showScreen("her-photo");
    }
}, 15000);

document.getElementById("welcome").addEventListener("click", () => {
    clearTimeout(welcomeTimer);
    showScreen("her-photo");
});


/* =====================================================
   HER PHOTO PAGE
   ===================================================== */

let herPhotoTimer = setTimeout(() => {
    if (document.getElementById("her-photo").classList.contains("active")) {
        showScreen("heart-game");
        startHeartGame();
    }
}, 10000);

document.getElementById("her-photo").addEventListener("click", () => {
    clearTimeout(herPhotoTimer);
    showScreen("heart-game");
    startHeartGame();
});


/* =====================================================
   HEART GAME
   ===================================================== */

let heartsCaught = 0;
let heartGameStarted = false;

function startHeartGame() {

    if (heartGameStarted) return;

    heartGameStarted = true;
    heartsCaught = 0;

    document.getElementById("heart-score").textContent = "0";

    const area = document.getElementById("heart-area");

    area.innerHTML = "";

    createGameHeart();
}


function createGameHeart() {

    const area = document.getElementById("heart-area");

    const heart = document.createElement("button");

    heart.className = "game-heart";
    heart.textContent = "❤️";

    const maxX = Math.max(20, area.clientWidth - 60);
    const maxY = Math.max(20, area.clientHeight - 60);

    heart.style.left = Math.random() * maxX + "px";
    heart.style.top = Math.random() * maxY + "px";

    heart.addEventListener("click", (event) => {

        event.stopPropagation();

        heartsCaught++;

        document.getElementById("heart-score").textContent =
            heartsCaught;

        heart.remove();

        if (heartsCaught >= 5) {

            heartGameStarted = false;

            setTimeout(() => {
                showScreen("quiz");
            }, 500);

        } else {
            createGameHeart();
        }
    });

    area.appendChild(heart);
}


/* =====================================================
   QUIZ
   ===================================================== */

const quizOptions = document.querySelectorAll(".quiz-option");

quizOptions.forEach(option => {

    option.addEventListener("click", (event) => {

        event.stopPropagation();

        const correct = option.dataset.correct === "true";

        if (correct) {

            document.getElementById("correct-popup")
                .classList.add("show");

        } else {

            option.textContent = "Nope 😭 Try again!";
            option.style.background = "#ffdce7";

            setTimeout(() => {

                option.textContent =
                    option.dataset.original || option.textContent;

            }, 1000);
        }
    });

    option.dataset.original = option.textContent;
});


document.getElementById("popup-next").addEventListener("click", () => {

    document.getElementById("correct-popup")
        .classList.remove("show");

    showScreen("envelope");

});


/* =====================================================
   ENVELOPE
   ===================================================== */

let envelopeOpened = false;
let envelopeTimer = null;

document.getElementById("envelope-btn").addEventListener("click", () => {

    if (envelopeOpened) return;

    envelopeOpened = true;

    const envelope =
        document.querySelector(".envelope");

    envelope.classList.add("open");

    document.getElementById("envelope-hint").style.display = "none";

    setTimeout(() => {

        document.getElementById("love-letter")
            .classList.add("show");

    }, 500);


    envelopeTimer = setTimeout(() => {

        showScreen("question-one");

    }, 15000);

});


/* =====================================================
   SEND ANSWER TO EMAIL
   ===================================================== */

async function sendAnswer(question, answer, statusElement, button) {

    if (!answer.trim()) {

        statusElement.textContent =
            "Jaan, you have to answer this one first 😭❤️";

        return false;
    }


    button.disabled = true;

    statusElement.textContent =
        "Sending your answer to Ashiq... 💌";


    const formData = new FormData();

    formData.append("question", question);
    formData.append("answer", answer);
    formData.append("_subject", "💌 New answer from your jaan");
    formData.append("source", "Ashiq's love game");


    try {

        const response = await fetch(
            FORMSPREE_ENDPOINT,
            {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            }
        );


        if (response.ok) {

            statusElement.textContent =
                "Answer received safely 💌❤️";

            return true;

        } else {

            statusElement.textContent =
                "Something went wrong 😭 Please try again.";

            button.disabled = false;

            return false;
        }


    } catch (error) {

        console.error(error);

        statusElement.textContent =
            "Internet problem 😭 Please try again.";

        button.disabled = false;

        return false;
    }
}


/* =====================================================
   QUESTION ONE
   ===================================================== */

document.getElementById("answer-one-btn")
    .addEventListener("click", async () => {

        const answer =
            document.getElementById("answer-one").value;

        const status =
            document.getElementById("sending-one");

        const button =
            document.getElementById("answer-one-btn");


        const sent = await sendAnswer(

            "What did you see in me that made you fall in love with me?",

            answer,

            status,

            button
        );


        if (sent) {

            setTimeout(() => {

                showScreen("our-photos");

            }, 1200);

        }

    });


/* =====================================================
   OUR PHOTO PAGE
   ===================================================== */

let couplePhotoTimer = setTimeout(() => {

    if (
        document
            .getElementById("our-photos")
            .classList
            .contains("active")
    ) {
        showScreen("question-two");
    }

}, 10000);


document.getElementById("our-photos")
    .addEventListener("click", () => {

        clearTimeout(couplePhotoTimer);

        showScreen("question-two");

    });


/* =====================================================
   QUESTION TWO
   ===================================================== */

document.getElementById("answer-two-btn")
    .addEventListener("click", async () => {

        const answer =
            document.getElementById("answer-two").value;

        const status =
            document.getElementById("sending-two");

        const button =
            document.getElementById("answer-two-btn");


        const sent = await sendAnswer(

            "What do you think Ashiq loves the most about you?",

            answer,

            status,

            button
        );


        if (sent) {

            setTimeout(() => {

                showScreen("puzzle");
                startMemoryGame();

            }, 1200);

        }

    });


/* =====================================================
   MEMORY MATCHING GAME
   ===================================================== */

const symbols = [
    "❤️",
    "💌",
    "😘",
    "🥰",
    "💍",
    "🌹"
];

let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryStarted = false;


function startMemoryGame() {

    if (memoryStarted) return;

    memoryStarted = true;

    matchedPairs = 0;
    flippedCards = [];

    const board =
        document.getElementById("memory-board");

    board.innerHTML = "";

    const cards = [...symbols, ...symbols];

    cards.sort(() => Math.random() - 0.5);

    cards.forEach((symbol, index) => {

        const card =
            document.createElement("button");

        card.className = "memory-card";

        card.dataset.symbol = symbol;
        card.dataset.index = index;

        card.textContent = symbol;

        card.addEventListener("click", () => {

            flipMemoryCard(card);

        });

        board.appendChild(card);

    });
}


function flipMemoryCard(card) {

    if (
        flippedCards.length >= 2 ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }


    card.classList.add("flipped");

    flippedCards.push(card);


    if (flippedCards.length === 2) {

        const first = flippedCards[0];
        const second = flippedCards[1];


        if (
            first.dataset.symbol ===
            second.dataset.symbol
        ) {

            first.classList.add("matched");
            second.classList.add("matched");

            matchedPairs++;

            flippedCards = [];


            if (matchedPairs === symbols.length) {

                document.getElementById("memory-status")
                    .textContent =
                    "You did it jaan! ❤️";

                setTimeout(() => {

                    showScreen("final");

                }, 1200);

            }

        } else {

            setTimeout(() => {

                first.classList.remove("flipped");
                second.classList.remove("flipped");

                flippedCards = [];

            }, 700);

        }
    }
}
