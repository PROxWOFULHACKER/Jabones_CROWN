import React, { useState } from 'react';
import { 
  SavedProjectState, 
  downloadUpdatedProjectCode, 
  downloadUpdatedProjectJson,
  generateShareableLink 
} from '../utils/projectPersistence';
import { Cloud, Check, Download, RefreshCw, X, FileCode, Users, Link2, HelpCircle, ExternalLink } from 'lucide-react';

interface SyncShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: SavedProjectState;
  onManualSave: () => Promise<boolean>;
  onResetToDefaults: () => void;
  isSaving: boolean;
  lastSavedTime: string | null;
}

export const SyncShareModal: React.FC<SyncShareModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onManualSave,
  onResetToDefaults,
  isSaving,
  lastSavedTime,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isOpen) return null;

  const handleSaveNow = async () => {
    const success = await onManualSave();
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleCopyShareableLink = () => {
    const link = generateShareableLink(currentState);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyCode = () => {
    const codeSnippet = JSON.stringify(currentState.tasks, null, 2);
    navigator.clipboard.writeText(codeSnippet);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Guardado, Netlify y Enlace Compartido
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Línea ZOTE · Para tus compañeros y entrega al profesor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Status Alert Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0 animate-pulse" />
            <div className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
              <strong className="font-bold">Guardado en servidor activo:</strong> Los cambios que realices se guardan automáticamente en el servidor y en la memoria del navegador.
              {lastSavedTime && (
                <div className="mt-1 font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                  Última sincronización: {new Date(lastSavedTime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              )}
            </div>
          </div>

          {/* NETLIFY / SHARING EXPLANATION (CRITICAL FOR USER) */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>¿Cómo funciona al subir el proyecto a Netlify?</span>
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-relaxed">
              Netlify aloja páginas estáticas (no guarda bases de datos en disco). Si subes el proyecto a Netlify, para que el profesor y todos vean siempre los cambios exactos dispones de <strong>2 opciones garantizadas</strong>:
            </p>
            <div className="text-[11px] text-amber-900 dark:text-amber-300 space-y-1.5 pl-2 font-mono">
              <div>
                <strong>Opción 1 (Inmediata sin programar):</strong> Haz clic abajo en <em>"Copiar Enlace con Cambios"</em>. Ese enlace contiene todas las fechas y tareas exactas. Quien lo abra (el profesor) verá todo tal cual lo dejaron.
              </div>
              <div>
                <strong>Opción 2 (En tu GitHub de Netlify):</strong> Haz clic en <em>"Descargar projectData.ts"</em>, sustituye ese archivo en tu carpeta <code>src/data/</code> de tu repositorio y haz <code>git push</code>. Netlify se actualizará solo.
              </div>
            </div>
          </div>

          {/* PRIORITY ACTION: Copy Shareable Link (Works on Netlify/Anywhere) */}
          <div className="p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Copiar Enlace con Cambios para el Profesor
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Genera un enlace con todas las fechas y semanas codificadas. Funciona en Netlify, WhatsApp o correo.
                </p>
              </div>
              <button
                onClick={handleCopyShareableLink}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 ${
                  copiedLink
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Enlace Copiado!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Copiar Enlace</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action 2: Manual Save to Server */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                Forzar Guardado Inmediato
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Guarda el estado actual directamente en el archivo del servidor
              </p>
            </div>
            <button
              onClick={handleSaveNow}
              disabled={isSaving}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95'
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Guardar en Línea</span>
                </>
              )}
            </button>
          </div>

          {/* Action 3: Export Code & Backup Files */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-rose-500" />
              Guardar dentro de los Archivos del Código
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Descarga el archivo TypeScript oficial con todas las modificaciones listas para tu repositorio de código local o entrega:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => downloadUpdatedProjectCode(currentState)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-400 dark:hover:border-rose-600 text-slate-800 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-mono font-bold transition-all shadow-2xs cursor-pointer group"
              >
                <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                <span>Descargar projectData.ts</span>
              </button>

              <button
                onClick={() => downloadUpdatedProjectJson(currentState)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-mono font-bold transition-all shadow-2xs cursor-pointer group"
              >
                <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                <span>Descargar Respaldo JSON</span>
              </button>
            </div>
          </div>

          {/* Action 4: Copy JSON & Reset */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleCopyCode}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono cursor-pointer flex items-center gap-1"
            >
              {copiedJson ? '¡Copiado al portapapeles!' : 'Copiar datos JSON de tareas'}
            </button>

            <button
              onClick={() => {
                if (confirm('¿Restablecer el cronograma a los valores iniciales por defecto?')) {
                  onResetToDefaults();
                  onClose();
                }
              }}
              className="text-xs text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 font-mono cursor-pointer"
            >
              Restablecer valores iniciales
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 z-20 px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
