document.getElementById('upload').addEventListener('change', handleImageUpload);
document.getElementById('downloadBtn').addEventListener('click', downloadMeme);
document.getElementById('shareBtn').addEventListener('click', shareMeme);
document.getElementById('addTextBtn').addEventListener('click', addText);

const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
let image = new Image();
let texts = [];
let selectedText = null;
let offsetX, offsetY;

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
    texts.forEach(text => {
        ctx.font = `${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
        ctx.fillStyle = text.fontColor;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.fillText(text.text, text.x, text.y);
        ctx.strokeText(text.text, text.x, text.y);
    });
}

function addText() {
    const fontSize = document.getElementById('fontSize').value;
    const fontColor = document.getElementById('fontColor').value;
    const fontWeight = document.getElementById('fontWeight').value;

    const textDiv = document.createElement('div');
    textDiv.classList.add('draggable-text');
    textDiv.contentEditable = true;
    textDiv.innerText = 'Texte';
    document.getElementById('textContainer').appendChild(textDiv);

    const text = {
        text: 'Texte',
        fontSize: fontSize,
        fontColor: fontColor,
        fontFamily: 'Arial',
        fontWeight: fontWeight,
        x: canvas.width / 2,
        y: canvas.height / 2,
        element: textDiv
    };

    texts.push(text);
    updateTextPosition(text);
    addDragHandlers(textDiv, text);
}

function addDragHandlers(element, text) {
    element.addEventListener('mousedown', (e) => {
        selectedText = text;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });
    document.addEventListener('mousemove', (e) => {
        if (selectedText) {
            const rect = canvas.getBoundingClientRect();
            selectedText.x = e.clientX - rect.left - offsetX + (element.offsetWidth / 2);
            selectedText.y = e.clientY - rect.top - offsetY + (element.offsetHeight / 2);
            updateTextPosition(selectedText);
            drawMeme();
        }
    });
    document.addEventListener('mouseup', () => {
        selectedText = null;
    });

    element.addEventListener('input', () => {
        text.text = element.innerText;
        drawMeme();
    });

    element.addEventListener('focus', () => {
        document.getElementById('fontSize').value = text.fontSize;
        document.getElementById('fontColor').value = text.fontColor;
        document.getElementById('fontWeight').value = text.fontWeight;
        document.getElementById('fontSize').addEventListener('input', () => {
            text.fontSize = document.getElementById('fontSize').value;
            drawMeme();
        });
        document.getElementById('fontColor').addEventListener('input', () => {
            text.fontColor = document.getElementById('fontColor').value;
            drawMeme();
        });
        document.getElementById('fontWeight').addEventListener('change', () => {
            text.fontWeight = document.getElementById('fontWeight').value;
            drawMeme();
        });
    });
}

function updateTextPosition(text) {
    text.element.style.left = `${text.x - (text.element.offsetWidth / 2)}px`;
    text.element.style.top = `${text.y - (text.element.offsetHeight / 2)}px`;
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
    const gallery = document.getElementById('gallery');
    const memeCount = gallery.childElementCount + 1;
    const date = new Date().toLocaleString();

    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');

    const img = new Image();
    img.src = canvas.toDataURL('image/png');
    img.addEventListener('click', () => openPopup(img.src));

    const info = document.createElement('div');
    info.innerHTML = `<p>Image #${memeCount} - Ajoutée le ${date}</p>`;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Supprimer';
    deleteBtn.addEventListener('click', () => gallery.removeChild(galleryItem));

    const viewBtn = document.createElement('button');
    viewBtn.innerText = 'Visualiser';
    viewBtn.addEventListener('click', () => openPopup(img.src));

    info.appendChild(deleteBtn);
    info.appendChild(viewBtn);

    galleryItem.appendChild(info);
    galleryItem.appendChild(img);
    gallery.appendChild(galleryItem);
}

function openPopup(src) {
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popupImg');
    popupImg.src = src;
    popup.style.display = 'block';
}

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
});
