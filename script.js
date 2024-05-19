document.getElementById('upload').addEventListener('change', handleImageUpload);
document.getElementById('topText').addEventListener('input', drawMeme);
document.getElementById('bottomText').addEventListener('input', drawMeme);
document.getElementById('fontSize').addEventListener('input', drawMeme);
document.getElementById('fontColor').addEventListener('input', drawMeme);
document.getElementById('fontFamily').addEventListener('change', drawMeme);
document.getElementById('fontWeight').addEventListener('change', drawMeme);
document.getElementById('downloadBtn').addEventListener('click', downloadMeme);
document.getElementById('shareBtn').addEventListener('click', shareMeme);

const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
let image = new Image();

function handleImageUpload(event) {
    const reader = new FileReader();
    reader.onload = function(event) {
        image.src = event.target.result;
        image.onload = function() {
            canvas.width = 800;
            canvas.height = 600;
            drawMeme();
        };
    };
    reader.readAsDataURL(event.target.files[0]);
}

function drawMeme() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, 800, 600);

    const fontSize = document.getElementById('fontSize').value;
    const fontColor = document.getElementById('fontColor').value;
    const fontFamily = document.getElementById('fontFamily').value;
    const fontWeight = document.getElementById('fontWeight').value;

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = fontColor;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';

    const topText = document.getElementById('topText').value;
    const bottomText = document.getElementById('bottomText').value;

    ctx.fillText(topText, canvas.width / 2, 40);
    ctx.strokeText(topText, canvas.width / 2, 40);

    ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
    ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
}

function downloadMeme() {
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    addMemeToGallery();
}

function shareMeme() {
    canvas.toBlob(blob => {
        const file = new File([blob], 'meme.png', { type: 'image/png' });
        const data = { files: [file] };

        if (navigator.canShare && navigator.canShare(data)) {
            navigator.share(data).catch(console.error);
        } else {
            alert('Partage non supporté sur ce navigateur');
        }
    });
}

function addMemeToGallery() {
    const img = new Image();
    img.src = canvas.toDataURL('image/png');
    img.addEventListener('click', function() {
        openPopup(img.src);
    });
    document.getElementById('gallery').appendChild(img);
}

function openPopup(src) {
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popupImg');
    popupImg.src = src;
    popup.style.display = 'block';
}

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});
