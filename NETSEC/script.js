document.addEventListener('DOMContentLoaded', function () {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize games
    initPasswordGame();
    initPhishingGame();
    initQuizGame();
    initNetworkDefenseGame();
    initDNSTunneling();
    
    // Existing threat cards functionality
    const threatCards = document.querySelectorAll('.threat-card');
    threatCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
    });

    // Defense tabs functionality
    const defenseTabs = document.querySelectorAll('.defense-tab');
    const defensePanels = document.querySelectorAll('.defense-panel');
    defenseTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            defenseTabs.forEach(t => t.classList.remove('active', 'border-blue-500', 'text-blue-600', 'hover:border-slate-300', 'text-slate-500'));
            defenseTabs.forEach(t => t.classList.add('border-transparent', 'text-slate-500', 'hover:text-slate-700', 'hover:border-slate-300'));
            tab.classList.remove('border-transparent', 'text-slate-500', 'hover:text-slate-700', 'hover:border-slate-300');
            tab.classList.add('active', 'border-blue-500', 'text-blue-600');
            const targetId = tab.dataset.target;
            defensePanels.forEach(panel => {
                if (panel.id === targetId) {
                    panel.classList.remove('hidden');
                } else {
                    panel.classList.add('hidden');
                }
            });
        });
    });

    // Traffic data and table
    const trafficData = [
        { time: '10:45:01', src: '192.168.1.101', dest: '8.8.8.8', proto: 'DNS', info: 'Standard query for google.com', suspicious: false },
        { time: '10:45:02', src: '192.168.1.101', dest: '172.217.16.14', proto: 'HTTP', info: 'GET / HTTP/1.1', suspicious: false },
        { time: '10:45:05', src: '104.18.25.32', dest: '192.168.1.101', proto: 'TCP', info: 'Port scan detected on ports 1-1024', suspicious: true, explanation: 'A rapid sequence of connection attempts to many ports from an external IP can indicate a port scan, where an attacker is probing for vulnerabilities.' },
        { time: '10:45:08', src: '192.168.1.102', dest: '192.168.1.103', proto: 'ARP', info: 'Who has 192.168.1.103? Tell 192.168.1.102', suspicious: false },
        { time: '10:45:11', src: '192.168.1.101', dest: '203.0.113.55', proto: 'FTP', info: 'User login with plain text password', suspicious: true, explanation: 'Protocols like FTP transmit data, including credentials, in plain text. This is a security risk as it can be easily intercepted.' },
        { time: '10:45:15', src: '192.168.1.101', dest: '1.1.1.1', proto: 'DNS', info: 'Standard query for cloudflare.com', suspicious: false },
        { time: '10:45:18', src: '45.33.32.156', dest: '192.168.1.101', proto: 'HTTP', info: 'SQL injection attempt detected', suspicious: true, explanation: 'Malicious HTTP requests containing SQL injection payloads attempt to compromise database-driven web applications.' },
        { time: '10:45:20', src: '1.2.3.4', dest: '192.168.1.101', proto: 'ICMP', info: 'Ping flood attack', suspicious: true, explanation: 'A large number of ICMP (ping) packets from a single source can be a simple form of a denial-of-service attack, aiming to overwhelm the target.' },
        { time: '10:45:22', src: '192.168.1.101', dest: '50.60.70.80', proto: 'HTTP', info: 'Downloading suspicious file', suspicious: true, explanation: 'A download from a known malicious IP address or a file with a suspicious extension can indicate malware being delivered to the system.' },
        { time: '10:45:25', src: '192.168.1.105', dest: '192.168.1.101', proto: 'SMB', info: 'Ransomware lateral movement detected', suspicious: true, explanation: 'Unusual SMB traffic patterns can indicate ransomware attempting to spread across network shares and encrypt files on multiple systems.' },
        { time: '10:45:28', src: '192.168.1.101', dest: '185.220.101.32', proto: 'TOR', info: 'Connection to TOR exit node', suspicious: true, explanation: 'While TOR has legitimate uses, connections to TOR networks from corporate environments may indicate data exfiltration or malicious activity.' },
        { time: '10:45:30', src: '192.168.1.101', dest: '93.184.216.34', proto: 'HTTPS', info: 'Normal web browsing', suspicious: false },
    ];

    const trafficTable = document.getElementById('traffic-table');
    const trafficExplanation = document.getElementById('traffic-explanation');
    
    trafficData.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 cursor-pointer';
        if(row.suspicious) {
            tr.classList.add('bg-red-50');
        }
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${row.time}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${row.src}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${row.dest}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${row.suspicious ? 'text-red-600' : 'text-slate-900'}">${row.proto}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${row.info}</td>
        `;
        tr.addEventListener('click', () => {
            if (row.suspicious) {
                trafficExplanation.textContent = `Analysis: ${row.explanation}`;
                trafficExplanation.classList.remove('hidden');
            } else {
                trafficExplanation.classList.add('hidden');
            }
            document.querySelectorAll('#traffic-table tr').forEach(r => r.classList.remove('bg-blue-100'));
            tr.classList.add('bg-blue-100');
        });
        trafficTable.appendChild(tr);
    });
    
    // Chart
    const threatCtx = document.getElementById('threatChart').getContext('2d');
    new Chart(threatCtx, {
        type: 'doughnut',
        data: {
            labels: ['Phishing', 'Ransomware', 'Trojans', 'SQL Injection', 'DDoS', 'Spyware', 'XSS', 'Social Engineering'],
            datasets: [{
                label: 'Threat Distribution',
                data: [28, 18, 15, 12, 10, 8, 5, 4],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(147, 51, 234, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(236, 72, 153, 0.7)',
                    'rgba(168, 85, 247, 0.7)',
                    'rgba(249, 115, 22, 0.7)',
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(6, 182, 212, 0.7)',
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(147, 51, 234, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(236, 72, 153, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(249, 115, 22, 1)',
                    'rgba(99, 102, 241, 1)',
                    'rgba(6, 182, 212, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Inter',
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + '%';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    // Navigation and scroll
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(section => {
        observer.observe(section);
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Enhanced checklist with progress tracking
    const checklistItems = document.querySelectorAll('input[type="checkbox"]');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const totalTasks = checklistItems.length;

    function updateProgress() {
        const completedTasks = document.querySelectorAll('input[type="checkbox"]:checked').length;
        const percentage = (completedTasks / totalTasks) * 100;
        
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
        if (progressText) {
            progressText.textContent = `${completedTasks}/${totalTasks} tasks completed`;
        }
    }

    checklistItems.forEach(item => {
        item.addEventListener('change', (e) => {
            const label = e.target.parentElement;
            if (e.target.checked) {
                label.classList.add('bg-blue-100', 'border', 'border-blue-500');
                label.classList.remove('bg-slate-50', 'hover:bg-slate-100');
            } else {
                label.classList.remove('bg-blue-100', 'border', 'border-blue-500');
                label.classList.add('bg-slate-50', 'hover:bg-slate-100');
            }
            updateProgress();
        });
    });

    updateProgress();

    // Floating action button
    const scrollTopBtn = document.getElementById('scroll-top');
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
});

// Initialize scroll animations
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => fadeObserver.observe(el));
}

// Password Strength Game
function initPasswordGame() {
    const passwordInput = document.getElementById('password-input');
    const strengthFill = document.getElementById('strength-fill');
    const feedback = document.getElementById('password-feedback');
    const tips = document.getElementById('password-tips');

    if (!passwordInput) return;

    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordUI(strength, strengthFill, feedback, tips);
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score += 20;
    else feedback.push('Use at least 8 characters');
    
    if (password.length >= 12) score += 10;
    
    if (/[a-z]/.test(password)) score += 15;
    else feedback.push('Add lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 15;
    else feedback.push('Add uppercase letters');
    
    if (/[0-9]/.test(password)) score += 15;
    else feedback.push('Add numbers');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    else feedback.push('Add special characters');

    return { score: Math.min(score, 100), feedback };
}

function updatePasswordUI(strength, strengthFill, feedback, tips) {
    const { score, feedback: feedbackList } = strength;
    
    strengthFill.style.width = score + '%';
    
    if (score < 30) {
        strengthFill.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
        feedback.textContent = 'Weak Password';
        feedback.style.color = '#ef4444';
    } else if (score < 60) {
        strengthFill.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        feedback.textContent = 'Medium Password';
        feedback.style.color = '#f59e0b';
    } else if (score < 80) {
        strengthFill.style.background = 'linear-gradient(90deg, #3b82f6, #60a5fa)';
        feedback.textContent = 'Strong Password';
        feedback.style.color = '#3b82f6';
    } else {
        strengthFill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
        feedback.textContent = 'Very Strong Password!';
        feedback.style.color = '#10b981';
    }
    
    tips.innerHTML = feedbackList.length > 0 ? 
        '<strong>Tips:</strong> ' + feedbackList.join(', ') : 
        '<strong>Excellent!</strong> Your password is very secure.';
}

// Phishing Detection Game
function initPhishingGame() {
    const emailsContainer = document.getElementById('phishing-emails');
    const scoreElement = document.getElementById('phishing-score');
    const accuracyElement = document.getElementById('phishing-accuracy');
    const newRoundBtn = document.getElementById('new-phishing-round');
    
    if (!emailsContainer) return;

    let gameState = {
        score: 0,
        total: 0,
        correct: 0
    };

    const emails = [
        { sender: 'security@paypal.com', subject: 'Urgent: Verify your account', content: 'Click here to verify your account immediately or it will be suspended.', isPhishing: true },
        { sender: 'newsletter@amazon.com', subject: 'Your order has shipped', content: 'Your recent order #12345 has been shipped and will arrive tomorrow.', isPhishing: false },
        { sender: 'support@microsoft.com', subject: 'Security Alert', content: 'We detected unusual activity. Click here to secure your account now!', isPhishing: true },
        { sender: 'team@github.com', subject: 'Weekly digest', content: 'Here are the top repositories trending this week in your favorite languages.', isPhishing: false },
        { sender: 'noreply@bank-security.com', subject: 'Account Locked', content: 'Your account has been locked. Verify your identity to unlock it.', isPhishing: true },
        { sender: 'updates@linkedin.com', subject: 'You have new connections', content: 'John Doe and 3 others want to connect with you on LinkedIn.', isPhishing: false }
    ];

    function startNewRound() {
        emailsContainer.innerHTML = '';
        const roundEmails = emails.sort(() => Math.random() - 0.5).slice(0, 4);
        
        roundEmails.forEach((email, index) => {
            const emailCard = document.createElement('div');
            emailCard.className = 'email-card';
            emailCard.innerHTML = `
                <div class="font-semibold text-lg mb-2">From: ${email.sender}</div>
                <div class="font-medium mb-2">Subject: ${email.subject}</div>
                <div class="text-slate-600">${email.content}</div>
            `;
            
            emailCard.addEventListener('click', () => handleEmailClick(emailCard, email));
            emailsContainer.appendChild(emailCard);
        });
    }

    function handleEmailClick(card, email) {
        gameState.total++;
        
        if (email.isPhishing) {
            card.classList.add('correct');
            gameState.score += 10;
            gameState.correct++;
        } else {
            card.classList.add('incorrect');
            gameState.score = Math.max(0, gameState.score - 5);
        }
        
        updatePhishingScore();
        
        setTimeout(() => {
            card.style.pointerEvents = 'none';
        }, 100);
    }

    function updatePhishingScore() {
        scoreElement.textContent = gameState.score;
        const accuracy = gameState.total > 0 ? Math.round((gameState.correct / gameState.total) * 100) : 0;
        accuracyElement.textContent = accuracy;
    }

    newRoundBtn.addEventListener('click', startNewRound);
    startNewRound();
}

// Quiz Game
function initQuizGame() {
    const quizContainer = document.getElementById('quiz-container');
    const questionElement = document.getElementById('quiz-question');
    const optionsElement = document.getElementById('quiz-options');
    const nextBtn = document.getElementById('quiz-next');
    const restartBtn = document.getElementById('quiz-restart');
    const currentElement = document.getElementById('quiz-current');
    const totalElement = document.getElementById('quiz-total');
    const scoreElement = document.getElementById('quiz-score');
    
    if (!quizContainer) return;

    const questions = [
        {
            question: "What does 'phishing' refer to in cybersecurity?",
            options: ["A type of malware", "Social engineering attack via email", "Network scanning technique", "Password cracking method"],
            correct: 1
        },
        {
            question: "Which encryption protocol is most secure for Wi-Fi?",
            options: ["WEP", "WPA", "WPA2", "WPA3"],
            correct: 3
        },
        {
            question: "What is the primary purpose of a firewall?",
            options: ["Encrypt data", "Filter network traffic", "Scan for viruses", "Backup files"],
            correct: 1
        },
        {
            question: "What does 'SQL injection' target?",
            options: ["Email servers", "Web applications", "Network routers", "Operating systems"],
            correct: 1
        },
        {
            question: "Which principle limits user access to minimum required resources?",
            options: ["Defense in depth", "Least privilege", "Zero trust", "Multi-factor authentication"],
            correct: 1
        }
    ];

    let currentQuestion = 0;
    let score = 0;

    function startQuiz() {
        currentQuestion = 0;
        score = 0;
        nextBtn.classList.add('hidden');
        restartBtn.classList.add('hidden');
        showQuestion();
    }

    function showQuestion() {
        const q = questions[currentQuestion];
        questionElement.textContent = q.question;
        currentElement.textContent = currentQuestion + 1;
        totalElement.textContent = questions.length;
        scoreElement.textContent = score;
        
        optionsElement.innerHTML = '';
        q.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.textContent = option;
            optionDiv.addEventListener('click', () => selectOption(index, optionDiv));
            optionsElement.appendChild(optionDiv);
        });
    }

    function selectOption(selectedIndex, optionElement) {
        const q = questions[currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        options.forEach((opt, index) => {
            opt.style.pointerEvents = 'none';
            if (index === q.correct) {
                opt.classList.add('correct');
            } else if (index === selectedIndex && index !== q.correct) {
                opt.classList.add('incorrect');
            }
        });

        if (selectedIndex === q.correct) {
            score += 20;
            scoreElement.textContent = score;
        }

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < questions.length) {
                nextBtn.classList.remove('hidden');
            } else {
                restartBtn.classList.remove('hidden');
                questionElement.textContent = `Quiz Complete! Final Score: ${score}/${questions.length * 20}`;
                optionsElement.innerHTML = '';
            }
        }, 1500);
    }

    nextBtn.addEventListener('click', () => {
        nextBtn.classList.add('hidden');
        showQuestion();
    });

    restartBtn.addEventListener('click', startQuiz);
    
    startQuiz();
}

// Network Defense Game
function initNetworkDefenseGame() {
    const networkField = document.getElementById('network-field');
    const startBtn = document.getElementById('start-defense');
    const stopBtn = document.getElementById('stop-defense');
    const healthElement = document.getElementById('network-health');
    const threatsBlockedElement = document.getElementById('threats-blocked');
    
    if (!networkField) return;

    let gameActive = false;
    let health = 100;
    let threatsBlocked = 0;
    let threatInterval;

    const threatTypes = ['🦠', '🐛', '🎣', '💉', '🤖'];

    function startGame() {
        gameActive = true;
        health = 100;
        threatsBlocked = 0;
        updateGameUI();
        
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        
        threatInterval = setInterval(spawnThreat, 1500);
    }

    function stopGame() {
        gameActive = false;
        clearInterval(threatInterval);
        
        startBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
        
        // Clear all threats
        document.querySelectorAll('.threat').forEach(threat => threat.remove());
    }

    function spawnThreat() {
        if (!gameActive) return;
        
        const threat = document.createElement('div');
        threat.className = 'threat absolute text-2xl cursor-pointer transition-all duration-300 hover:scale-125';
        threat.textContent = threatTypes[Math.floor(Math.random() * threatTypes.length)];
        threat.style.left = Math.random() * (networkField.offsetWidth - 40) + 'px';
        threat.style.top = '0px';
        
        threat.addEventListener('click', () => {
            threat.remove();
            threatsBlocked++;
            updateGameUI();
        });
        
        networkField.appendChild(threat);
        
        // Animate threat moving down
        let position = 0;
        const moveInterval = setInterval(() => {
            position += 2;
            threat.style.top = position + 'px';
            
            if (position > networkField.offsetHeight - 40) {
                clearInterval(moveInterval);
                if (threat.parentNode) {
                    threat.remove();
                    health -= 10;
                    updateGameUI();
                    
                    if (health <= 0) {
                        stopGame();
                        alert(`Game Over! You blocked ${threatsBlocked} threats.`);
                    }
                }
            }
        }, 50);
    }

    function updateGameUI() {
        healthElement.textContent = health;
        threatsBlockedElement.textContent = threatsBlocked;
    }

    startBtn.addEventListener('click', startGame);
    stopBtn.addEventListener('click', stopGame);
}

// DNS Tunneling Simulation
function initDNSTunneling() {
    const startBtn = document.getElementById('start-tunnel');
    const analyzeBtn = document.getElementById('analyze-dns');
    const domainInput = document.getElementById('tunnel-domain');
    const dataInput = document.getElementById('tunnel-data');
    const queriesDiv = document.getElementById('dns-queries');
    const suspiciousCount = document.getElementById('suspicious-count');
    const normalCount = document.getElementById('normal-count');
    
    if (!startBtn) return;
    
    let queries = [];
    let suspicious = 0;
    let normal = 0;
    
    function base64Encode(str) {
        return btoa(str).replace(/[+=]/g, '').toLowerCase();
    }
    
    function generateTunnelQueries(domain, data) {
        const encoded = base64Encode(data);
        const chunks = encoded.match(/.{1,50}/g) || [];
        const tunnelQueries = [];
        
        chunks.forEach((chunk, i) => {
            tunnelQueries.push(`${chunk}.${i}.${domain}`);
        });
        
        // Add some normal queries for comparison
        const normalDomains = ['google.com', 'facebook.com', 'amazon.com', 'microsoft.com'];
        for (let i = 0; i < 5; i++) {
            tunnelQueries.push(normalDomains[Math.floor(Math.random() * normalDomains.length)]);
        }
        
        return tunnelQueries.sort(() => Math.random() - 0.5);
    }
    
    function displayQuery(query, isSuspicious) {
        const queryElement = document.createElement('div');
        queryElement.className = `p-2 mb-1 rounded text-xs ${isSuspicious ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`;
        queryElement.textContent = `DNS Query: ${query}`;
        queriesDiv.appendChild(queryElement);
        queriesDiv.scrollTop = queriesDiv.scrollHeight;
    }
    
    function analyzeQueries() {
        suspicious = 0;
        normal = 0;
        
        queries.forEach(query => {
            const isSuspicious = query.length > 50 || 
                               /[0-9a-f]{20,}/.test(query) || 
                               query.includes(domainInput.value);
            
            if (isSuspicious) {
                suspicious++;
            } else {
                normal++;
            }
        });
        
        suspiciousCount.textContent = suspicious;
        normalCount.textContent = normal;
    }
    
    startBtn.addEventListener('click', () => {
        const domain = domainInput.value || 'evil.com';
        const data = dataInput.value || 'sensitive data';
        
        queries = generateTunnelQueries(domain, data);
        queriesDiv.innerHTML = '';
        
        let i = 0;
        const interval = setInterval(() => {
            if (i >= queries.length) {
                clearInterval(interval);
                return;
            }
            
            const query = queries[i];
            const isSuspicious = query.length > 50 || 
                               /[0-9a-f]{20,}/.test(query) || 
                               query.includes(domain);
            
            displayQuery(query, isSuspicious);
            i++;
        }, 500);
    });
    
    analyzeBtn.addEventListener('click', analyzeQueries);
}
