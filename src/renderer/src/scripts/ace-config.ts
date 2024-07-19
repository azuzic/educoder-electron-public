import ace from 'ace-builds';

import modeJsonUrl from 'ace-builds/src-noconflict/mode-json?url';
ace.config.setModuleUrl('ace/mode/json', modeJsonUrl);

import modeJavascriptUrl from 'ace-builds/src-noconflict/mode-javascript?url';
ace.config.setModuleUrl('ace/mode/javascript', modeJavascriptUrl);

import modeCPPUrl from 'ace-builds/src-noconflict/mode-c_cpp?url';
ace.config.setModuleUrl('ace/mode/c_cpp', modeCPPUrl);

import pythonUrl from 'ace-builds/src-noconflict/mode-python?url';
ace.config.setModuleUrl('ace/mode/python', pythonUrl);

import modeHtmlUrl from 'ace-builds/src-noconflict/mode-html?url';
ace.config.setModuleUrl('ace/mode/html', modeHtmlUrl);

import modeYamlUrl from 'ace-builds/src-noconflict/mode-yaml?url';
ace.config.setModuleUrl('ace/mode/yaml', modeYamlUrl);

import workerBaseUrl from 'ace-builds/src-noconflict/worker-base?url';
ace.config.setModuleUrl('ace/mode/base', workerBaseUrl);

import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url';
ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl);

import workerJavascriptUrl from 'ace-builds/src-noconflict/worker-javascript?url';
ace.config.setModuleUrl('ace/mode/javascript_worker', workerJavascriptUrl);

import workerHtmlUrl from 'ace-builds/src-noconflict/worker-html?url';
ace.config.setModuleUrl('ace/mode/html_worker', workerHtmlUrl);

import workerYamlUrl from 'ace-builds/src-noconflict/worker-yaml?url';
ace.config.setModuleUrl('ace/mode/yaml_worker', workerYamlUrl);

import snippetsHtmlUrl from 'ace-builds/src-noconflict/snippets/html?url';
ace.config.setModuleUrl('ace/snippets/html', snippetsHtmlUrl);

import snippetsPythonUrl from 'ace-builds/src-noconflict/snippets/python?url';
ace.config.setModuleUrl('ace/snippets/python', snippetsPythonUrl);

import snippetsCPPUrl from 'ace-builds/src-noconflict/snippets/c_cpp?url';
ace.config.setModuleUrl('ace/snippets/c_cpp', snippetsCPPUrl);

import snippetsJsUrl from 'ace-builds/src-noconflict/snippets/javascript?url';
ace.config.setModuleUrl('ace/snippets/javascript', snippetsJsUrl);

import snippetsYamlUrl from 'ace-builds/src-noconflict/snippets/yaml?url';
ace.config.setModuleUrl('ace/snippets/javascript', snippetsYamlUrl);

import snippetsJsonUrl from 'ace-builds/src-noconflict/snippets/json?url';
ace.config.setModuleUrl('ace/snippets/json', snippetsJsonUrl);

import 'ace-builds/src-noconflict/ext-language_tools';
ace.require("ace/ext/language_tools");

/*--*/
import themeDawnUrl from 'ace-builds/src-noconflict/theme-dawn?url';
ace.config.setModuleUrl('ace/theme/dawn', themeDawnUrl);

import themeDreamweaverUrl from 'ace-builds/src-noconflict/theme-dreamweaver?url';
ace.config.setModuleUrl('ace/theme/dreamweaver', themeDreamweaverUrl);

import themeEclipseUrl from 'ace-builds/src-noconflict/theme-eclipse?url';
ace.config.setModuleUrl('ace/theme/eclipse', themeEclipseUrl);

import themeGobUrl from 'ace-builds/src-noconflict/theme-gob?url';
ace.config.setModuleUrl('ace/theme/gob', themeGobUrl);

import themeGruvboxUrl from 'ace-builds/src-noconflict/theme-gruvbox?url';
ace.config.setModuleUrl('ace/theme/gruvbox', themeGruvboxUrl);

import themeIdleFingersUrl from 'ace-builds/src-noconflict/theme-idle_fingers?url';
ace.config.setModuleUrl('ace/theme/idle_fingers', themeIdleFingersUrl);

import themeIPlasticUrl from 'ace-builds/src-noconflict/theme-iplastic?url';
ace.config.setModuleUrl('ace/theme/iplastic', themeIPlasticUrl);

import themeKatzenMilchUrl from 'ace-builds/src-noconflict/theme-katzenmilch?url';
ace.config.setModuleUrl('ace/theme/katzenmilch', themeKatzenMilchUrl);

import themeKrThemeUrl from 'ace-builds/src-noconflict/theme-kr_theme?url';
ace.config.setModuleUrl('ace/theme/kr_theme', themeKrThemeUrl);

import themeKuroirUrl from 'ace-builds/src-noconflict/theme-kuroir?url';
ace.config.setModuleUrl('ace/theme/kuroir', themeKuroirUrl);

import themeMerbivoreUrl from 'ace-builds/src-noconflict/theme-merbivore?url';
ace.config.setModuleUrl('ace/theme/merbivore', themeMerbivoreUrl);

import themeMerbivoreSoftUrl from 'ace-builds/src-noconflict/theme-merbivore_soft?url';
ace.config.setModuleUrl('ace/theme/merbivore_soft', themeMerbivoreSoftUrl);

import themeMonoIndustrialUrl from 'ace-builds/src-noconflict/theme-mono_industrial?url';
ace.config.setModuleUrl('ace/theme/mono_industrial', themeMonoIndustrialUrl);

import themeMonokaiUrl from 'ace-builds/src-noconflict/theme-monokai?url';
ace.config.setModuleUrl('ace/theme/monokai', themeMonokaiUrl);

import themePastelOnDarkUrl from 'ace-builds/src-noconflict/theme-pastel_on_dark?url';
ace.config.setModuleUrl('ace/theme/pastel_on_dark', themePastelOnDarkUrl);

import themeSolarizedDarkUrl from 'ace-builds/src-noconflict/theme-solarized_dark?url';
ace.config.setModuleUrl('ace/theme/solarized_dark', themeSolarizedDarkUrl);

import themeTerminalUrl from 'ace-builds/src-noconflict/theme-terminal?url';
ace.config.setModuleUrl('ace/theme/terminal', themeTerminalUrl);

import themeTomorrowNightUrl from 'ace-builds/src-noconflict/theme-tomorrow_night?url';
ace.config.setModuleUrl('ace/theme/tomorrow_night', themeTomorrowNightUrl);

import themeTomorrowNightBlueUrl from 'ace-builds/src-noconflict/theme-tomorrow_night_blue?url';
ace.config.setModuleUrl('ace/theme/tomorrow_night_blue', themeTomorrowNightBlueUrl);

import themeTomorrowNightBrightUrl from 'ace-builds/src-noconflict/theme-tomorrow_night_bright?url';
ace.config.setModuleUrl('ace/theme/tomorrow_night_bright', themeTomorrowNightBrightUrl);

import themeTomorrowNightEightiesUrl from 'ace-builds/src-noconflict/theme-tomorrow_night_eighties?url';
ace.config.setModuleUrl('ace/theme/tomorrow_night_eighties', themeTomorrowNightEightiesUrl);

import themeTwilightUrl from 'ace-builds/src-noconflict/theme-twilight?url';
ace.config.setModuleUrl('ace/theme/twilight', themeTwilightUrl);

import themeVibrantInkUrl from 'ace-builds/src-noconflict/theme-vibrant_ink?url';
ace.config.setModuleUrl('ace/theme/vibrant_ink', themeVibrantInkUrl);

import themeChromeUrl from 'ace-builds/src-noconflict/theme-chrome?url';
ace.config.setModuleUrl('ace/theme/chrome', themeChromeUrl);

import themeGithubUrl from 'ace-builds/src-noconflict/theme-github?url';
ace.config.setModuleUrl('ace/theme/github', themeGithubUrl);

import themeIPlasticUrl from 'ace-builds/src-noconflict/theme-iplastic?url';
ace.config.setModuleUrl('ace/theme/iplastic', themeIPlasticUrl);

import themeKatzenMilchUrl from 'ace-builds/src-noconflict/theme-katzenmilch?url';
ace.config.setModuleUrl('ace/theme/katzenmilch', themeKatzenMilchUrl);

import themeKuroirUrl from 'ace-builds/src-noconflict/theme-kuroir?url';
ace.config.setModuleUrl('ace/theme/kuroir', themeKuroirUrl);

import themeSolarizedLightUrl from 'ace-builds/src-noconflict/theme-solarized_light?url';
ace.config.setModuleUrl('ace/theme/solarized_light', themeSolarizedLightUrl);

import themeSQLServerUrl from 'ace-builds/src-noconflict/theme-sqlserver?url';
ace.config.setModuleUrl('ace/theme/sqlserver', themeSQLServerUrl);

import themeTextmateUrl from 'ace-builds/src-noconflict/theme-textmate?url';
ace.config.setModuleUrl('ace/theme/textmate', themeTextmateUrl);

import themeTomorrowUrl from 'ace-builds/src-noconflict/theme-tomorrow?url';
ace.config.setModuleUrl('ace/theme/tomorrow', themeTomorrowUrl);

import themeXCodeUrl from 'ace-builds/src-noconflict/theme-xcode?url';
ace.config.setModuleUrl('ace/theme/xcode', themeXCodeUrl);

import themeAmbianceUrl from 'ace-builds/src-noconflict/theme-ambiance?url';
ace.config.setModuleUrl('ace/theme/ambiance', themeAmbianceUrl);

import themeChaosUrl from 'ace-builds/src-noconflict/theme-chaos?url';
ace.config.setModuleUrl('ace/theme/chaos', themeChaosUrl);

import themeCloudsMidnightUrl from 'ace-builds/src-noconflict/theme-clouds_midnight?url';
ace.config.setModuleUrl('ace/theme/clouds_midnight', themeCloudsMidnightUrl);

import themeCobaltUrl from 'ace-builds/src-noconflict/theme-cobalt?url';
ace.config.setModuleUrl('ace/theme/cobalt', themeCobaltUrl);

import themeDraculaUrl from 'ace-builds/src-noconflict/theme-dracula?url';
ace.config.setModuleUrl('ace/theme/dracula', themeDraculaUrl);

import themeGobUrl from 'ace-builds/src-noconflict/theme-gob?url';
ace.config.setModuleUrl('ace/theme/gob', themeGobUrl);

import themeGruvboxUrl from 'ace-builds/src-noconflict/theme-gruvbox?url';
ace.config.setModuleUrl('ace/theme/gruvbox', themeGruvboxUrl);

import themeIdleFingersUrl from 'ace-builds/src-noconflict/theme-idle_fingers?url';
ace.config.setModuleUrl('ace/theme/idle_fingers', themeIdleFingersUrl);

import themeKrThemeUrl from 'ace-builds/src-noconflict/theme-kr_theme?url';
ace.config.setModuleUrl('ace/theme/kr_theme', themeKrThemeUrl);

import themeMerbivoreUrl from 'ace-builds/src-noconflict/theme-merbivore?url';
ace.config.setModuleUrl('ace/theme/merbivore', themeMerbivoreUrl);

import themeMerbivoreSoftUrl from 'ace-builds/src-noconflict/theme-merbivore_soft?url';
ace.config.setModuleUrl('ace/theme/merbivore_soft', themeMerbivoreSoftUrl);

import themeMonoIndustrialUrl from 'ace-builds/src-noconflict/theme-mono_industrial?url';
ace.config.setModuleUrl('ace/theme/mono_industrial', themeMonoIndustrialUrl);

import themeMonokaiUrl from 'ace-builds/src-noconflict/theme-monokai?url';
ace.config.setModuleUrl('ace/theme/monokai', themeMonokaiUrl);

import themePastelOnDarkUrl from 'ace-builds/src-noconflict/theme-pastel_on_dark?url';
ace.config.setModuleUrl('ace/theme/pastel_on_dark', themePastelOnDarkUrl);

import themeSolarizedDarkUrl from 'ace-builds/src-noconflict/theme-solarized_dark?url';
ace.config.setModuleUrl('ace/theme/solarized_dark', themeSolarizedDarkUrl);

import themeTerminalUrl from 'ace-builds/src-noconflict/theme-terminal?url';
ace.config.setModuleUrl('ace/theme/terminal', themeTerminalUrl);

import themeTomorrowNightUrl from 'ace-builds/src-noconflict/theme-tomorrow_night?url';
ace.config.setModuleUrl('ace/theme/tomorrow_night', themeTomorrowNightUrl);

import themeTomorrowNightBlueUrl from 'ace-builds/src-noconflict/theme-tomorrow_night_blue?url';
ace.config.setModuleUrl('ace/theme/tomorrow_night_blue', themeTomorrowNightBlueUrl);

import themeTomorrowNightBrightUrl from 'ace-builds/src-noconflict/theme-tomorrow_night_bright?url';
ace.config.setModuleUrl('ace/theme/tomorrow_night_bright', themeTomorrowNightBrightUrl);

import themeTomorrowNightEightiesUrl from 'ace-builds/src-noconflict/theme-tomorrow_night_eighties?url';
ace.config.setModuleUrl('ace/theme/tomorrow_night_eighties', themeTomorrowNightEightiesUrl);

import themeTwilightUrl from 'ace-builds/src-noconflict/theme-twilight?url';
ace.config.setModuleUrl('ace/theme/twilight', themeTwilightUrl);

import themeVibrantInkUrl from 'ace-builds/src-noconflict/theme-vibrant_ink?url';
ace.config.setModuleUrl('ace/theme/vibrant_ink', themeVibrantInkUrl);


