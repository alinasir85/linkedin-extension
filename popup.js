document.addEventListener("DOMContentLoaded", function () {
    const statusElement = document.getElementById("status");
    const connectButton = document.getElementById("connectButton");

    function updateUI(loggedIn) {
        if (loggedIn) {
            statusElement.innerText = "Connected";
            connectButton.style.display = "none";
        } else {
            statusElement.innerText = "";
            connectButton.style.display = "block";
            connectButton.addEventListener("click", function () {
                chrome.runtime.sendMessage({ action: "monitorLogin" });
            });
        }
    }

    chrome.runtime.sendMessage({ action: "checkLogin" }, function (response) {
        updateUI(response.loggedIn);
    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.action === "loginDetected") {
            updateUI(true);
        }
    });
});
