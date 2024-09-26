let model;
let imageLoaded = false;

// Load the COCO-SSD model
const init = async () => {
    try {
        model = await cocoSsd.load();
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Model failed to load", error);
    }
};

// Handle file input change
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const image = document.getElementById('image');
        image.src = URL.createObjectURL(file);
        image.style.display = 'block';  // Show the image when loaded

        image.onload = () => {
            imageLoaded = true;
            document.getElementById('detectButton').disabled = false; // Enable the detect button
        };

        // Error handling if the image fails to load
        image.onerror = () => {
            console.error("Failed to load the image. Please try again.");
            document.getElementById('detectButton').disabled = true; // Disable the detect button
        };
    } else {
        console.error("No file selected");
    }
});

// Detect button functionality
const detectButton = document.getElementById('detectButton');
detectButton.addEventListener('click', () => {
    if (imageLoaded) {
        const image = document.getElementById('image');
        predict(image);
    }
});

// Predict objects in the image
const predict = async (img) => {
    if (model) {
        const predictions = await model.detect(img);
        console.log("Predictions:", predictions);
        showResult(predictions);
    } else {
        console.error("Model not loaded");
    }
};

// Display the results
const showResult = (predictions) => {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    if (predictions.length === 0) {
        resultDiv.innerHTML = "<p>No objects detected</p>";
    } else {
        predictions.forEach(prediction => {
            const { class: object, score } = prediction;
            resultDiv.innerHTML += `<p>Detected: ${object} with ${(score * 100).toFixed(2)}% confidence</p>`;
        });
    }
};

init(); // Initialize the model
