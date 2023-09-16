const toggleInput = document.getElementById("toggleExtension")

toggleInput.addEventListener("change", e => {
    const isChecked = e.target.checked

    ;(async () => {
        const firstTab = await getCurrentTab()
        const options = { toggleExtension: isChecked }
        await sendOptions(firstTab, options)
    })()
})

async function getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true }
    const [firstTab] = await chrome.tabs.query(queryOptions)
    return firstTab
}

async function sendOptions(firstTab, options) {
    await chrome.tabs.sendMessage(firstTab.id, options)
}
