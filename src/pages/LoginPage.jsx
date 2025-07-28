import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Shield, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const { user, signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/panel" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
    } catch (error) {
      // Hata zaten toast ile gösteriliyor
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <Helmet>
        <title>Giriş Yap - Rbb Work Station</title>
        <meta name="description" content="Rbb Work Station güvenli proje yönetimi platformuna giriş yapın." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-effect rounded-2xl p-8"
          >
            {/* Logo ve Başlık */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-2">Rbb Work Station</h1>
              <p className="text-gray-400">Güvenli Proje Yönetimi Platformu</p>
            </div>

            {/* Giriş Formu */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ornek@rbbworkstation.com"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Giriş Yapılıyor...
                  </div>
                ) : (
                  'Giriş Yap'
                )}
              </Button>
            </form>

            {/* Güvenlik Bilgisi */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-300 font-medium">Güvenlik Önceliğimiz</p>
                  <p className="text-xs text-blue-200 mt-1">
                    Tüm verileriniz 256-bit SSL şifreleme ile korunmaktadır.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;