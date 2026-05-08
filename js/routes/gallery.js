import { db } from "../firebase/firebase.js"
import { getDocData } from "../utils/data.js";
import { cloudinaryConfig } from "../config.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function initGallery() {
  const gridGallery = document.getElementById("grid-gallery");
  const uploadInput = document.getElementById("upload");
  const uploadBtn = document.getElementById("uploadBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const dropzone = document.getElementById("dropzone");
  const container = document.getElementById("preview-container");
  const btnConfirm = document.getElementById("btnConfirmUpload");

  let selectedImages = new Set();
  let currentSection = "nf";

  const generateSignature = async(publicId, timestamp) => {
    const text = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryConfig.secret_apiKey}`;
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });
  
    return await res.json();
  }

  const deleteFromCloudinary = async (publicId) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await generateSignature(publicId, timestamp);

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("signature", signature);
    formData.append("api_key", cloudinaryConfig.apiKey);
    formData.append("timestamp", timestamp);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`, {
      method: "POST",
      body: formData
    });

    return await res.json();
  }

  const saveImage = async (section, ImageData) => {
    const ref = doc(db, "gallery", "main");

    await setDoc(ref, {
      [section]: arrayUnion(ImageData)
    }, { merge: true });
  };

  const getGallery = async () => {
    const ref = doc(db, "gallery", "main");
    const snap = await getDoc(ref);

    return snap.exists() ? snap.data() : {};
  }

  const updateDeleteBtnVisibility = () => {
    deleteBtn.style.display = selectedImages.size > 0 ? "block" : "none";
  }

  const renderGallery = async () => {
    const data = await getGallery();
    const images = data[currentSection] || [];
    gridGallery.innerHTML = "";

    updateDeleteBtnVisibility();

    images.forEach(img => {
      const div = document.createElement("div");
      div.classList.add("gallery__item");
      div.innerHTML = `<img src="${img.url}" loading="lazy">`;

      div.addEventListener("click", () => {
        div.classList.toggle("selected");

        if (selectedImages.has(img.public_id)) {
          selectedImages.delete(img.public_id);
        } else {
          selectedImages.add(img.public_id);
        }
        updateDeleteBtnVisibility();
      });
      gridGallery.appendChild(div);
    });
  }

  const deleteSelected = async (e) => {
    if (e) e.preventDefault();
    if (selectedImages.size === 0) return;
    
    const data = await getGallery();
    const images = data[currentSection] || [];
    const ref = doc(db, "gallery", "main");
    
    for (const pid of selectedImages) {
      try {
        const resCloud = await deleteFromCloudinary(pid);
        if (resCloud.result === "ok") {
          const imgToRemove = images.find(img => img.public_id === pid);
          if(imgToRemove) {
            await updateDoc(ref, {[currentSection]: arrayRemove(imgToRemove)});
        }
      }
    } catch (error) {
      console.error("Error al eliminar la imagen " + pid, error);      
    }
  }
  selectedImages.clear();
  updateDeleteBtnVisibility();
  renderGallery();
}

  let filesToUpload = [];

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isSmallEnough = file.size < 5 * 1024 * 1024;;
      if (!isImage) { alert(`${file.name}, no es una imagen válida.`); }
      if (!isSmallEnough) { alert(`${file.name}, es demasiado pesado (máx 5MB).`); }
      return isImage && isSmallEnough;
    });
    filesToUpload = [...filesToUpload, ...validFiles];
    renderPreview();
  }

  const renderPreview = () => {
    container.innerHTML = "";

    filesToUpload.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const div = document.createElement("div");
        div.classList.add("preview__item");
        div.innerHTML = `<img src="${e.target.result}" style="width: 10rem; height: 10rem; object-fit: cover;">
        <button type="button" class="btn-remove" data-index="${index}">❌</button>`;
        container.appendChild(div);
      };
      reader.readAsDataURL(file);
    });

    btnConfirm.style.display = filesToUpload.length > 0 ? "block" : "none";
  }
  
  const uploadAllFiles = async () => {
    btnConfirm.disabled = true;
    btnConfirm.textContent = "Subiendo...";

    for (const file of filesToUpload) {
      try {
        const uploaded = await uploadImage(file);
        const imageData = {
          url: uploaded.secure_url,
          public_id: uploaded.public_id
        };
        await saveImage(currentSection, imageData);
      } catch(error) {
        console.error("Error al subir uno de los archivos", error);
      };
    }
    filesToUpload = [];
    renderPreview();
    renderGallery();
    alert("¡Todas las fotos seleccionadas han sido subidas!");
  }

  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-remove")) {
      e.preventDefault();
      const index = e.target.dataset.index;
      filesToUpload.splice(index, 1);
      renderPreview();
    }
  });
  
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.style.borderColor = "#000"; });
  dropzone.addEventListener("dragleave", () => { dropzone.style.borderColor = "#ddd"; });
  dropzone.addEventListener("drop", (e) => { e.preventDefault(); dropzone.style.borderColor = "#ccc";
    handleFiles(e.dataTransfer.files)
  });

  btnConfirm.addEventListener("click", (e) => { e.preventDefault(); uploadAllFiles(); });
  
  uploadInput.addEventListener("change", async (e) => handleFiles(e.target.files));

  uploadBtn.addEventListener("click", (e) => { e.preventDefault(); uploadInput.click()});

  deleteBtn.addEventListener("click", (e) => { e.preventDefault(); deleteSelected(); });

  renderGallery();
}


