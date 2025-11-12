const API = "/libros";
const API_AUTORES = "/autores";

const tbody = document.getElementById("books-tbody");
const form = document.getElementById("book-form");
const inputId = document.getElementById("book-id");
const inputTitulo = document.getElementById("titulo");
const selectAutor = document.getElementById("autorId");
const btnReset = document.getElementById("reset-btn");
const btnReload = document.getElementById("reload-btn");
const toastContainer = document.getElementById("toast-container");
const searchInput = document.getElementById("search-input");

function renderRows(books) {
  tbody.innerHTML = "";
  if (!books || books.length === 0) {
    document.getElementById("empty-state").hidden = false;
    return;
  }
  document.getElementById("empty-state").hidden = true;
  for (const b of books) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.id}</td>
      <td>${escapeHtml(b.titulo)}</td>
      <td>${escapeHtml(b.autorNombre ?? "")}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-sm btn-edit" data-id="${b.id}">Editar</button>
          <button class="btn btn-sm btn-danger" data-id="${b.id}">Eliminar</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function loadBooks() {
  const q = searchInput?.value?.trim();
  btnReload?.setAttribute("disabled", "true");
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("Error al cargar libros");
    const data = await res.json();
    // filtro simple en el cliente (rápido y evita cambios en API)
    const filtered = data.filter(b => {
      if (!q) return true;
      const t = `${b.titulo} ${b.autorNombre ?? ""}`.toLowerCase();
      return t.includes(q.toLowerCase());
    });
    renderRows(filtered);
  } catch (err) {
    showToast(err.message || "Error cargando libros", "error");
  } finally {
    btnReload?.removeAttribute("disabled");
  }
}

async function loadAutores() {
  try {
    const res = await fetch(API_AUTORES);
    if (!res.ok) throw new Error("Error al cargar autores");
    const autores = await res.json();
    selectAutor.innerHTML = "<option value=\"\">-- Seleccionar --</option>";
    for (const a of autores) {
      const opt = document.createElement("option");
      opt.value = a.id;
      opt.textContent = a.nombre;
      selectAutor.appendChild(opt);
    }
  } catch (err) {
    showToast("No se pudieron cargar los autores", "error");
  }
}

tbody.addEventListener("click", async (e) => {
  const t = e.target;
  if (t.matches(".btn-edit")) {
    const id = t.getAttribute("data-id");
    const row = t.closest("tr");
    inputId.value = id;
    inputTitulo.value = row.children[1].textContent;
    // Buscamos el autor por texto en el select
    const autorNombre = row.children[2].textContent;
    const option = Array.from(selectAutor.options).find(o => o.textContent === autorNombre);
    if (option) selectAutor.value = option.value;
    inputTitulo.focus();
  }
  if (t.matches(".btn-danger")) {
    const id = t.getAttribute("data-id");
    if (!confirm("¿Eliminar este libro?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Libro eliminado", "success");
        await loadBooks();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || "Error al eliminar libro", "error");
      }
    } catch (err) {
      showToast("Error al eliminar libro", "error");
    }
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    titulo: inputTitulo.value.trim(),
    autorId: Number(selectAutor.value),
  };
  const id = inputId.value;
  const isEdit = Boolean(id);
  if (!payload.titulo) return showToast("El título es obligatorio", "error");
  if (!payload.autorId) return showToast("Selecciona un autor", "error");
  try {
    const res = await fetch(isEdit ? `${API}/${id}` : API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      form.reset();
      inputId.value = "";
      showToast(isEdit ? "Libro actualizado" : "Libro agregado", "success");
      await loadBooks();
    } else {
      const { message } = await res.json().catch(() => ({ message: "Error" }));
      showToast(message || "Ocurrió un error", "error");
    }
  } catch (err) {
    showToast("Error al guardar libro", "error");
  }
});

btnReset.addEventListener("click", () => {
  form.reset();
  inputId.value = "";
});

btnReload.addEventListener("click", loadBooks);

searchInput?.addEventListener("input", () => loadBooks());

function showToast(message, type = "success", timeout = 3500) {
  if (!toastContainer) return alert(message);
  const t = document.createElement("div");
  t.className = `toast ${type === 'error' ? 'error' : 'success'}`;
  t.innerHTML = `<div class="msg">${escapeHtml(message)}</div><div class="close" aria-label="cerrar">&times;</div>`;
  toastContainer.appendChild(t);
  const closer = () => t.remove();
  t.querySelector('.close').addEventListener('click', closer);
  setTimeout(() => { t.remove(); }, timeout);
}

Promise.all([loadAutores(), loadBooks()]);