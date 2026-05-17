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
  const galleryPanel = document.getElementById("gallery-panel");

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
    deleteBtn.disabled = selectedImages.size === 0;
  }

  const setSystemBusy = (isBusy) => {
    uploadBtn.disabled = isBusy;
    deleteBtn.disabled = isBusy;
    btnConfirm.disabled = isBusy;
  }

  const renderGallery = async () => {
    const data = await getGallery();
    const images = data[currentSection] || [];
    gridGallery.innerHTML = "";

    updateDeleteBtnVisibility();

    images.forEach(img => {
      const div = document.createElement("div");
      div.classList.add("gallery__item");
      div.dataset.pid = img.public_id;
      div.innerHTML = `<img src="${img.url}" loading="lazy">`;

      div.addEventListener("click", (e) => {
        e.stopPropagation();
        const pid = div.dataset.pid;
        
        if (e.ctrlKey) {
        const isSelected = div.classList.toggle("selected");
          if (isSelected) {
            selectedImages.add(pid);
          } else {
            selectedImages.delete(pid);
          }
        } else {
          document.querySelectorAll(".gallery__item").forEach(item => {
            if(item !== div) item.classList.remove("selected");
          });
          selectedImages.clear();
          div.classList.add("selected");
          selectedImages.add(pid);
        }
        updateDeleteBtnVisibility();
      });
      gridGallery.appendChild(div);
    });
  }
  // --- LÓGICA DE SELECCIÓN POR ARRASTRE (MARQUEE) ---
    let isSelecting = false;
    let startX, startY;
    let allItems = []; // Para no buscarlos 60 veces por segundo
    const marquee = document.createElement("div");
    marquee.classList.add("selection-marquee");

    gridGallery.addEventListener("mousedown", (e) => {
      // if (e.target !== gridGallery);
      if (e.target.tagName === "IMG") { 
        e.preventDefault();
        return;
      }

      isSelecting = true;
      if (!e.ctrlKey) {
        selectedImages.clear();
        document.querySelectorAll(".gallery__item").forEach(item => item.classList.remove("selected"));
      }
      
      allItems = Array.from(document.querySelectorAll(".gallery__item"));
      
      // Usamos clientX/Y para que sea relativo a lo que ves, no a la página entera
      startX = e.clientX;
      startY = e.clientY;

      marquee.style.left = `${startX}px`;
      marquee.style.top = `${startY}px`;
      marquee.style.width = "0px";
      marquee.style.height = "0px";
      document.body.appendChild(marquee);

      updateDeleteBtnVisibility();  
    });

    window.addEventListener("mousemove", (e) => {
      if (!isSelecting) return;

      e.preventDefault();

      // 1. Obtenemos los límites de la galería
      const gridRect = gridGallery.getBoundingClientRect();

      // 2. Limitamos el mouse para que la caja no salga de la galería
      const currentX = Math.max(gridRect.left, Math.min(e.clientX, gridRect.right));
      const currentY = Math.max(gridRect.top, Math.min(e.clientY, gridRect.bottom));

      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      marquee.style.width = `${width}px`;
      marquee.style.height = `${height}px`;
      marquee.style.left = `${Math.min(currentX, startX)}px`;
      marquee.style.top = `${Math.min(currentY, startY)}px`;

      const marqueeRect = marquee.getBoundingClientRect();

      allItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const pid = item.dataset.pid;

        const isOverlapping = !(
          marqueeRect.right < itemRect.left || 
          marqueeRect.left > itemRect.right || 
          marqueeRect.bottom < itemRect.top || 
          marqueeRect.top > itemRect.bottom
        );

        if (isOverlapping) {
          item.classList.add("selected");
          selectedImages.add(pid);
        } else {
          // Solo deseleccionamos lo que NO estaba marcado antes del arrastre
          // si querés que el arrastre siempre "sume", sacá este else.
          item.classList.remove("selected");
          selectedImages.delete(pid);
        }
    });
    updateDeleteBtnVisibility();
  });


  window.addEventListener("mouseup", () => {
    if (!isSelecting) return;
    isSelecting = false;
    if (marquee.parentNode) marquee.parentNode.removeChild(marquee);
    updateDeleteBtnVisibility();
  });

  galleryPanel.addEventListener("mousedown", (e) => {
    const clickPhoto = e.target.closest(".gallery__item");
    const clickControls = e.target.closest(".container");
    const clickPreview = e.target.closest(".dropzone");
    const clickDropzone = e.target.closest(".preview-grid");
    const clickButtons = e.target.closest(".button-container");

    if (!clickPhoto && !clickControls && !clickPreview && !clickDropzone && !clickButtons) {
      selectedImages.clear();

      document.querySelectorAll(".gallery__item").forEach(item => {
        item.classList.remove("selected");
      });

      updateDeleteBtnVisibility();
    }
  });

  const deleteSelected = async (e) => {
    if (e) e.preventDefault();
    if (selectedImages.size === 0) return;
    
    setSystemBusy(true);
    deleteBtn.textContent = "Eliminando..."

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

    deleteBtn.textContent = "Eliminar"
    setSystemBusy(false);
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
        div.innerHTML = `<img src="${e.target.result}">
        <button type="button" class="btn-remove" data-index="${index}">❌</button>`;
        container.appendChild(div);
      };
      reader.readAsDataURL(file);
    });

    btnConfirm.style.display = filesToUpload.length > 0 ? "block" : "none";
  }
  
  const uploadAllFiles = async () => {
    setSystemBusy(true);
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
    btnConfirm.textContent = "Subir fotos";
    setSystemBusy(false);
    btnConfirm.disabled = false;


    renderPreview();
    renderGallery();
    setTimeout(() => alert("¡Todas las fotos seleccionadas han sido subidas!"), 100);
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
  
  uploadInput.addEventListener("change", async (e) => {
    handleFiles(e.target.files);
    uploadBtn.disabled = true;
    updateDeleteBtnVisibility();
  });

  uploadBtn.addEventListener("click", (e) => { e.preventDefault();
    deleteBtn.disabled = true;
    uploadBtn.disabled = true;    
    uploadInput.click()
  });

  deleteBtn.addEventListener("click", (e) => { 
    e.preventDefault(); 
    deleteBtn.disabled = true;
    uploadBtn.disabled = true;
    deleteSelected();
  });

  renderGallery();
}


