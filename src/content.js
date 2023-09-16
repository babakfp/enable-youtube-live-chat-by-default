// Check Chrome storage for the isEnabled flag.
chrome.storage.local.get().then(({ isEnabled }) => {
    if (isEnabled) {
        switchToLiveChat()
    }
})

// TODO: Maybe add try/catch?
// Listen for messages from the extension.
chrome.runtime.onMessage.addListener(({ isEnabled }) => {
    if (isEnabled) {
        switchToLiveChat()
    }
})

// Function to switch to Live Chat.
function switchToLiveChat() {
    /** @type {HTMLIFrameElement | null} */
    const iframe = document.querySelector("#chatframe")
    if (iframe) {
        fireClickActions(iframe)
    } else {
        waitForQuerySelector(
            "#chatframe",
            /** @param {HTMLIFrameElement} iframe */ iframe => {
                fireClickActions(iframe)
            },
        )
    }
}

/**
 * @param {HTMLIFrameElement} iframe
 * @returns
 */
function fireClickActions(iframe) {
    let didGoInsideLoad = false

    // Add an event listener for the iframe's load event.
    iframe.contentWindow.addEventListener("load", () => {
        didGoInsideLoad = true
        clickToSwitch(iframe)
    })

    // If the load event didn't trigger (iframe already loaded), call clickToSwitch.
    if (!didGoInsideLoad) {
        clickToSwitch(iframe)
    }
}

/**
 * Clicks to switch to "Live chat replay" mode if not already on that mode.
 * @param {Document} param0 - An object with a `contentDocument` property representing the document to interact with.
 */
function clickToSwitch({ contentDocument: document }) {
    if (isAlreadyOnLiveChat(document)) return

    const triggerButton = document.querySelector("#trigger")
    if (!triggerButton) return
    triggerButton.click()

    const liveChatButton = document.querySelector("#menu > a:last-of-type")
    if (!liveChatButton) return
    liveChatButton.click()
}

/**
 * Checks if the chat is already on "Live chat replay" mode.
 * @param {Document} document - The document object.
 * @returns {boolean} True if on "Live chat replay" mode, false otherwise.
 */
function isAlreadyOnLiveChat(document) {
    return getDropdownButtonLabelTextContent(document) === "Live chat replay"
}

/**
 * Get the text content of the chat filter dropdown button.
 * @param {Document} document - The document object.
 * @returns {"Top chat replay" | "Live chat replay"} The text content of the dropdown button.
 */
function getDropdownButtonLabelTextContent(document) {
    /** @type {HTMLDivElement} */
    const labelElement = document.querySelector("#label-text")
    return labelElement.textContent
}

/**
 * Wait for a specified selector to become available in the DOM and execute a callback function when found.
 * @param {string} selector - The CSS selector to wait for.
 * @param {(element: Element) => void} callback - The callback function to execute when the selector is found.
 */
function waitForQuerySelector(selector, callback) {
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            // Check if the selector exists in the added nodes
            if (mutation.addedNodes.length > 0) {
                const element = document.body.querySelector(selector)
                if (element) {
                    // Selector found, call the callback function
                    callback(element)
                    // Disconnect the observer since we found what we were looking for
                    observer.disconnect()
                    // Break out of the loop
                    break
                }
            }
        }
    })

    // Start observing for changes
    observer.observe(document.body, { childList: true, subtree: true })
}
