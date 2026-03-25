const projectsRow = document.getElementById('projects-container');

const fetchProjects = async () => {
    try {
        const response = await fetch('../../content/data/projects.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        } const { projects } = await response.json();
        return projects || [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
};

const logMissingField = (projectTitle, field) => console.warn(`Project "${projectTitle}" is missing a ${field}.`);

async function projectFields() {
    if (!projectsRow) return;
    projectsRow.innerHTML = ``;

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
            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4 mb-4 d-flex';

            let cardContent = `<div class="card flex-fill h-100">`;

            if (project.img) {
                cardContent += `
                    <img src="${project.img}" class="card-img-top" alt="${project.title || 'Project'} image" loading="eager" decoding="async" fetchpriority="high">
                `;
            } else {
                logMissingField(project.title || 'Untitled', 'image');
            }

            cardContent += `
                <div class="card-body">
                    <h5 class="card-title">${project.title || 'Untitled'}</h5>
                    <p class="card-text">${project.description || 'No description available.'}</p>
            `;

            for (const tag of project.tags || []) {
                let tagColor = '';
                switch (tag) {
                    case 'HTML':
                        tagColor = 'html';
                        break;
                    case 'CSS':
                        tagColor = 'css';
                        break;
                    case 'JavaScript':
                        tagColor = 'js';
                        break;
                    case 'TypeScript':
                        tagColor = 'ts';
                        break;
                    case 'PHP':
                        tagColor = 'php';
                        break;
                    case 'Python':
                        tagColor = 'python';
                        break;
                    case 'Ruby':
                        tagColor = 'ruby';
                        break;
                    case 'Bootstrap':
                        tagColor = 'bootstrap';
                        break;
                    case 'Three.js':
                        tagColor = 'threejs';
                        break;
                    case 'API':
                        tagColor = 'api';
                        break;
                    case 'RPG Maker XP':
                        tagColor = 'rpgmakerxp';
                        break;
                }
                cardContent += `<span class="${tagColor} me-1 mb-1">${tag}</span>`;
            }

            cardContent += `</div><div>`;

            if (project.subContent && project.subContent.length > 0) {
                project.subContent.forEach(sub => {
                    cardContent += `
                    <details class="mb-2 style">
                    <summary class="fw-bold">${sub.title}</summary>
                    <p class="card-text"><small>${sub.description}</small></p>
                `;

                if (sub.github) {
                    cardContent += `<a href="${sub.github}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Source Code</a>`;
                } else {
                    logMissingField(sub.title || 'Untitled', 'GitHub link');
                }
                cardContent += `
                </details>
                `;
                });
            } else {
                logMissingField(project.title || 'Untitled', 'subcontent');
            }

            if (project.link) {
                if (`${project.link}`.includes('github.io')) {
                    cardContent += `<a href="${project.link}" class="btn btn-primary me-2" target="_blank" rel="noopener noreferrer">Live Demo</a>`;
                } else {
                    cardContent += `<a href="${project.link}" class="btn btn-primary me-2" target="_blank" rel="noopener noreferrer">Project Link</a>`;
                }
            } else {
                logMissingField(project.title || 'Untitled', 'project link');
            }
            
            if (project.github) {
                cardContent += `<a href="${project.github}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Source Code</a>`;
            } else {
                logMissingField(project.title || 'Untitled', 'GitHub link');
            }

            const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (isoDateRegex.test(String(project.age))) {
                cardContent += `<p class="card-text mt-2 text-end date-helper"><small><date data="${project.age}" mode="full"></date></small></p>`;
            } else if (project.age === 'soon') {
                cardContent += `<p class="card-text mt-2 text-end date-helper"><small>Soon™</small></p>`;
            } else if (project.age === 'dead') {
                cardContent += `<p class="card-text mt-2 text-end date-helper"><small>Discontinued</small></p>`;
            } else {
            logMissingField(project.title || 'Untitled', 'age');
            }
                        
            cardContent += `</div></div>`;
            card.innerHTML = cardContent;
            projectsRow.appendChild(card);
            updateDates();
         });
    } catch (err) {
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