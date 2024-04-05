const n = 30;
const random_array = [];
const container = document.getElementById("container"); // Assuming there is an HTML element with id "container"
let sortAlgorithm = 'bubble'; // Default to bubble sort
init();
let audioCtx = null;

function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (
            AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime + dur
    );
    node.gain.value = 0.1;
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init() {
    for (let i = 0; i < n; i++) {
        random_array[i] = Math.random();
    }
    showBars();
}

function runSort(algorithm) {
    sortAlgorithm = algorithm;
    sortAndAnimate();
}

function sortAndAnimate() {
    const copy = [...random_array];
    let moves;
    switch (sortAlgorithm) {
        case 'bubble':
            moves = BubbleSort(copy);
            break;
        case 'selection':
            moves = SelectionSort(copy);
            break;
        case 'heap':
            moves = HeapSort(copy);
            break;
        case 'insertion':
            moves = InsertionSort(copy);
            break;
        default:
            console.error('Invalid sort algorithm:', sortAlgorithm);
            return;
    }
    animate(moves);
}

function animate(moves) {
    if (moves.length == 0) {
        showBars();
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;
    if (move.type == "swap") {
        [random_array[i], random_array[j]] = [random_array[j], random_array[i]];
    }
    playNote(200 + random_array[i] * 500); // Interpolation function
    playNote(200 + random_array[j] * 500);
    showBars(move);
    setTimeout(function () {
        animate(moves);
    }, 10);
}

function BubbleSort(random_array) {
    const moves = [];
    do {
        var swapped = false;
        for (let i = 0; i < random_array.length - 1; i++) {
            moves.push({
                indices: [i, i + 1],
                type: "comp"
            });
            if (random_array[i] > random_array[i + 1]) {
                swapped = true;
                moves.push({
                    indices: [i, i + 1],
                    type: "swap"
                });
                [random_array[i], random_array[i + 1]] = [random_array[i + 1], random_array[i]];
            }
        }
    } while (swapped);
    return moves;
}

function SelectionSort(random_array) {
    const moves = [];
    const n = random_array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            moves.push({
                indices: [minIndex, j],
                type: "comp"
            });
            if (random_array[j] < random_array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            moves.push({
                indices: [minIndex, i],
                type: "swap"
            });
            [random_array[minIndex], random_array[i]] = [random_array[i], random_array[minIndex]];
        }
    }
    return moves;
}

function HeapSort(random_array) {
    const moves = [];
    function heapify(arr, n, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest !== i) {
            moves.push({
                indices: [i, largest],
                type: "swap"
            });

            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            heapify(arr, n, largest);
        }
    }

    const n = random_array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(random_array, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        moves.push({
            indices: [0, i],
            type: "swap"
        });
        [random_array[0], random_array[i]] = [random_array[i], random_array[0]];
        heapify(random_array, i, 0);
    }

    return moves;
}

function InsertionSort(random_array) {
    const moves = [];
    for (let i = 1; i < random_array.length; i++) {
        let key = random_array[i];
        let j = i - 1;
        while (j >= 0 && random_array[j] > key) {
            random_array[j + 1] = random_array[j];
            moves.push({
                indices: [j, j + 1],
                type: "swap"
            });
            j--;
        }
        random_array[j + 1] = key;
    }
    return moves;
}

function showBars(move) {
    container.innerHTML = ""; // To remove the previous array after sorting
    for (let i = 0; i < random_array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = random_array[i] * 100 + "%";
        bar.classList.add("bar");
        if (move && move.indices.includes(i)) {
            bar.style.backgroundColor = move.type == "swap" ? "grey" : "blue";
        }
        container.appendChild(bar);
    }
}
