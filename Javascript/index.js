document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.getElementById("addBtn");
  const noteInput = document.getElementById("noteInput");
  const notesList = document.getElementById("notesList");

  // Load notes from localStorage
  loadNotes();

  // Add note when the button is clicked or enter is pressed
  addBtn.addEventListener("click", addNote);
  noteInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addNote();
    }
  });

  function addNote() {
    const text = noteInput.value.trim();
    if (text) {
      createNote(text);
      noteInput.value = "";
      saveNotes();
    }
  }

  function createNote(text, isEditing = false, timestamp = null) {
    const li = document.createElement("li");
    li.classList.add("note");
    const currentDate = timestamp || new Date().toLocaleString(); // Default to current date if no timestamp is passed

    if (isEditing) {
      li.innerHTML = `
          <div class="note-content">
            <input type="text" class="note-edit-input" value="${text}">
            <div class="note-buttons">
              <button class="save-btn">Save</button>
              <button class="cancel-btn">Cancel</button>
            </div>
          </div>
        `;
    } else {
      li.innerHTML = `
          <div class="note-content">
            <div class="note-text">${text}</div>
            <div class="note-date">Created on: ${currentDate}</div>
            <div class="note-buttons">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </div>
          </div>
        `;
    }

    notesList.appendChild(li);

    // Set up event listeners based on mode
    if (isEditing) {
      const saveBtn = li.querySelector(".save-btn");
      const cancelBtn = li.querySelector(".cancel-btn");
      const editInput = li.querySelector(".note-edit-input");

      saveBtn.addEventListener("click", () => {
        const newText = editInput.value.trim();
        if (newText) {
          li.remove();
          createNote(newText, false, currentDate); // Pass the timestamp along when saving
          saveNotes();
        }
      });

      cancelBtn.addEventListener("click", () => {
        li.remove();
        createNote(text, false, currentDate); // Pass the timestamp along if cancelling
      });

      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          saveBtn.click();
        }
      });
    } else {
      const deleteBtn = li.querySelector(".delete-btn");
      const editBtn = li.querySelector(".edit-btn");

      deleteBtn.addEventListener("click", () => {
        li.classList.add("deleting");
        setTimeout(() => {
          li.remove();
          saveNotes();
        }, 300);
      });

      editBtn.addEventListener("click", () => {
        const currentText = li.querySelector(".note-text").textContent;
        li.remove();
        createNote(currentText, true, currentDate); // Pass timestamp to editing mode
      });
    }
  }

  function saveNotes() {
    const notes = [];
    document.querySelectorAll(".note").forEach((note) => {
      const noteText = note.querySelector(".note-text").textContent;
      const noteDate = note.querySelector(".note-date")
        ? note.querySelector(".note-date").textContent
        : null;
      notes.push({ text: noteText, date: noteDate });
    });
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function loadNotes() {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      JSON.parse(savedNotes).forEach((note) => {
        createNote(note.text, false, note.date); // Pass the saved date as timestamp
      });
    }
  }

  // For future Firebase integration
  function syncWithFirebase() {
    // This would be implemented when adding Firebase
    console.log("Firebase sync would happen here");
  }
});
