// Function to parse the information from the file
function parseInfoFile(filename) {
    return fetch(filename) // Fetch the JSON file
        .then(response => {
            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the JSON response
            return response.json();
        })
        .then(data => {
            let map = {};

            // Looping through each category in the JSON data
            for (let category in data) {
                if (data.hasOwnProperty(category)) {
                    let info = data[category];
                    let values = [];

                    // Extracting values from the info object
                    for (let key in info) {
                        if (info.hasOwnProperty(key)) {
                            values.push(info[key]);
                        }
                    }

                    // Storing the values in the hashmap
                    map[category] = values;
                }
            }

            return map;
        })
        .catch(error => {
            // Handle any errors
            console.error('There was a problem parsing the data:', error);
        });
}




// Function to fetch data from infoMap and populate <p> tags
async function displayInfo(keyName) {
    try {
        const parsedInfo = await parseInfoFile('info.json');
        console.log(parsedInfo);
        console.log(keyName);
        console.log(parsedInfo[keyName]);
        // Get data based on the specified key
        const info = parsedInfo[keyName];

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
