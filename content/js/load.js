const projectsRow = document.getElementById('projects-container');
const fetchProjects = async () => {
    try {
        const response = await fetch('../data/projects.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const json = await response.json();
        if (!json.projects || !Array.isArray(json.projects)) {
            throw new Error('Invalid projects data format.');
        }
        return json.projects;
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
};
const logMissingField = (projectTitle, field) => {
    console.warn(`Project "${projectTitle}" is missing a ${field}.`);
};
async function projectFields() {
    if (!projectsRow)
        return;
    projectsRow.innerHTML = `
        <div class="col-12 text-center">
            <h2 class="mb-4">My Work</h2>
            <p>Here is a selection of some of my recent projects.</p>
        </div>
    `;
    try {
        const projects = await fetchProjects();
        if (projects.length === 0) {
            projectsRow.innerHTML += `
                <div class="col-12">
                    <p class="text-center text-muted">No projects to display at the moment.</p>
                </div>
            `;
            return;
        }
        projects.forEach((project) => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-4 d-flex';
            let cardContent = `<div class="card flex-fill h-100">`;
            if (project.img) {
                cardContent += `
                    <img src="${project.img}" class="card-img-top" alt="${project.title || 'Project'} image">
                `;
            }
            else {
                logMissingField(project.title || 'Untitled', 'image');
            }
            cardContent += `
                <div class="card-body">
                    <h5 class="card-title">${project.title || 'Untitled'}</h5>
                    <p class="card-text">${project.description || 'No description available.'}</p>
            `;
            if (project.tags && project.tags.length > 0) {
                project.tags.forEach(tag => {
                    cardContent += `<span class="badge badge-tag text-dark me-1 mb-1">${tag}</span>`;
                });
            }
            cardContent += `<br>`;
            if (project.link) {
                cardContent += `<a href="${project.link}" class="btn btn-primary me-2" target="_blank" rel="noopener noreferrer">Live Demo</a>`;
            }
            else {
                logMissingField(project.title || 'Untitled', 'project link');
            }
            if (project.github) {
                cardContent += `<a href="${project.github}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Source Code</a>`;
            }
            else {
                logMissingField(project.title || 'Untitled', 'GitHub link');
            }
            cardContent += `</div></div>`;
            col.innerHTML = cardContent;
            projectsRow.appendChild(col);
        });
    }
    catch (err) {
        console.error(`Unable to retrieve or display projects: ${err}`);
        projectsRow.innerHTML += `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    Unable to load projects. Please refresh or try again later.<br>${err}
                </div>
            </div>
        `;
    }
}
projectFields();
