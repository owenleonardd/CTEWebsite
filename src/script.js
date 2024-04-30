let parsedInfo = null;
const title = document.getElementById('title');

async function generateSidebar() {
    try {
        const parsedInfo = await parseInfoFile('info.json');
        if (!parsedInfo) {
            console.error('Error: Unable to fetch info data.');
            return;
        }

        const sidebar = document.getElementById('sidebar');

        // Function to replace hyphens with spaces
        const replaceHyphensWithSpaces = str => str.replace(/-/g, ' ');

        // Iterate over each category and create a container for it
        Object.entries(parsedInfo).forEach(([category, pathways]) => {
            // Replace spaces with hyphens in category name
            const categoryId = category.replace(/\s+/g, '-');

            // Create a container div for the category
            const categoryContainer = document.createElement('div');
            categoryContainer.id = `category-${categoryId}`; // Set a unique ID for each container
            categoryContainer.classList.add('category-container', 'transition', 'ease-in-out', 'duration-300'); // Add transition classes
            sidebar.appendChild(categoryContainer);

            // Create the category button
            const categoryButton = document.createElement('button');
            categoryButton.classList.add('block', 'px-4', 'py-2', 'rounded-lg', 'hover:bg-gray-200', 'mb-4', 'focus:outline-none', 'focus:bg-gray-200');
            categoryButton.innerHTML = `<span class="arrow-icon">&#9205;</span> ${replaceHyphensWithSpaces(category)}`;
            categoryButton.addEventListener('click', () => callDifferentMethod(category, pathways));
            categoryContainer.appendChild(categoryButton);

            // Create the pathways list for the category
            const pathwaysList = document.createElement('ul');
            pathwaysList.classList.add('pl-4', 'hidden');
            categoryContainer.appendChild(pathwaysList);

            // Populate the pathways list with pathway buttons
            Object.keys(pathways).forEach(pathway => {
                const pathwayButton = document.createElement('li');
                pathwayButton.innerHTML = `<a href="#" onclick="displayInfo('${category}','${pathway}')" class="block px-4 py-2 rounded-lg hover:bg-gray-200">${replaceHyphensWithSpaces(pathway)}</a>`;
                pathwaysList.appendChild(pathwayButton);
            });

            // Function to handle clicking on the arrow
            const arrowIcon = categoryButton.querySelector('.arrow-icon');
            arrowIcon.addEventListener('click', (event) => {
                event.stopPropagation(); // Stop event propagation to prevent calling the method
                togglePathways(category, pathways);
            });

            // Function to toggle the display of pathways
            function togglePathways(category, pathways) {
                pathwaysList.classList.toggle('hidden');
                // Change arrow icon based on visibility
                if (pathwaysList.classList.contains('hidden')) {
                    arrowIcon.innerHTML = '&#9205;'; // Right-pointing arrow when collapsed
                } else {
                    arrowIcon.innerHTML = '&#9207;'; // Downward-pointing arrow when expanded
                }
            }

            // Function to call a different method when clicking on the category button
            function callDifferentMethod(category, pathways) {
                // Replace this placeholder with the method you want to call
                console.log(`Calling a different method for ${category}`);
                displayCategoryInfo(category);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}









function togglePathways(category, pathways) {
    const escapedCategory = category.replace(/\s+/g, '-');
    const categoryContainer = document.querySelector(`#category-${escapedCategory}`);

    if (!categoryContainer) {
        console.error(`Category container not found for category: ${category}`);
        return;
    }

    const pathwaysList = categoryContainer.querySelector('ul');
    if (!pathwaysList) {
        console.error(`Pathways list not found for category: ${category}`);
        return;
    }

    pathwaysList.classList.toggle('hidden');
}





async function parseInfoFile(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();

        // Replace spaces with hyphens in key names
        const transformedData = replaceSpacesWithHyphens(jsonData);

        return transformedData;
    } catch (error) {
        console.error('Error parsing JSON file:', error);
        return null;
    }
}

function replaceSpacesWithHyphens(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => replaceSpacesWithHyphens(item));
    }

    const newObj = {};
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newKey = key.replace(/\s+/g, '-');
            newObj[newKey] = replaceSpacesWithHyphens(obj[key]);
        }
    }
    return newObj;
}


async function displayInfo(categoryName, keyName) {
    console.log("Category Name: ", categoryName);
    console.log("Key Name: ", keyName);
    try {
        const parsedInfo = await parseInfoFile('info.json');
        if (!parsedInfo) {
            console.error('Error: Unable to fetch info data.');
            return;
        }
        keyName = keyName.replace(/\s+/g, '-');
        console.log("Parsed keys:", Object.keys(parsedInfo));
        console.log("Parsed keys after fix: ", Object.keys(parsedInfo[categoryName]));
        
        console.log(parsedInfo);
        console.log(keyName);

        if (!(keyName in parsedInfo[categoryName])) {
            console.error(`Error: '${keyName}' not found in parsedInfo.`);
            return;
        }

        const info = parsedInfo[categoryName][keyName];

        title.textContent = keyName.replace(/-/g, ' ');

        if ("Type" in info && info.Type === "Home") {
            displayHomePage();
        } else if ("Concentrator" in info && "Capstone" in info) {
            displayPathwayInfo(info);
        } else if ("description" in info) {
            displayCourseInfo(info);
        } else {
            console.error("Error: Invalid info object.");
        }

        console.log("Title:", keyName);

    } catch (error) {
        console.error('Error:', error);
    }
}

async function displayCategoryInfo(keyName) {//for displaying category page
    try {
        const parsedInfo = await parseInfoFile('info.json');
        if (!parsedInfo) {
            console.error('Error: Unable to fetch info data.');
            return;
        }
        keyName = keyName.replace(/\s+/g, '-');
        console.log("Parsed keys:", Object.keys(parsedInfo));
        
        console.log(parsedInfo);
        console.log(keyName);

        if (!(keyName in parsedInfo)) {
            console.error(`Error: '${keyName}' not found in parsedInfo.`);
            return;
        }

        const info = parsedInfo[keyName];

        title.textContent = keyName.replace(/-/g, ' ');

        displayCategoryPage();
        console.log("Title:", keyName);

    } catch (error) {
        console.error('Error:', error);
    }

}

function displayPathwayInfo(info) {
    const { Concentrator, Capstone } = info;
    const concentratorName = Concentrator.name;
    const concentratorDescription = Concentrator.description;
    const capstoneName = Capstone.name;
    const capstoneDescription = Capstone.description;

    const content = `
        <div class="grid grid-cols-2 gap-8">
            <div class="border rounded-lg p-4 bg-white">
                <h2 class="text-xl font-semibold mb-4">${concentratorName}</h2>
                <p>${concentratorDescription}</p>
            </div>
            <div class="border rounded-lg p-4 bg-white">
                <h2 class="text-xl font-semibold mb-4">${capstoneName}</h2>
                <p>${capstoneDescription}</p>
            </div>
        </div>
    `;
    displayContent(content);
}

function displayCourseInfo(info) {
    const { name, description, prerequisites } = info;

    const content = `
        <div class="border rounded-lg p-4 bg-white">
            <h2 class="text-xl font-semibold mb-4">${name}</h2>
            <p>${description}</p>
            <p>Prerequisites: ${prerequisites.join(", ")}</p>
        </div>
    `;
    displayContent(content);
}

function displayHomePage() {
    const content = `
        <div class="border rounded-lg p-4 bg-white">
            <p>It's the home page</p>
        </div>
    `;
    displayContent(content);
}

function displayCategoryPage() {
    const content = `
        <div class="border rounded-lg p-4 bg-white">
            <p>It's the category page</p>
        </div>
    `;
    displayContent(content);

}

function displayContent(content) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = content;
}



window.onload = generateSidebar();
displayInfo('Home');