'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface WatermarkedImage {
  id: number;
  original_filename: string;
  watermarked_url: string;
  created_at: string;
  is_expired: boolean;
}

export default function MarcaDaguaPage() {
  const [images, setImages] = useState<WatermarkedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number, total: number } | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/watermark/list', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setImages(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    } finally {
      setLoading(false);
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const valid: File[] = [];
    const rejected: string[] = [];

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) { rejected.push(`${file.name}: tipo inválido`); continue; }
      if (file.size > 10 * 1024 * 1024) { rejected.push(`${file.name}: maior que 10MB`); continue; }
      valid.push(file);
    }

    if (rejected.length > 0) {
      setMessage({ type: 'error', text: `Rejeitados: ${rejected.join(', ')}` });
    }

    if (valid.length === 0) {
      e.target.value = '';
      return;
    }

    setUploading(true);
    setMessage(null);

    let successCount = 0;
    let failCount = 0;
    setUploadProgress({ current: 0, total: valid.length });

    for (let i = 0; i < valid.length; i++) {
      try {
        const formData = new FormData();
        formData.append('image', valid[i]);
        const response = await fetch('/api/admin/watermark/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) successCount++; else failCount++;
      } catch {
        failCount++;
      }
      setUploadProgress({ current: i + 1, total: valid.length });
    }

    if (successCount > 0 && failCount === 0) {
      setMessage({ type: 'success', text: `✅ ${successCount} ${successCount === 1 ? 'imagem processada' : 'imagens processadas'} com sucesso!` });
    } else if (successCount > 0) {
      setMessage({ type: 'success', text: `⚠️ ${successCount} processadas, ${failCount} falharam` });
    } else {
      setMessage({ type: 'error', text: 'Erro ao processar imagens' });
    }

    await loadImages();
    setUploading(false);
    setUploadProgress(null);
    e.target.value = '';
  };

  const handleDelete = async (imageId: number) => {
    if (!confirm('Tem certeza que deseja deletar esta imagem?')) return;
    try {
      const response = await fetch(`/api/admin/watermark/${imageId}/delete`, {
        method: 'DELETE', credentials: 'include',
      });
      const data = await response.json();
      if (data.success) { setMessage({ type: 'success', text: 'Imagem deletada com sucesso' }); loadImages(); }
      else setMessage({ type: 'error', text: data.message || 'Erro ao deletar' });
    } catch { setMessage({ type: 'error', text: 'Erro ao deletar imagem' }); }
  };

  const handleDownloadAll = () => {
    images.forEach(image => {
      const a = document.createElement('a');
      a.href = image.watermarked_url; a.download = image.original_filename; a.click();
    });
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('pt-MZ', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8" suppressHydrationWarning>
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="bg-primary text-white rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">💧 Marca D&apos;água</h1>
                <p className="text-primary-50 text-sm md:text-base">
                  {images.length} {images.length === 1 ? 'imagem processada' : 'imagens processadas'} • Auto-delete em 2h
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensagem de feedback */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 shadow-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <span className="text-xl">
              {message.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="flex-1">{message.text}</span>
            <button 
              onClick={() => setMessage(null)}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 md:mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📤 Upload de Imagens</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInput}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-gray-600">
                  <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-lg font-medium mb-1">
                    {uploading 
                      ? uploadProgress 
                        ? `⏳ Processando ${uploadProgress.current} de ${uploadProgress.total}...`
                        : '⏳ Processando marca d\'água...'
                      : 'Clique para selecionar imagens'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {uploading ? 'Aguarde, aplicando marcas d\'água...' : 'PNG, JPG, JPEG até 10MB (múltiplas imagens permitidas)'}
                  </p>
                </div>
              </label>
            </div>
            
            <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 md:p-4 rounded-lg text-left">
              <div className="flex gap-2 md:gap-3 items-start">
                <span className="text-xl md:text-2xl">⚠️</span>
                <p className="text-xs md:text-sm text-yellow-900">
                  <strong>Atenção:</strong> As imagens são deletadas em 2h automaticamente.
                </p>
              </div>
            </div>
          </div>

          {/* Images List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">🖼️ Imagens Processadas</h2>
            </div>
            
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary mb-4"></div>
                <p className="text-gray-500">Carregando imagens...</p>
              </div>
            ) : images.length === 0 ? (
              <div className="p-8 md:p-12 text-center">
                <div className="text-5xl md:text-6xl mb-4">📷</div>
                <p className="text-gray-500 text-base md:text-lg font-medium">Nenhuma imagem processada ainda</p>
                <p className="text-gray-400 text-sm mt-2">Faça upload para começar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
                {images.map((image) => (
                  <div key={image.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
                    <div className="aspect-video bg-gray-100 relative overflow-hidden group">
                      <img
                        src={image.watermarked_url}
                        alt={image.original_filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded shadow-lg">
                        ✓ Marca aplicada
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-sm truncate text-gray-900 mb-2" title={image.original_filename}>
                        {image.original_filename}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        {formatDate(image.created_at)}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={image.watermarked_url}
                          download={image.original_filename}
                          className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 text-center text-sm font-semibold transition-all min-h-[40px] flex items-center justify-center"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => handleDelete(image.id)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200 transition-all min-h-[40px]"
                          title="Deletar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        {/* Info Box */}
        <div className="mt-6 md:mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">💡 Como usar</h3>
          <div className="grid md:grid-cols-3 gap-3 md:gap-4 text-sm">
            <div className="flex gap-2">
              <span className="text-lg">1️⃣</span>
              <div>
                <p className="font-medium text-gray-900">Upload</p>
                <p className="text-gray-600 text-xs">Envie imagens PNG/JPG</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-lg">2️⃣</span>
              <div>
                <p className="font-medium text-gray-900">Processamento</p>
                <p className="text-gray-600 text-xs">Marca d&apos;água aplicada</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-lg">3️⃣</span>
              <div>
                <p className="font-medium text-gray-900">Download</p>
                <p className="text-gray-600 text-xs">Use em redes sociais</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
