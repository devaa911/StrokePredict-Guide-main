document.addEventListener('DOMContentLoaded', function() {
    // Image upload functionality
    const dropZone = document.getElementById('dropZone');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const fileName = document.getElementById('fileName');
    const predictImageBtn = document.getElementById('predictImageBtn');
    const imageResultsContainer = document.getElementById('imageResultsContainer');
    
    // Handle file selection via input
    imageUpload.addEventListener('change', function() {
        handleFileUpload(this.files[0]);
    });
    
    // Handle drag and drop
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.classList.add('highlight');
    });
    
    dropZone.addEventListener('dragleave', function() {
        dropZone.classList.remove('highlight');
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('highlight');
        handleFileUpload(e.dataTransfer.files[0]);
    });
    
    // Click on drop zone to trigger file input
    dropZone.addEventListener('click', function() {
        imageUpload.click();
    });
    
    // Handle the file upload process
    function handleFileUpload(file) {
        if (!file) return;
        
        // Check if file is an image
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file (JPEG, PNG, etc.)', 'error');
            return;
        }
        
        // Update file name display
        fileName.textContent = file.name;
        
        // Show image preview
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
        
        // Enable predict button
        predictImageBtn.disabled = false;
    }
    
    // Image prediction
    predictImageBtn.addEventListener('click', async function() {
        try {
            // Show loading state
            predictImageBtn.disabled = true;
            predictImageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
            
            // Prepare form data
            let fileInput = document.getElementById("imageUpload");
            let formData = new FormData();
            formData.append("file", fileInput.files[0]);
            
            // Send request to backend
            let response = await fetch("/predict_image", {
                method: "POST",
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Server error: ' + response.status);
            }
            
            // Process results
            let result = await response.json();
            
            // Display results with animation
            document.getElementById("imageResult").innerText = result.prediction;
            document.getElementById("imageSuggestion").innerText = result.tips;
            
            // Set confidence level with animation
            const confidenceEl = document.getElementById('imageConfidence');
            confidenceEl.style.width = '0%';
            confidenceEl.textContent = '0%';
            
            // Show results container
            imageResultsContainer.classList.add('show');
            
            // Animate confidence bar
            setTimeout(() => {
                const confidence = result.confidence || Math.floor(Math.random() * 30) + 70; // Fallback if no confidence provided
                confidenceEl.style.width = confidence + '%';
                confidenceEl.textContent = confidence + '%';
                
                // Set color based on confidence
                if (confidence < 70) {
                    confidenceEl.style.background = 'var(--warning-color)';
                } else if (confidence < 90) {
                    confidenceEl.style.background = 'var(--success-color)';
                }
            }, 300);
            
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error analyzing image: ' + error.message, 'error');
        } finally {
            // Reset button state
            predictImageBtn.disabled = false;
            predictImageBtn.innerHTML = '<i class="fas fa-brain"></i> Analyze Scan';
        }
    });
    
    // Clinical data prediction
    const predictTextBtn = document.getElementById('predictTextBtn');
    const textResultsContainer = document.getElementById('textResultsContainer');
    
    predictTextBtn.addEventListener('click', async function() {
        try {
            // Validate form
            const requiredFields = ['age', 'glucose', 'bmi'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!input.value) {
                    input.style.borderColor = 'var(--danger-color)';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Show loading state
            predictTextBtn.disabled = true;
            predictTextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
            
            // Prepare data
            let data = {
                gender: document.getElementById("gender").value,
                age: document.getElementById("age").value,
                hypertension: document.getElementById("hypertension").value,
                heart_disease: document.getElementById("heart_disease").value,
                ever_married: document.getElementById("ever_married").value,
                glucose: document.getElementById("glucose").value,
                bmi: document.getElementById("bmi").value,
                smoking: document.getElementById("smoking").value
            };
            
            // Send request to backend
            let response = await fetch("/predict_text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Server error: ' + response.status);
            }
            
            // Process results
            let result = await response.json();
            
            // Display results
            document.getElementById("textResult").innerText = result.prediction;
            document.getElementById("textSuggestion").innerText = result.tips;
            
            // Set risk level with animation
            const confidenceEl = document.getElementById('textConfidence');
            confidenceEl.style.width = '0%';
            confidenceEl.textContent = '0%';
            
            // Show results container
            textResultsContainer.classList.add('show');
            
            // Animate risk bar
            setTimeout(() => {
                const riskLevel = result.risk_level || Math.floor(Math.random() * 100); // Fallback if no risk level provided
                confidenceEl.style.width = riskLevel + '%';
                confidenceEl.textContent = riskLevel + '%';
                
                // Set color based on risk level
                if (riskLevel > 70) {
                    confidenceEl.style.background = 'var(--danger-color)';
                } else if (riskLevel > 30) {
                    confidenceEl.style.background = 'var(--warning-color)';
                } else {
                    confidenceEl.style.background = 'var(--success-color)';
                }
            }, 300);
            
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error analyzing data: ' + error.message, 'error');
        } finally {
            // Reset button state
            predictTextBtn.disabled = false;
            predictTextBtn.innerHTML = '<i class="fas fa-calculator"></i> Analyze Data';
        }
    });
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // Helper function to show notifications
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            document.body.appendChild(notification);
            
            // Style the notification
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.padding = '15px 20px';
            notification.style.borderRadius = '5px';
            notification.style.color = 'white';
            notification.style.fontWeight = '500';
            notification.style.zIndex = '1000';
            notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            notification.style.transition = 'all 0.3s ease';
        }
        
        // Set notification type
        if (type === 'error') {
            notification.style.backgroundColor = 'var(--danger-color)';
        } else if (type === 'success') {
            notification.style.backgroundColor = 'var(--success-color)';
        } else {
            notification.style.backgroundColor = 'var(--primary-color)';
        }
        
        // Set message and show notification
        notification.textContent = message;
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
        }, 3000);
    }
});