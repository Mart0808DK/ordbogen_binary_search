window.addEventListener("load", main);

const endpoint = "http://localhost:8080/ordbogen";

function main(){
    document.querySelector("#search-dictionary").addEventListener("click", searchWord);
    
}

async function getMinMax() {
    const json = await fetch(endpoint).then((response) => response.json());
    return json
}

async function getEntryAt(index) {
    try {
        const response = await fetch(`${endpoint}/${index}`)
        const data = await response.json();
        return data
    } catch (error) {
        console.error("Error fetching data:", error)
        return {index: "Intet fundet"}
    }
}

async function searchWord() {
    const searchInput = document.querySelector("#search").value.toLowerCase();
    if (searchInput === "") {
        alert("Indtast et ord");
        return;
    }

    resetTimer();

    const startTime = performance.now();

    const result = await binarySearch(searchInput);
    const endTime = performance.now();
    const timeTaken = (endTime - startTime) /1000;
    document.querySelector("#time_for_backend").innerHTML = "total time taken: " + timeTaken.toFixed(2) + " seconds";

    
    if (result != -1) {
        displayDictonaryWord(result);
    } else {
        document.querySelector("#show_word").innerHTML = "Ordet blev ikke fundet"
        document.querySelector("#wrong_word").innerHTML = searchInput;
    }

    console.log(result);
    
    

}

async function binarySearch(searchWord) {
    let data = await getMinMax();
    let min = data.min;
    let max = data.max;
    let r = 0;

    while (min <= max) {
        let middle = Math.floor((min + max) / 2);
        let entry = await getEntryAt(middle);
        console.log(middle, entry);
        let comp = compare(searchWord, entry);
        switch (true) {
            case comp > 0:
                min = middle + 1;
                serverReqAndTime(r);
                break;
            case comp < 0:
                max = middle - 1;
                serverReqAndTime(r);
                break;
            case comp == 0:
                return entry;
            default:
                break;
        }
        r++;
    }
    return -1;
}

function displayDictonaryWord(entry) {
    const displayWords = document.querySelector("#show_word");
    displayWords.innerHTML = `<p><strong>Inflected:</strong> ${entry.inflected}</p>
        <p><strong>Headword:</strong> ${entry.headword}</p>
        <p><strong>Part of Speech:</strong> ${entry.partofspeech}</p>
        <p><strong>Homograph:</strong> ${entry.homograph}</p>
        <p><strong>ID:</strong> ${entry.id}</p>
    `;
}

function compare(a, b) {
    return a.localeCompare(b.inflected)
}

function serverReqAndTime(r) {
    document.querySelector("#server_req").innerHTML = "server request time: " + r + " seconds";

}

function resetTimer() {
    document.querySelector("#time_for_backend").innerHTML = "total time taken: ";	
    document.querySelector("#server_req").innerHTML = "server request time: ";

}

