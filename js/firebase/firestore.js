import { db } from "./firebase.js";
import { collection, addDoc, query, where, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const initFirestore = async () => {
  const ref = doc(db, "index", "main");
  const snap = await getDoc(ref);

  const initialData = {
    carousel: [
      {
        id: 1,
        url: "https://res.cloudnary.com/djtomsyj8/image/upload/f_webp/v1774990714/24_bvmpvy.jpg",
        name: "Foto 1",
      },
      {
        id: 2,
        url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990661/2_rjgcf3.jpg",
        name: "Foto 2",
      },
      {
        id: 3,
        url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990646/27_m7lwwl.jpg",
        name: "Foto 3",
      },
      {
        id: 4,
        url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990591/22_l9hheo.jpg",
        name: "Foto 4",
      },
    ],
    testimony: [
      {
        id: 1,
        name: "PERSONA",
        url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990595/5_oeuaik.jpg",
        description:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et nostrus. Fugit dolore aspernatur illo nisi, nesciunt quisquam? Perspiciatis, non nostrum.",
      },
      {
        id: 2,
        name: "PERSONA",
        url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990590/18_tf5xcn.jpg",
        description:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit dolore aspernatur illo nisi, nesciunt quisquam? Perspiciatis, non nostrum.",
      },
      {
        id: 3,
        name: "PERSONA",
        url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990591/21_zko009.jpg",
        description:
          "Lorem ipsum dolor sit, adipisicing elit. Et nostrum laboriosam eligendi aspernatur non tenetur eius iure nam quos. Fugit dolore aspernatur illo nisi, nesciunt quisquam? Perspiciatis, non nostrum.",
      },
    ],
    profile: [
      {
        id: "f1",
        name: "Foto 1",
        url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990589/17_vjzsse.jpg",
      },
      {
        id: "f2",
        name: "Foto 2",
        url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990590/18_tf5xcn.jpg",
      },
    ],
    profileText: [
      {
        id: "p1",
        description:
          "Soy la cara detrás de las hermosas historias que capturo día a día. Tengo 31 años, soy mamá de una bella niña y además fotógrafa, hace más de 10 años.",
      },
      {
        description:
          "<strong>Mi camino por esta mágica profesión comenzó cuando empecé a ver el mundo en imágenes, las imágenes en historias y estas en momentos por ser retratados</strong>. Y ahí estaba yo, dispuesta a cumplir los sueños de mis clientes.",
      },
      {
        description:
          "Día a día me perfecciono para cumplir sus expectativas y deseos, poniéndole el corazón a cada sesión, mi ojo entrenado y la creatividad a flor de piel. Pongo a disposición de mis clientes toda mi experiencia para realizar las fotos más emotivas y bellas, <strong>cada persona que pasa por mi lente, deja un emocionante relato marcado</strong>.",
      },
      {
        description:
          "Mi estilo combina lo documental y lo artístico con un enfoque que captura emociones y personalidades auténticas.",
      },
      {
        description:
          "Mi trabajo se basa en la <strong>conexión real</strong> y la <strong>narrativa honesta</strong>. Me atraen los momentos intermedios: ese <strong>caos</strong>, esa <strong>emoción</strong> y esa <strong>alegría</strong> que hacen de un día algo inolvidable. Te ayudaré a sentirte como tú mismo frente a la cámara, para que tus fotos reflejen la energía, el movimiento y el significado del momento.",
      },
      {
        description:
          "Me encanta documentar cualquier persona que celebre algo especial, grande o pequeño.",
      },
      {
        description:
          "¿Mi objetivo? Darte fotos que se sientan como recuerdos: <strong>auténticas, conmovedoras y tan hermosas</strong> que dentro de unos años se vean como lo son hoy.",
      },
      { description: "De esas que volverás una y otra vez." },
    ],
    portfolio: {
      nf: {
        link: "/html/portfolio_newborn&family.html",
        preview: [
          {
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990625/2_ps3ent.jpg",
            name: "Foto 1",
          },
          {
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990636/17_ag8fkj.jpg",
            name: "Foto 2",
          },
          {
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990640/20_iilwqp.jpg",
            name: "Foto 3",
          },
          {
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990641/25_e3usxe.jpg",
            name: "Foto 4",
          },
        ],
        images: [
          {
            id: "f1",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990623/1_wbnvel.jpg",
            name: "Foto 1",
          },
          {
            id: "f2",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990635/13_qgfrrk.jpg",
            name: "Foto 2",
          },
          {
            id: "f3",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990639/22_fjetjt.jpg",
            name: "Foto 3",
          },
          {
            id: "f4",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990645/24_dnh0io.jpg",
            name: "Foto 4",
          },
          {
            id: "f5",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990646/28_h53mwg.jpg",
            name: "Foto 5",
          },
          {
            id: "f6",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990628/5_dtj8ue.jpg",
            name: "Foto 6",
          },
          {
            id: "f7",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990642/26_rb22bx.jpg",
            name: "Foto 7",
          },
          {
            id: "f8",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990639/23_uksyqu.jpg",
            name: "Foto 8",
          },
        ],
      },
      xv: {
        link: "/html/portfolio_xv.html",
        preview: [
          {
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990700/12_jjsj5t.jpg",
            name: "Foto 1",
          },
          {
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990700/4_ouykgw.jpg",
            name: "Foto 2",
          },
          {
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990692/1_zaxwrb.jpg",
            name: "Foto 3",
          },
          {
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990711/17_dzpbw5.jpg",
            name: "Foto 4",
          },
        ],
        images: [
          {
            id: "f1",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990695/3_rtbx1t.jpg",
            name: "Foto 1",
          },
          {
            id: "f2",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990698/6_rpngqv.jpg",
            name: "Foto 2",
          },
          {
            id: "f3",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990702/10_to5tdv.jpg",
            name: "Foto 3",
          },
          {
            id: "f4",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990716/28_drp28y.jpg",
            name: "Foto 4",
          },
          {
            id: "f5",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990707/14_jfdums.jpg",
            name: "Foto 5",
          },
          {
            id: "f6",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990714/22_wuomfh.jpg",
            name: "Foto 6",
          },
          {
            id: "f7",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990715/29_l0yrqf.jpg",
            name: "Foto 7",
          },
          {
            id: "f8",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990697/7_vdxorn.jpg",
            name: "Foto 8",
          },
        ],
      },
      wd: {
        link: "/html/portfolio_weddings.html",
        preview: [
          {
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990676/8_ipmeca.jpg",
            name: "Foto 1",
          },
          {
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990661/2_rjgcf3.jpg",
            name: "Foto 2",
          },
          {
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990678/9_dtfsdm.jpg",
            name: "Foto 3",
          },
          {
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990672/7_jfllkn.jpg",
            name: "Foto 4",
          },
        ],
        images: [
          {
            id: "f1",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990661/1_q4u8av.jpg",
            name: "Foto 1",
          },
          {
            id: "f2",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990661/2_rjgcf3.jpg",
            name: "Foto 2",
          },
          {
            id: "f3",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990669/3_g8t7de.jpg",
            name: "Foto 3",
          },
          {
            id: "f4",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990669/4_kfjpoa.jpg",
            name: "Foto 4",
          },
          {
            id: "f5",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990670/5_mhjpcl.jpg",
            name: "Foto 5",
          },
          {
            id: "f6",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990671/6_ivt8tb.jpg",
            name: "Foto 6",
          },
          {
            id: "f7",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990672/7_jfllkn.jpg",
            name: "Foto 7",
          },
          {
            id: "f8",
            url: "https://res.cloudinary.com/djtomsyj8/image/upload/f_webp/v1774990676/8_ipmeca.jpg",
            name: "Foto 8",
          },
        ],
      },
    },
    disclaimer: [
      { disclaimer: "TOTAL CON <strong>10%</strong> DE DESCUENTO." },
      {
        disclaimer:
          "<strong>50%</strong> PARA CONGELAR Y <strong>50%</strong> A ACORDAR.",
      },
      {
        disclaimer:
          "EN CUOTAS CON <strong>10%</strong> DE RECARGO POR MES VENCIDO.",
      },
      {
        disclaimer:
          "<strong>EL TOTAL DEL SERVICIO DEBE SER CANCELADO ANTES DEL EVENTO.</strong>",
      },
    ],
  };
  
  if (!snap.exists()) {
    await setDoc(ref, initialData);
    console.log("Datos en Firestore creados correctamente");
  } else {
    await setDoc(ref, initialData, { merge: true });
    console.log("Los datos en Firestore están actualizados");
  }
};












// export async function insert(item) {
//   try {
//     const response = await addDoc(collection(firestore, "usuarios"), item);
//     return response;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// export async function getItems(uid) {
//   try {
//     const q = query(collection(firestore, "usuarios"), where("userid", "==", uid));

//     const response = await getDocs(q);
    
//     const items = [];
//     response.forEach((item) => {
//       items.push(item.data());
//     });
//     return items;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// export async function updateid item) {

//   try {
//     const q = query(collection(firestore, "usuarios"), where(id, "==",id);
    
//     const response = await getDocs(q);
    
//     let docId = null;
//     response.forEach(d => {
//       docId = did
//     });

//     if (!docId) throw new Error("Documento no encontrado");
    
//     const reference = doc(firestore, "usuarios", docId);

//     await updateDoc(reference, { completed: item.completed });
//   } catch (error) { throw new Error("Error al actualizar: " + error.message);
//   }
// }