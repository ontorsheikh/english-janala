// synonyms array
const createElements = (arr) =>{
    const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
    return htmlElements.join(" ");
};

// voice systems

function pronounceWord(word) {
  if (!("speechSynthesis" in window)) {
    alert("Sorry, your browser does not support Text-to-Speech!");
    return;
  }

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices.find(v => v.lang.startsWith("en")) || voices[0];
    }

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  // কিছু মোবাইলে voices load হতে দেরি হয়
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = () => speak();
  } else {
    speak();
  }
}


// spinner managing

const manageSpinner =(status)=>{
    if(status==true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden")
        }

        else{
            document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden")
        }
};




const loadLessons=()=>{
    fetch("https://openapi.programming-hero.com/api/levels/all") /*promise of response*/

  .then((res)=> res.json()) /*promise for json data*/
  .then((json) => displayLesson(json.data))
};
// active class removing function from all by using query selector
const removeActive=()=>{
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach((btn)=> btn.classList.remove("active"));

};

const loadLevelWord = (id) => {

    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((res)=> res.json())
    .then((data)=>{
       
        removeActive();    /*remove all active class*/
    
    const clickBtn = document.getElementById(`lesson-btn-${id}`);

        // class add.....
        clickBtn.classList.add("active"); 
        displayLevelWord(data.data);
    });
};

// "data": {
// "word": "Wholesome",
// "meaning": "পুষ্টিকর / স্বাস্থ্যকর",
// "pronunciation": "হোউলসাম",
// "level": 5,
// "sentence": "A wholesome diet keeps the body strong.",
// "points": 4,
// "partsOfSpeech": "adjective",
// "synonyms": [3 items],
// "id": 23
// }




// .then fetch er poriborte async await dia function

const loadwordDetail = async(id)=>{
    const url =`https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
};
const displayWordDetails =(word)=>{
    console.log(word);
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML=`
    
    
    <div class="">
            <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
        </div>

        <div class="">
            <h2 class="font-bold" >Meaning</h2>
            <p>${word.meaning}</p>
        </div>

        

        <div class="">
            <h2 class="font-bold" >Example</h2>
            <p>${word.sentence}</p>
        </div>

        <div class="">
            <h2 class="font-bold" >Synonym</h2>
            <div class ="">${createElements(word.synonyms)}</div>
        </div>

        
    
    `;
    document.getElementById("my_modal_5").showModal();

};

const displayLevelWord = (words)=>{
const wordContainer=document.getElementById("word-container");
wordContainer.innerHTML = "";

if (words.length == 0) {
wordContainer.innerHTML = `
  <div class="text-center col-span-full rounded-xl py-10 space-y-6 font-bangla" >

    <img src="./assets/alert-error.png" class="mx-auto">
            <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-3xl">Next Lesson এ যান </h2>
            
        </div>`;

        manageSpinner(false);
        return;
}

// "id": 4,
// "level": 5,
// "word": "Diligent",
// "meaning": "পরিশ্রমী",
// "pronunciation": "ডিলিজেন্ট"

words.forEach((word) =>{
    console.log(word);
    const card = document.createElement("div");
    card.innerHTML=`
    <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4"> 
            <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-semibold break-words">Meaning/Pronunciation</p>
            <div class="text-2xl font-medium font-bangla">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি" } / ${word.pronunciation ? word.pronunciation : "উচ্চারন পাওয়া যায়নি"}</div>
            <div class="flex justify-between items-center">
                <button onclick="loadwordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `;
    wordContainer.append(card);

});

manageSpinner(false);
};

const displayLesson = (lessons) => {
    // 1. get the container & empty
    const levelContainer=document.getElementById("level-container");
    levelContainer.innerHTML = ""

    // 2. get into every lessons
    for (let lesson of lessons){
        console.log(lesson)
    // 3. create Element
    

    const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
        `;
    
    // 4. append into container
    levelContainer.append(btnDiv)
    }
};
loadLessons()

// search voccabulary
document.getElementById("btn-search").addEventListener("click",()=>{
    removeActive();
const input = document.getElementById("input-search");
const searchValue =input.value.trim().toLowerCase();
console.log(searchValue);

fetch("https://openapi.programming-hero.com/api/words/all")
.then((res)=> res.json())
.then((data)=>{
    const allwords =data.data;
    console.log(allwords);
    const filterwords =allwords.filter(word=>word.word.toLowerCase().includes(searchValue));
    displayLevelWord(filterwords);
} );


});