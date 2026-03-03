const supabaseUrl = 'https://evmfeikwgxhuewzmlrau.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bWZlaWt3Z3hodWV3em1scmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDI3MjEsImV4cCI6MjA4NzUxODcyMX0.pBI7AU4xMUP2LpBfpu5tEW2zzYkaG-rLe596mJrtya4';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

if (window.lucide) lucide.createIcons();

let selectedProgramName = '';
let userPrice = "1099.90 RSD";
let uplatnicaIznos = "1099.90";
let uplatnicaValuta = "RSD";

const programsData = {
  'ruka': [
    { id: 'r1', name: 'Trnjenje ruke regija 1', videoUrl: 'https://drive.google.com/file/d/1z7FKFC1VlZiGEOYMoNNUOTLAdhms25hP/preview', img: 'images/regija1.png', desc: 'Detaljan video vodic za prevazilazenje tegobe trnjenja regije prikazane na slici.' },
    { id: 'r2', name: 'Trnjenje ruke regija 2', videoUrl: 'https://drive.google.com/file/d/1Q6-PZ-sEfNJCI8EQ477KLxVbHROa6LTe/preview', img: 'images/regija2.png', desc: 'Detaljan video vodic za prevazilazenje tegobe trnjenja regije prikazane na slici.' }
  ],
  'grudi': [
    { id: 'rm1', name: 'Bolovi u grudima / Interkostal', videoUrl: 'https://drive.google.com/file/d/10-bxGrdTIfDQMZGjJ0cWo5ukDbOTcdtj/preview', img: 'images/grudi1.png', desc: 'Detaljan video vodic za prevazilazenje tegobe bolova u grudima.' }
  ]
};

const DOM = {
  step1: document.getElementById('step-1-categories'),
  step2: document.getElementById('step-2-subcategories'),
  subcatContainer: document.getElementById('subcat-container'),
  purchaseForm: document.getElementById('purchaseForm'),
  
  uplIme: document.getElementById('uplIme'),
  uplSvrha: document.getElementById('uplSvrha'),
  uplPoziv: document.getElementById('uplPoziv'),
  uplIznos: document.getElementById('uplIznos'),
  uplValuta: document.getElementById('uplValuta'),
  uplatnicaElement: document.getElementById('uplatnicaElement'),
  
  submitBtn: document.getElementById('submitBtn'),
  buyerFirstName: document.getElementById('buyerFirstName'),
  buyerLastName: document.getElementById('buyerLastName'),
  buyerEmail: document.getElementById('buyerEmail'),
  buyerPhone: document.getElementById('buyerPhone'),
  
  videoCodeInput: document.getElementById('videoCodeInput'),
  activeUser: document.getElementById('activeUser'),
  countdownTimer: document.getElementById('countdownTimer'),
  activeProgramTitle: document.getElementById('activeProgramTitle'),
  
  errorBox: document.getElementById('errorMessage'),
  videoFrame: document.getElementById('mainVideoFrame'),
  videoLoader: document.getElementById('videoLoader'),
  backToTopBtn: document.getElementById('backToTop')
};

async function setPriceByLocation() {
  try {
    const response = await fetch('https://ipwho.is/');
    const data = await response.json();
    
    if (data && data.success) {
      if (data.country_code !== 'RS') {
        userPrice = "8.99 EUR";
        uplatnicaIznos = "8.99";
        uplatnicaValuta = "EUR";
      } else {
        userPrice = "1099.90 RSD";
        uplatnicaIznos = "1099.90";
        uplatnicaValuta = "RSD";
      }
      console.log(`Lokacija prepoznata: ${data.country_code}. Valuta: ${uplatnicaValuta}`);
    }
  } catch (error) {
    console.warn("Greška pri prepoznavanju lokacije, koristim RSD kao fallback.");
  }

  // Ažuriraj elemente na uplatnici ako su učitani
  if (DOM.uplIznos) DOM.uplIznos.innerText = uplatnicaIznos;
  if (DOM.uplValuta) DOM.uplValuta.innerText = uplatnicaValuta;
}

setPriceByLocation();

function showSubCategories(categoryId) {
  DOM.step1.classList.add('hidden');
  if (programsData[categoryId]) {
    DOM.subcatContainer.innerHTML = programsData[categoryId].map(prog => `
      <div class="group bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col text-left">
      <div class="relative h-52 sm:h-56 bg-gray-100 overflow-hidden">
        <img src="${prog.img}" alt="${prog.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out">
        <div class="absolute top-4 right-4 bg-primary text-dark font-bold px-4 py-1.5 rounded-full shadow-md text-sm tracking-wide z-10">${userPrice}</div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div class="p-6 sm:p-7 flex flex-col flex-grow bg-white relative z-20">
        <h3 class="text-xl font-extrabold text-gray-900 mb-2 line-clamp-1">${prog.name}</h3>
        <p class="text-gray-500 mb-6 text-sm leading-relaxed flex-grow line-clamp-3">${prog.desc}</p>
        <button onclick="openOrderForm('${prog.name}')" class="w-full bg-dark text-white font-semibold py-3.5 rounded-xl hover:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all mt-auto flex justify-center items-center gap-2">
          Kupi program
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>
    `).join('');
  }
  
  DOM.step2.classList.remove('hidden');
  
  setTimeout(() => {
    DOM.step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function backToCategories() {
  DOM.step2.classList.add('hidden');
  DOM.step1.classList.remove('hidden');
}

const toggleModal = (id, show) => {
  const el = document.getElementById(id);
  if(el) {
    el.classList.toggle('modal-hidden', !show);
    el.classList.toggle('modal-visible', show);
  }
};

const openModal = id => toggleModal(id, true);
const closeModal = id => toggleModal(id, false);
const openAccessModal = () => openModal('accessModal');

function openOrderForm(programName) {
  selectedProgramName = programName;
  if(DOM.purchaseForm) DOM.purchaseForm.reset();
  openModal('orderFormModal');
}

const generisiKod = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

async function handleFormSubmit(e) {
  e.preventDefault();
  DOM.submitBtn.innerText = "Slanje...";
  DOM.submitBtn.disabled = true;

  const punoIme = `${DOM.buyerFirstName.value.trim()} ${DOM.buyerLastName.value.trim()}`;
  const email = DOM.buyerEmail.value.trim();
  const telefon = DOM.buyerPhone.value.trim();
  const noviKod = generisiKod();

  const { error } = await supabaseClient.from('pristupi').insert([{ 
    kod: noviKod, 
    ime_prezime: punoIme, 
    telefon,
    program_ime: selectedProgramName 
  }]);

  if (error) {
    console.error(error);
    alert("Greška sa bazom. Molimo pokušajte ponovo.");
    DOM.submitBtn.disabled = false;
    DOM.submitBtn.innerText = "Potvrdi i prikaži uplatnicu";
    return;
  }

  DOM.uplIme.innerText = punoIme;
  DOM.uplSvrha.innerText = `${selectedProgramName}`;
  DOM.uplPoziv.innerText = noviKod;

  fetch("https://formsubmit.co/ajax/prodaja@sinapis.rs", {
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ Ime: punoIme, email, Telefon: telefon, Program: selectedProgramName, Kod: noviKod, _subject: `Nova narudžbina: ${noviKod}` })
  }).catch(err => {
      console.warn("Slanje mejla nije uspelo ali je kod sačuvan", err);
  }).finally(() => {
      DOM.submitBtn.innerText = "Potvrdi i prikaži uplatnicu";
      DOM.submitBtn.disabled = false;
      closeModal('orderFormModal');
      openModal('paymentModal');
  });
}

async function verifyCode() {
    const codeInput = DOM.videoCodeInput.value.trim().toUpperCase();
    
    if (!codeInput) return DOM.errorBox.innerText = 'Unesite kod';
    DOM.errorBox.innerText = 'Proveravam...';

    try {
        const { data, error } = await supabaseClient.from('pristupi').select('*').eq('kod', codeInput).maybeSingle();

        if (error) throw new Error('Greška sa bazom.');
        if (!data) return DOM.errorBox.innerText = 'Kod ne postoji.';
        if (!data.aktivan) return DOM.errorBox.innerText = 'Kod još nije aktiviran.';

        const danas = new Date();
        const vaziDo = new Date(data.vazi_do);

        if (danas > vaziDo) return DOM.errorBox.innerText = 'Kod je istekao.';

        const allPrograms = Object.values(programsData).flat();
        const programInfo = allPrograms.find(p => p.name === data.program_ime);

        if (programInfo && DOM.videoFrame) {
            const razlika = vaziDo - danas;
            const d = Math.floor(razlika / (1000 * 60 * 60 * 24));
            const h = Math.floor((razlika % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((razlika % (1000 * 60 * 60)) / (1000 * 60));

            if (DOM.activeUser) DOM.activeUser.innerText = data.ime_prezime || "Korisnik";
            if (DOM.countdownTimer) DOM.countdownTimer.innerText = `${d}d ${h}h ${m}m`;
            if (DOM.activeProgramTitle) DOM.activeProgramTitle.innerText = data.program_ime;

            if (DOM.videoLoader) DOM.videoLoader.style.display = 'flex';
            DOM.videoFrame.src = programInfo.videoUrl.replace('/view', '/preview');
            DOM.errorBox.innerText = '';
            
            closeModal('accessModal');
            openModal('videoModal');
            
            if (window.lucide) lucide.createIcons();
            
        } else {
            DOM.errorBox.innerText = 'Program nije pronađen.';
        }
    } catch (err) {
        DOM.errorBox.innerText = err.message;
    }
}

function closeVideo() {
  if (DOM.videoFrame) {
    DOM.videoFrame.src = '';
  }
  if (DOM.videoLoader) {
    DOM.videoLoader.style.display = 'flex';
  }
  closeModal('videoModal');
}

let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
        const isVisible = window.scrollY > 300;
        if(DOM.backToTopBtn) {
            DOM.backToTopBtn.classList.toggle('opacity-0', !isVisible);
            DOM.backToTopBtn.classList.toggle('opacity-100', isVisible);
            DOM.backToTopBtn.classList.toggle('pointer-events-none', !isVisible);
            DOM.backToTopBtn.classList.toggle('pointer-events-auto', isVisible);
        }
        scrollTimeout = null;
    }, 50);
});

if(DOM.backToTopBtn) {
  DOM.backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function preuzmiUplatnicu() {
  if (typeof html2canvas === 'undefined') {
      alert("Sistem za preuzimanje se učitava. Molimo sačekajte par sekundi pa pokušajte ponovo.");
      return;
  }
  
  html2canvas(DOM.uplatnicaElement, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    scrollY: -window.scrollY
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'Uplatnica.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(err => {
    console.error("Greška pri skidanju slike", err);
  });
}