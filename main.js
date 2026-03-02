    const supabaseUrl = 'https://evmfeikwgxhuewzmlrau.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bWZlaWt3Z3hodWV3em1scmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDI3MjEsImV4cCI6MjA4NzUxODcyMX0.pBI7AU4xMUP2LpBfpu5tEW2zzYkaG-rLe596mJrtya4';
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

    lucide.createIcons();

    let selectedProgramName = '';
    let userPrice = "1099 RSD";

    async function setPriceByLocation() {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code !== 'RS') {
          userPrice = "8.99 EUR";
        }
      } catch (error) {
        console.log("Lokacija nije pronađena");
      }
    }

    setPriceByLocation();
    const programsData = {
      'ruka': [
        { id: 'r1', name: 'Trnjenje ruke regija 1', videoUrl: 'https://drive.google.com/file/d/1z7FKFC1VlZiGEOYMoNNUOTLAdhms25hP/preview', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80', desc: 'Detaljan video vodic za prevazilazenje tegobe trnjenja regije prikazane na slici.' },
        { id: 'r2', name: 'Trnjenje ruke regija 2', videoUrl: 'https://drive.google.com/file/d/1Q6-PZ-sEfNJCI8EQ477KLxVbHROa6LTe/preview', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80', desc: 'Detaljan video vodic za prevazilazenje tegobe trnjenja regije prikazane na slici.' }
      ],
      'grudi': [
        { id: 'rm1', name: 'Bolovi u grudima / Interkostal', videoUrl: 'https://drive.google.com/file/d/10-bxGrdTIfDQMZGjJ0cWo5ukDbOTcdtj/preview', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80', desc: 'Detaljan video vodic za prevazilazenje tegobe bolova u grudima.' }
      ],
    };

    const DOM = {
      step1: document.getElementById('step-1-categories'),
      step2: document.getElementById('step-2-subcategories'),
      subcatContainer: document.getElementById('subcat-container'),
      purchaseForm: document.getElementById('purchaseForm'),
      uplIme: document.getElementById('uplIme'),
      uplSvrha: document.getElementById('uplSvrha'),
      uplPoziv: document.getElementById('uplPoziv'),
      errorBox: document.getElementById('errorMessage'),
      videoFrame: document.getElementById('mainVideoFrame'),
      backToTopBtn: document.getElementById('backToTop')
    };

    function showSubCategories(categoryId) {
      DOM.step1.classList.add('hidden');
      if (programsData[categoryId]) {
        DOM.subcatContainer.innerHTML = programsData[categoryId].map(prog => `
          <div class="group bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden flex flex-col text-left">
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
    }

    function backToCategories() {
      DOM.step2.classList.add('hidden');
      DOM.step1.classList.remove('hidden');
    }

    const toggleModal = (id, show) => {
      const el = document.getElementById(id);
      el.classList.toggle('modal-hidden', !show);
      el.classList.toggle('modal-visible', show);
    };

    const openModal = id => toggleModal(id, true);
    const closeModal = id => toggleModal(id, false);
    const openAccessModal = () => openModal('accessModal');

    function openOrderForm(programName) {
      selectedProgramName = programName;
      DOM.purchaseForm.reset();
      openModal('orderFormModal');
    }

    const generisiKod = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    async function handleFormSubmit(e) {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      btn.innerText = "Slanje...";
      btn.disabled = true;

      const ime = document.getElementById('buyerFirstName').value.trim();
      const prezime = document.getElementById('buyerLastName').value.trim();
      const email = document.getElementById('buyerEmail').value.trim();
      const telefon = document.getElementById('buyerPhone').value.trim();
      const punoIme = `${ime} ${prezime}`;
      const noviKod = generisiKod();

      const { error } = await supabaseClient.from('pristupi').insert([{ 
        kod: noviKod, 
        ime_prezime: punoIme, 
        telefon,
        program_ime: selectedProgramName 
      }]);

      if (error) {
        console.error(error);
        alert("Greska sa bazom. Proveri RLS polise.");
        btn.disabled = false;
        btn.innerText = "Potvrdi i prikaži uplatnicu";
        return;
      }

      DOM.uplIme.innerText = punoIme;
      DOM.uplSvrha.innerText = `Program: ${selectedProgramName}`;
      DOM.uplPoziv.innerText = noviKod;

      fetch("https://formsubmit.co/ajax/kontakt@sinapis.rs", {
          method: "POST",
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ Ime: punoIme, email, Telefon: telefon, Program: selectedProgramName, Kod: noviKod, _subject: `Nova narudžbina: ${noviKod}` })
      }).finally(() => {
          btn.innerText = "Potvrdi i prikaži uplatnicu";
          btn.disabled = false;
          closeModal('orderFormModal');
          openModal('paymentModal');
      });
    }

    async function verifyCode() {
        const codeInput = document.getElementById('videoCodeInput').value.trim().toUpperCase();
        
        if (!codeInput) return DOM.errorBox.innerText = 'Unesite kod';
        DOM.errorBox.innerText = 'Proveravam...';

        try {
            const { data, error } = await supabaseClient.from('pristupi').select('*').eq('kod', codeInput).maybeSingle();

            if (error) throw new Error('Greška pri povezivanju sa bazom.');
            if (!data) return DOM.errorBox.innerText = 'Kod ne postoji.';
            if (!data.aktivan) return DOM.errorBox.innerText = 'Kod još nije aktiviran.';
            if (new Date() > new Date(data.vazi_do)) return DOM.errorBox.innerText = 'Kod je istekao.';

            const allPrograms = Object.values(programsData).flat();
            const programInfo = allPrograms.find(p => p.name === data.program_ime);

            if (programInfo && DOM.videoFrame) {
                DOM.videoFrame.src = programInfo.videoUrl.replace('/view', '/preview');
                DOM.errorBox.innerText = '';
                closeModal('accessModal');
                openModal('videoModal');
            } else {
                DOM.errorBox.innerText = !programInfo ? 'Video nije pronađen.' : 'Plejer nije spreman.';
            }
        } catch (err) {
            DOM.errorBox.innerText = err.message;
        }
    }

    function closeVideo() {
      if (DOM.videoFrame) DOM.videoFrame.src = '';
      closeModal('videoModal');
    }

    window.addEventListener('scroll', () => {
        const isVisible = window.scrollY > 300;
        DOM.backToTopBtn.classList.toggle('opacity-0', !isVisible);
        DOM.backToTopBtn.classList.toggle('opacity-100', isVisible);
        DOM.backToTopBtn.classList.toggle('pointer-events-none', !isVisible);
        DOM.backToTopBtn.classList.toggle('pointer-events-auto', isVisible);
    });
    
    DOM.backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));