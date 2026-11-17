
const API = "http://localhost:5000/api/jobs";

const form = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");
const search = document.getElementById("search");

let jobs = [];

function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

// Get all jobs
async function getJobs() {
    try {
        const response = await fetch(API);

        if (!response.ok) throw new Error("Could not load jobs");

        jobs = await response.json();
        displayJobs();
    } catch (err) {
        alert(err.message);
    }
}

// Display jobs
function displayJobs() {
    let filteredJobs = jobs.filter(job =>
        job.company.toLowerCase().includes(search.value.toLowerCase()) ||
        job.position.toLowerCase().includes(search.value.toLowerCase())
    );

    jobList.innerHTML = "";

    filteredJobs.forEach(job => {
        jobList.innerHTML += `
            <tr>
                <td>${escapeHTML(job.company)}</td>
                <td>${escapeHTML(job.position)}</td>
                <td>${escapeHTML(job.location)}</td>
                <td>
                    <select onchange="updateStatus('${job._id}', this.value)">
                        ${['Applied', 'Interview', 'Selected', 'Rejected'].map(status =>
                            `<option value="${status}" ${job.status === status ? 'selected' : ''}>${status}</option>`
                        ).join('')}
                    </select>
                </td>
                <td>
                    <button class="delete-btn"
                        onclick="deleteJob('${job._id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById("total").innerText = jobs.length;

    document.getElementById("interviews").innerText =
        jobs.filter(j => j.status === "Interview").length;

    document.getElementById("selected").innerText =
        jobs.filter(j => j.status === "Selected").length;

    document.getElementById("rejected").innerText =
        jobs.filter(j => j.status === "Rejected").length;
}

// Add job
form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const job = {
        company: document.getElementById("company").value.trim(),
        position: document.getElementById("position").value.trim(),
        location: document.getElementById("location").value.trim()
    };

    try {
        const response = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(job)
        });

        if (!response.ok) throw new Error("Could not add job");

        form.reset();
        getJobs();
    } catch (err) {
        alert(err.message);
    }
});

// Update status
async function updateStatus(id, status) {
    try {
        const response = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });

        if (!response.ok) throw new Error("Could not update status");

        getJobs();
    } catch (err) {
        alert(err.message);
    }
}

// Delete job
async function deleteJob(id) {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
        const response = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Could not delete job");

        getJobs();
    } catch (err) {
        alert(err.message);
    }
}

// Search
search.addEventListener("input", displayJobs);

// Initial load
getJobs();
