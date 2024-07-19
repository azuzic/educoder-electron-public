function formatDateTime(dateTime) {
    return new Date(dateTime).toLocaleDateString("hr") + " - " + new Date(dateTime).getHours() + "h " + new Date(dateTime).getMinutes() + "m " + new Date(dateTime).getSeconds() + "s";
}
function formatTime(dateTime) {
    let h = new Date(dateTime).getHours() - 1;
    let m = new Date(dateTime).getMinutes();
    let s = new Date(dateTime).getSeconds();
    let duration = "";
    if (h != 0) duration += h + "h ";
    if (m != 0) duration += m + "m ";
    if (s != 0) duration += s + "s ";
    return duration;
}

function extractNumberOfTasks(str) {
    let tasks = [];
    let currentTask = "";
    let totalTasks = 0;

    const lines = str.split("\n");
    for (const line of lines) {
        if (/^\d+\./.test(line.trim())) {
            if (currentTask !== "") {
                tasks.push(currentTask.trim());
                currentTask = "";
                totalTasks++;
            }
        }
        currentTask += line.replace(/^\d+\.\s*/, " **" + (totalTasks + 1) + ".** ").trim() + "\n";
    }

    if (currentTask !== "") tasks.push(currentTask.trim());
    return tasks;
}

function mdTitleRegex(name) {
    return new RegExp("\\s*\\#*\\s*\\[\\s*" + name + "\\s*\\=*[\\s\\d]*\\]", "gi");
}

function extractFromFile(text, removeExaminationText = true) {
    const groups = [];
    let tasks = [];

    const foundGroups = text.trim().split(mdTitleRegex("GROUP")).filter(Boolean);
    for (const group of foundGroups) {
        if (group.length < 10) continue;
        const foundTasks = group.trim().split(mdTitleRegex("TASK")).filter(Boolean);
        for (const foundTask of foundTasks) {
            const taskPoints = foundTask.match(/(?:[\#\s]*\[\s*MAX_TASK_POINTS\s*=\s*)(\d+)(?:\s*\])/i)[1]
            const taskText = removeExaminationText ? 
                foundTask.replace(/[\#\s]*\[\s*(MAX_TASK_POINTS|TASK)\s*=\s*(\d+)\s*\]\s\n*/gi, '').replace(/\s*>.*>\s*/gi, '') 
                : foundTask.replace(/[\#\s]*\[\s*(MAX_TASK_POINTS|TASK)\s*=\s*(\d+)\s*\]\s\n*/gi, '');  
            const task = {
                taskPoints: Number(taskPoints),
                taskText: taskText
            }
            tasks.push( task )
        }
        groups.push({tasks: tasks})
        tasks = []
    }
    return groups;
}

let wait = function (seconds) {
	return new Promise((resolveFn) => {
		setTimeout(resolveFn, seconds * 1000);
	});
};

function codeCopy(examStore = false) {
    // Get all code elements
    const codeBlocks = document.querySelectorAll('code');

    // Function to copy code
    function copyCode(event) {
        const code = event.target.nextElementSibling.textContent.trim();
        navigator.clipboard.writeText(code);
        if (examStore !== false) examStore.copiedCode = code;
        
        // Change icon color and text to indicate successful copy
        event.target.textContent = '✅'; // Change icon to checkmark
        event.target.style.color = 'green'; // Change color to green
        
        // Reset icon after a short delay
        setTimeout(() => {
            event.target.textContent = '📋'; // Reset icon to clipboard
            event.target.style.color = '#999'; // Reset color
        }, 1000); // Change the delay duration as needed
    }

    // Loop through each code block and add copy icon
    codeBlocks.forEach(codeBlock => {
        if (codeBlock.parentNode.nodeName === 'PRE') {
            // Create copy icon element
            const copyIcon = document.createElement('span');
            copyIcon.innerHTML = '&#128203;'; // Unicode for copy icon

            // Style the icon
            copyIcon.style.cursor = 'pointer';
            copyIcon.style.position = 'absolute';
            copyIcon.style.top = '5px';
            copyIcon.style.right = '5px';
            copyIcon.style.color = '#999'; // You can adjust color as per your preference
            copyIcon.title = 'Copy code';
            
            // Attach click event to copy icon
            copyIcon.addEventListener('click', copyCode);

            // Append icon to code block
            codeBlock.parentNode.style.position = 'relative'; // Make sure the parent is relatively positioned
            codeBlock.parentNode.insertBefore(copyIcon, codeBlock);
        }
    });
}

export { formatDateTime, formatTime, extractNumberOfTasks, extractFromFile, wait, codeCopy }