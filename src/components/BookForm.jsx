import { useState, useEffect, useRef } from "react"; 

const ProductForm = ({
  initialData = {},
  onSubmit,
  submitting = false,
  onClose,
}) => {
  // Se rellena el formulario con ellos.
  const [form, setForm] = useState(() => ({
    userId: "",
    id: "",
    title: "",
    body: "",
    ...initialData,
  }));
  const isEditing = !!initialData?.id; // Detecta si estamos editando un Libro existente.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // función cuando se le da agregar
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, id: Number(form.id) };
    onSubmit && onSubmit(payload); 
  };

  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose && onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-medium text-green-700">
            {isEditing ? "Editar libro" : "Agregar libro"}
          </h3>
          <button
            type="button"
            onClick={() => onClose && onClose()}
            className="-mr-2 inline-flex items-center justify-center rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <form
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          {/* Campo de id. */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              ID
            </label>
            <input
              name="id"
              type="number"
              step="1"
              value={form.id}
              onChange={handleChange}
              placeholder="Ingrese el ID"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              required
            />
          </div>

          {/* Campo de título . */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Título
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Título del libro"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              required
            />
          </div>

          {/* Campo de body. */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Descripción
            </label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              placeholder="Descripción del libro"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              rows={3}
            />
          </div>

          <div className="sm:col-span-2">
            <div className="mt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => onClose && onClose()}
                className="rounded-2xl border border-slate-200 bg-orange-400 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitting
                  ? "Guardando..."
                  : isEditing
                    ? "Actualizar "
                    : "Agregar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
