document.addEventListener('DOMContentLoaded', function() {
    // Get references to the relevant elements (for Personal Info, Summary, Skills)
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const summaryText = document.getElementById('summary-text');
    const skillsInput = document.getElementById('skills-input');
    
    document.getElementById('download-button').addEventListener('click', downloadResume);
    
    
    
    // Function to generate the HTML for the resume with *INLINED STYLES*
    function generateResumeHTML() {
        let resumeData = localStorage.getItem('resumeData');
    
        if (resumeData) {
            resumeData = JSON.parse(resumeData);
        } else {
            return '<p style="font-family: \'Open Sans\', sans-serif;">No resume data found. Please enter your information.</p>';
        }
    
        // Example of inlining styles (font-family and basic color)
        let resumeHTML = `
            <div style="font-family: 'Open Sans', sans-serif; color: #343a40; padding: 20px;"> 
                <h1 style="font-size: 2.2rem; margin-bottom: 5px;">${resumeData.personalInfo.name || ''}</h1>
                <p style="margin-bottom: 10px;">${resumeData.personalInfo.email || ''} | ${resumeData.personalInfo.phone || ''}</p>
    
                <h2 style="font-size: 1.6rem; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Summary</h2>
                <p style="margin-bottom: 10px;">${resumeData.summary || ''}</p>
    
                <h2 style="font-size: 1.6rem; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Skills</h2>
                <p style="margin-bottom: 10px;">${resumeData.skills || ''}</p>
        `;
    
        // *** Add Work Experience to HTML ***
        if (resumeData.workExperience && resumeData.workExperience.length > 0) {
            resumeHTML += `
                <h2 style="font-size: 1.6rem; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Work Experience</h2>
            `;
            resumeData.workExperience.forEach(experience => {
                resumeHTML += `
                    
                        <h3 style="font-size: 1.2rem; margin-bottom: 3px;">${experience.jobTitle || ''}</h3>
                        <h4 style="font-size: 1rem; margin-bottom: 3px;">${experience.company || ''}, ${experience.jobLocation || ''}</h4>
                        <p style="margin-bottom: 5px;">${experience.jobStartDate || ''} - ${experience.jobEndDate || ''}</p>
                        <p style="margin-bottom: 10px;">${experience.jobDescription || ''}</p>
                    
                `;
            });
        }
    
        // *** Add Education to HTML ***
        if (resumeData.education && resumeData.education.length > 0) {
            resumeHTML += `
                <h2 style="font-size: 1.6rem; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Education</h2>
            `;
            resumeData.education.forEach(educationItem => {
                resumeHTML += `
                    
                        <h3 style="font-size: 1.2rem; margin-bottom: 3px;">${educationItem.institution || ''}</h3>
                        <h4 style="font-size: 1rem; margin-bottom: 3px;">${educationItem.degree || ''}, ${educationItem.educationLocation || ''}</h4>
                        <p style="margin-bottom: 5px;">${educationItem.graduationDate || ''}</p>
                        <p style="margin-bottom: 10px;">${educationItem.educationDescription || ''}</p>
                    
                `;
            });
        }
    
        // *** Add Awards to HTML ***
        if (resumeData.awards && resumeData.awards.length > 0) {
            resumeHTML += `
                <h2 style="font-size: 1.6rem; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Awards</h2>
            `;
            resumeData.awards.forEach(award => {
                resumeHTML += `
                    
                        <h3 style="font-size: 1.2rem; margin-bottom: 3px;">${award.awardName || ''}</h3>
                        <p style="margin-bottom: 5px;">${award.awardDate || ''}</p>
                        <p style="margin-bottom: 10px;">${award.awardDescription || ''}</p>
                    
                `;
            });
        }
    
        // *** Add Projects to HTML ***
        if (resumeData.projects && resumeData.projects.length > 0) {
            resumeHTML += `
                <h2 style="font-size: 1.6rem; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Projects</h2>
            `;
            resumeData.projects.forEach(project => {
                resumeHTML += `
                    
                        <h3 style="font-size: 1.2rem; margin-bottom: 3px;">${project.projectName || ''}</h3>
                        <p style="margin-bottom: 5px;">${project.projectTechnologies || ''}</p>
                        <p style="margin-bottom: 10px;">${project.projectDescription || ''}</p>
                        <a href="${project.projectLink || ''}" target="_blank" style="color: #3498db; text-decoration: none;">Project Link</a>
                    
                `;
            });
        }
    
        resumeHTML += `</div>`; // Closing div
    
        return resumeHTML;
    }
    
    function saveData() {
        // 1. Get values from input fields (Personal Info, Summary, Skills)
        const name = nameInput.value;
        const email = emailInput.value;
        const summary = summaryText.value;
        const skills = skillsInput.value;
    
        // 2. Create a JavaScript object
        const resumeData = {
            personalInfo: { name: name, email: email },
            summary: summary,
            skills: skills,
            workExperience: [], // Initialize as an empty array
            education: [],      // Initialize as an empty array
            awards: [],          // Initialize as an empty array
            projects: []         // Initialize as an empty array
    
            // We'll add work experience, education, etc. data to these arrays later
        };
    
        // *** Collect Work Experience Data ***
        const workExperienceEntries = document.querySelectorAll('.work-experience-entry');
        workExperienceEntries.forEach(entry => {
            const jobTitle = entry.querySelector('[name="job-title"]').value;
            const company = entry.querySelector('[name="company"]').value;
            const jobLocation = entry.querySelector('[name="job-location"]').value;
            const jobStartDate = entry.querySelector('[name="job-start-date"]').value;
            const jobEndDate = entry.querySelector('[name="job-end-date"]').value;
            const jobDescription = entry.querySelector('[name="job-description"]').value;
    
            resumeData.workExperience.push({
                jobTitle,
                company,
                jobLocation,
                jobStartDate,
                jobEndDate,
                jobDescription
            });
        });
    
        // *** Collect Education Data ***
        const educationEntries = document.querySelectorAll('.education-entry');
        educationEntries.forEach(entry => {
            const institution = entry.querySelector('[name="institution"]').value;
            const degree = entry.querySelector('[name="degree"]').value;
            const educationLocation = entry.querySelector('[name="education-location"]').value;
            const graduationDate = entry.querySelector('[name="graduation-date"]').value;
            const educationDescription = entry.querySelector('[name="education-description"]').value;
    
            resumeData.education.push({
                institution,
                degree,
                educationLocation,
                graduationDate,
                educationDescription
            });
        });
    
         // *** Collect Awards Data ***
         const awardEntries = document.querySelectorAll('.award-entry');
         awardEntries.forEach(entry => {
             const awardName = entry.querySelector('[name="award-name"]').value;
             const awardDate = entry.querySelector('[name="award-date"]').value;
             const awardDescription = entry.querySelector('[name="award-description"]').value;
    
             resumeData.awards.push({
                 awardName,
                 awardDate,
                 awardDescription
             });
         });
    
         // *** Collect Projects Data ***
         const projectEntries = document.querySelectorAll('.project-entry');
         projectEntries.forEach(entry => {
             const projectName = entry.querySelector('[name="project-name"]').value;
             const projectDescription = entry.querySelector('[name="project-description"]').value;
             const projectTechnologies = entry.querySelector('[name="project-technologies"]').value;
             const projectLink = entry.querySelector('[name="project-link"]').value;
    
             resumeData.projects.push({
                 projectName,
                 projectDescription,
                 projectTechnologies,
                 projectLink
             });
         });
    
        // 3. Convert the object to a JSON string
        const resumeDataJSON = JSON.stringify(resumeData);
    
        // 4. Store the JSON string in Local Storage
        localStorage.setItem('resumeData', resumeDataJSON);
        alert('Resume data saved!'); // Optional: Provide feedback to the user
    
    }
    
    
    
    function loadData() {
        // 1. Check if there's any data in Local Storage
        const storedData = localStorage.getItem('resumeData');
    
        if (storedData) {
            // 2. Retrieve the data
            // 3. Parse the JSON string
            const resumeData = JSON.parse(storedData);
    
            // 4. Populate the input fields (Personal Info, Summary, Skills)
            nameInput.value = resumeData.personalInfo.name || ''; // Use || '' to handle cases where a value might be missing
            emailInput.value = resumeData.personalInfo.email || '';
            summaryText.value = resumeData.summary || '';
            skillsInput.value = resumeData.skills || '';
    
            // *** Populate Work Experience Data ***
            // First, remove any existing entries
            const workExperienceContainer = document.getElementById('work-experience-container');
            workExperienceContainer.innerHTML = ''; // Clear existing entries
    
            resumeData.workExperience.forEach(experience => {
                // Create a new work experience entry element
                const workExperienceDiv = document.createElement('div');
                workExperienceDiv.classList.add('work-experience-entry');
    
                workExperienceDiv.innerHTML = `
                    <label for="job-title">Job Title:</label>
                    <input type="text" id="job-title" name="job-title" value="${experience.jobTitle || ''}"><br>
    
                    <label for="company">Company:</label>
                    <input type="text" id="company" name="company" value="${experience.company || ''}"><br>
    
                    <label for="job-location">Location:</label>
                    <input type="text" id="job-location" name="job-location" value="${experience.jobLocation || ''}"><br>
    
                    <label for="job-start-date">Start Date:</label>
                    <input type="date" id="job-start-date" name="job-start-date" value="${experience.jobStartDate || ''}"><br>
    
                    <label for="job-end-date">End Date:</label>
                    <input type="date" id="job-end-date" name="job-end-date" value="${experience.jobEndDate || ''}"><br>
    
                    <label for="job-description">Description:</label>
                    <textarea id="job-description" name="job-description">${experience.jobDescription || ''}</textarea><br>
    
                    <button type="button" class="remove-work-experience">Remove</button>
                `;
    
                workExperienceContainer.appendChild(workExperienceDiv);
    
                // Add event listener to the "Remove" button for this entry
                const removeButton = workExperienceDiv.querySelector('.remove-work-experience');
                removeButton.addEventListener('click', function() {
                    workExperienceContainer.removeChild(workExperienceDiv);
                    saveData(); // Call saveData to update localStorage after removing an entry
                });
    
            });
    
            // *** Populate Education Data ***
            const educationContainer = document.getElementById('education-container');
            educationContainer.innerHTML = '';
            resumeData.education.forEach(educationItem => {
                const educationDiv = document.createElement('div');
                educationDiv.classList.add('education-entry');
                educationDiv.innerHTML = `
                    <label for="institution">Institution:</label>
                    <input type="text" id="institution" name="institution" value="${educationItem.institution || ''}"><br>
                    <label for="degree">Degree:</label>
                    <input type="text" id="degree" name="degree" value="${educationItem.degree || ''}"><br>
                    <label for="education-location">Location:</label>
                    <input type="text" id="education-location" name="education-location" value="${educationItem.educationLocation || ''}"><br>
                    <label for="graduation-date">Graduation Date:</label>
                    <input type="date" id="graduation-date" name="graduation-date" value="${educationItem.graduationDate || ''}"><br>
                    <label for="education-description">Description:</label>
                    <textarea id="education-description" name="education-description">${educationItem.educationDescription || ''}</textarea><br>
                    <button type="button" class="remove-education">Remove</button>
                `;
                educationContainer.appendChild(educationDiv);
                  // Add event listener to the "Remove" button for this entry
                  const removeButton = educationDiv.querySelector('.remove-education');
                  removeButton.addEventListener('click', function() {
                      educationContainer.removeChild(educationDiv);
                      saveData(); // Call saveData to update localStorage after removing an entry
                  });
            });
    
             // *** Populate Awards Data ***
             const awardsContainer = document.getElementById('awards-container');
             awardsContainer.innerHTML = '';
             resumeData.awards.forEach(award => {
                 const awardDiv = document.createElement('div');
                 awardDiv.classList.add('award-entry');
                 awardDiv.innerHTML = `
                     <label for="award-name">Award Name:</label>
                     <input type="text" id="award-name" name="award-name" value="${award.awardName || ''}"><br>
                     <label for="award-date">Date Received:</label>
                     <input type="text" id="award-date" name="award-date" value="${award.awardDate || ''}"><br>
                     <label for="award-description">Description:</label>
                     <textarea id="award-description" name="award-description">${award.awardDescription || ''}</textarea><br>
                     <button type="button" class="remove-award">Remove</button>
                 `;
                 awardsContainer.appendChild(awardDiv);
    
                   // Add event listener to the "Remove" button for this entry
                   const removeButton = awardDiv.querySelector('.remove-award');
                   removeButton.addEventListener('click', function() {
                       awardsContainer.removeChild(awardDiv);
                       saveData(); // Call saveData to update localStorage after removing an entry
                   });
             });
    
              // *** Populate Projects Data ***
              const projectsContainer = document.getElementById('projects-container');
              projectsContainer.innerHTML = '';
              resumeData.projects.forEach(project => {
                  const projectDiv = document.createElement('div');
                  projectDiv.classList.add('project-entry');
                  projectDiv.innerHTML = `
                      <label for="project-name">Award Name:</label>
                      <input type="text" id="project-name" name="project-name" value="${project.projectName || ''}"><br>
                      <label for="project-description">Description:</label>
                      <textarea id="project-description" name="project-description">${project.projectDescription || ''}</textarea><br>
                      <label for="project-technologies">Description:</label>
                      <input type="text" id="project-technologies" name="project-technologies" value="${project.projectTechnologies || ''}"><br>
                      <label for="project-link">Project Link (Optional):</label>
                      <input type="url" id="project-link" name="project-link" value="${project.projectLink || ''}"><br>
                      <button type="button" class="remove-project">Remove</button>
                  `;
                  projectsContainer.appendChild(projectDiv);
    
                    // Add event listener to the "Remove" button for this entry
                    const removeButton = projectDiv.querySelector('.remove-project');
                    removeButton.addEventListener('click', function() {
                        projectsContainer.removeChild(projectDiv);
                        saveData(); // Call saveData to update localStorage after removing an entry
                    });
              });
        }
    }
    
    
    function downloadResume() {
        saveData()
        // 1. Generate the HTML for the resume
        const resumeHTML = generateResumeHTML();
    
        // 2. Use html2pdf to generate the PDF and trigger the download
        html2pdf().from(resumeHTML).save('resume.pdf');
    }
    
    
    // Call loadData when the page loads
    loadData();
    
    // Add an event listener to the "download" button
    const downloadButton = document.getElementById('save-button');
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            saveData();  // Call saveData to collect all latest changes
        });
    } else {
        console.error("Download button not found!");
    }
    
    // Work Experience Logic
    const addWorkExperienceButton = document.getElementById('add-work-experience');
    const workExperienceContainer = document.getElementById('work-experience-container');
    
    if (addWorkExperienceButton && workExperienceContainer) {
        addWorkExperienceButton.addEventListener('click', function() {
            const workExperienceDiv = document.createElement('div');
            workExperienceDiv.classList.add('work-experience-entry');
    
            workExperienceDiv.innerHTML = `
                <label for="job-title">Job Title:</label>
                <input type="text" id="job-title" name="job-title"><br>
    
                <label for="company">Company:</label>
                <input type="text" id="company" name="company"><br>
    
                <label for="job-location">Location:</label>
                <input type="text" id="job-location" name="job-location"><br>
    
                <label for="job-start-date">Start Date:</label>
                <input type="date" id="job-start-date" name="job-start-date"><br>
    
                <label for="job-end-date">End Date:</label>
                <input type="date" id="job-end-date" name="job-end-date"><br>
    
                <label for="job-description">Description:</label>
                <textarea id="job-description" name="job-description"></textarea><br>
    
                <button type="button" class="remove-work-experience">Remove</button>
            `;
    
            workExperienceContainer.appendChild(workExperienceDiv);
    
            const removeButton = workExperienceDiv.querySelector('.remove-work-experience');
            removeButton.addEventListener('click', function() {
                workExperienceContainer.removeChild(workExperienceDiv);
                saveData();  // Call saveData to update localStorage after removing an entry
            });
        });
    }
    
    // Education Logic (Similar to Work Experience)
    const addEducationButton = document.getElementById('add-education');
const educationContainer = document.getElementById('education-container');

if (addEducationButton && educationContainer) {
    addEducationButton.addEventListener('click', function() {
        const educationDiv = document.createElement('div');
        educationDiv.classList.add('education-entry');

        educationDiv.innerHTML = `
            <label>Institution:</label>
            <input type="text" name="institution"><br>

            <label>Degree:</label>
            <input type="text" name="degree"><br>

            <label>Location:</label>
            <input type="text" name="education-location"><br>

            <label>Graduation Date:</label>
            <input type="date" name="graduation-date"><br>

            <label>Description:</label>
            <textarea name="education-description"></textarea><br>

            <button type="button" class="remove-education">Remove</button>
        `;

        educationContainer.appendChild(educationDiv);

        const removeButton = educationDiv.querySelector('.remove-education');
        removeButton.addEventListener('click', function() {
            educationContainer.removeChild(educationDiv);
            saveData(); // Call saveData to update localStorage after removing an entry
        });
    });
}

    const addAwardButton = document.getElementById('add-award');
    const awardsContainer = document.getElementById('awards-container');
    
    if (addAwardButton && awardsContainer) {
        addAwardButton.addEventListener('click', function() {
            const awardDiv = document.createElement('div');
            awardDiv.classList.add('award-entry');
    
            awardDiv.innerHTML = `
                <label for="award-name">Award Name:</label>
                <input type="text" id="award-name" name="award-name"><br>
    
                <label for="award-date">Date Received:</label>
                <input type="text" id="award-date" name="award-date"><br>
    
                <label for="award-description">Description:</label>
                <textarea id="award-description" name="award-description"></textarea><br>
    
                <button type="button" class="remove-award">Remove</button>
            `;
    
            awardsContainer.appendChild(awardDiv);
    
            const removeButton = awardDiv.querySelector('.remove-award');
            removeButton.addEventListener('click', function() {
                awardsContainer.removeChild(awardDiv);
                saveData();  // Call saveData to update localStorage after removing an entry
            });
        });
    }
    
    // Projects Logic
    const addProjectButton = document.getElementById('add-project');
    const projectsContainer = document.getElementById('projects-container');
    
    if (addProjectButton && projectsContainer) {
        addProjectButton.addEventListener('click', function() {
            const projectDiv = document.createElement('div');
            projectDiv.classList.add('project-entry');
    
            projectDiv.innerHTML = `
                <label for="project-name">Project Name:</label>
                <input type="text" id="project-name" name="project-name"><br>
    
                <label for="project-description">Description:</label>
                <textarea id="project-description" name="project-description"></textarea><br>
    
                <label for="project-technologies">Technologies Used:</label>
                <input type="text" id="project-technologies" name="project-technologies"><br>
    
                <label for="project-link">Project Link (Optional):</label>
                <input type="url" id="project-link" name="project-link"></br>
    
                <button type="button" class="remove-project">Remove</button>
            `;
    
            projectsContainer.appendChild(projectDiv);
    
            const removeButton = projectDiv.querySelector('.remove-project');
            removeButton.addEventListener('click', function() {
                projectsContainer.removeChild(projectDiv);
                saveData(); // Call saveData to update localStorage after removing an entry
            });
        });
    }
    
    // Call loadData when the page loads
    loadData();

    }); 
