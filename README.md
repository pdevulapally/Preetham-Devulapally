# 🚀 Preetham Devulapally - Portfolio

<div align="center">

![Portfolio Preview](https://img.shields.io/badge/Portfolio-Live-brightgreen?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.10-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Portfolio-FF6B6B?style=for-the-badge)](https://preetham.dev)
[![Download CV](https://img.shields.io/badge/📄_Download-CV-4ECDC4?style=for-the-badge)](#)

</div>

---

## ✨ Features

### 🎨 **Modern Design**
- **LinkedIn-style** professional layout
- **Glass morphism** effects with backdrop blur
- **Gradient backgrounds** and smooth animations
- **Dark/Light mode** support with system preference detection
- **Responsive design** optimized for all devices

### 🎯 **Interactive Elements**
- **Custom audio pronunciation** of name (click speaker icon)
- **Protected phone number** with spam bot protection
- **Premium contact form** with Firebase integration
- **Smooth scroll navigation** with active section highlighting
- **Command palette** (Ctrl/Cmd + K) for quick navigation

### 🔥 **Technical Excellence**
- **TypeScript** for type safety and better development experience
- **Framer Motion** for smooth animations and transitions
- **Firebase Firestore** for contact form submissions
- **Real-time Analytics** with comprehensive user interaction tracking
- **Admin Dashboard** with live analytics and message management
- **Responsive breakpoints** for optimal viewing on all devices

### 📱 **Mobile-First**
- **Touch-friendly** interface with proper touch targets
- **Optimized typography** scaling across screen sizes
- **Mobile navigation** with hamburger menu
- **Gesture support** and smooth scrolling

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40"/>
<br><b>React 18.3.1</b>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40" height="40"/>
<br><b>TypeScript 5.6.2</b>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="40" height="40"/>
<br><b>Tailwind CSS 3.4.10</b>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" width="40" height="40"/>
<br><b>Firebase</b>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" width="40" height="40"/>
<br><b>Vite 7.1.4</b>
</td>
</tr>
</table>

### 🎨 **Additional Libraries**
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons
- **clsx & tailwind-merge** - Conditional styling utilities

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/preetham-portfolio.git

# Navigate to project directory
cd preetham-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 📁 Project Structure

```
preetham-portfolio/
├── public/
│   ├── audio/
│   │   └── name-pronunciation.mp3    # Custom name pronunciation
│   ├── profile/
│   │   └── preetham-profile.jpg      # Profile picture
│   └── resume/
│       └── PreethamDevulapallyCV.pdf # CV download
├── src/
│   ├── components/
│   │   ├── Badge.tsx                 # Reusable badge component
│   │   ├── ContactForm.tsx           # Premium contact form
│   │   ├── Navbar.tsx                # Responsive navigation
│   │   ├── ProtectedPhone.tsx        # Spam-protected phone
│   │   └── Section.tsx               # Section wrapper
│   ├── data/
│   │   └── cv.ts                     # Personal data & content
│   ├── lib/
│   │   ├── firebase.ts               # Firebase configuration
│   │   └── utils.ts                  # Utility functions
│   ├── sections/
│   │   ├── About.tsx                 # About section
│   │   ├── Achievements.tsx          # Awards & achievements
│   │   ├── Contact.tsx               # Contact information
│   │   ├── Education.tsx             # Educational background
│   │   ├── Experience.tsx            # Work experience
│   │   ├── Hero.tsx                  # Hero section with profile
│   │   ├── Projects.tsx              # Project showcase
│   │   └── Skills.tsx                # Skills & technologies
│   ├── App.tsx                       # Main application
│   ├── main.tsx                      # Application entry point
│   └── styles.css                    # Global styles
├── .env.local                        # Environment variables
├── package.json                      # Dependencies & scripts
├── tailwind.config.js                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── vite.config.ts                    # Vite configuration
```

---

## 🎨 Customization

### Personal Information
Update your personal details in `src/data/cv.ts`:

```typescript
export const personal = {
  name: "Your Name",
  role: "Your Role",
  email: "your.email@example.com",
  phone: "+44 1234 567890",
  location: "Your Location",
  linkedin: "https://linkedin.com/in/yourprofile",
  resumeUrl: "resume/YourCV.pdf",
  profileImage: "profile/your-photo.jpg"
};
```

### Profile Picture
1. Add your photo to `public/profile/your-photo.jpg`
2. Update the `profileImage` path in `cv.ts`

### Name Pronunciation
1. Record your name saying "Your Name"
2. Save as `public/audio/name-pronunciation.mp3`
3. The speaker button will play your custom audio

### Styling
- **Colors**: Update the brand colors in `tailwind.config.js`
- **Fonts**: Modify font families in the config
- **Animations**: Adjust Framer Motion settings in components

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

---

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints optimized for:

- **Mobile**: 320px - 639px (stacked layout, centered content)
- **Small**: 640px - 767px (side-by-side layout)
- **Medium**: 768px - 1023px (enhanced spacing)
- **Large**: 1024px+ (full desktop experience)

---

## 🔒 Security Features

- **Protected Phone Number**: Click-to-reveal with spam bot protection
- **Environment Variables**: Secure Firebase configuration
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Graceful error handling throughout

---

## 🚀 Deployment

### Vercel (Recommended)
The project is fully configured for Vercel deployment with:
- ✅ **vercel.json** configuration
- ✅ **Environment variables** setup
- ✅ **Build optimization** with code splitting
- ✅ **Error boundaries** for production
- ✅ **Performance optimization**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

**Quick Deploy Steps:**
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables (see `ENVIRONMENT_SETUP.md`)
4. Deploy!

### Environment Variables Required:
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Other Platforms
- **Netlify**: Use `npm run build` and deploy `dist/` folder
- **Firebase Hosting**: Configure for SPA routing
- **GitHub Pages**: Requires additional configuration for SPA

---

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Optimized with Vite's tree-shaking
- **Image Optimization**: Responsive images with proper sizing

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Preetham Devulapally**

- **Email**: [preethamdevulapally@gmail.com](mailto:preethamdevulapally@gmail.com)
- **LinkedIn**: [linkedin.com/in/preethamdevulapally](https://linkedin.com/in/preethamdevulapally)
- **Location**: London, UK

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Preetham Devulapally](https://github.com/yourusername)

</div>