import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Nav from "../components/Nav"; // Se importa el componente del Nav
import BookForm from "../components/BookForm.jsx"; // Se importa el componente productForm y se les manda el prompt que solicita
import ConfirmModal from "../components/ConfirmModal.jsx"; // Se importa el componente ConfirmModal y se les manda el prompt que solicita

const Books = () => {
  // Estados que controla la lista de productos y su carga.
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const navigate = useNavigate();
  const token =
    localStorage.getItem("laboratorio_token") ||
    sessionStorage.getItem("laboratorio_token");

  // Filtra libros según el texto de búsqueda en título, descripción .
  const filteredBooks = books.filter((book) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return [book.title, book.description, book.category]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  // Cálculos de paginación.
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBooks.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBook = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    // Si no hay token válido, redirige al login.
    if (!token) {
      navigate("/");
      return;
    }

    const fetchBook = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts",
        );
        if (!response.ok) {
          throw new Error("Error al cargar los libros");
        }

        const data = await response.json();
        // Agrega la propiedad source para distinguir productos de la API de los locales.
        setBooks(data.map((book) => ({ ...book, source: "api" })));
      } catch (err) {
        setError(err.message || "No se pudieron cargar los libros");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [navigate, token]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditBook = async (bookid) => {
    setBookError("");
    setLoadingBookDetail(true);

    const localBook = books.find((book) => book.id === bookid);
    // Si el libro ya está en el estado local, no vuelve a pedirlo a la API.
    if (localBook) {
      setEditingBook(localBook);
      setShowBookForm(true);
      setLoadingBookDetail(false);
      return;
    }

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
      );
      if (!response.ok) {
        throw new Error("Error al cargar el libro");
      }

      const data = await response.json();
      setEditingBook({ ...data, source: "api" });
      setShowBookForm(true);
    } catch (err) {
      setBookError(err.message || "No se pudo cargar el libro");
    } finally {
      setLoadingBookDetail(false);
    }
  };

  const handleUpdateBook = async (formData) => {
    setBookError("");
    setBookSuccess("");
    setBookSubmitting(true);

    const isLocalBook = editingBook?.source !== "api";

    try {
      if (isLocalBook) {
        // Actualiza directamente el producto local sin llamar a la API.
        setBooks((prev) =>
          prev.map((p) =>
            p.id === editingBook.id
              ? { ...p, ...formData, source: p.source || "local" }
              : p,
          ),
        );
        setBookSuccess("libro actualizado correctamente.");
        setShowBookForm(false);
        setEditingBook(null);
        return;
      }

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Error actualizando libro");
      }

      const data = await response.json();
      setBooks((prev) =>
        prev.map((p) =>
          p.id === editingBook.id ? { ...data, source: "api" } : p,
        ),
      );
      setBookSuccess("Libro actualizado correctamente.");
      setShowBookForm(false);
      setEditingBook(null);
      console.log(" updated libro:", data);
    } catch (err) {
      setBookError(err.message || "No se pudo actualizar el libro");
    } finally {
      setBookSubmitting(false);
    }
  };

  const handleDeleteBook = async (id) => {
    setBookToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;

    setBookError("");
    setBookSuccess("");
    setShowDeleteConfirm(false);

    try {
      const book = book.find((p) => p.id === bookToDelete);
      if (book?.source !== "api") {
        // Si el libro es local, simplemente lo eliminamos del estado.
        setBooks((prev) => prev.filter((p) => p.id !== bookToDelete));
        setBookSuccess("Libro eliminado correctamente.");
        setBookToDelete(null);
        return;
      }

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${bookToDelete}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Error eliminando libro");
      }

      setBooks((prev) => prev.filter((p) => p.id !== bookToDelete));
      setBookSuccess("Libro eliminado correctamente.");
      setBookToDelete(null);
    } catch (err) {
      setBookError(err.message || "No se pudo eliminar el libro");
      setBookToDelete(null);
    }
  };

  const cancelDeleteBook = () => {
    setShowDeleteConfirm(false);
    setBookToDelete(null);
  };

  const [showBookForm, setShowBookForm] = useState(false);
  const [bookSubmitting, setBookSubmitting] = useState(false);
  const [bookError, setBookError] = useState("");
  const [bookSuccess, setBookSuccess] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [loadingBookDetail, setLoadingBookDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const handleCreateBook = async (formData) => {
    setBookError("");
    setBookSuccess("");
    setBookSubmitting(true);

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Error creando libro");
      }

      const data = await response.json();
      const newBook = { ...data, source: "local" };
      setBooks((prev) => [newBook, ...(prev || [])]);
      setBookSuccess("Libro creado correctamente. ID: " + (newBook.id || "—"));
      setShowBookForm(false);
      setEditingBook(null);
      setCurrentPage(1);
    } catch (err) {
      setBookError(err.message || "No se pudo crear el libro");
    } finally {
      setBookSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {token && <Nav />}

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-green-700">Libros</h1>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingBook(null);
                    setShowBookForm((s) => !s);
                  }}
                  className="rounded-2xl bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
                >
                  Agregar libro
                </button>
              </div>
            </div>
          </div>
        </div>
        {bookError && (
          <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-rose-700">
            {bookError}
          </div>
        )}
        {bookSuccess && (
          <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700">
            {bookSuccess}
          </div>
        )}

        {showBookForm && (
          // Aca se pasa el prompt
          <BookForm
            initialData={editingBook || {}}
            categories={categories}
            onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
            submitting={bookSubmitting || loadingBookDetail}
            onClose={() => {
              setShowBookForm(false);
              setEditingBook(null);
            }}
          />
        )}

        {/* Aca se pasa el prompt*/}
        <ConfirmModal
          title="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar este libro? Esta acción no se puede deshacer."
          isOpen={showDeleteConfirm}
          isDangerous={true}
          onConfirm={confirmDeleteBook}
          onCancel={cancelDeleteBook}
        />

        <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-slate-500">
                Cargando libros...
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-rose-50 px-4 py-6 text-rose-700">
                {error}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-0 text-left ">
                  <thead className="bg-orange-500 ">
                    <tr>
                      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white">
                        ID
                      </th>
                      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white">
                        Título
                      </th>
                      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white text-center">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white">
                        {" "}
                      </th>
                      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white text-center">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black bg-white">
                    {currentBook.map((book) => (
                      <tr key={book.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 align-top text-sm text-slate-700 max-w-xl wrap-break-word">
                          {book.id}
                        </td>
                        <td className="px-6 py-4 align-top text-sm text-slate-700 max-w-xl wrap-break-word">
                          {book.title}
                        </td>
                        <td className="px-6 py-4 align-top text-sm text-slate-600 max-w-2xl wrap-break-word">
                          {book.body}
                        </td>
                        <td className="px-6 py-4 align-top text-sm text-slate-700"></td>
                        <td className="px-6 py-4 align-top text-sm text-slate-700">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditBook(book.id)}
                              disabled={loadingBookDetail}
                              className="rounded-full w-full bg-orange-500 px-3 py-1 text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                              Editar libro
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBook(book.id)}
                              className="rounded-full w-full bg-orange-500 px-3 py-1 text-white transition hover:bg-red-800"
                            >
                              Eliminar libro
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-6 flex flex-col gap-3 rounded-3xl bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-600">
                    Mostrando {currentPage} de {totalPages} libros
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="rounded-2xl border border-slate-200 bg-orange-400 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      Anterior
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                            currentPage === page
                              ? " text-black shadow-sm"
                              : "bg-white text-slate-700 hover:bg-orange-400"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="rounded-2xl border border-slate-200 bg-orange-400 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Books;
