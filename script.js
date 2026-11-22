document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');


    const inputLineContainer = terminalInput.closest('.input-line');

    terminalInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            const command = terminalInput.value.trim();
            terminalInput.value = '';

            if (command === '') return;

            if (command.toLowerCase() === 'help') {
                printOutput('An archive for the works of EM.', 'system-msg');
            } else {
                await fetchAndDisplayFile(command);
            }

            terminalHistory.scrollTop = terminalHistory.scrollHeight;
        }
    });

    function printOutput(text, className = '') {
        const outputDiv = document.createElement('div');
        outputDiv.className = `output-line ${className}`;
        outputDiv.style.whiteSpace = 'pre-wrap';
        outputDiv.innerHTML = text;
        terminalHistory.insertBefore(outputDiv, inputLineContainer);
    }

     async function fetchAndDisplayFile(filename) {
        let targetFile = filename;
        if (!targetFile.endsWith('.txt')) {
            targetFile += '.txt';
        }

        const filePath = `./poetry/${targetFile}`;

        try {
            const response = await fetch(filePath);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`"${filename}" is not poetry.`);
                } else {
                    throw new Error(`Blind. ${response.status}.`);
                }
            }

            const content = await response.text();
            printOutput(escapeHtml(content));
        } catch (error) {
            printOutput(`Error: ${error.message}`, 'error-msg');
        }
    }

    // Basic HTML escaping helper
    function escapeHtml(string) {
        return string
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
