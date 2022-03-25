// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    query,
    where,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseApp = initializeApp({
    apiKey: "AIzaSyBTN15zYQGD3kZl6qF0y_C7ak1bc_KFN_0",
    authDomain: "ride-finder-62fd6.firebaseapp.com",
    projectId: "ride-finder-62fd6",
    storageBucket: "ride-finder-62fd6.appspot.com",
    messagingSenderId: "322245180630",
    appId: "1:322245180630:web:21f1966cd3c7dfaf965d77"
});

// Initialize Firebase
const db = getFirestore(firebaseApp);

// Read data from reviews-collection
const q = collection(db, "reviews");
const unsubscribe = onSnapshot(q, (querySnapshot) => {
    let cumulativeRating = 0;
    let ratingCount = 0;
    let averageRating = 0;
    let stars = "";
    querySnapshot.forEach((doc) => {
        cumulativeRating += doc.data().stars;
        ratingCount++;
    });
    averageRating = cumulativeRating / ratingCount;
    if (averageRating.toFixed() == 1) {
        stars = stars
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-muted mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-muted mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-muted mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-muted mx-1' style='font-size:64px;'></i>"
            + "<br>" + averageRating.toFixed() + " / 5 keskiarvo";
    }
    if (averageRating.toFixed() == 2) {
        stars = stars
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-muted mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-muted mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-muted mx-1' style='font-size:64px;'></i>"
            + "<br>" + averageRating.toFixed() + " / 5 keskiarvo";
    }
    if (averageRating.toFixed() == 3) {
        stars = stars
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-muted mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-muted mx-1' style='font-size:64px;'></i>"
            + "<br>" + averageRating.toFixed() + " / 5 keskiarvo";
    }
    if (averageRating.toFixed() == 4) {
        stars = stars
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-muted mx-1' style='font-size:64px;'></i>"
            + "<br>" + averageRating.toFixed() + " / 5 keskiarvo";
    }
    if (averageRating.toFixed() == 5) {
        stars = stars
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<i class='bi bi-star-fill text-primary mx-1' style='font-size:64px;'></i>"
            + "<br>" + averageRating.toFixed() + " / 5 keskiarvo";
    }
    document.getElementById("review-text").innerHTML = stars;
});

// EventListener for submit-button
let submitButtonElement = document.getElementById("submit");
submitButtonElement.addEventListener("click", addRating);

// Funktio, jota EventListener kutsuu
function addRating() {
    let rating = document.getElementById("rating").value;
    let ratingInt = parseInt(rating);
    try {
        const docRef = addDoc(collection(db, "reviews"), {
            stars: ratingInt,
            timestamp: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
        document.getElementById("review-form").innerHTML = "<h2 class='text-center fw-bold mb-3'>Arvostelusi</h2>"
        + "<p class='text-center lead mb-4'>Kiitos arvostelustasi!</p>";
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}