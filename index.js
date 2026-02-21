const notesList = document.getElementById("notesList");
const titleInput = document.getElementById("titleInput");
const textEditor = document.getElementById("textEditor");
const savedNotes = JSON.parse(localStorage.getItem("savedNotes")) || [];

const render = ({ title, content }) => {
    titleInput.value = title;
    textEditor.value = content;
};

const updateNote = (title, content, id) => {
    if (title.trim() == "") {
        alert("Title cannot be empty");
        return;
    }

    if (id == null) {
        const note = document.createElement("li");
        note.textContent = title;

        const newId = Date.now().toString();
        note.dataset.id = newId;

        Array.from(notesList.children).forEach(i => i.classList.remove("selected"));
        note.className = "selected";

        note.addEventListener("click", () => {
            const notes = Array.from(note.parentElement.children);
            notes.forEach((item) => {
                item.classList.remove("selected");
            });
            note.className = "selected";
            render({ title: title, content: content });
        });

        notesList.append(note);
        savedNotes.push({ title: title, content: content, id: newId });
    } else {
        const index = Array.from(notesList.children).findIndex(item => item.dataset.id === id);
        if (index > -1) {
            notesList.children[index].textContent = title;
            const ind = savedNotes.findIndex(item => item.id === id);
            if (ind > -1) {
                savedNotes[ind].title = title;
                savedNotes[ind].content = content;
            }
        }
    }

    localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
};

savedNotes.forEach((item) => {
    const note = document.createElement("li");
    note.textContent = item.title;
    note.dataset.id = item.id;
    note.addEventListener("click", () => {
        const notes = Array.from(note.parentElement.children);
        notes.forEach((item) => {
            item.classList.remove("selected");
        });
        note.className = "selected";
        render(item);
    });
    notesList.append(note);
});

// new button
const newBtn = document.getElementById("newBtn");
newBtn.addEventListener("click", () => {
    const notes = Array.from(notesList.children);
    notes.forEach((item) => {
        item.classList.remove("selected");
    });
    titleInput.value = "";
    textEditor.value = "";
});

// save button
const saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", () => {
    const note = document.getElementsByClassName("selected").length == 1
        ? document.getElementsByClassName("selected")[0]
        : null;

    if (note == null) {
        updateNote(titleInput.value, textEditor.value, null);
    } else {
        updateNote(titleInput.value, textEditor.value, note.dataset.id);
    }
});

const deleteBtn = document.getElementById("deleteBtn");
deleteBtn.addEventListener("click", () => {
    const note = document.getElementsByClassName("selected").length == 1
        ? document.getElementsByClassName("selected")[0]
        : null;

    if (note != null) {
        const p = prompt(`Type 'y' to delete "${note.textContent}"`);
        if (p == null || p !== 'y') return;
        const index = savedNotes.findIndex(item => item.id === note.dataset.id);
        if (index > -1) {
            savedNotes.splice(index, 1);
        }
        note.remove();
        localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
    }

    titleInput.value = "";
    textEditor.value = "";

});

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener('click', () => {
    const searchInput = document.getElementById("searchInput");
    const q = searchInput.value.toLowerCase();
    notesList.innerHTML = "";
    const filter = savedNotes.filter((item) => 
    {
        const val = item.title.toLowerCase().indexOf(q);
        if(val != -1) return true;
    });
    filter.forEach((item) => {
        const note = document.createElement("li");
        note.textContent = item.title;
        note.dataset.id = item.id;
        note.addEventListener("click", () => {
            const notes = Array.from(note.parentElement.children);
            notes.forEach((item) => {
                item.classList.remove("selected");
            });
            note.className = "selected";
            render(item);
        });
        notesList.append(note);
    })
})