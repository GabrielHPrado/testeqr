const video = document.getElementById("video");
const qrResult = document.getElementById("qr-result");
const toggleBtn = document.getElementById("toggle-camera");

let currentFacingMode = "user"; // "user" = frontal, "environment" = traseira
let stream = null;

// Função para iniciar a câmera
async function startCamera() {
    if (stream) {
        // Para a câmera atual
        stream.getTracks().forEach(track => track.stop());
    }

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentFacingMode }
        });
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // Para iOS
        requestAnimationFrame(tick);
    } catch (err) {
        alert("Erro ao acessar a câmera: " + err);
    }
}

// Alternar câmera ao clicar no botão
toggleBtn.addEventListener("click", () => {
    currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
    startCamera();
});

// Função de leitura do QR Code
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

// Inicia a câmera ao carregar a página
startCamera();
