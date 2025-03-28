document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // ===== COMPUTER RISE ANIMATION =====
    const computerAnimation = () => {
        const computer = document.querySelector('.computer-animation');
        if (!computer) return;

        // Initial state
        computer.style.opacity = '0';
        computer.style.transform = 'translateY(50px)';
        
        // Animate computer rising
        setTimeout(() => {
            computer.style.transition = 'all 1s ease-out';
            computer.style.opacity = '1';
            computer.style.transform = 'translateY(0)';
            
            // Start loading animation
            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = '100%';
                progressBar.style.transition = 'width 2s ease-in-out';
            }
            
            // Add system info after loading
            setTimeout(() => {
                const screenContent = document.querySelector('.screen-content');
                if (screenContent) {
                    screenContent.innerHTML += `
                        <div class="system-line" style="opacity:0;transform:translateY(10px)">System: Ready</div>
                        <div class="system-line" style="opacity:0;transform:translateY(10px)">User: Jason Fang</div>
                        <div class="system-line" style="opacity:0;transform:translateY(10px)">Portfolio: Loaded</div>
                    `;
                    
                    // Animate in system lines
                    document.querySelectorAll('.system-line').forEach((line, index) => {
                        setTimeout(() => {
                            line.style.transition = 'all 0.5s ease-out';
                            line.style.opacity = '1';
                            line.style.transform = 'translateY(0)';
                        }, index * 300);
                    });
                }
            }, 2000);
        }, 500);
    };

    // Start computer animation after particles load
    setTimeout(computerAnimation, 500);

    // ===== LIGHTNING EFFECT =====
    const createLightning = () => {
        const canvas = document.getElementById('particles-js');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const lightning = {
            active: false,
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            branches: [],
            lastStrike: 0
        };
        
        const strike = () => {
            const now = Date.now();
            if (now - lightning.lastStrike < 3000) return;
            
            lightning.active = true;
            lightning.lastStrike = now;
            lightning.x = Math.random() * canvas.width;
            lightning.y = 0;
            lightning.targetX = Math.random() * canvas.width;
            lightning.targetY = canvas.height;
            lightning.branches = [];
            
            createBolt(lightning.x, lightning.y, lightning.targetX, lightning.targetY, 5);
            
            const branchCount = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < branchCount; i++) {
                const branchX = lightning.x + (lightning.targetX - lightning.x) * Math.random();
                const branchY = lightning.y + (lightning.targetY - lightning.y) * Math.random();
                const branchLength = (canvas.height - branchY) * (0.2 + Math.random() * 0.3);
                const branchAngle = (Math.random() - 0.5) * Math.PI/2;
                
                const endX = branchX + Math.sin(branchAngle) * branchLength;
                const endY = branchY + Math.cos(branchAngle) * branchLength;
                
                createBolt(branchX, branchY, endX, endY, 3);
            }
            
            canvas.style.boxShadow = '0 0 30px #00f0ff';
            setTimeout(() => canvas.style.boxShadow = 'none', 100);
        };
        
        const createBolt = (x1, y1, x2, y2, maxOffset) => {
            const segments = 10;
            const points = [{x: x1, y: y1}];
            
            for (let i = 1; i < segments; i++) {
                const t = i / segments;
                const x = x1 + (x2 - x1) * t;
                const y = y1 + (y2 - y1) * t;
                const offsetX = (Math.random() - 0.5) * maxOffset * (1 - t * 0.5);
                const offsetY = (Math.random() - 0.5) * maxOffset * (1 - t * 0.5);
                
                points.push({x: x + offsetX, y: y + offsetY});
            }
            
            points.push({x: x2, y: y2});
            
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            
            ctx.stroke();
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00f0ff';
            ctx.stroke();
            ctx.shadowBlur = 0;
        };
        
        setInterval(() => Math.random() > 0.7 && strike(), 5000);
        setTimeout(strike, 1500);
    };
    
    setTimeout(createLightning, 1000);

    // ===== COMPUTER SHAPE FORMATION =====
    const formComputerShape = () => {
        const canvas = document.getElementById('particles-js');
        if (!canvas || !window.pJSDom || !window.pJSDom[0]) return;
        
        const pJS = window.pJSDom[0].pJS;
        const computerShape = [
            {x: 0.3, y: 0.2}, {x: 0.7, y: 0.2}, 
            {x: 0.8, y: 0.5}, {x: 0.7, y: 0.8},
            {x: 0.3, y: 0.8}, {x: 0.2, y: 0.5},
            {x: 0.3, y: 0.2},
            {x: 0.4, y: 0.8}, {x: 0.6, y: 0.8},
            {x: 0.65, y: 0.95}, {x: 0.35, y: 0.95},
            {x: 0.4, y: 0.8}
        ];
        
        const shapePoints = computerShape.map(point => ({
            x: point.x * canvas.width,
            y: point.y * canvas.height
        }));
        
        const distanceToSegment = (x, y, x1, y1, x2, y2) => {
            const A = x - x1;
            const B = y - y1;
            const C = x2 - x1;
            const D = y2 - y1;
            const dot = A * C + B * D;
            const len_sq = C * C + D * D;
            let param = len_sq !== 0 ? dot / len_sq : -1;
            
            let xx, yy;
            if (param < 0) {
                xx = x1;
                yy = y1;
            } else if (param > 1) {
                xx = x2;
                yy = y2;
            } else {
                xx = x1 + param * C;
                yy = y1 + param * D;
            }
            
            const dx = x - xx;
            const dy = y - yy;
            return Math.sqrt(dx * dx + dy * dy);
        };
        
        if (pJS.particles && pJS.particles.array) {
            pJS.particles.array.forEach(particle => {
                let nearestPoint = shapePoints[0];
                let minDist = Infinity;
                
                for (let i = 0; i < shapePoints.length - 1; i++) {
                    const p1 = shapePoints[i];
                    const p2 = shapePoints[i + 1];
                    const dist = distanceToSegment(particle.x, particle.y, p1.x, p1.y, p2.x, p2.y);
                    
                    if (dist < minDist) {
                        minDist = dist;
                        nearestPoint = {
                            x: p1.x + (p2.x - p1.x) * 0.5,
                            y: p1.y + (p2.y - p1.y) * 0.5
                        };
                    }
                }
                
                if (Math.random() > 0.95) {
                    particle.vx += (nearestPoint.x - particle.x) * 0.01;
                    particle.vy += (nearestPoint.y - particle.y) * 0.01;
                }
            });
        }
    };
    
    setInterval(formComputerShape, 3000);
    setTimeout(formComputerShape, 2000);

    // ===== ACCORDION FUNCTIONALITY =====
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = header.nextElementSibling;
            
            if (accordionItem.classList.contains('active')) {
                accordionContent.style.maxHeight = null;
                accordionItem.classList.remove('active');
            } else {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                accordionItem.classList.add('active');
            }
        });
    });
    
    // ===== SCROLL ANIMATIONS =====
    const animateOnScroll = () => {
        const isElementInViewport = el => {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        };
        
        // Skill bars
        document.querySelectorAll('.skill-level').forEach(bar => {
            const level = bar.getAttribute('data-level');
            if (isElementInViewport(bar) && !bar.classList.contains('animated')) {
                bar.classList.add('animated');
                bar.style.width = level;
            }
        });
        
        // Timeline items
        document.querySelectorAll('.timeline-item').forEach(item => {
            if (isElementInViewport(item)) {
                item.classList.add('visible');
            }
        });
        
        // Counters
        document.querySelectorAll('.stat-box').forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / 200;
            
            if (count < target && isElementInViewport(counter)) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateOnScroll, 1);
            } else if (count >= target) {
                counter.innerText = target;
            }
        });
    };
    
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // ===== SKILL CLOUD POSITIONING =====
    const positionSkillTags = () => {
        const cloud = document.querySelector('.skills-cloud');
        const skillTags = document.querySelectorAll('.skill-tag');
        if (!cloud || skillTags.length === 0) return;
        
        const cloudRect = cloud.getBoundingClientRect();
        const placedTags = [];
        const padding = 10;
        
        skillTags.forEach(tag => {
            let placed = false;
            let attempts = 0;
            const tagRect = tag.getBoundingClientRect();
            
            while (!placed && attempts < 100) {
                attempts++;
                const x = Math.random() * (cloudRect.width - tagRect.width);
                const y = Math.random() * (cloudRect.height - tagRect.height);
                
                const collision = placedTags.some(existingTag => {
                    const existingRect = existingTag.rect;
                    return !(
                        x + tagRect.width + padding < existingRect.x ||
                        x > existingRect.x + existingRect.width + padding ||
                        y + tagRect.height + padding < existingRect.y ||
                        y > existingRect.y + existingRect.height + padding
                    );
                });
                
                if (!collision) {
                    tag.style.left = `${x}px`;
                    tag.style.top = `${y}px`;
                    placedTags.push({
                        element: tag,
                        rect: { x, y, width: tagRect.width, height: tagRect.height }
                    });
                    placed = true;
                }
            }
            
            if (!placed) {
                const lastTag = placedTags[placedTags.length - 1];
                const y = lastTag ? lastTag.rect.y + lastTag.rect.height + padding : 0;
                tag.style.left = `${Math.random() * (cloudRect.width - tagRect.width)}px`;
                tag.style.top = `${y}px`;
                placedTags.push({
                    element: tag,
                    rect: { 
                        x: parseFloat(tag.style.left), 
                        y, 
                        width: tagRect.width, 
                        height: tagRect.height 
                    }
                });
            }
        });
    };
    
    positionSkillTags();

    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                setTimeout(() => button.classList.remove('active'), 1000);
            }
        });
    });

    // ===== INTERSECTION OBSERVER =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('visible');
                }
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section-title, .about-text, .image-wrapper, .skills-cloud, .skill-bars, .hexagon-item, .contact-form, .timeline-item, .achievement-category').forEach(el => {
        if (el) observer.observe(el);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Auto-scrolling company slider
    const companySlider = () => {
        const slider = document.querySelector('.company-slider');
        const track = document.querySelector('.company-track');
        if (!slider || !track) return;

        // Clone the first few slides and append to end for infinite effect
        const slides = document.querySelectorAll('.company-slide');
        const slideWidth = slides[0].offsetWidth + 20; // width + gap
        
        // How many slides to clone (enough to fill the viewport)
        const clonesToAdd = Math.ceil(slider.offsetWidth / slideWidth);
        
        for (let i = 0; i < clonesToAdd; i++) {
            const clone = slides[i].cloneNode(true);
            track.appendChild(clone);
        }

        let currentPosition = 0;
        const slideInterval = 1800; // 3 seconds between slides
        
        const slideNext = () => {
            const slides = document.querySelectorAll('.company-slide');
            currentPosition += slideWidth;
            
            // If we've scrolled past the original slides, reset to start
            if (currentPosition > (slides.length - clonesToAdd) * slideWidth) {
                currentPosition = 0;
                // Jump without animation to start
                track.style.transition = 'none';
                track.style.transform = `translateX(-${currentPosition}px)`;
                // Force reflow to apply the change immediately
                track.offsetHeight;
            }
            
            // Animate to next position
            track.style.transition = 'transform 0.5s ease';
            track.style.transform = `translateX(-${currentPosition}px)`;
        };

        // Start auto-scrolling
        let intervalId = setInterval(slideNext, slideInterval);
        
        // Pause on hover
        slider.addEventListener('mouseenter', () => {
            clearInterval(intervalId);
        });
        
        slider.addEventListener('mouseleave', () => {
            intervalId = setInterval(slideNext, slideInterval);
        });
    };

    companySlider();
});

document.addEventListener('DOMContentLoaded', () => {
    // Add this at the start of your script
document.documentElement.style.setProperty('--zoom-factor', window.innerWidth / window.visualViewport.width);

// Modify your resize handler to this:
const handleZoom = () => {
  const zoomFactor = window.innerWidth / visualViewport.width;
  document.documentElement.style.setProperty('--zoom-factor', zoomFactor);
  
  // Recalculate all sizes
  const baseSize = Math.min(visualViewport.width, visualViewport.height) / 100;
  
  document.querySelectorAll('.tech-particle').forEach(particle => {
    particle.style.fontSize = `${baseSize * 0.8}px`;
  });
  
  document.querySelectorAll('.active-node').forEach(node => {
    node.style.width = `${baseSize * 1.5}px`;
    node.style.height = `${baseSize * 1.5}px`;
  });
};

// Use both resize and visualViewport handlers
window.addEventListener('resize', handleZoom);
window.visualViewport?.addEventListener('resize', handleZoom);

    const particleField = document.querySelector('.particle-field');
    const techChars = ["■", "▢", "▣", "▤", "▥", "▦", "◈", "◉", "⬖", "⎔"];
    
    // Base size on viewport width
    const baseSize = Math.min(window.innerWidth, window.innerHeight) / 100;
    
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'tech-particle';
        particle.textContent = techChars[Math.floor(Math.random() * techChars.length)];
        particle.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            color: hsla(${Math.random() * 60 + 180}, 80%, 70%, 0.8);
            font-size: ${(Math.random() * 0.5 + 0.5) * baseSize}px;
            opacity: 0;
            animation: particle-float ${Math.random() * 10 + 5}s linear infinite;
            animation-delay: ${Math.random() * 3}s;
            transform: scale(${Math.random() * 0.5 + 0.75});
            will-change: transform, opacity;
        `;
        particleField.appendChild(particle);
    }

    // Make responsive to resize/zoom
    window.addEventListener('resize', () => {
        const particles = document.querySelectorAll('.tech-particle');
        const newBaseSize = Math.min(window.innerWidth, window.innerHeight) / 100;
        
        particles.forEach(particle => {
            const currentSize = parseFloat(particle.style.fontSize);
            const ratio = currentSize / baseSize;
            particle.style.fontSize = `${ratio * newBaseSize}px`;
        });
    });

    // Dynamic node connections
    setInterval(() => {
        const nodes = document.querySelectorAll('.active-node');
        nodes.forEach(node => {
            if (Math.random() > 0.7) {
                const pulse = document.createElement('div');
                pulse.className = 'node-pulse';
                pulse.style.cssText = `
                    position: absolute;
                    width: ${1.5 * baseSize}px;
                    height: ${1.5 * baseSize}px;
                    background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: pulse-wave ${Math.random() * 2 + 1}s ease-out forwards;
                    transform: translate(-50%, -50%);
                `;
                node.appendChild(pulse);
                setTimeout(() => pulse.remove(), 1000);
            }
        });
    }, 800);
});

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.details-btn').forEach(button => {
            button.addEventListener('click', function() {
                const year = this.getAttribute('data-year');
                const details = document.getElementById(`details-${year}`);
                
                // Toggle visibility
                details.classList.toggle('show');
                
                // Change button text
                this.textContent = details.classList.contains('show') ? 
                    'Hide Details -' : 'More Details +';
            });
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        const detailsButtons = document.querySelectorAll('.details-btn');
        const timelinePopup = document.getElementById('timelinePopup');
        const timelinePopupClose = document.getElementById('timelinePopupClose');
        const timelinePopupContent = document.getElementById('timelinePopupContent');
        
        // Detailed content for each year with tech-themed structure
        const detailedContent = {
            '2025': `
            <div class="tech-decoration">
                <div class="tech-node"></div>
                <div class="tech-node"></div>
            </div>
            <h3>INTERNATIONAL HACKATHON HOST</h3>
            <p class="popup-subtitle">2025 | GLOBAL EVENT</p>
            <p>I hosted a worldwide challenge with the Senior Vice President of JP Morgan Chase for technologists from all around the world to integrate technology and collaborate on solving pressing global challenges. Collaborated with judges from the largest tech companies including Amazon, Meta, Uber, and Visa. </p>
            
            <h4>KEY INITIATIVES</h4>
            <ul>
                <li>Attracted 500+ participants from 30+ countries</li>
                <li>Secured sponsorships from major tech companies totaling $10,000+</li>
                <li>Featured challenges in sustainability, healthcare, and education</li>
                <li>5 winning projects received funding for further development</li>
            </ul>
            
            <h4>TECH INTEGRATION</h4>
            <p>Built the event platform using React, Node.js, and AWS infrastructure to handle global participation and ensure real-time collaboration during hackathon events.</p>
        `,
            '2024': `
                <div class="tech-decoration">
                    <div class="tech-node"></div>
                    <div class="tech-node"></div>
                </div>
                <h3>AI FOR ENVIRONMENTAL SOLUTIONS</h3>
                <p class="popup-subtitle">2024 | ENVIRONMENTAL NON-PROFIT</p>
                <p>Established this foundation to combat environmental degradation through community-driven restoration projects.</p>
                
                <h4>KEY INITIATIVES</h4>
                <ul>
                    <li>Organized 35+ large-scale clean-up and reforestation projects</li>
                    <li>Developed educational programs for 15 partner schools</li>
                    <li>Created a volunteer network of 125+ dedicated environmentalists</li>
                    <li>Implemented sustainable waste management systems in 3 communities</li>
                </ul>
                
                <h4>TECH INTEGRATION</h4>
                <p>Developed a custom platform using geospatial mapping to track restoration progress and volunteer coordination.</p>
            `,
            '2023': `
                <div class="tech-decoration">
                    <div class="tech-node"></div>
                    <div class="tech-node"></div>
                </div>
                <h3>AI FOR LEARNING ENHANCEMENT</h3>
                <p class="popup-subtitle">2023 | ED-TECH PLATFORM</p>
                <p>Launched an ed-tech platform that reached over 1,500 users, offering personalized learning experiences for students.</p>
                
                <h4>KEY INITIATIVES</h4>
                <ul>
                    <li>Developed an AI-driven recommendation engine for customized learning paths</li>
                    <li>Partnered with 30+ schools to integrate the platform into their curriculums</li>
                    <li>Introduced interactive lessons and gamification to increase engagement</li>
                    <li>Held 100+ live virtual workshops with industry experts</li>
                </ul>
                
                <h4>TECH INTEGRATION</h4>
                <p>Built the platform using Python, Flask, and MongoDB with cloud hosting on AWS for scalability. Incorporated machine learning for content personalization.</p>
            `,
            '2022': `
                <div class="tech-decoration">
                    <div class="tech-node"></div>
                    <div class="tech-node"></div>
                </div>
                <h3>AI FOR AUTOMATION</h3>
                <p class="popup-subtitle">2022 | AI PLATFORM</p>
                <p>Developed an AI-powered solution for natural language processing to assist businesses in automating their customer service processes.</p>
                
                <h4>KEY INITIATIVES</h4>
                <ul>
                    <li>Launched AI chatbots for 10+ enterprise clients, reducing response time by 70%</li>
                    <li>Integrated multi-language support for diverse customer bases</li>
                    <li>Enhanced customer experience with context-based responses and sentiment analysis</li>
                    <li>Offered a scalable SaaS product that grew its customer base by 150%</li>
                </ul>
                
                <h4>TECH INTEGRATION</h4>
                <p>Used TensorFlow for NLP models and integrated cloud services (AWS Lambda, EC2) for high-performance AI processing.</p>
            `,
            '2021': `
                <div class="tech-decoration">
                    <div class="tech-node"></div>
                    <div class="tech-node"></div>
                </div>
                <h3>TECH INTERNSHIP</h3>
                <p class="popup-subtitle">2021 | TECH INDUSTRY</p>
                <p>Gained hands-on experience working alongside senior engineers to develop software solutions at a top tech company.</p>
                
                <h4>KEY INITIATIVES</h4>
                <ul>
                    <li>Collaborated on the development of a cloud-based SaaS product</li>
                    <li>Assisted in designing user interfaces and enhancing the user experience</li>
                    <li>Contributed to the testing and debugging of new features for enterprise applications</li>
                </ul>
                
                <h4>TECH INTEGRATION</h4>
                <p>Worked with JavaScript, Node.js, and AWS services to develop scalable solutions and integrate APIs for feature enhancement.</p>
            `,
            '2020': `
                <div class="tech-decoration">
                    <div class="tech-node"></div>
                    <div class="tech-node"></div>
                </div>
                <h3>INDEPENDENT CODER</h3>
                <p class="popup-subtitle">2020 | SELF-LEARNING JOURNEY</p>
                <p>Dedicated myself to mastering coding through self-learning, focusing on various programming languages, frameworks, and tools.</p>
                
                <h4>KEY INITIATIVES</h4>
                <ul>
                    <li>Completed 50+ coding challenges on platforms like LeetCode and HackerRank</li>
                    <li>Built personal projects in web development, automation, and data analysis</li>
                    <li>Started contributing to open-source projects on GitHub</li>
                </ul>
                
                <h4>TECH INTEGRATION</h4>
                <p>Focused on Python, JavaScript, and React for full-stack development, utilizing Git for version control and Docker for containerization.</p>
            `,
        };
        // Add click event to all details buttons
        detailsButtons.forEach(button => {
            button.addEventListener('click', function() {
                const year = this.getAttribute('data-year');
                timelinePopupContent.innerHTML = detailedContent[year] || '<p>NO ADDITIONAL DATA AVAILABLE</p>';
                timelinePopup.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close popup when close button is clicked
        timelinePopupClose.addEventListener('click', closePopup);
        
        // Close popup when clicking outside content
        timelinePopup.addEventListener('click', function(e) {
            if (e.target === timelinePopup) {
                closePopup();
            }
        });
        
        // Close popup with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && timelinePopup.classList.contains('active')) {
                closePopup();
            }
        });
        
        function closePopup() {
            timelinePopup.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Add active class when button is clicked
detailsButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        detailsButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
    });
});

// Add ripple effect
detailsButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const detailsButtons = document.querySelectorAll('.details-btn');
    const timelinePopup = document.getElementById('timelinePopup');
    const timelinePopupClose = document.getElementById('timelinePopupClose');
    const timelinePopupContent = document.getElementById('timelinePopupContent');
    
    // Detailed content without tech decorations
    const detailedContent = {
        '2025': `
            <h3>INTERNATIONAL HACKATHON HOST</h3>
            <p class="popup-subtitle">2025 | GLOBAL EVENT</p>
            <p>I hosted a worldwide challenge with the Senior Vice President of JP Morgan Chase for technologists from all around the world to integrate technology and collaborate on solving pressing global challenges. Collaborated with judges from the largest tech companies including Amazon, Meta, Uber, and Visa.</p>
            
            <h4>KEY INITIATIVES</h4>
            <ul>
                <li>Attracted 500+ participants from 30+ countries</li>
                <li>Secured sponsorships from major tech companies totaling $10,000+</li>
                <li>Featured challenges in sustainability, healthcare, and education</li>
                <li>5 winning projects received funding for further development</li>
            </ul>
            
            <h4>TECH INTEGRATION</h4>
            <p>Built the event platform using React, Node.js, and AWS infrastructure to handle global participation and ensure real-time collaboration during hackathon events.</p>
        `,
        // ... (other years with same simplified structure)
    };

    // Button click handler
    detailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const year = this.getAttribute('data-year');
            timelinePopupContent.innerHTML = detailedContent[year] || '<p>No additional details available</p>';
            timelinePopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close handlers
    timelinePopupClose.addEventListener('click', closePopup);
    timelinePopup.addEventListener('click', function(e) {
        if (e.target === timelinePopup) closePopup();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && timelinePopup.classList.contains('active')) {
            closePopup();
        }
    });

    function closePopup() {
        timelinePopup.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Add this to your existing button click handler
detailsButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        detailsButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        const year = this.getAttribute('data-year');
        timelinePopupContent.innerHTML = detailedContent[year] || '<p>No additional details available</p>';
        timelinePopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});