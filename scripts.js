const uploadButton = document.getElementById("upload");
const imgDOM = document.getElementById("images-container");
const downloadButton = document.getElementById("download");

// download all blob images as zip (image/xxx list)
downloadButton.addEventListener("click", async () => {
    const files = uploadButton.files;
    if (files.length === 0) {
        alert("Please upload images first.");
        return;
    }
    const zip = new JSZip();
    // get all images from image container
    const images = imgDOM.querySelectorAll("img");
    images.forEach((image, index) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        const base64 = canvas.toDataURL("image/png");
        zip.file(`image-${index}.png`, base64.split(",")[1], { base64: true });
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `images-${new Date().getTime()}.zip`);
});

function createImageFromFile(workspace, file) {
    return new Promise((resolve, reject) => {
        const row = document.createElement("div");
        row.class = "row";
        const column = document.createElement("div");
        column.class = "column";
        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);
        image.onload = () => {
        URL.revokeObjectURL(image.src);
        resolve(image);
        };
        image.onerror = () => {
        reject("Failure to load image.");
        };
        column.appendChild(image);
        row.appendChild(column);
        workspace.appendChild(row);
    });
}

function getFileBase64Encode(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

function handleFiles() {
    imgDOM.innerHTML = ``;
    const fileList = this.files;
    console.log(fileList);
    for (const file of fileList) {
        createImageFromFile(imgDOM, file);
        getFileBase64Encode(file);
    }
}

uploadButton.addEventListener("change", handleFiles, false);
