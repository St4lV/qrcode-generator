const url_input = document.getElementById("url-input");
const send_btn = document.getElementById("send-btn");
const returned_img = document.getElementById("returned-img");
const log = document.getElementById("display-log");

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (err) {
        return false;
    }
}

async function postRequest() {
    const url = url_input.value.trim();
    if (!url) {
        log.innerText="URL field can't be empty.";
        return;
    }
    if (!isValidUrl(url)) {
        log.innerText='Please enter a valid URL (ex: https://example.com)';
        return;
    }
    const existingElements = returned_img.querySelectorAll('.returned-img-comp');
    const urlExists = Array.from(existingElements).some(element => {
        return element.getAttribute('data-url') === url;
    });

    if (urlExists) {
        log.innerText='URL Already generated !';
        return;
    }

    try {
        const response = await fetch("/generate-qr-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: url }),
        });

        if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            returned_img.innerHTML += `<fieldset class="returned-img-comp" data-url="${url}"><img class="returned-img" src="${imageUrl}" alt="QR Code"><a href="${url}" target="_blank">${(url.split("://")[1].split("/")[0])}</a></fieldset>`;
            url_input.value = "";
            log.innerText='QR Code generated successfully !'
        } else {
            log.innerText="Error while generating URL";
        }
    } catch (error) {
        log.innerText=error.error;
    }
}

send_btn.addEventListener("click", postRequest);
url_input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        postRequest();
    }
});