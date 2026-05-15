# Paskolinau.lt — Mobile App (Expo)

## Svarbu (raudona klaida / „Project is incompatible”)

1. **Visada paleiskite Expo iš `mobile` aplanko** (ne iš `Paskolinau_UI` šaknies).
   - Iš šaknės galite naudoti: `npm run mobile`
   - Jei paleidžiate Expo iš šaknės be `mobile`, Metro ieško `assets` neteisingoje vietoje → **ENOENT** ir raudonas ekranas.

2. **Atnaujinkite „Expo Go“** telefone iki naujausios versijos (App Store / Play Store). Kitaip galite matyti **„Project is incompatible with this version of Expo Go“**.

3. Po klaidų: `cd mobile` → `npx expo start -c`

4. Jei terminale buvo **`EXPO_ROUTER_APP_ROOT` / `require.context`** – tai sutvarkyta (pašalintas `babel-plugin-module-resolver` iš `babel.config.js`).

## Reikalavimai
- Node.js 18+
- Expo Go app telefone (iOS arba Android)
- Kompiuteris ir telefonas tame pačiame WiFi tinkle

## Paleidimas

### 1. Nustatyti API adresą
Faile `lib/api.ts` pakeiskite `API_BASE` į jūsų kompiuterio IP adresą:
```
export const API_BASE = "http://192.168.X.X:3000";
```
IP rasite: Windows → cmd → `ipconfig` → IPv4 Address

### 2. Paleisti Next.js serverį (web backend)
```bash
cd .. (į Paskolinau_UI)
npm run dev
```

### 3. Paleisti Expo (teisingai)

**Variantas A** — iš projekto šaknės (`Paskolinau_UI`):
```bash
npm run mobile
```

**Variantas B** — iš `mobile` aplanko:
```bash
cd mobile
npm start
```

**Nenaudokite** `npx expo start` tiesiai iš `Paskolinau_UI` be `cd mobile`.

### 4. Po pakeitimų (cache)
- Expo paleiskite su išvalytu cache: `cd mobile` → `npx expo start -c`

### 5. Atidaryti telefone
- Įdiekite **Expo Go** iš App Store / Play Store
- Nuskenuokite QR kodą iš terminalo
