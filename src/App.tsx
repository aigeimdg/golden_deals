import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import DealsPage from './pages/DealsPage';
import AboutPage from './pages/AboutPage';
import CategoriesPage from './pages/CategoriesPage';
import AdminPage from './pages/AdminPage';
import SupportPage from './pages/SupportPage';
import { DealsProvider } from './context/DealsContext';

export default function App() {
  return (
    <DealsProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/help" element={<SupportPage />} />
            <Route path="/contact" element={<SupportPage />} />
            <Route path="/privacy" element={<SupportPage />} />
            <Route path="/terms" element={<SupportPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </MainLayout>
      </Router>
    </DealsProvider>
  );
}
