<script setup>
import { globalStore, examStore, fileStore } from "@/main.js";
import { computed } from "vue";

const markdowTask = computed(() => {
    const p = examStore.examMarkdownContent[examStore.currentSolution - 1].taskPoints;
    const t = examStore.examMarkdownContent[examStore.currentSolution - 1].taskText;
	return `<b>Broj bodova: </b> <b class='text-sky-600'> ${p} </b>\n\n ${t}`;
});
 
</script>
<template v-if="examStore.examSet && examStore.examInProgress">
    <div class="flex h-full w-full">
        <EC_SideBar />
        <div class="wh-full overflow-auto">
            <VueShowdown v-if="examStore.markdownTab == 'task' && examStore.examSet" v-highlight :style="`scale: ${globalStore.MARKDOWNSize};`"
                class="mdSize text-left p-4 h-full overflow-scroll text-neutral-800 dark:text-neutral-400 text-xs origin-top-left" 
                :markdown="examStore.examInProgress || examStore.EDU_CODER_MODE === 'SANDBOX' ? markdowTask : ''" 
                flavor="github" :options="{ emoji: true }" 
                :class="globalStore.isDarkMode ? 'md-dark bg-neutral-800' : 'md bg-white'" />

            <VueShowdown v-else v-highlight :style="`scale: ${globalStore.MARKDOWNSize};`"
            class="mdSize text-left p-4 h-full overflow-scroll text-neutral-800 dark:text-neutral-400 text-xs origin-top-left" 
                :markdown="fileStore.selectedScriptMarkdown" flavor="github" :options="{ emoji: true }" 
                :class="globalStore.isDarkMode ? 'md-dark bg-neutral-800' : 'md bg-white'" />
        </div>
    </div>
</template>

<script>
export default { 
    props: {
        previous: Array,
        next: Array,
        current: Array
    },
}
</script>

<style lang="scss">
.mdSize {
    a:not([href^="#"]) {
		pointer-events: none;
	}
	img {
		border-radius: 4px;
		box-shadow: 0px 0px 12px #4040403b;
	}
	table {
		margin-top: 16px;
		margin-bottom: 16px;
	}
	h1 {
		font-size: 1.5rem !important;
        line-height: 2rem !important;
		margin-bottom: 16px;
		border-bottom: solid 1px gray;
		padding-bottom: 12px;
		font-weight: bold;
		margin-top: 24px;
	}
	h2 {
		font-size: 1rem !important;
        line-height: 1.5rem !important;
		margin-top: 16px;
		margin-bottom: 8px;
		border-bottom: solid 1px gray;
		padding-bottom: 6px;
		font-weight: bold;
	}
	h3 {
		font-size: 0.8rem !important;
        line-height: 1.2rem !important;
		margin-top: 16px;
		margin-bottom: 4px;
		padding-bottom: 4px;
		font-weight: bold;
	}
	img {
		margin-top: 16px;
		margin-bottom: 16px;
	}
	ul {
		margin-top: 12px;
		margin-bottom: 12px;
		li {
			margin-top: 2px;
			margin-bottom: 2px;
			&::before {
				content: "●"; /* Dot */
				margin-right: 0.5rem;
			}
            p {
                display: inline;
            }
		}
		ul {
			margin-top: 0px !important;
			margin-bottom: 0px !important;
			li {
				&::before {
					content: "⚬"; /* Dash */
					margin-right: 0.5rem;
				}
			}
			ul {
				li {
					&::before {
						content: "▪"; /* Right-pointing Triangle */
						margin-right: 0.5rem;
					}
				}
			}
		}
		li {
			padding-left: 1.5rem;
		}
	}
	ol {
		li {
			margin-top: 8px;
			&::before {
				counter-increment: item;
				font-weight: bold;
			}
			p {
				margin-top: 16px;
				margin-bottom: 1rem;
			}
			ul {
				li {
					margin-top: 4px;
					margin-bottom: 4px;
					&::before {
						content: "-";
					}
				}
			}
		}
	}
}

.md {
    blockquote {
        background: #f4f2f0;
        align-items: center;
        border-left: 4px solid #cacaca;
        padding: 6px 12px 6px 12px;
        margin-bottom: 8px;
        margin-top: 8px;
    }
	table {
		font-family: Arial, sans-serif;
		border-collapse: collapse;
		width: 100%;
		border: 2px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		th,
		td {
			border: 1px solid #ddd;
			padding: 8px;
			text-align: left;
		}
		th {
			background-color: #eeeeee;
		}
		tbody tr:nth-child(even) {
			background-color: #f2f2f2;
		}
		code {
			background-color: #dbdbdb;
			padding: 0px 4px;
			border-radius: 4px;
			font-family: monospace;
		}
	}
	a {
		color: rgb(63, 63, 233);
		&:hover {
			text-decoration: underline;
		}
	}
	ol,
	li,
	p {
		code {
			background-color: #dbdbdb;
			padding: 0px 4px;
			border-radius: 4px;
			font-family: monospace;
		}
	}
	ol {
        margin-left: 12px;
		counter-reset: custom-counter;
        list-style-type: decimal;
		margin-top: 24px;
		li {
			position: relative;
			margin-bottom: 4px;

			&:first-child {
				margin-top: -8px;
			}
			&:last-child {
				margin-bottom: 16px;
			}
		}
	}
	/**
 * prism.js default theme for JavaScript, CSS and HTML
 * Based on dabblet (http://dabblet.com)
 * @author Lea Verou
 */

	code[class*="language-"],
	pre[class*="language-"] {
		color: black;
		background: none;
		text-shadow: 0 1px white;
		font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
		text-align: left;
		white-space: pre;
		word-spacing: normal;
		word-break: normal;
		word-wrap: normal;
		line-height: 1.5;

		-moz-tab-size: 4;
		-o-tab-size: 4;
		tab-size: 4;

		-webkit-hyphens: none;
		-moz-hyphens: none;
		-ms-hyphens: none;
		hyphens: none;
	}

	pre[class*="language-"]::-moz-selection,
	pre[class*="language-"] ::-moz-selection,
	code[class*="language-"]::-moz-selection,
	code[class*="language-"] ::-moz-selection {
		text-shadow: none;
		background: #b3d4fc;
	}

	pre[class*="language-"]::selection,
	pre[class*="language-"] ::selection,
	code[class*="language-"]::selection,
	code[class*="language-"] ::selection {
		text-shadow: none;
		background: #b3d4fc;
	}

	@media print {
		code[class*="language-"],
		pre[class*="language-"] {
			text-shadow: none;
		}
	}

	/* Code blocks */
	pre[class*="language-"] {
		padding: 1em;
		margin: 0.5em 0;
		overflow: auto;
	}

	:not(pre) > code[class*="language-"],
	pre[class*="language-"] {
		background: #f5f2f0;
	}

	/* Inline code */
	:not(pre) > code[class*="language-"] {
		padding: 0.1em;
		border-radius: 0.3em;
		white-space: normal;
	}

	.token.comment,
	.token.prolog,
	.token.doctype,
	.token.cdata {
		color: slategray;
	}

	.token.punctuation {
		color: #999;
	}

	.namespace {
		opacity: 0.7;
	}

	.token.property,
	.token.tag,
	.token.boolean,
	.token.number,
	.token.constant,
	.token.symbol,
	.token.deleted {
		color: #905;
	}

	.token.selector,
	.token.attr-name,
	.token.string,
	.token.char,
	.token.builtin,
	.token.inserted {
		color: #690;
	}

	.token.operator,
	.token.entity,
	.token.url,
	.language-css .token.string,
	.style .token.string {
		color: #9a6e3a;
		background: hsla(0, 0%, 100%, 0.5);
	}

	.token.atrule,
	.token.attr-value,
	.token.keyword {
		color: #07a;
	}

	.token.function,
	.token.class-name {
		color: #dd4a68;
	}

	.token.regex,
	.token.important,
	.token.variable {
		color: #e90;
	}

	.token.important,
	.token.bold {
		font-weight: bold;
	}
	.token.italic {
		font-style: italic;
	}

	.token.entity {
		cursor: help;
	}
}
.md-dark {
    blockquote {
        background: #2d2d2d;
        align-items: center;
        border-left: 4px solid #616161;
        padding: 6px 12px 6px 12px;
        margin-bottom: 8px;
        margin-top: 8px;
    }
	ol,
	li,
	p {
		code {
			background-color: #404040;
			padding: 0px 4px;
			border-radius: 4px;
			font-family: monospace;
		}
	}
	table {
		font-family: Arial, sans-serif;
		border-collapse: collapse;
		width: 100%;
		border: 2px solid #555;
		border-radius: 8px;
		overflow: hidden;

		th,
		td {
			border: 1px solid #555;
			padding: 8px;
			text-align: left;
		}

		th {
			background-color: #444;
		}

		tbody tr:nth-child(even) {
			background-color: #323232;
		}

		code {
			background-color: #404040;
			padding: 0px 4px;
			border-radius: 4px;
			font-family: monospace;
		}
	}
	a {
		color: rgb(107, 137, 235);
		&:hover {
			text-decoration: underline;
		}
	}
	/**
 * prism.js tomorrow night eighties for JavaScript, CoffeeScript, CSS and HTML
 * Based on https://github.com/chriskempson/tomorrow-theme
 * @author Rose Pritchard
 */

	code[class*="language-"],
	pre[class*="language-"] {
		color: #ccc;
		background: none;
		font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
		text-align: left;
		white-space: pre;
		word-spacing: normal;
		word-break: normal;
		word-wrap: normal;
		line-height: 1.5;

		-moz-tab-size: 4;
		-o-tab-size: 4;
		tab-size: 4;

		-webkit-hyphens: none;
		-moz-hyphens: none;
		-ms-hyphens: none;
		hyphens: none;
	}

	/* Code blocks */
	pre[class*="language-"] {
		padding: 1em;
		margin: 0.5em 0;
		overflow: auto;
	}

	:not(pre) > code[class*="language-"],
	pre[class*="language-"] {
		background: #2d2d2d;
	}

	/* Inline code */
	:not(pre) > code[class*="language-"] {
		padding: 0.1em;
		border-radius: 0.3em;
		white-space: normal;
	}

	.token.comment,
	.token.block-comment,
	.token.prolog,
	.token.doctype,
	.token.cdata {
		color: #999;
	}

	.token.punctuation {
		color: #ccc;
	}

	.token.tag,
	.token.attr-name,
	.token.namespace,
	.token.deleted {
		color: #e2777a;
	}

	.token.function-name {
		color: #6196cc;
	}

	.token.boolean,
	.token.number,
	.token.function {
		color: #f08d49;
	}

	.token.property,
	.token.class-name,
	.token.constant,
	.token.symbol {
		color: #f8c555;
	}

	.token.selector,
	.token.important,
	.token.atrule,
	.token.keyword,
	.token.builtin {
		color: #cc99cd;
	}

	.token.string,
	.token.char,
	.token.attr-value,
	.token.regex,
	.token.variable {
		color: #7ec699;
	}

	.token.operator,
	.token.entity,
	.token.url {
		color: #67cdcc;
	}

	.token.important,
	.token.bold {
		font-weight: bold;
	}
	.token.italic {
		font-style: italic;
	}

	.token.entity {
		cursor: help;
	}

	.token.inserted {
		color: green;
	}
	ol {
        margin-left: 12px;
        list-style-type: decimal;
		margin-top: 24px;
		li {
			position: relative;
			margin-bottom: 4px;

			&:first-child {
				margin-top: -8px;
			}
			&:last-child {
				margin-bottom: 16px;
			}
		}
	}
}
</style>
