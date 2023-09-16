/**
 * Options for the extension.
 * @typedef {object} Options
 * @property {boolean} isEnabled - Indicates whether the extension is enabled or disabled.
 */

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
        // TODO: Maybe add try/catch?
        // Get the current active tab.
        const firstTab = await getCurrentTab()

        // Create options object with the new state.
        const options = { isEnabled: isChecked }

        // Send options to the content script.
        sendOptions(firstTab, options)

        // Store the options in local storage.
        await chrome.storage.local.set(options)
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
