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
        const topLeftContent = document.getElementById('top-left-content');
        const topRightContent = document.getElementById('top-right-content');
        const bottomLeftContent = document.getElementById('bottom-left-content');
        const bottomRightContent = document.getElementById('bottom-right-content');
        console.log(info.length);
        if (info.length === 4) {
            bottomLeftContent.style.display = "block";
            bottomRightContent.style.display = "block";
            topLeftContent.style.display = "block";
            topRightContent.style.display = "block";

            topLeftContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${topLeftContent.querySelector('h2').innerHTML}</h2><p>${info[0]}</p>`;
            bottomLeftContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${bottomLeftContent.querySelector('h2').innerHTML}</h2><p>${info[1]}</p>`;
            topRightContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${topRightContent.querySelector('h2').innerHTML}</h2><p>${info[2]}</p>`;
            bottomRightContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${bottomRightContent.querySelector('h2').innerHTML}</h2><p>${info[3]}</p>`;
        } else if (info.length == 2) {
            topLeftContent.style.display = "block";
            topRightContent.style.display = "none";
            bottomLeftContent.style.display = "block";
            bottomRightContent.style.display = "none";

            topLeftContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${topLeftContent.querySelector('h2').innerHTML}</h2><p>${info[0]}</p>`;
            bottomLeftContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${bottomLeftContent.querySelector('h2').innerHTML}</h2><p>${info[1]}</p>`;
        } else {
            console.error('Error: Information not found for key:', keyName);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

displayInfo('Home');