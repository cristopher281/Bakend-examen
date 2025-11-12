const API = "/libros";
const API_AUTORES = "/autores";

const tbody = document.getElementById("books-tbody");
const form = document.getElementById("book-form");
const inputId = document.getElementById("book-id");
const inputTitulo = document.getElementById("titulo");
const selectAutor = document.getElementById("autorId");
const btnReset = document.getElementById("reset-btn");
const btnReload = document.getElementById("reload-btn");

function renderRows(books) {
  tbody.innerHTML = "";
  for (const b of books) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.id}</td>
      <td>${b.titulo}</td>
      <td>${b.autorNombre ?? ""}</td>
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

async function loadBooks() {
  const res = await fetch(API);
  const data = await res.json();
  renderRows(data);
}

async function loadAutores() {
  const res = await fetch(API_AUTORES);
  const autores = await res.json();
  selectAutor.innerHTML = "";
  for (const a of autores) {
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = a.nombre;
    selectAutor.appendChild(opt);
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
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (res.ok) {
      await loadBooks();
    } else {
      alert("Error al eliminar libro");
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
  const res = await fetch(isEdit ? `${API}/${id}` : API, {
    method: isEdit ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    form.reset();
    inputId.value = "";
    await loadBooks();
  } else {
    const { message } = await res.json().catch(() => ({ message: "Error" }));
    alert(message || "Ocurrió un error");
  }
});

btnReset.addEventListener("click", () => {
  form.reset();
  inputId.value = "";
});

btnReload.addEventListener("click", loadBooks);

Promise.all([loadAutores(), loadBooks()]);