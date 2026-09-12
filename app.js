// =============================================
//  BIO DATA — app.js
//  Firebase Firestore + Storage
// =============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// 🔴 REMPLACER PAR VOS VRAIES CLÉS FIREBASE
const firebaseConfig = {
  apiKey:            "VOTRE_API_KEY",
  authDomain:        "VOTRE_PROJECT.firebaseapp.com",
  projectId:         "VOTRE_PROJECT_ID",
  storageBucket:     "VOTRE_PROJECT.appspot.com",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId:             "VOTRE_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const storage = getStorage(app);

// ---- Collecter les données du formulaire ----
function collectFormData() {
  const f = document.getElementById('bioForm');
  const data = {};

  // Champs texte simples
  const fields = [
    'ref','salary','post','fullname',
    'nationality','religion','dob','age',
    'pob','marital','children','weight','height','education',
    'ppNumber','ppIssue','ppPlace','ppExpiry'
  ];
  fields.forEach(name => {
    const el = f.elements[name];
    data[name] = el ? el.value.trim() : '';
  });

  // Langues
  ['lang_en','lang_ar','lang_fr'].forEach(name => {
    const el = f.elements[name];
    data[name] = el ? el.value : '';
  });

  // Expériences (on cherche toutes les lignes)
  const experiences = [];
  let i = 0;
  while (f.elements[`exp_country_${i}`]) {
    const country = f.elements[`exp_country_${i}`]?.value?.trim() || '';
    const period  = f.elements[`exp_period_${i}`]?.value?.trim()  || '';
    const work    = f.elements[`exp_work_${i}`]?.value?.trim()    || '';
    if (country || period || work) {
      experiences.push({ country, period, work });
    }
    i++;
  }
  data.experiences = experiences;

  return data;
}

// ---- Générer un ID unique ----
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---- Fonction principale : générer le lien ----
window.generateLink = async function() {
  const btn = document.querySelector('.btn-primary');
  btn.textContent = '⏳ Enregistrement…';
  btn.disabled = true;

  try {
    const formData = collectFormData();
    const id = uid();

    // Upload photo si présente
    if (window._photoBase64) {
      const photoRef = ref(storage, `photos/${id}.jpg`);
      await uploadString(photoRef, window._photoBase64, 'data_url');
      const url = await getDownloadURL(photoRef);
      formData.photoURL = url;
    }

    // Enregistrer dans Firestore
    await setDoc(doc(db, 'fiches', id), {
      ...formData,
      createdAt: new Date().toISOString()
    });

    // Construire le lien
    const base = window.location.href.replace('index.html', '').replace(/\/$/, '');
    const link = `${base}/view.html?id=${id}`;

    // Afficher le lien
    document.getElementById('generatedLink').value = link;
    document.getElementById('linkBox').style.display = 'block';
    document.getElementById('linkBox').scrollIntoView({ behavior: 'smooth' });

  } catch (err) {
    console.error(err);
    alert('Erreur lors de la génération du lien. Vérifiez la configuration Firebase.');
  } finally {
    btn.textContent = '🔗 Générer le lien de partage';
    btn.disabled = false;
  }
};
