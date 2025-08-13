// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Audio functionality
function playEngineSound() {
    // Create a synthetic engine sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.5);
    oscillator.frequency.exponentialRampToValueAtTime(60, audioContext.currentTime + 2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
    
    oscillator.type = 'sawtooth';
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 2);
    
    // Add visual feedback
    const button = document.querySelector('.cta-button');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

// Car gallery interactions
document.querySelectorAll('.car-card').forEach(card => {
    card.addEventListener('click', function() {
        const carType = this.getAttribute('data-car');
        showCarDetails(carType);
    });
});

function showCarDetails(carType) {
    const details = {
        sports: {
            title: 'Sports Car Details',
            info: 'High-performance engineering meets sleek design. Features include turbocharged engine, carbon fiber body, and advanced aerodynamics.'
        },
        luxury: {
            title: 'Luxury Sedan Details',
            info: 'Premium comfort with leather seating, advanced infotainment system, and whisper-quiet cabin with superior ride quality.'
        },
        suv: {
            title: 'SUV Details',
            info: 'Versatile family vehicle with all-wheel drive, spacious interior, advanced safety features, and excellent cargo capacity.'
        },
        electric: {
            title: 'Electric Vehicle Details',
            info: 'Zero emissions technology with fast charging capability, regenerative braking, and cutting-edge battery management system.'
        }
    };
    
    const detail = details[carType];
    alert(`${detail.title}\n\n${detail.info}`);
}

// Drag and Drop functionality for car builder
let draggedElement = null;
const completedParts = new Set();

document.querySelectorAll('.part').forEach(part => {
    part.addEventListener('dragstart', function(e) {
        draggedElement = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
    });
    
    part.addEventListener('dragend', function() {
        this.classList.remove('dragging');
    });
});

document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
        e.dataTransfer.dropEffect = 'move';
    });
    
    zone.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });
    
    zone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        if (draggedElement) {
            const partType = draggedElement.getAttribute('data-part');
            const zoneType = this.getAttribute('data-zone');
            
            if (partType === zoneType) {
                this.innerHTML = draggedElement.innerHTML;
                this.classList.add('filled');
                draggedElement.style.opacity = '0.5';
                draggedElement.setAttribute('draggable', 'false');
                completedParts.add(partType);
                
                // Check if car is complete
                if (completedParts.size === 4) {
                    setTimeout(() => {
                        alert('🎉 Congratulations! You\'ve built a complete car!');
                        animateCompletedCar();
                    }, 500);
                }
            } else {
                // Wrong part - show feedback
                this.style.background = 'rgba(244, 67, 54, 0.3)';
                setTimeout(() => {
                    this.style.background = 'rgba(255, 255, 255, 0.1)';
                }, 1000);
            }
        }
    });
});

function animateCompletedCar() {
    document.querySelectorAll('.drop-zone.filled').forEach((zone, index) => {
        setTimeout(() => {
            zone.style.animation = 'pulse 0.5s ease-in-out';
        }, index * 200);
    });
}

document.getElementById('resetCar').addEventListener('click', function() {
    // Reset drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.innerHTML = zone.getAttribute('data-zone').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + ' Here';
        zone.classList.remove('filled');
        zone.style.animation = '';
    });
    
    // Reset parts
    document.querySelectorAll('.part').forEach(part => {
        part.style.opacity = '1';
        part.setAttribute('draggable', 'true');
    });
    
    completedParts.clear();
});

// Video functionality
let currentVideo = null;
let isPlaying = false;
let progress = 0;
let progressInterval = null;

function playVideo(videoId) {
    const modal = document.getElementById('videoModal');
    const videoTitle = document.getElementById('videoTitle');
    
    const titles = {
        1: 'Sports Car Review - Performance Analysis',
        2: 'Racing Championship - Best Moments',
        3: 'Latest Automotive Technology Features'
    };
    
    videoTitle.textContent = titles[videoId];
    modal.style.display = 'block';
    currentVideo = videoId;
    resetVideo();
}

function closeModal() {
    document.getElementById('videoModal').style.display = 'none';
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    resetVideo();
}

function togglePlay() {
    const progressBar = document.getElementById('progress');
    
    if (!isPlaying) {
        isPlaying = true;
        progressInterval = setInterval(() => {
            progress += 1;
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                isPlaying = false;
                progress = 0;
                progressBar.style.width = '0%';
            }
        }, 100);
    } else {
        clearInterval(progressInterval);
        isPlaying = false;
    }
}

function resetVideo() {
    isPlaying = false;
    progress = 0;
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    document.getElementById('progress').style.width = '0%';
}

// Sound effects
function playCarSound(soundType) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const sounds = {
        engine: () => createEngineSound(audioContext),
        horn: () => createHornSound(audioContext),
        brake: () => createBrakeSound(audioContext),
        turbo: () => createTurboSound(audioContext),
        tire: () => createTireSound(audioContext),
        ignition: () => createIgnitionSound(audioContext)
    };
    
    if (sounds[soundType]) {
        sounds[soundType]();
        
        // Visual feedback
        const button = event.target;
        button.style.transform = 'scale(0.95)';
        button.style.background = 'rgba(255, 68, 68, 0.5)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.background = 'rgba(255, 255, 255, 0.1)';
        }, 300);
    }
}

function createEngineSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    
    oscillator.type = 'sawtooth';
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1.5);
}

function createHornSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.type = 'square';
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
}

function createBrakeSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(50, audioContext.currentTime + 0.8);
    
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
    
    oscillator.type = 'sawtooth';
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.8);
}

function createTurboSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.3);
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.type = 'sine';
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
}

function createTireSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(400, audioContext.currentTime + 1.2);
    
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2);
    
    oscillator.type = 'sawtooth';
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1.2);
}

function createIgnitionSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(50, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 1);
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.type = 'square';
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
}

// Quiz functionality
const quizData = [
    {
        question: "What does 'MPG' stand for in automotive terms?",
        answers: ["Miles Per Gallon", "Maximum Power Generated", "Motor Performance Grade", "Manual Power Gear"],
        correct: 0
    },
    {
        question: "Which type of engine typically provides better fuel efficiency?",
        answers: ["V8 Engine", "V6 Engine", "4-Cylinder Engine", "V12 Engine"],
        correct: 2
    },
    {
        question: "What is the primary advantage of hybrid vehicles?",
        answers: ["Higher top speed", "Better fuel economy", "Louder engine sound", "More cargo space"],
        correct: 1
    },
    {
        question: "What does 'ABS' stand for in automotive safety?",
        answers: ["Automatic Brake System", "Anti-lock Braking System", "Advanced Brake Support", "Air Bag Safety"],
        correct: 1
    },
    {
        question: "Which component is responsible for converting fuel into motion?",
        answers: ["Transmission", "Engine", "Differential", "Alternator"],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = -1;

function displayQuestion() {
    const question = quizData[currentQuestionIndex];
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = quizData.length;
    document.getElementById('questionText').textContent = question.question;
    
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach((btn, index) => {
        btn.textContent = question.answers[index];
        btn.classList.remove('correct', 'incorrect', 'disabled');
        btn.onclick = () => selectAnswer(index);
    });
    
    document.getElementById('quizResult').textContent = '';
    document.getElementById('nextBtn').style.display = 'none';
    selectedAnswer = -1;
}

function selectAnswer(answerIndex) {
    if (selectedAnswer !== -1) return; // Already answered
    
    selectedAnswer = answerIndex;
    const question = quizData[currentQuestionIndex];
    const answerButtons = document.querySelectorAll('.answer-btn');
    
    answerButtons.forEach((btn, index) => {
        btn.classList.add('disabled');
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === answerIndex && index !== question.correct) {
            btn.classList.add('incorrect');
        }
    });
    
    const resultElement = document.getElementById('quizResult');
    if (answerIndex === question.correct) {
        score++;
        resultElement.textContent = '✅ Correct!';
        resultElement.style.color = '#4caf50';
    } else {
        resultElement.textContent = `❌ Incorrect! The correct answer is: ${question.answers[question.correct]}`;
        resultElement.style.color = '#f44336';
    }
    
    if (currentQuestionIndex < quizData.length - 1) {
        document.getElementById('nextBtn').style.display = 'block';
    } else {
        showFinalScore();
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        displayQuestion();
    } else {
        showFinalScore();
    }
}

function showFinalScore() {
    const percentage = Math.round((score / quizData.length) * 100);
    const finalScoreElement = document.getElementById('finalScore');
    
    let message = '';
    if (percentage >= 80) {
        message = `🏆 Excellent! You scored ${score}/${quizData.length} (${percentage}%)`;
    } else if (percentage >= 60) {
        message = `👍 Good job! You scored ${score}/${quizData.length} (${percentage}%)`;
    } else {
        message = `📚 Keep learning! You scored ${score}/${quizData.length} (${percentage}%)`;
    }
    
    finalScoreElement.textContent = message;
    finalScoreElement.style.display = 'block';
    
    document.getElementById('nextBtn').style.display = 'none';
    
    // Add restart button
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Restart Quiz';
    restartBtn.className = 'next-btn';
    restartBtn.onclick = restartQuiz;
    finalScoreElement.appendChild(document.createElement('br'));
    finalScoreElement.appendChild(restartBtn);
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = -1;
    document.getElementById('finalScore').style.display = 'none';
    document.getElementById('finalScore').innerHTML = '';
    displayQuestion();
}

// Initialize quiz
displayQuestion();

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('videoModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add some interactive hover effects
document.querySelectorAll('.car-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const placeholder = this.querySelector('.car-placeholder');
        placeholder.style.transform = 'scale(1.2) rotate(5deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        const placeholder = this.querySelector('.car-placeholder');
        placeholder.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Footer functionality
function subscribeNewsletter() {
    const input = document.querySelector('.newsletter-input');
    const email = input.value.trim();
    
    if (email === '') {
        alert('Please enter your email address.');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Simulate successful subscription
    alert(`🎉 Thank you for subscribing! Welcome to AutoWorld Newsletter, ${email}!`);
    input.value = '';
    
    // Add visual feedback
    const button = document.querySelector('.newsletter-btn');
    const originalText = button.textContent;
    button.textContent = 'Subscribed!';
    button.style.background = '#4caf50';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#ff4444';
    }, 2000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function filterCars(category) {
    // Scroll to gallery section first
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    
    // Highlight the selected category
    setTimeout(() => {
        const cards = document.querySelectorAll('.car-card');
        cards.forEach(card => {
            const cardType = card.getAttribute('data-car');
            if (category === 'all' || cardType === category) {
                card.style.display = 'block';
                card.style.animation = 'slideInUp 0.5s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show message if filtering
        if (category !== 'all') {
            const categoryNames = {
                sports: 'Sports Cars',
                luxury: 'Luxury Sedans',
                suv: 'SUVs & Trucks',
                electric: 'Electric Vehicles',
                classic: 'Classic Cars',
                racing: 'Racing Cars'
            };
            
            // Create temporary filter message
            const gallery = document.querySelector('.gallery-container');
            const existingMessage = document.querySelector('.filter-message');
            if (existingMessage) existingMessage.remove();
            
            const filterMessage = document.createElement('div');
            filterMessage.className = 'filter-message';
            filterMessage.innerHTML = `
                <p>Showing: ${categoryNames[category] || category}</p>
                <button onclick="showAllCars()" class="show-all-btn">Show All Cars</button>
            `;
            filterMessage.style.cssText = `
                text-align: center;
                margin-bottom: 2rem;
                padding: 1rem;
                background: rgba(255, 68, 68, 0.1);
                border-radius: 10px;
                border: 1px solid rgba(255, 68, 68, 0.3);
            `;
            
            gallery.parentNode.insertBefore(filterMessage, gallery);
        }
    }, 800);
}

function showAllCars() {
    const cards = document.querySelectorAll('.car-card');
    cards.forEach(card => {
        card.style.display = 'block';
    });
    
    const filterMessage = document.querySelector('.filter-message');
    if (filterMessage) filterMessage.remove();
}

function showPrivacyPolicy() {
    const modal = document.getElementById('videoModal');
    const modalContent = document.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <span class="close" onclick="closeModal()">&times;</span>
        <div style="padding: 2rem; color: white; max-height: 400px; overflow-y: auto;">
            <h2 style="color: #ff4444; font-family: 'Orbitron', monospace; margin-bottom: 1rem;">Privacy Policy</h2>
            <p><strong>Effective Date:</strong> August 11, 2025</p>
            
            <h3 style="color: #ff4444; margin: 1.5rem 0 0.5rem;">Information We Collect</h3>
            <p>AutoWorld collects information to provide better automotive experiences:</p>
            <ul style="margin-left: 2rem;">
                <li>Email addresses for newsletter subscriptions</li>
                <li>Usage data for improving our multimedia features</li>
                <li>Browser information for optimal performance</li>
            </ul>
            
            <h3 style="color: #ff4444; margin: 1.5rem 0 0.5rem;">How We Use Information</h3>
            <p>We use your information to:</p>
            <ul style="margin-left: 2rem;">
                <li>Send automotive news and updates</li>
                <li>Improve our interactive features</li>
                <li>Provide personalized car recommendations</li>
            </ul>
            
            <h3 style="color: #ff4444; margin: 1.5rem 0 0.5rem;">Contact Us</h3>
            <p>For privacy concerns, contact us at privacy@autoworld.com</p>
        </div>
    `;
    
    modal.style.display = 'block';
}

function showTerms() {
    const modal = document.getElementById('videoModal');
    const modalContent = document.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <span class="close" onclick="closeModal()">&times;</span>
        <div style="padding: 2rem; color: white; max-height: 400px; overflow-y: auto;">
            <h2 style="color: #ff4444; font-family: 'Orbitron', monospace; margin-bottom: 1rem;">Terms of Service</h2>
            <p><strong>Last Updated:</strong> August 11, 2025</p>
            
            <h3 style="color: #ff4444; margin: 1.5rem 0 0.5rem;">Acceptance of Terms</h3>
            <p>By using AutoWorld, you agree to these terms and conditions.</p>
            
            <h3 style="color: #ff4444; margin: 1.5rem 0 0.5rem;">Use of Service</h3>
            <p>AutoWorld is provided for educational and entertainment purposes:</p>
            <ul style="margin-left: 2rem;">
                <li>Interactive automotive multimedia experience</li>
                <li>Educational content about vehicles</li>
                <li>Gaming and quiz features</li>
            </ul>
            
            <h3 style="color: #ff4444; margin: 1.5rem 0 0.5rem;">Prohibited Uses</h3>
            <ul style="margin-left: 2rem;">
                <li>Commercial use without permission</li>
                <li>Reverse engineering of features</li>
                <li>Harmful or malicious activities</li>
            </ul>
            
            <h3 style="color: #ff4444; margin: 1.5rem 0 0.5rem;">Contact</h3>
            <p>Questions? Contact legal@autoworld.com</p>
        </div>
    `;
    
    modal.style.display = 'block';
}

function showCookiePolicy() {
    const modal = document.getElementById('videoModal');
    const modalContent = document.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <span class="close" onclick="closeModal()">&times;</span>
        <div style="padding: 2rem; color: white; max-height: 400px; overflow-y: auto;">
            <h2 style="color: #ff4444; font-family: 'Orbitron', monospace; margin-bottom: 1rem;">Cookie Policy</h2>
            <p><strong>Effective Date:</strong> August 11, 2025</p>
            
            <h3 style="color: #ff4444; margin: 1.5rem 0 0.5rem;">What Are Cookies?</h3>
            <p>Cookies are small text files stored on your device to enhance your AutoWorld experience.</p>
            
            <h3 style="color: #ff4444; margin: 1.5rem 0 0.5rem;">Types of Cookies We Use</h3>
            <ul style="margin-left: 2rem;">
                <li><strong>Essential:</strong> Required for basic functionality</li>
                <li><strong>Performance:</strong> Help us improve our features</li>
                <li><strong>Functional:</strong> Remember your preferences</li>
            </ul>
            
            <h3 style="color: #ff4444; margin: 1.5rem 0 0.5rem;">Managing Cookies</h3>
            <p>You can control cookies through your browser settings. Note that disabling cookies may affect functionality.</p>
            
            <h3 style="color: #ff4444; margin: 1.5rem 0 0.5rem;">Updates</h3>
            <p>This policy may be updated periodically. Check back for changes.</p>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Newsletter input enter key support
document.addEventListener('DOMContentLoaded', function() {
    const newsletterInput = document.querySelector('.newsletter-input');
    if (newsletterInput) {
        newsletterInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                subscribeNewsletter();
            }
        });
    }
});

// Footer link hover effects
document.querySelectorAll('.footer-links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.color = '#ff4444';
        this.style.transform = 'translateX(5px)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.color = 'rgba(255, 255, 255, 0.8)';
        this.style.transform = 'translateX(0)';
    });
});

// Add smooth scroll behavior for footer links
document.querySelectorAll('.footer a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
