import { ipcMain, shell } from 'electron'
import { evaluateCode } from '../main/scripts/codeEvaluator.js'

function ipcSetup() {
    ipcMain.handle('openSignIn', () => {
        shell.openExternal("https://fipu-educoder.netlify.app/sign-in");
    });
    ipcMain.handle('codeEvaluation', async (event, data) => {
        const response = await evaluateCode(data.lang, data.code);
        return response
    });
}

export { ipcSetup }
