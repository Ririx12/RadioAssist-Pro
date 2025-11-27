# RadioAssist Pro - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure API Keys

1. Copy the template:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your keys:
   ```env
   VITE_OPENAI_API_KEY=your_openai_key_here
   VITE_GOOGLE_API_KEY=your_google_key_here
   ```

3. Get keys:
   - **OpenAI**: https://platform.openai.com/api-keys
   - **Google Gemini**: https://aistudio.google.com/apikey (optional)

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Open Browser

Navigate to: `http://localhost:5173`

---

## 🎯 Quick Test

1. Enter test indication:
   ```
   Patient de 45 ans avec douleur abdominale aiguë, suspicion appendicite
   ```

2. Click **Reformuler**

3. Watch auto-protocol suggestion apply

4. Click **TOUT COPIER** to export

---

## ⚠️ Important Notes

- **Medical Disclaimer**: Always visible on first load
- **Code Jaune**: Requires complete NIHSS data
- **Gemini Features**: Need Google API key
- **Security**: Never commit `.env.local`!

---

## 🐛 Troubleshooting

### "Clé API manquante"
→ Check `.env.local` has correct keys

### Gemini features don't work
→ Add Google API key to `.env.local`

### App won't start
→ Run `npm install` again

---

## 📝 Build for Production

```bash
npm run build
npm run preview
```

Dist folder ready for deployment!

---

**That's it! You're ready to use RadioAssist Pro.**
