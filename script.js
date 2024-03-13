// Function to parse the information from the file
function parseInfoFile(filename) {
    return fetch(filename)
        .then(response => response.text())
        .then(data => {
            let entries = data.split('~'); // Splitting the data into entries based on double newlines

            let map = {};

            // Looping through each entry and extracting key-value pairs
            entries.forEach(entry => {
                let lines = entry.trim().split('\n');
                let key = lines.shift().trim(); // First line is the key (class name)
                let values = lines.map(line => line.split(":")[1].trim()); // Rest of the lines are values

                // Storing the values in the hashmap
                map[key] = values;
            });

            return map;
        });
}


// Function to fetch data from infoMap and populate <p> tags
async function displayInfo(keyName) {
    try {
        const parsedInfo = await parseInfoFile('info.txt');
        console.log(parsedInfo);
        // Get data based on the specified key
        const info = parsedInfo[keyName + ":"];

        // Update the <p> tags with the fetched data
        if (info) {
            const topLeftContent = document.getElementById('top-left-content');
            const topRightContent = document.getElementById('top-right-content');
            const bottomLeftContent = document.getElementById('bottom-left-content');
            const bottomRightContent = document.getElementById('bottom-right-content');

            topLeftContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${topLeftContent.querySelector('h2').innerHTML}</h2><p>${info[0]}</p>`;
            bottomLeftContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${bottomLeftContent.querySelector('h2').innerHTML}</h2><p>${info[1]}</p>`;
            topRightContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${topRightContent.querySelector('h2').innerHTML}</h2><p>${info[2]}</p>`;
            bottomRightContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${bottomRightContent.querySelector('h2').innerHTML}</h2><p>${info[3]}</p>`;

        } else {
            console.error('Error: Information not found for key:', keyName);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the displayInfo function with the specified key when the page loads
// For example, if you want to display information for "Animation" initially:
// displayInfo('Animation');
