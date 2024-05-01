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
            categoryButton.addEventListener('click', () => displayInfoPage(category, ''));
            categoryContainer.appendChild(categoryButton);

            // Create the pathways list for the category
            const pathwaysList = document.createElement('ul');
            pathwaysList.classList.add('pl-4', 'hidden');
            categoryContainer.appendChild(pathwaysList);

            // Populate the pathways list with pathway buttons
            console.log("pathways: ", pathways);
            Object.keys(pathways).forEach(pathway => {
                // Check if the value corresponding to the key is an object
                if (!Array.isArray(pathways[pathway]) && typeof pathways[pathway] === 'object' && pathways[pathway] !== null) {
                    const pathwayButton = document.createElement('li');
                    pathwayButton.innerHTML = `<a href="#" onclick="displayInfoPage('${category}','${pathway}')" class="block px-8 py-2 rounded-lg my-2 hover:bg-gray-200">${replaceHyphensWithSpaces(pathway)}</a>`;
                    pathwaysList.appendChild(pathwayButton);
                }
            });

            //if there are no pathways added in the forEach loop above, remove the arrow unicode character
            if (pathwaysList.children.length === 0) {
                categoryButton.querySelector('.arrow-icon').innerHTML = '';
            }
            

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


async function displayInfoPage(categoryName, keyName = '') {
    console.log("displayInfoPage called with categoryName: ", categoryName, " and keyName: ", keyName);
    try {
        const parsedInfo = await parseInfoFile('info.json');
        if (!parsedInfo) {
            console.error('Error: Unable to fetch info data.');
            return;
        }

        const info = getCategoryInfo(parsedInfo, categoryName, keyName);

        if (!info) {
            console.error(`Error: Info not found for ${categoryName} - ${keyName}`);
            return;
        }

        const content = generateInfoContent(info, categoryName);
        displayContent(content);

    } catch (error) {
        console.error('Error:', error);
    }
}



function getCategoryInfo(parsedInfo, categoryName, keyName) {
    if (categoryName === 'Home' || categoryName === 'About') {
        return parsedInfo[categoryName];
    } else if (parsedInfo[categoryName]) {
        if (keyName) {
            console.log(parsedInfo[categoryName][keyName]);
            return parsedInfo[categoryName][keyName];
        } else {
            // If keyName is blank, return the entire category object
            console.log("returning entire category:",parsedInfo[categoryName]);
            return parsedInfo[categoryName];
        }
    }
    return null;
}


function generateInfoContent(info, categoryName) {
    let content = '';

    // Check if the info represents a category with Concentrator and Capstone objects
    if (info['Concentrator'] && info['Capstone']) {
        content += generateTextBoxForPathway(info['Concentrator']);
        content += generateTextBoxForPathway(info['Capstone']);
    } else {
        // Iterate through all keys and generate text boxes
        for (const key in info) {
            if((info['Type'] === 'Category' )&&(key !== 'Type' && typeof info[key] === 'string')){
                console.log(info)
                content += generateTextBox(`<span style='font-size: 20px;'><strong>${categoryName.replace(/-/g, ' ')}</strong></span><br><br>` + info[key]);
            }else if (key !== 'Type' && typeof info[key] === 'string') {
                content += generateTextBox(info[key]);
            } else if(key === 'Images') {
                for (const image of info[key]) {
                    content += generateTextBoxForImage(image, "");
                }
            }
        }
    }

    return content;
}

function generateTextBoxForPathway(pathway) {
    console.log("generateTextBoxForPathway called with pathway: ", pathway)
    let content = '<div class="border rounded-lg p-4 bg-white my-4">';
    if (typeof pathway === 'object') {
        for (const key in pathway) {
            if (key === 'name') {
                content += `<p><strong class="mr-2">${pathway[key]}</strong>`;
                // Add icons for boolean variables
                if (pathway.isDualEnrollment) {
                    content += '<img src="icons/dual-enrollment.svg" alt="Dual Enrollment" class="icon inline h-4 w-4 mx-0.5" title="Dual Enrollment">';
                }
                if (pathway.isCTSO) {
                    content += '<img src="icons/ctso.svg" alt="CTSO" class="icon inline h-4 w-4 mx-0.5" title="CTSO">';
                }
                if (pathway.hasCerts) {
                    content += '<img src="icons/certifications.svg" alt="Certifications" class="icon inline h-4 w-4 mx-0.5" title="Certifications">';
                }
                content += `<br><br></p>`;
            } else if (typeof pathway[key] === 'string'){
                content += `<p>${pathway[key]}<br></p>`;
            }
        }
    } else {
        content += `<p>${pathway}</p>`;
    }
    content += '</div>';
    return content;
}

function generateTextBoxForImage(image, headerText) {
    if(headerText === undefined) {
        headerText = "";
    }
    // if(image === "images/mvhspathway.png") {
    //     headerText = "MVHS Pathways";
    // } else if(image === "images/lahspathway.png") {
    //     headerText = "LAHS Pathways";
    // }
    return `
        <div class="border rounded-lg p-4 bg-white my-4">
            <h2 class="text-5xl text-center">${headerText}</h2>
            <img src="${image}" alt="Image" class="w-full">
        </div>
    `;

}




function generateTextBox(text) {
    return `
        <div class="border rounded-lg p-4 bg-white my-4">
            <p>${text}</p>
        </div>
    `;
}

function displayContent(content) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = content;
}





window.onload = generateSidebar();
window.onload = displayInfoPage('Home', '');