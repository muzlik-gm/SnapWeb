import React, { useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/Button';

interface ScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  downloadUrl?: string;
  format: string;
  metadata?: {
    width: number;
    height: number;
    fileSize: number;
  };
}

export const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  downloadUrl,
  format,
  metadata,
}) => {
  const [zoom, setZoom] = React.useState(100);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    // Prefer data URL for reliability if available
    const isDataUrl = imageUrl?.startsWith('data:');
    const downloadLink = isDataUrl ? imageUrl : (downloadUrl || imageUrl);

    const link = document.createElement('a');
    link.href = downloadLink;
    link.download = `screenshot-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full h-full max-w-7xl mx-auto p-4 flex flex-col">
        {/* Header - Fixed */}
        <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-t-2xl shadow-2xl border border-secondary-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-secondary-900">
              Screenshot Preview
            </h3>
            {metadata && (
              <div className="hidden sm:flex items-center gap-3 text-sm text-secondary-600">
                <span className="px-2 py-1 bg-secondary-100 rounded">
                  {metadata.width} × {metadata.height}
                </span>
                <span className="px-2 py-1 bg-secondary-100 rounded">
                  {formatFileSize(metadata.fileSize)}
                </span>
                <span className="px-2 py-1 bg-secondary-100 rounded uppercase">
                  {format}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden md:flex items-center gap-2 mr-2">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 25))}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4 text-secondary-600" />
              </button>
              <span className="text-sm text-secondary-600 min-w-[3rem] text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4 text-secondary-600" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-secondary-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Image Container */}
        <div className="relative flex-1 bg-white/95 backdrop-blur-md shadow-2xl border-x border-secondary-200 overflow-auto">
          <div className="min-h-full flex items-start justify-center p-8 bg-gradient-to-br from-secondary-50 to-secondary-100">
            <img
              src={imageUrl}
              alt="Generated screenshot"
              className="max-w-full h-auto rounded-lg shadow-2xl border border-secondary-200 transition-transform duration-200"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
              }}
              loading="eager"
            />
          </div>
        </div>

        {/* Footer - Fixed with Download Button */}
        <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-2xl border border-secondary-200 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-secondary-600 text-center sm:text-left">
              Scroll to view the full screenshot. Use zoom controls to adjust size.
            </p>
            <Button
              type="button"
              onClick={handleDownload}
              variant="primary"
              size="md"
              className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Screenshot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
