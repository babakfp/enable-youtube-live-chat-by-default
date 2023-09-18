/**
 * Options for the extension.
 * @typedef {object} Options
 * @property {boolean} isEnabled - Indicates whether the extension is enabled or disabled.
 */

const YOUTUBE_URL_MATCH_REGEX =
    /https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]+/

/** @type {HTMLInputElement} */
const toggleInput = document.getElementById("isEnabled")

// Load the extension state from extension local storage.
chrome.storage.local.get().then(({ isEnabled }) => {
    if (isEnabled) {
        toggleInput.checked = true
    }
})

// Listen for changes to the toggle input.
toggleInput.addEventListener("change", e => {
    const isChecked = e.target.checked

    ;(async () => {
        // Get the current active tab.
        const firstTab = await getCurrentTab()

        // Create options object with the new state.
        const options = { isEnabled: isChecked }

        // Store the options in local storage.
        await chrome.storage.local.set(options)

        // Step away if not on correct page
        if (!firstTab.url.match(YOUTUBE_URL_MATCH_REGEX)) return

        // Send options to the content script.
        sendOptions(firstTab, options)
    })()
})

/**
 * Get the current active tab in the browser.
 * @returns {Promise<chrome.tabs.Tab>} A Promise that resolves to the active tab.
 */
async function getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true }
    const [firstTab] = await chrome.tabs.query(queryOptions)
    return firstTab
}

/**
 * Send options to a specified tab.
 * @param {chrome.tabs.Tab} tab - The tab to send options to.
 * @param {Options} options - The options to send.
 */
function sendOptions(tab, options) {
    chrome.tabs.sendMessage(tab.id, options)
}
