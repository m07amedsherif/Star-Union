let students = []; 
let nextId = 1; 
const PASSING_GRADE = 60; 

const saveToLocalStorage = () => {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('nextId', nextId.toString());
};

const loadFromLocalStorage = () => {
    const storedStudents = localStorage.getItem('students');
    const storedNextId = localStorage.getItem('nextId');
    
    if (storedStudents) {
        students = JSON.parse(storedStudents);
    }
    
    if (storedNextId) {
        nextId = parseInt(storedNextId);
    }
};

function addStudent() {
    const nameInput = document.getElementById('studentName');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('⚠️ Please enter a student name!');
        nameInput.classList.add('shake');
        setTimeout(() => nameInput.classList.remove('shake'), 500);
        return;
    }
    
    let isValidName = false;
    let attempts = 0;
    while (attempts < 1 && !isValidName) {
        if (name.length >= 2) {
            isValidName = true;
        } else {
            alert('⚠️ Name must be at least 2 characters long!');
            return;
        }
        attempts++;
    }
    
    const student = {
        id: nextId++,
        name: name,
        grades: [], // Array of numbers
        tasks: [], // Array of task objects
        passed: false, // Boolean
        average: 0 // Number
    };
    
    students.push(student);
    saveToLocalStorage();
    
    nameInput.value = '';
    updateStudentSelects();
    renderStudents();
    updateStatistics();
    
    showNotification(`✅ Student "${name}" added successfully!`, 'success');
}

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(student => student.id !== studentId);
        
        saveToLocalStorage();
        updateStudentSelects();
        renderStudents();
        updateStatistics();
        
        showNotification('🗑️ Student deleted successfully!', 'warning');
    }
}

function addTask() {
    const studentSelect = document.getElementById('taskStudentSelect');
    const taskInput = document.getElementById('taskInput');
    const gradeInput = document.getElementById('taskGradeInput');
    const studentId = parseInt(studentSelect.value);
    const taskDescription = taskInput.value.trim();
    const grade = parseFloat(gradeInput.value);
    
    if (!studentId) {
        alert('⚠️ Please select a student!');
        return;
    }
    
    if (!taskDescription) {
        alert('⚠️ Please enter a task description!');
        taskInput.classList.add('shake');
        setTimeout(() => taskInput.classList.remove('shake'), 500);
        return;
    }
    
    if (isNaN(grade) || grade < 0 || grade > 100) {
        alert('⚠️ Please enter a valid grade between 0 and 100!');
        gradeInput.classList.add('shake');
        setTimeout(() => gradeInput.classList.remove('shake'), 500);
        return;
    }
    
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        const task = {
            id: Date.now(), // Unique ID using timestamp
            description: taskDescription,
            grade: grade, // Number - grade for this task
            completed: false // Boolean
        };
        
        student.tasks.push(task);
        student.grades.push(grade);
        
        updateStudentStatus(student);
        
        saveToLocalStorage();
        taskInput.value = '';
        gradeInput.value = '';
        renderStudents();
        updateStatistics();
        
        showNotification(`✅ Task with grade ${grade} added to ${student.name}!`, 'success');
    }
}

function toggleTask(studentId, taskId) {
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        const task = student.tasks.find(t => t.id === taskId);
        
        if (task) {
            // Toggle boolean value using logical NOT operator
            task.completed = !task.completed;
            
            saveToLocalStorage();
            renderStudents();
        }
    }
}

function calculateAverage(grades) {
    if (grades.length === 0) {
        return 0;
    }
    
    let sum = 0;
    for (const grade of grades) {
        sum += grade; // Arithmetic operator +=
    }
    
    const average = sum / grades.length;
    return Math.round(average * 100) / 100; 
}

function updateStudentStatus(student) {
    student.average = calculateAverage(student.grades);
    
    student.passed = student.average >= PASSING_GRADE && student.grades.length > 0;
}

function getLetterGrade(average) {
    switch (true) {
        case (average >= 90):
            return 'A';
        case (average >= 80):
            return 'B';
        case (average >= 70):
            return 'C';
        case (average >= 60):
            return 'D';
        default:
            return 'F';
    }
}

function getGradeBadgeClass(letter) {
    switch (letter) {
        case 'A':
            return 'grade-a';
        case 'B':
            return 'grade-b';
        case 'C':
            return 'grade-c';
        case 'D':
            return 'grade-d';
        default:
            return 'grade-f';
    }
}

function showAllStudents() {
    renderStudents(students);
    showNotification('📋 Showing all students', 'info');
}

const showPassedStudents = () => {
    const passed = students.filter(student => 
        student.passed && student.grades.length > 0
    );
    
    if (passed.length === 0) {
        alert('No students have passed yet!');
        return;
    }
    
    renderStudents(passed);
    showNotification(`✅ Showing ${passed.length} passed student(s)`, 'success');
};

const showFailedStudents = () => {
    const failed = students.filter(student => 
        !student.passed || student.grades.length === 0
    );
    
    if (failed.length === 0) {
        alert('No students have failed!');
        return;
    }
    
    renderStudents(failed);
    showNotification(`Showing ${failed.length} failed student(s)`, 'warning');
};

function renderStudents(studentsToRender = students) {
    const container = document.getElementById('studentsList');
    
    if (studentsToRender.length === 0) {
        container.innerHTML = '<p class="empty-state">No students to display!</p>';
        return;
    }
    
    container.innerHTML = '';
    
    for (let i = 0; i < studentsToRender.length; i++) {
        const student = studentsToRender[i];
        const card = createStudentCard(student);
        container.appendChild(card);
    }
}

function createStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'student-card';
    
    const letterGrade = getLetterGrade(student.average);
    const gradeBadgeClass = getGradeBadgeClass(letterGrade);
    
    card.innerHTML = `
        <div class="student-header">
            <h3 class="student-name">${student.name}</h3>
            <span class="student-id">ID: ${student.id}</span>
        </div>
        
        <div class="student-info">
            <div class="info-row">
                <span class="info-label">Average:</span>
                <span class="info-value">${student.average.toFixed(2)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Letter Grade:</span>
                <span class="info-value">
                    <span class="grade-badge ${gradeBadgeClass}">${letterGrade}</span>
                </span>
            </div>
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value">
                    <span class="status-badge ${student.passed ? 'status-passed' : 'status-failed'}">
                        ${student.passed ? '✓ Passed' : '✗ Failed'}
                    </span>
                </span>
            </div>
            <div class="info-row">
                <span class="info-label">Total Grades:</span>
                <span class="info-value">${student.grades.length}</span>
            </div>
        </div>
        
        <div class="grades-section">
            <h4>📊 Grades:</h4>
            <div class="grades-list">
                ${renderGrades(student.grades)}
            </div>
        </div>
        
        <div class="tasks-section">
            <h4>✅ Tasks (${student.tasks.length}):</h4>
            ${renderTasks(student)}
        </div>
        
        <button class="btn-delete" onclick="deleteStudent(${student.id})">
            🗑️ Delete Student
        </button>
    `;
    
    return card;
}

function renderGrades(grades) {
    if (grades.length === 0) {
        return '<span class="grade-item">No grades yet</span>';
    }
    
    return grades.map(grade => 
        `<span class="grade-item">${grade}</span>`
    ).join('');
}

function renderTasks(student) {
    if (student.tasks.length === 0) {
        return '<div class="task-item">No tasks assigned</div>';
    }
    
    let html = '';
    for (const task of student.tasks) {
        html += `
            <div class="task-item">

                <span class="task-text">
                    ${task.description}
                </span>
                <span class="task-grade">Grade: ${task.grade}</span>
            </div>
        `;
    }
    
    return html;
}

function updateStudentSelects() {
    const taskSelect = document.getElementById('taskStudentSelect');
    
    taskSelect.innerHTML = '<option value="">Select a student</option>';
    
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        taskSelect.appendChild(option);
    });
}

function updateStatistics() {
    const totalStudents = students.length;
    const passedCount = students.filter(s => s.passed && s.grades.length > 0).length;
    const failedCount = students.filter(s => !s.passed || s.grades.length === 0).length;
    
    let classAverage = 0;
    if (students.length > 0) {
        const averages = students.map(student => student.average);
        
        const sum = averages.reduce((acc, avg) => acc + avg, 0);
        classAverage = (sum / students.length).toFixed(2);
    }
    
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('passedStudents').textContent = passedCount;
    document.getElementById('failedStudents').textContent = failedCount;
    document.getElementById('classAverage').textContent = classAverage;
}

function clearAllData() {
    if (confirm('⚠️ Are you sure you want to delete ALL students? This cannot be undone!')) {
        students = [];
        nextId = 1;
        
        localStorage.clear();
        
        updateStudentSelects();
        renderStudents();
        updateStatistics();
        
        showNotification('🗑️ All data cleared!', 'warning');
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#6366f1'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function demonstrateObjectMethods() {
    if (students.length === 0) return;
    
    const student = students[0];
    
    const keys = Object.keys(student);
    console.log('Student properties (Object.keys):', keys);
    
    const values = Object.values(student);
    console.log('Student values (Object.values):', values);
    
    const entries = Object.entries(student);
    console.log('Student entries (Object.entries):', entries);
    
    console.log('Student name using bracket notation:', student["name"]);
    console.log('Student grades using dot notation:', student.grades);
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateStudentSelects();
    renderStudents();
    updateStatistics();
    
    console.log('🎓 Student Task & Grade Manager Initialized!');
    console.log('Students loaded:', students.length);
    
    if (students.length > 0) {
        demonstrateObjectMethods();
    }
});

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.activeElement.id === 'studentName') {
        addStudent();
    }
    if (e.key === 'Enter' && document.activeElement.id === 'taskInput') {
        addTask();
    }
    if (e.key === 'Enter' && document.activeElement.id === 'taskGradeInput') {
        addTask();
    }
});