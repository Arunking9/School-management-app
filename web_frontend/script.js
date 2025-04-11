import { openAIService } from './services/openai-service.js';
import config from './config.js';

// API Configuration
const API_BASE_URL = config.API_BASE_URL;

// State management
let currentUser = null;
let subjects = [];
let chapters = [];

// Auth state management
let currentAuthTab = 'login';

// Initialize system monitoring
async function initializeSystemMonitoring() {
    try {
        // Start monitoring core services
        await openAIService.monitorService('authentication');
        await openAIService.monitorService('database');
        await openAIService.monitorService('file_storage');
        
        // Perform initial system health check
        const healthStatus = await openAIService.performSystemHealthCheck();
        console.log('System Health Status:', healthStatus);
        
        // Set up periodic monitoring
        setInterval(async () => {
            try {
                await openAIService.monitorSecurity();
                await openAIService.performSystemHealthCheck();
            } catch (error) {
                console.error('Monitoring error:', error);
            }
        }, 300000); // Run every 5 minutes
    } catch (error) {
        console.error('Failed to initialize system monitoring:', error);
    }
}

// Initialize the page with enhanced security
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await initializeSystemMonitoring();
        
        // Ensure login page is visible by default
        const loginSection = document.querySelector('.login-section');
        const mainApp = document.getElementById('main-app');
        
        if (loginSection) loginSection.style.display = 'block';
        if (mainApp) mainApp.style.display = 'none';
        
        // Check for URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('username');
        const password = urlParams.get('password');
        const role = urlParams.get('role');
        
        if (username && password && role) {
            // Auto-login with URL parameters
            await handleAutoLogin(username, password, role);
        } else {
            // Setup login form with enhanced security
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;
                    const role = document.getElementById('role').value;
                    await handleAutoLogin(username, password, role);
                });
            }
        }
        
        // Setup form submissions with file analysis
        setupSecureFormSubmissions();
        
        // Setup secure file uploads
        setupSecureFileUploads();
        
        // Setup detail panel close button
        document.getElementById('close-detail')?.addEventListener('click', closeDetailPanel);
        
        // Setup sidebar toggle
        document.getElementById('toggleSidebar')?.addEventListener('click', toggleSidebar);
        
        // Setup resizers
        setupResizer('sidebar-resizer', '.sidebar', 'width', 200, 500);
        setupResizer('detail-resizer', '.detail-panel', 'width', 300, 600);

        // Initialize auth interface
        initializeAuthInterface();

        // Initialize navigation
        initializeNavigation();
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize the application securely');
    }
});

// Handle auto login
async function handleAutoLogin(username, password, role) {
    try {
        // Store user data
        currentUser = {
            username,
            role,
            id: 'temp-id' // Temporary ID for demo
        };
        
        // Hide login page and show main app
        const loginSection = document.querySelector('.login-section');
        const mainApp = document.getElementById('main-app');
        
        if (loginSection) loginSection.style.display = 'none';
        if (mainApp) mainApp.style.display = 'flex';
        
        // Update user info in the header
        const userNameElement = document.getElementById('user-name');
        const userRoleElement = document.getElementById('user-role');
        
        if (userNameElement) userNameElement.textContent = username;
        if (userRoleElement) userRoleElement.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        
        // Hide all panels first
        hideAllPanels();
        
        // Show appropriate panel based on role
        const panel = document.getElementById(`${role}-panel`);
        if (panel) {
            panel.style.display = 'block';
        }
        
        // Load role-specific data
        await loadRoleData(role);
        
        // Update URL without reloading the page
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('username', username);
        newUrl.searchParams.set('role', role);
        window.history.pushState({}, '', newUrl);
    } catch (error) {
        console.error('Auto login error:', error);
        showError('Failed to login automatically');
    }
}

// Setup secure form submissions
function setupSecureFormSubmissions() {
    document.getElementById('subject-form')?.addEventListener('submit', handleSecureSubjectSubmit);
    document.getElementById('chapter-form')?.addEventListener('submit', handleSecureChapterSubmit);
}

// Setup secure file uploads
function setupSecureFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', async (event) => {
            try {
                const files = Array.from(event.target.files);
                for (const file of files) {
                    const analysis = await openAIService.analyzeFile(file);
                    console.log(`File analysis for ${file.name}:`, analysis);
                    
                    // If analysis indicates security issues, prevent upload
                    if (analysis.includes('security risk') || analysis.includes('malicious')) {
                        event.target.value = '';
                        showError(`File ${file.name} was rejected due to security concerns`);
                        return;
                    }
                }
            } catch (error) {
                console.error('File analysis error:', error);
                showError('Failed to analyze uploaded file');
                event.target.value = '';
            }
        });
    });
}

// API Calls
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showError(error.message);
        throw error;
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Hide all role panels
function hideAllPanels() {
    const panels = document.querySelectorAll('.role-panel');
    panels.forEach(panel => {
        panel.style.display = 'none';
    });
}

// Load role-specific data
async function loadRoleData(role) {
    try {
        switch (role) {
            case 'teacher':
                await loadTeacherData();
                break;
            case 'principal':
                await loadPrincipalData();
                break;
            case 'admin':
                await loadAdminData();
                break;
            case 'student':
                await loadStudentData();
                break;
        }
    } catch (error) {
        console.error('Error loading role data:', error);
        showError('Failed to load role-specific data');
    }
}

// Load teacher data
async function loadTeacherData() {
    try {
        // Load subjects
        const response = await apiCall('/subjects');
        subjects = response.subjects;
        updateSubjectsList();
        updateSubjectDropdown();
        
        // Load chapters
        const chaptersResponse = await apiCall('/chapters');
        chapters = chaptersResponse.chapters;
        updateChaptersList();
    } catch (error) {
        showError('Failed to load teacher data');
    }
}

// Load principal data
async function loadPrincipalData() {
    try {
        // Show principal dashboard
        const principalPanel = document.getElementById('principal-panel');
        if (principalPanel) {
            principalPanel.style.display = 'block';
        }
        
        // Load statistics
        const stats = {
            totalTeachers: 25,
            totalStudents: 500,
            activeClasses: 15
        };
        
        // Update statistics display
        document.getElementById('total-teachers').textContent = stats.totalTeachers;
        document.getElementById('total-students').textContent = stats.totalStudents;
        document.getElementById('active-classes').textContent = stats.activeClasses;
        
        // Load recent activities
        const activities = [
            { type: 'New Teacher', description: 'John Doe joined the school', time: '2 hours ago' },
            { type: 'New Student', description: '50 new students enrolled', time: '1 day ago' },
            { type: 'Event', description: 'Annual Sports Day scheduled', time: '2 days ago' }
        ];
        
        const activitiesList = document.getElementById('recent-activities');
        if (activitiesList) {
            activitiesList.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <span class="activity-type">${activity.type}</span>
                    <p>${activity.description}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading principal data:', error);
        showError('Failed to load principal dashboard data');
    }
}

// Load admin data
async function loadAdminData() {
    try {
        // Load users
        const users = await apiCall('/users');
        const userList = document.getElementById('user-list');
        userList.innerHTML = users.map(user => `
            <div class="user-item">
                <span>${user.name} (${user.role})</span>
                <div class="item-actions">
                    <button class="btn btn-secondary" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                </div>
            </div>
        `).join('');
        
        // Load settings
        const settings = await apiCall('/settings');
        document.getElementById('school-name').value = settings.schoolName;
        document.getElementById('academic-year').value = settings.academicYear;
    } catch (error) {
        showError('Failed to load admin data');
    }
}

// Load student data with AI-generated progress reports
async function loadStudentData() {
    try {
        // Load subjects and grades
        const subjects = await apiCall('/student/subjects');
        const subjectsHTML = await Promise.all(subjects.map(async subject => {
            const progressReport = await openAIService.generateProgressReport({
                subject: subject.name,
                grade: subject.grade,
                teacher: subject.teacher
            });
            
            return `
                <div class="subject-item">
                    <h4>${subject.name}</h4>
                    <p>Grade: ${subject.grade}</p>
                    <p>Teacher: ${subject.teacher}</p>
                    <div class="progress-report">
                        <h5>Progress Report</h5>
                        <p>${progressReport}</p>
                    </div>
                </div>
            `;
        }));
        
        document.getElementById('student-subjects').innerHTML = subjectsHTML.join('');
        
        // Load assignments
        const assignments = await apiCall('/student/assignments');
        document.getElementById('student-assignments').innerHTML = assignments.map(assignment => `
            <div class="assignment-item">
                <div>
                    <h4>${assignment.title}</h4>
                    <p>Due: ${new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
                <span class="status ${assignment.status.toLowerCase()}">${assignment.status}</span>
            </div>
        `).join('');
        
        // Load grades
        const grades = await apiCall('/student/grades');
        document.getElementById('student-grades').innerHTML = grades.map(grade => `
            <div class="grade-item">
                <h4>${grade.subject}</h4>
                <p class="grade">${grade.letter}</p>
                <p>${grade.percentage}%</p>
            </div>
        `).join('');
    } catch (error) {
        showError('Failed to load student data');
    }
}

// Enhanced subject submission with content analysis
async function handleSecureSubjectSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    try {
        const subject = {
            name: form.querySelector('#subject-name').value,
            description: form.querySelector('#subject-description').value,
            gradeLevel: parseInt(form.querySelector('#grade-level').value)
        };
        
        // Analyze content for appropriateness
        const contentAnalysis = await openAIService.analyzeContent(subject.description);
        if (contentAnalysis.includes('inappropriate')) {
            showError('Subject content contains inappropriate material');
            return;
        }
        
        const response = await apiCall('/subjects', 'POST', subject);
        subjects.push(response);
        updateSubjectsList();
        updateSubjectDropdown();
        form.reset();
        showSuccess('Subject added successfully');
    } catch (error) {
        openAIService.logSecurityEvent('subject_creation_error', error.message);
        showError('Failed to add subject');
    }
}

// Enhanced chapter submission with content analysis
async function handleSecureChapterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    try {
        const chapter = {
            subjectId: parseInt(form.querySelector('#chapter-subject').value),
            title: form.querySelector('#chapter-title').value,
            description: form.querySelector('#chapter-description').value
        };
        
        // Analyze content for appropriateness
        const contentAnalysis = await openAIService.analyzeContent(chapter.description);
        if (contentAnalysis.includes('inappropriate')) {
            showError('Chapter content contains inappropriate material');
            return;
        }
        
        const response = await apiCall('/chapters', 'POST', chapter);
        chapters.push(response);
        updateChaptersList();
        form.reset();
        showSuccess('Chapter added successfully');
    } catch (error) {
        openAIService.logSecurityEvent('chapter_creation_error', error.message);
        showError('Failed to add chapter');
    }
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Update subjects list in sidebar
function updateSubjectsList() {
    const subjectsList = document.getElementById('subjects-list');
    subjectsList.innerHTML = subjects.map(subject => `
        <li onclick="showSubjectDetails(${subject.id})">${subject.name}</li>
    `).join('');
}

// Update chapters list in sidebar
function updateChaptersList() {
    const chaptersList = document.getElementById('chapters-list');
    chaptersList.innerHTML = chapters.map(chapter => `
        <li onclick="showChapterDetails(${chapter.id})">${chapter.title}</li>
    `).join('');
}

// Update subject dropdown in chapter form
function updateSubjectDropdown() {
    const select = document.getElementById('chapter-subject');
    select.innerHTML = `
        <option value="">Select a subject</option>
        ${subjects.map(subject => `
            <option value="${subject.id}">${subject.name}</option>
        `).join('')}
    `;
}

// Show subject details in detail panel
async function showSubjectDetails(id) {
    try {
        const subject = await apiCall(`/subjects/${id}`);
        const detailPanel = document.querySelector('.detail-panel');
        document.getElementById('detail-title').textContent = subject.name;
        document.getElementById('detail-content').innerHTML = `
            <div class="item-meta">Grade Level: ${subject.gradeLevel}</div>
            <div class="item-description">${subject.description}</div>
            <div class="item-actions">
                <button class="btn btn-secondary" onclick="editSubject(${subject.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteSubject(${subject.id})">Delete</button>
            </div>
        `;
        detailPanel.classList.add('active');
    } catch (error) {
        showError('Failed to load subject details');
    }
}

// Show chapter details in detail panel
async function showChapterDetails(id) {
    try {
        const chapter = await apiCall(`/chapters/${id}`);
        const subject = await apiCall(`/subjects/${chapter.subjectId}`);
        
        // Generate AI-powered content
        const summary = await openAIService.generateChapterSummary(chapter.description);
        const enrichedContent = await openAIService.generateChapterContent(
            subject.name,
            chapter.title,
            subject.gradeLevel
        );
        
        // Validate content quality
        const qualityAssessment = await openAIService.validateContentQuality(chapter.description);
        
        const detailPanel = document.querySelector('.detail-panel');
        document.getElementById('detail-title').textContent = chapter.title;
        document.getElementById('detail-content').innerHTML = `
            <div class="item-meta">Subject: ${subject.name}</div>
            <div class="item-description">${chapter.description}</div>
            
            <div class="ai-content">
                <h3>Chapter Summary</h3>
                <p>${summary}</p>
                
                <h3>Learning Resources</h3>
                <div class="resources-section">
                    <h4>Video Resources</h4>
                    <div class="video-resources">
                        ${enrichedContent.content.youtubeVideos.map(video => `
                            <div class="video-item">
                                <h5>${video.title}</h5>
                                <a href="${video.url}" target="_blank" rel="noopener noreferrer">
                                    <img src="${video.thumbnail}" alt="${video.title}">
                                </a>
                                <p>${video.description}</p>
                            </div>
                        `).join('')}
                    </div>

                    <h4>Online Documents</h4>
                    <div class="document-resources">
                        ${enrichedContent.content.documents.map(doc => `
                            <div class="document-item">
                                <h5>${doc.title}</h5>
                                <a href="${doc.url}" target="_blank" rel="noopener noreferrer">
                                    ${doc.type} - ${doc.source}
                                </a>
                                <p>${doc.description}</p>
                            </div>
                        `).join('')}
                    </div>

                    <h4>Interactive Resources</h4>
                    <div class="interactive-resources">
                        ${enrichedContent.content.interactiveExercises.map(exercise => `
                            <div class="exercise-item">
                                <h5>${exercise.title}</h5>
                                <a href="${exercise.url}" target="_blank" rel="noopener noreferrer">
                                    Try Exercise
                                </a>
                                <p>${exercise.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <h3>Learning Path</h3>
                <div class="learning-path">
                    <div class="prerequisites">
                        <h4>Prerequisites</h4>
                        <ul>
                            ${enrichedContent.path.prerequisites.map(prereq => `
                                <li>${prereq}</li>
                            `).join('')}
                        </ul>
                    </div>

                    <div class="objectives">
                        <h4>Learning Objectives</h4>
                        <ul>
                            ${enrichedContent.path.objectives.map(obj => `
                                <li>${obj}</li>
                            `).join('')}
                        </ul>
                    </div>

                    <div class="timeline">
                        <h4>Suggested Timeline</h4>
                        ${enrichedContent.path.timeline.map(item => `
                            <div class="timeline-item">
                                <h5>${item.week}</h5>
                                <p>${item.activities}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <h3>Practice Exercises</h3>
                <div class="exercises-section">
                    <div class="multiple-choice">
                        <h4>Multiple Choice Questions</h4>
                        ${enrichedContent.exercises.multipleChoice.map((q, index) => `
                            <div class="question">
                                <p><strong>Q${index + 1}:</strong> ${q.question}</p>
                                <div class="options">
                                    ${q.options.map(opt => `
                                        <label>
                                            <input type="radio" name="q${index}" value="${opt}">
                                            ${opt}
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="practice-problems">
                        <h4>Practice Problems</h4>
                        ${enrichedContent.exercises.problems.map((problem, index) => `
                            <div class="problem">
                                <p><strong>Problem ${index + 1}:</strong> ${problem.question}</p>
                                <button onclick="showSolution(${index})" class="btn btn-secondary">Show Solution</button>
                                <div id="solution-${index}" class="solution" style="display: none;">
                                    ${problem.solution}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <h3>Content Quality Assessment</h3>
                <div class="quality-assessment">
                    <div class="scores">
                        ${Object.entries(qualityAssessment.scores).map(([category, score]) => `
                            <div class="score-item">
                                <label>${category}</label>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${score}%"></div>
                                </div>
                                <span>${score}%</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="recommendations">
                        <h4>Recommendations</h4>
                        <ul>
                            ${qualityAssessment.recommendations.map(rec => `
                                <li>${rec}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="item-actions">
                <button class="btn btn-secondary" onclick="editChapter(${chapter.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteChapter(${chapter.id})">Delete</button>
            </div>
        `;
        detailPanel.classList.add('active');

        // Initialize interactive elements
        initializeExercises();
    } catch (error) {
        showError('Failed to load chapter details');
    }
}

// Initialize interactive exercises
function initializeExercises() {
    // Add event listeners for exercise interactions
    document.querySelectorAll('.multiple-choice .question').forEach(question => {
        const inputs = question.querySelectorAll('input[type="radio"]');
        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                checkAnswer(e.target);
            });
        });
    });
}

// Check multiple choice answer
function checkAnswer(input) {
    const question = input.closest('.question');
    const questionIndex = parseInt(input.name.replace('q', ''));
    const selectedAnswer = input.value;
    
    // In a real application, you would check against correct answers from your backend
    // For now, we'll just show a generic response
    showSuccess('Answer submitted successfully!');
}

// Show solution for practice problems
function showSolution(index) {
    const solution = document.getElementById(`solution-${index}`);
    if (solution.style.display === 'none') {
        solution.style.display = 'block';
    } else {
        solution.style.display = 'none';
    }
}

// Edit subject
async function editSubject(id) {
    try {
        const subject = await apiCall(`/subjects/${id}`, 'PUT', {
            name: document.getElementById('edit-subject-name').value,
            description: document.getElementById('edit-subject-description').value,
            gradeLevel: parseInt(document.getElementById('edit-grade-level').value)
        });
        
        const index = subjects.findIndex(s => s.id === id);
        if (index !== -1) {
            subjects[index] = subject;
        }
        
        updateSubjectsList();
        showSubjectDetails(id);
        showSuccess('Subject updated successfully');
    } catch (error) {
        showError('Failed to update subject');
    }
}

// Delete subject
async function deleteSubject(id) {
    if (!confirm('Are you sure you want to delete this subject?')) {
        return;
    }
    
    try {
        await apiCall(`/subjects/${id}`, 'DELETE');
        subjects = subjects.filter(s => s.id !== id);
        updateSubjectsList();
        closeDetailPanel();
        showSuccess('Subject deleted successfully');
    } catch (error) {
        showError('Failed to delete subject');
    }
}

// Edit chapter
async function editChapter(id) {
    try {
        const chapter = await apiCall(`/chapters/${id}`, 'PUT', {
            title: document.getElementById('edit-chapter-title').value,
            description: document.getElementById('edit-chapter-description').value,
            subjectId: parseInt(document.getElementById('edit-chapter-subject').value)
        });
        
        const index = chapters.findIndex(c => c.id === id);
        if (index !== -1) {
            chapters[index] = chapter;
        }
        
        updateChaptersList();
        showChapterDetails(id);
        showSuccess('Chapter updated successfully');
    } catch (error) {
        showError('Failed to update chapter');
    }
}

// Delete chapter
async function deleteChapter(id) {
    if (!confirm('Are you sure you want to delete this chapter?')) {
        return;
    }
    
    try {
        await apiCall(`/chapters/${id}`, 'DELETE');
        chapters = chapters.filter(c => c.id !== id);
        updateChaptersList();
        closeDetailPanel();
        showSuccess('Chapter deleted successfully');
    } catch (error) {
        showError('Failed to delete chapter');
    }
}

// Close detail panel
function closeDetailPanel() {
    document.querySelector('.detail-panel').classList.remove('active');
}

// Toggle sidebar
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// Setup resizer functionality
function setupResizer(resizerId, targetSelector, property, min, max) {
    const resizer = document.getElementById(resizerId);
    const target = document.querySelector(targetSelector);
    
    if (!resizer || !target) return;
    
    let startSize;
    let startPos;
    
    function startResize(e) {
        startSize = parseInt(getComputedStyle(target)[property]);
        startPos = property === 'width' ? e.clientX : e.clientY;
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    }
    
    function resize(e) {
        const currentPos = property === 'width' ? e.clientX : e.clientY;
        const diff = currentPos - startPos;
        let newSize = startSize + diff;
        
        if (newSize < min) newSize = min;
        if (newSize > max) newSize = max;
        
        target.style[property] = newSize + 'px';
    }
    
    function stopResize() {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
    
    resizer.addEventListener('mousedown', startResize);
}

// Enhanced logout with security logging
function logout() {
    try {
        // Log the logout event
        openAIService.logSecurityEvent('user_logout', {
            userId: currentUser?.id,
            username: currentUser?.username
        });
        
        // Update service status
        openAIService.updateServiceStatus('authentication', {
            status: 'inactive',
            lastLogout: new Date().toISOString()
        });
        
        // Clear sensitive data
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        
        // Clear current user data
        currentUser = null;
        subjects = [];
        chapters = [];
        
        // Reset the UI
        document.getElementById('main-app').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
        document.getElementById('login-form').reset();
        
        // Clear lists
        document.getElementById('subjects-list').innerHTML = '';
        document.getElementById('chapters-list').innerHTML = '';
        document.getElementById('assignments-list').innerHTML = '';
        
        // Close detail panel if open
        closeDetailPanel();
        
    } catch (error) {
        console.error('Logout error:', error);
        openAIService.logSecurityEvent('logout_error', error.message);
    }
}

// Initialize auth interface
function initializeAuthInterface() {
    const authChoice = document.getElementById('auth-choice');
    const loginForm = document.getElementById('login-form-container');
    const signupForm = document.getElementById('signup-form-container');
    const chooseLogin = document.getElementById('choose-login');
    const chooseSignup = document.getElementById('choose-signup');
    const backButtons = document.querySelectorAll('#back-to-choice');

    // Show choice interface by default
    authChoice.style.display = 'block';
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';

    // Add event listeners for choice buttons
    chooseLogin.addEventListener('click', () => {
        authChoice.style.display = 'none';
        loginForm.style.display = 'block';
    });

    chooseSignup.addEventListener('click', () => {
        authChoice.style.display = 'none';
        signupForm.style.display = 'block';
    });

    // Add event listeners for back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            authChoice.style.display = 'block';
            loginForm.style.display = 'none';
            signupForm.style.display = 'none';
        });
    });

    // Add form submission handlers
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data;
            showMainApplication();
        } else {
            showError('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred during login. Please try again.');
    }
}

// Handle signup
async function handleSignup(event) {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const role = document.getElementById('signup-role').value;

    if (password !== confirmPassword) {
        showError('Passwords do not match.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, role }),
        });

        if (response.ok) {
            showSuccess('Account created successfully! Please log in.');
            switchAuthTab('login');
        } else {
            const error = await response.json();
            showError(error.message || 'An error occurred during signup.');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showError('An error occurred during signup. Please try again.');
    }
}

// Show main application
function showMainApplication() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    updateHeader();
    loadRoleSpecificData();
}

// Update header with user info
function updateHeader() {
    const header = document.getElementById('header');
    if (header && currentUser) {
        header.innerHTML = `
            <div class="header-content">
                <h1>Welcome, ${currentUser.username}!</h1>
                <p>Role: ${currentUser.role}</p>
            </div>
        `;
    }
}

// Initialize navigation
function initializeNavigation() {
    const navLogin = document.getElementById('nav-login');
    const navSignup = document.getElementById('nav-signup');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Handle navigation auth buttons
    navLogin.addEventListener('click', () => {
        showLoginForm();
    });

    navSignup.addEventListener('click', () => {
        showSignupForm();
    });

    // Handle mobile menu
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            navLinks.classList.remove('active');
        }
    });
}

// Show login form
function showLoginForm() {
    const loginForm = document.createElement('div');
    loginForm.className = 'auth-box';
    loginForm.innerHTML = `
        <h2>Login to Your Account</h2>
        <form id="login-form" class="auth-form-content">
            <div class="form-group">
                <label class="form-label" for="login-username">Username</label>
                <input type="text" id="login-username" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label" for="login-password">Password</label>
                <input type="password" id="login-password" class="form-input" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
    `;
    
    // Add form to the page
    document.body.appendChild(loginForm);
    
    // Add form submission handler
    loginForm.querySelector('form').addEventListener('submit', handleLogin);
    
    // Close form when clicking outside
    document.addEventListener('click', function closeForm(event) {
        if (!loginForm.contains(event.target) && event.target !== document.getElementById('nav-login')) {
            loginForm.remove();
            document.removeEventListener('click', closeForm);
        }
    });
}

// Show signup form
function showSignupForm() {
    const signupForm = document.createElement('div');
    signupForm.className = 'auth-box';
    signupForm.innerHTML = `
        <h2>Create New Account</h2>
        <form id="signup-form" class="auth-form-content">
            <div class="form-group">
                <label class="form-label" for="signup-username">Username</label>
                <input type="text" id="signup-username" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label" for="signup-email">Email</label>
                <input type="email" id="signup-email" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label" for="signup-password">Password</label>
                <input type="password" id="signup-password" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label" for="signup-confirm-password">Confirm Password</label>
                <input type="password" id="signup-confirm-password" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label" for="signup-role">Role</label>
                <select id="signup-role" class="form-input" required>
                    <option value="">Select Role</option>
                    <option value="teacher">Teacher</option>
                    <option value="principal">Principal</option>
                    <option value="admin">Administrator</option>
                    <option value="student">Student</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Sign Up</button>
        </form>
    `;
    
    // Add form to the page
    document.body.appendChild(signupForm);
    
    // Add form submission handler
    signupForm.querySelector('form').addEventListener('submit', handleSignup);
    
    // Close form when clicking outside
    document.addEventListener('click', function closeForm(event) {
        if (!signupForm.contains(event.target) && event.target !== document.getElementById('nav-signup')) {
            signupForm.remove();
            document.removeEventListener('click', closeForm);
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeSystemMonitoring();
}); 