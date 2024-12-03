# Retrospektiva projekta

**Sprint Retrospektiva**  
*Datoteka: `Retrospektiva.md`*

---

## 🎯 Povzetek
Projekt smo izvedli v dveh sprintih, pri čemer smo uporabili **GitHub Flow strategijo** za upravljanje kode in sodelovanje v ekipi. Aplikacijo smo razvili s **Vite.js** in **React** za frontend, **Express.js** za backend API ter Dockerjem za enotno razvojno okolje.

---

## ✅ Kaj je šlo dobro

### 1. Učinkovita uporaba GitHub Flow strategije
- **Striktna uporaba kratkoživečih feature vej** nam je omogočila razvoj v manjših, obvladljivih delih.
- Pull requesti (PR) so zagotavljali, da je vsaka funkcionalnost pregledana pred združitvijo v dolgoživeče veje.
- **Code review** pri vsakem PR-ju so izboljšali kakovost kode ter omogočili izmenjavo znanja.

### 2. Razvoj s kratkoročnimi feature vejami
- Za vsako novo funkcionalnost smo ustvarili **feature/[ime_funkcionalnosti]** vejo, kar je omogočilo neodvisno delo posameznih razvijalcev.
- Redno združevanje (merge) zaključenih funkcionalnosti v `main` vejo je zagotovilo stabilno različico za testiranje.

### 3. Docker za razvojno in produkcijsko okolje

- **Docker Compose** nam je omogočil enostavno vzpostavitev okolja za frontend, backend in bazo podatkov.
- Razvoj z Dockerjem je bil **konzistenten in portabilen**, kar je omogočilo, da so vsi razvijalci delali v enakem okolju, ne glede na operacijski sistem.
- Docker nam je olajšal **razmestitev aplikacije** v pre-production in production okolje.
- Možnost **izolacije posameznih komponent** je izboljšala stabilnost in varnost aplikacije.

## 4. Uporaba Vite.js in React za frontend

- **Vite.js** je poskrbel za hiter razvojni strežnik in minimalen čas nalaganja.
- **React** je omogočil hitro sestavljanje komponent ter večkratno uporabo kode, kar je pospešilo razvoj uporabniškega vmesnika.


---

## ❓ S kakšnimi težavami smo se soočili

### 1. Sinhronizacija med različnimi feature vejami
- Občasno smo naleteli na **merge konflikte**, predvsem ko je več razvijalcev delalo na povezanih funkcionalnostih.
- Potrebovali smo več **komunikacije in usklajevanja**, da smo zmanjšali tveganje za konflikte.

### 2. Pregledi in združevanje PR-jev
- Včasih so se pregledi PR-jev zavlekli, kar je upočasnilo združevanje funkcionalnosti v `main`.
- Nekateri PR-ji so bili zavrnjeni zaradi **pomanjkljivih testnih primerov ali nejasne dokumentacije**, kar je zahtevalo dodatno delo.

---

## 🚀 Kaj bi lahko izboljšali v prihodnosti

### 1. Boljša organizacija GitHub Issues in projektov
- Uporaba **GitHub Issues** za sledenje nalogam bi izboljšala preglednost in omogočila boljše načrtovanje sprintov.
- **Kanban plošča** bi pomagala pri vizualizaciji napredka in optimizaciji dela znotraj ekipe.

### 2. Optimizacija pull request procesov
- Uvedba smernic za **hitrejše preglede PR-jev** bi zmanjšala čakalne dobe.
- **Avtomatizacija s CI/CD pipeline** za testiranje PR-jev bi izboljšala kakovost in zanesljivost kode pred združitvijo.

### 3. Dokumentacija
- Bolj podrobna dokumentacija za **nastavitev lokalnega okolja**, uporabo vej in postopek združevanja bi olajšala vključevanje novih članov ekipe.
- Poudarek na dokumentiranju posameznih funkcij in API-jev bi izboljšal vzdrževanje projekta.

---

## 📋 Sklepne misli
Uporaba **GitHub Flow** je močno prispevala k strukturiranemu razvoju in sodelovanju v ekipi. Sistem kratkoživečih vej in PR-jev je zmanjšal tveganje za uvedbo napak ter omogočil hitrejše in bolj pregledno razvijanje funkcionalnosti. Retrospektiva nam je omogočila uvid v ključne izboljšave, ki jih bomo uporabili v prihodnjih projektih.

**Avtorji**: Gal Guštin, Vito Polenek, Tjaša Gumilar, Katarina Lipovšek
