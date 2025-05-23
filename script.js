let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


let editIndex = null;

function fillTasks() {
    const startSection = document.getElementById("start-section");
    const tasksContainer = document.getElementById("tasks-container");

    const hasTasks = tasks.length > 0;

    startSection.classList.toggle("hidden", hasTasks);
    tasksContainer.classList.toggle("has-tasks", hasTasks);

    let tasksContent = "";
    for (let task of tasks) {
        tasksContent += `
            <div class="item ${task.isDone}">
                <div class="item-title">
                    <h3>${task.title}</h3>
                </div>
                <div class="item-btns">
                    <button class="circular done-btn" aria-label="Mark as Done Task">
                        <span class="material-icons">done</span>
                    </button>
                    <button class="circular edit-btn" aria-label="Edit Task">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="circular delete-btn" aria-label="Delete Task">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
        `;
    }

    tasksContainer.innerHTML = tasksContent;


    // ===== Mark as Done Buttons =====
    const isDoneBtns = document.querySelectorAll(".done-btn");
    isDoneBtns.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            tasks[index].isDone = !tasks[index].isDone;
            tasks.sort((a, b) => a.isDone - b.isDone);
            saveTasks();
            fillTasks();
        })
    })

    // ===== Edit Buttons =====
    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const titleInput = document.getElementById("title");
            titleInput.value = tasks[index].title;

            editIndex = index;
            titleInput.focus();
            document.getElementById("add-edit-btn").innerHTML = "done";
        });
    });

    // ===== Delete Buttons =====
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            // Reset edit mode if the deleted task was being edited
            if (editIndex !== null && editIndex === index) {
                editIndex = null;
                document.getElementById("title").value = "";
                document.getElementById("add-edit-btn").innerHTML = "add";
            } else if (editIndex !== null && index < editIndex) {
                editIndex--; // shift index after deletion
            }

            tasks.splice(index, 1);
            tasks.sort((a, b) => a.isDone - b.isDone);
            saveTasks();
            fillTasks();
        });
    });
}

fillTasks();

// ===== Form Submit: Add or Edit =====
const formAction = document.getElementById("form-action");

formAction.addEventListener("submit", (event) => {
    event.preventDefault();

    const titleInput = document.getElementById("title");
    const titleValue = titleInput.value.trim();

    if (titleValue === "") return;

    if (editIndex !== null) {
        // Edit mode
        tasks[editIndex].title = titleValue;
        editIndex = null;
        document.getElementById("add-edit-btn").innerHTML = "add";
    } else {
        // Add mode
        tasks.push({ title: titleValue, isDone: false });
    }

    titleInput.value = "";
    tasks.sort((a, b) => a.isDone - b.isDone);
    saveTasks();
    fillTasks();
});


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
