import fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const execAsync = promisify(exec);

async function ensureDirectoryExists(dir) {
    try {
        await mkdirAsync(dir, { recursive: true });
        console.log(`Directory ${dir} created successfully!`);
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw new Error(`Failed to create directory ${dir}: ${error.message}`);
        }
    }
}

async function evaluateCode(language, code) {
    const ext = {
        "c_cpp": "cpp",
        "javascript": "js",
        "python": "py",
    };

    const directoryPath = path.join('resources', 'code_evaluation_files');
    await ensureDirectoryExists(directoryPath);
    const fileName = path.join(directoryPath, 'code');

    try {
        if (!ext.hasOwnProperty(language)) {
            throw new Error(`Unsupported language: ${language}`);
        }

        await writeFileAsync(`${fileName}.${ext[language]}`, code);
        console.log(`File ${fileName}.${ext[language]} created successfully!`);

        const { error, output } = await runCode(language, fileName);
        return { error, output };
    } catch (error) {
        return { error: error.message, output: '' };
    }
}

async function runCode(language, fileName, timeout = 100) {
    let childProcess;

    switch (language) {
        case 'python':
            childProcess = exec(`python ${fileName}.py`);
            break;
        case 'javascript':
            childProcess = exec(`node ${fileName}.js`);
            break;
        case 'c_cpp':
            try {
                await execAsync(`g++ ${fileName}.cpp -o ${fileName}.exe`);
                childProcess = exec(`${fileName}.exe`);
            } catch (compileErr) {
                return { error: compileErr.message, output: '' };
            }
            break;
        default:
            return { error: `Unsupported language: ${language}`, output: '' };
    }

    return await executeWithTimeout(childProcess, timeout);
}

async function executeWithTimeout(childProcess, timeout) {
    return new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';

        const timeoutId = setTimeout(() => {
            childProcess.kill();
            reject(new Error('Execution timed out.'));
        }, timeout);

        childProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        childProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        childProcess.on('exit', (code) => {
            clearTimeout(timeoutId);
            if (code === 0) {
                resolve({ error: undefined, output: stdout });
            } else {
                reject(new Error(stderr || 'Execution failed.'));
            }
        });
    });
}

export { evaluateCode };
