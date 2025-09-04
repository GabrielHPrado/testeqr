const video = document.getElementById("video");
const qrResult = document.getElementById("qr-result");

// Acessar a câmera frontal
navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" } // "user" = frontal, "environment" = traseira
}).then(stream => {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // Para iOS
    requestAnimationFrame(tick);
}).catch(err => {
    alert("Erro ao acessar a câmera: " + err);
});

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
            qrResult.textContent = "QR Code: " + code.data;
        } else {
            qrResult.textContent = "Aponte para um QR Code";
        }
    }
    requestAnimationFrame(tick);
}
