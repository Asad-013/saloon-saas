# ✨ Radiant Apprentice: Luxe Saloon & Spa Management Platform ✨

![Hero Image - Salon](https://github.com/AzamKhan03/radiant-apprentice/blob/main/src/assets/hero-salon.jpg?raw=true)

## 🌟 Overview

Radiant Apprentice is a sophisticated and modern web application designed to streamline the operations of a high-end saloon and spa. Built with React, Vite, Supabase, and Tailwind CSS, this platform offers a seamless experience for both customers and administrators. From dynamic service bookings to intuitive staff management, Radiant Apprentice aims to bring elegance and efficiency to your business.

## 🚀 Features

*   **Dynamic Service Showcase (Homepage):**
    *   Browse a beautifully presented and dynamically loaded list of services.
    *   Select multiple services for quick and convenient booking directly from the homepage.
    *   (Future: Seamless integration with a complete booking flow).

*   **Enhanced Admin Dashboard:**
    *   **Staff Availability:** Empower administrators to easily manage staff availability with a user-friendly interface that supports selecting multiple time slots for a given date.
    *   **Service Management:** Add, edit, and delete services with detailed descriptions, pricing, and duration.
    *   **Staff Management:** Maintain staff profiles, including roles and bios.
    *   **Booking Oversight:** View and manage all customer bookings, with options to confirm or cancel.

*   **Personalized User Profile:**
    *   Customers can view their booking history with clear service names (not just IDs) and booking details.
    *   Access personal account information.

*   **Modern & Responsive UI:**
    *   A sleek, elegant, and fully responsive user interface built with Tailwind CSS and shadcn/ui components, ensuring a consistent experience across all devices.

## 🛠️ Technologies Used

*   **Frontend:**
    *   [React](https://react.dev/) - A JavaScript library for building user interfaces.
    *   [Vite](https://vitejs.dev/) - Next-generation frontend tooling for fast development.
    *   [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript that compiles to plain JavaScript.
    *   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
    *   [shadcn/ui](https://ui.shadcn.com/) - Reusable components built with Radix UI and Tailwind CSS.
    *   [date-fns](https://date-fns.org/) - Modern JavaScript date utility library.
    *   [Lucide React](https://lucide.dev/) - A beautiful open-source icon library.

*   **Backend & Database (BaaS):**
    *   [Supabase](https://supabase.com/) - Open-source Firebase alternative providing a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, and Storage.

## ⚙️ Installation & Setup

To get this project up and running on your local machine, follow these steps:

### Prerequisites

*   Node.js (v18 or later)
*   npm or Yarn
*   A Supabase project with the necessary tables (`services`, `staff`, `time_slots`, `bookings`, `profiles`, `staff_services`).

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AzamKhan03/radiant-apprentice.git
    cd radiant-apprentice
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Supabase Environment Variables:**
    Create a `.env` file in the root directory and add your Supabase project URL and Anon Key:
    ```
    VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
    *(Replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual Supabase credentials.)*

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## 💡 Usage

*   **Homepage:** Navigate to `/` to view services and initiate quick bookings.
*   **Admin Dashboard:** Log in as an administrator and go to `/admin-dashboard` to manage services, staff, availability, and bookings.
*   **User Profile:** Log in as a regular user and go to `/profile` to view your booking history and account details.

## 📦 Building for Production

To create a production-ready build of the application:

```bash
npm run build
# or
yarn build
```

The optimized static files will be generated in the `dist` directory, which can then be deployed to any static site hosting service (e.g., Netlify, Vercel, AWS S3).

## 🤝 Contributing

Contributions are welcome! If you have any suggestions, bug reports, or want to contribute to the codebase, please feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
