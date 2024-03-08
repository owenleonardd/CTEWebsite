// Function to parse the information from the file
async function parseInfoFile(filename) {
    let response = await fetch(filename);
    let data = await response.text();

    let entries = data.split('~'); // Splitting the data into entries based on double newlines

    let infoMap = {};

    // Looping through each entry and extracting key-value pairs
    entries.forEach(entry => {
        let lines = entry.trim().split('\n');
        let key = lines.shift().trim(); // First line is the key (class name)
        let values = lines.map(line => line.split(":")[1].trim()); // Rest of the lines are values

        // Storing the values in the hashmap
        infoMap[key] = values;
    });

    return infoMap;
}

// Function to fetch data from infoMap and populate <p> tags
async function displayInfo(keyName) {
    try {
        const parsedInfo = await parseInfoFile('info.txt');

        // Get data based on the specified key
        const info = parsedInfo[keyName];

        // Update the <p> tags with the fetched data
        if (info) {
            const leftContent = document.getElementById('left-content');
            const rightContent = document.getElementById('right-content');

            leftContent.innerHTML = `<p>${info[0]}</p><p>${info[1]}</p>`;
            rightContent.innerHTML = `<p>${info[2]}</p><p>${info[3]}</p>`;
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
