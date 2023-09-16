chrome.storage.local.get().then(({ isEnabled }) => {
    if (isEnabled) {
        switchToLiveChat()
    }
})

// TODO: Maybe add try/catch?
chrome.runtime.onMessage.addListener(({ isEnabled }) => {
    if (isEnabled) {
        switchToLiveChat()
    }
})

function switchToLiveChat() {
    waitForQuerySelector("#chatframe", iframe => {
        iframe.contentWindow.addEventListener("load", () => {
            const triggerButton =
                iframe.contentDocument.querySelector("#trigger")
            if (!triggerButton) return
            triggerButton.click()
            const liveChatButton = iframe.contentDocument.querySelector(
                '#menu > a[aria-selected="false"]',
            )
            if (!liveChatButton) return
            liveChatButton.click()
        })
    })
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
