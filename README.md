# RadioAssist Pro



**AI-Powered Radiology Assistant for French Medical Professionals**



RadioAssist Pro is a web application designed to help French-speaking radiologists reformulate medical indications and generate CT scan protocols using AI assistance.



---



##  Features



- **Indication Reformulation**: Transform raw medical requests into professional radiology format using OpenAI GPT-4o-mini

- **Auto-Protocol Suggestion**: AI automatically suggests appropriate CT scan protocols based on the indication

- **Protocol Builder**: Interactive checklist for configuring CT scan protocols (regions, phases, contrast agents)

- **Clinical Vigilance Points**: AI-generated critical points for radiologists to watch (Google Gemini)

- **Patient Explanations**: Simple, reassuring explanations for patients about their exam (Google Gemini)

- **One-Click Export**: Copy formatted indication + protocol to clipboard with medical disclaimer



---



##  Project Structure



```

site_radio/

 src/

    components/          # React components

       Header.jsx

       MedicalDisclaimer.jsx

       SettingsPanel.jsx

       CheckBox.jsx

       Footer.jsx

    services/            # API services

       openai.js       # OpenAI API integration

       gemini.js       # Google Gemini API integration

       clipboard.js    # Clipboard operations

    utils/              # Utilities and constants

       constants.js    # Configuration and prompts

       protocolTemplates.js  # CT protocol templates

    RadioHelper.jsx     # Main application component

    main.jsx           # React entry point

    index.css          # Tailwind CSS

 .env.local             # Environment variables (API keys)

 .env.example           # Environment variables template

 index.html

 package.json

 tailwind.config.js

 vite.config.js

```



---



##  Getting Started



### Prerequisites



- Node.js 18+ and npm

- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

- Google Gemini API key (optional, [Get one here](https://aistudio.google.com/apikey))



### Installation



1. **Clone or download the project**



2. **Install dependencies**

   ```bash

   npm install

   ```



3. **Configure API keys**

   - Copy `.env.example` to `.env.local`

   - Add your OpenAI API key:

     ```

     VITE_OPENAI_API_KEY=your_openai_key_here

     VITE_GOOGLE_API_KEY=your_google_key_here

     ```



4. **Start development server**

   ```bash

   npm run dev

   ```



5. **Open in browser**

   - Navigate to `http://localhost:5173`



---



##  Security



### API Key Management



-  API keys are stored in `.env.local` (gitignored)

-  Never commit `.env.local` to version control

-  Rotate exposed keys immediately

-  Use environment variables for all sensitive data



### Medical Disclaimer



The application includes:

- Prominent disclaimer banner on startup

- Warning message on copied content

- Clear statement that AI  medical opinion



---



## Ŀ Design System



The application follows a strict design rulebook:



- **Typography**:

  - H1: 48px (text-5xl)

  - H2: 36px (text-3xl)

  - Body: 16-20px with line-height 1.5

  - Headings: line-height 1.2



- **Colors**:

  - Primary: Blue (#2563eb)

  - Accent: Indigo (#4f46e5)

  - Neutrals: Slate



- **Spacing**:

  - Section spacing: 80px desktop / 48px mobile

  - Internal padding: 4-8pt increments



- **Buttons**:

  - Height: 44-52px

  - Border radius: 8-12px

  - Transitions: 150-300ms



---



##  Technologies



- **Frontend**: React 18 + Vite

- **Styling**: Tailwind CSS

- **Icons**: Lucide React

- **AI**: OpenAI GPT-4o-mini + Google Gemini 2.5



---



##  Usage



### 1. Reformulate Indication



1. Enter raw medical indication in "Dicte Brute"

2. Click "Reformuler"

3. View formatted result

4. Protocol auto-applies based on AI suggestion



### 2. Customize Protocol



- Select body regions (Thorax, AP, TAP, etc.)

- Choose head/neck regions (Crne, Sinus, etc.)

- Select injection phases (Natif, Artriel, Portal)

- Toggle contrast agent (Xenetix 350 / Iomeron 350)



### 3. Generate Analysis



- **Points de vigilance**: Clinical points for radiologist

- **Explication Patient**: Simple patient explanation



### 4. Export



- Click "TOUT COPIER" to copy indication + protocol

- Includes medical disclaimer warning



---



##  Important Notes



### Medical Safety



-  **AI-generated content requires professional verification**

-  **Code Jaune (stroke) protocols require complete NIHSS data**

-  **This tool assists radiologists; it does not replace them**



### Code Jaune (Stroke Protocol)



Special handling for emergency stroke cases:

- Requires: Clinical signs, symptom onset time, NIHSS score

- Missing data triggers validation warning

- Critical for time-sensitive emergency protocols



---



##  Testing



RadioAssist Pro includes comprehensive testing:



### Running Tests



```bash

# Unit tests

npm test



# Unit tests with UI

npm run test:ui



# E2E tests

npm run test:e2e



# Coverage report

npm run test:coverage

```



### Test Coverage



- **Unit Tests**: 60+ tests covering:

  - Code Jaune (stroke) validator (15+ tests)

  - Protocol templates (25+ tests)

  - History service (20+ tests)



- **E2E Tests**: 16+ tests covering:

  - Complete reformulation workflow

  - Code Jaune medical safety validation

  - Protocol builder interaction

  - History management



See [TESTING.md](./TESTING.md) for complete testing documentation.



### Manual Testing Checklist



- [ ] API keys load from environment

- [ ] Reformulation works with valid OpenAI key

- [ ] Auto-protocol suggestion applies correctly

- [ ] Protocol templates match expected output

- [ ] Gemini features work (or show error if key missing)

- [ ] Clipboard copy includes disclaimer

- [ ] Medical disclaimer shows on first load

- [ ] Settings panel saves API keys

- [ ] Responsive design works on mobile

- [ ] All ARIA labels present for accessibility

- [ ] History save/restore works correctly

- [ ] Code Jaune validation blocks incomplete data



---



##  Development



### Build for Production



```bash

npm run build

```



### Preview Production Build



```bash

npm run preview

```



### Code Structure



- **Components**: Modular, reusable UI components

- **Services**: API integrations isolated from components

- **Utils**: Constants, templates, and helper functions

- **Main**: RadioHelper.jsx orchestrates everything



---



##  License



Proprietary - For authorized medical use only



---



##  Author



Built for French-speaking radiologists with AI assistance



---



## ɢ Known Issues



- None currently tracked



##  Support



For issues or questions, contact the development team.



---



** Medical Disclaimer**: This application is an AI-powered assistant tool. All generated content must be verified by qualified medical professionals before clinical use. The AI does not provide medical diagnosis or treatment recommendations.

