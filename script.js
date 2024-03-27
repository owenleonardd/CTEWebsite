let parsedInfo = null;
const topLeftContent = document.getElementById('top-left-content');
const topRightContent = document.getElementById('top-right-content');
const bottomLeftContent = document.getElementById('bottom-left-content');
const bottomRightContent = document.getElementById('bottom-right-content');

async function parseInfoFile(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error parsing JSON file:', error);
        return null;
    }
}

async function displayInfo(keyName) {
    try {
        parsedInfo = await parseInfoFile('info.json');
        if (!parsedInfo) {
            console.error('Error: Unable to fetch info data.');
            return;
        }
        
        const { home, what, whatdo, connects, jobs, welcome, learn } = parsedInfo[keyName];
        
        const showHome = home === true;
        topLeftContent.style.display = 'block';
        topRightContent.style.display = showHome ? 'none' : 'block';
        bottomLeftContent.style.display = 'block';
        bottomRightContent.style.display = showHome ? 'none' : 'block';
        topLeftContent.classList.toggle("col-span-2", showHome);
        bottomLeftContent.classList.toggle("col-span-2", showHome);

        topLeftContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${topLeftContent.querySelector('h2').innerHTML}</h2><p>${showHome ? welcome : what}</p>`;
        bottomLeftContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${bottomLeftContent.querySelector('h2').innerHTML}</h2><p>${showHome ? learn : connects}</p>`;
        topRightContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${topRightContent.querySelector('h2').innerHTML}</h2><p>${whatdo}</p>`;
        bottomRightContent.innerHTML = `<h2 class="text-xl font-semibold mb-4">${bottomRightContent.querySelector('h2').innerHTML}</h2><p>${jobs}</p>`;

        // Remove active class from all links
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => link.classList.remove('bg-gray-200', 'text-gray-900'));
        
        // Add active class to the clicked link
        const clickedLink = document.querySelector(`nav a[href="#"][onclick="displayInfo('${keyName}')"`);
        clickedLink.classList.add('bg-gray-200', 'text-gray-900');


    } catch (error) {
        console.error('Error:', error);
    }
}

displayInfo('Home');
