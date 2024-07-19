function getErrorMessage(error) {
    let errorMessage = error.error || error.message || error;
    return errorMessage;
}

function getPosition(lang, errorMessage) {
    let positionMatch = "";
    switch (lang) {
        case "c_cpp":
            positionMatch = errorMessage.match(/(?<=code\.cpp:)\d+/);
            return positionMatch ? positionMatch[0] : 0;
        case "javascript":
            positionMatch =  errorMessage.match(/(?<=code\.js:)\d+/);
            return positionMatch ? positionMatch[0] : 0;
        case "python":
            positionMatch =  errorMessage.match(/(?<=line\s)\d+/);
            return positionMatch ? positionMatch[0] : 0;
        default:
            return 0;
    }
}
function getErrorErrorType(lang, errorMessage) {
    let errorTypeMatch = "";
    switch (lang) {
        case "c_cpp":
            errorTypeMatch = errorMessage.match(/error|fatal\serror:/);
            return errorTypeMatch ? errorTypeMatch[0].trim() : "none";
        case "javascript":
            errorTypeMatch = errorMessage.match(/SyntaxError|ReferenceError|TypeError|RangeError|InternalError.*/);
        case "python":
            const errorTypePatterns = [
                /SyntaxError.*/, /ValueError.*/, /TypeError.*/, /RangeError/, /AttributeError.*/,
                /NameError.*/, /IndentationError.*/, /KeyError.*/, /FileNotFoundError.*/, /ModuleNotFoundError.*/,
                /ZeroDivisionError.*/, /AssertionError.*/, /IndexError.*/, /NotImplementedError.*/, /RecursionError.*/,
                /RuntimeError.*/, /FileExistsError.*/, /KeyboardInterrupt.*/, /PermissionError.*/
            ];
            for (const pattern of errorTypePatterns) { errorTypeMatch = errorMessage.match(pattern); if (errorTypeMatch)  break; }
            return errorTypeMatch ? errorTypeMatch[0].trim() : "none";
        default:
            return "none";
    }
}
function getErrorMessageDetail(lang, errorMessage) {
    let errorMessageDetailMatch = "";
    switch (lang) {
        case "c_cpp":
            errorMessageDetailMatch = errorMessage.match(/:\d+:\s*.*\s*.*\s*\^*/);
            return errorMessageDetailMatch ? errorMessageDetailMatch[0].replace(/:\d+:\d+:.*?:/, '').trim() : "none";
        case "javascript":
            errorMessageDetailMatch = errorMessage.match(/:\d+\s*.*\s*\^*/);
            return errorMessageDetailMatch ? errorMessageDetailMatch[0].replace(/:\d+/, '').trim() : "none";
        case "python":
            const errorKeywords = [
                "NameError", "TypeError", "ValueError", "AttributeError", "KeyError",
                "FileNotFoundError", "ModuleNotFoundError", "ZeroDivisionError", "AssertionError",
                "IndexError", "NotImplementedError", "RecursionError", "RuntimeError", "FileExistsError",
                "KeyboardInterrupt", "PermissionError"
            ];
            const hasErrorKeyword = errorKeywords.some(keyword => errorMessage.includes(keyword));
            if (!hasErrorKeyword) errorMessageDetailMatch = errorMessage.match(/line\s\d+\s*.*\s*\^*/);
            else errorMessageDetailMatch = errorMessage.match(/line\s\d+\s*.*\s*.*\s.*/);
            return errorMessageDetailMatch ? errorMessageDetailMatch[0].replace(/line\s\d+/, '').replace(/,\s*in\s\<module\>\s*/,'').replace('\n','') : "none";
        default:
            return "none";
    }
}

function formatError(lang, error) {
    let formattedError = { errorType: "none", errorMessageDetail: "none", position: 0 };

    if (error == undefined) return formattedError;
    const errorMessage = getErrorMessage(error);

    if (errorMessage == "Execution timed out.") return { errorType: "InternalError", errorMessageDetail: "Izvršenje koda premašilo je dopušteno vremensko ograničenje", position: 0 };
    if (errorMessage == "stdout maxBuffer length exceeded") return { errorType: "InternalError", errorMessageDetail: "Premašena je maksimalna duljina spremnika za izlaz", position: 0 };

    const position = getPosition(lang, errorMessage);
    const errorType = getErrorErrorType(lang, errorMessage);
    const errorMessageDetail = getErrorMessageDetail(lang, errorMessage);

    formattedError = { errorType: errorType, errorMessageDetail: errorMessageDetail, position: position };
    return formattedError;
}

function getCodeAlertType(errorType, error) {
    return errorType == "none" ? "OK" :
        "RangeError" == errorType || error == "Error: Execution timed out." ?
        "loop" : "error";
}

function getOutput(response) {
    let logMessages = [];
    let output = response.output.replace(/\r/g,'').split('\n');
    for (let i = Math.max(0, output.length - 1000); i < output.length - 1; i++)
        logMessages.push({ type: "log", msg: JSON.stringify(output[i]) });
    return logMessages
}

function highlightError(error) {
    const highlightedElements = document.querySelectorAll(".EC_highlightedError");
    highlightedElements.forEach(element => {
        element.classList.remove("EC_highlightedError");
    });

    if (error.position > 0) {
        const editor = document.getElementsByClassName("ace_text-layer")[0];
        const children = editor.children;
        const indexToHighlight = error.position - 1;

        if (indexToHighlight < children.length) children[indexToHighlight].classList.add("EC_highlightedError");
    }
}

export {formatError, getCodeAlertType, getOutput, highlightError}
