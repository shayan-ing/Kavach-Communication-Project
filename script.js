// DOM Elements
const SECRET_PIN = "1971"; // Demo PIN - change in production
const pinContainer = document.getElementById('pin-container');
const appContainer = document.getElementById('app-container');
const pinInput = document.getElementById('pin-input');
const pinSubmit = document.getElementById('pin-submit');
const pinError = document.getElementById('pin-error');
const pinThemeBtn = document.getElementById('pin-theme-btn');
const lastAuth = document.getElementById('last-auth');
const themeToggle = document.getElementById('theme-toggle');
const logoutBtn = document.getElementById('logout-btn');
const emergencyBtn = document.getElementById('emergency-btn');
const emergencyModal = document.getElementById('emergency-modal');
const closeModal = document.querySelector('.close-modal');
const lockSystemBtn = document.getElementById('lock-system-btn');
const wipeDataBtn = document.getElementById('wipe-data-btn');
const alertTeamBtn = document.getElementById('alert-team-btn');
const plaintext = document.getElementById('plaintext');
const ciphertext = document.getElementById('ciphertext');
const encryptedText = document.getElementById('encrypted-text');
const decryptedText = document.getElementById('decrypted-text');
const encryptBtn = document.getElementById('encrypt-btn');
const decryptBtn = document.getElementById('decrypt-btn');
const encryptLoading = document.getElementById('encrypt-loading');
const decryptLoading = document.getElementById('decrypt-loading');
const clearEncrypt = document.getElementById('clear-encrypt');
const clearDecrypt = document.getElementById('clear-decrypt');
const messageHistory = document.getElementById('message-history');
const privacyLink = document.getElementById('privacy-link');
const termsLink = document.getElementById('terms-link');
const contactLink = document.getElementById('contact-link');

// Tab Navigation
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// File Vault
const fileVaultTabs = document.querySelectorAll('.file-tab-btn');
const fileTabContents = document.querySelectorAll('.file-tab-content');
const fileUpload = document.getElementById('file-upload');
const fileDecrypt = document.getElementById('file-decrypt');
const fileDropArea = document.getElementById('file-drop-area');
const decryptDropArea = document.getElementById('decrypt-drop-area');
const fileNameDisplay = document.getElementById('file-name');
const fileSizeDisplay = document.getElementById('file-size');
const decryptFileNameDisplay = document.getElementById('decrypt-file-name');
const filePassword = document.getElementById('file-password');
const decryptPassword = document.getElementById('decrypt-password');
const togglePassword = document.getElementById('toggle-password');
const toggleDecryptPassword = document.getElementById('toggle-decrypt-password');
const generatePassword = document.getElementById('generate-password');
const selfDestruct = document.getElementById('self-destruct');
const expirySettings = document.getElementById('expiry-settings');
const expiryHours = document.getElementById('expiry-hours');
const encryptFileBtn = document.getElementById('encrypt-file-btn');
const decryptFileBtn = document.getElementById('decrypt-file-btn');
const encryptProgressContainer = document.getElementById('encrypt-progress-container');
const decryptProgressContainer = document.getElementById('decrypt-progress-container');
const encryptProgressBar = document.getElementById('encrypt-progress-bar');
const decryptProgressBar = document.getElementById('decrypt-progress-bar');
const encryptProgressText = document.getElementById('encrypt-progress-text');
const decryptProgressText = document.getElementById('decrypt-progress-text');
const uploadForm = document.getElementById('upload-form');
const uploadSuccess = document.getElementById('upload-success');
const decryptForm = document.getElementById('decrypt-form');
const decryptSuccess = document.getElementById('decrypt-success');
const successFilename = document.getElementById('success-filename');
const generatedPasswordContainer = document.getElementById('generated-password-container');
const generatedPassword = document.getElementById('generated-password');
const toggleGeneratedPassword = document.getElementById('toggle-generated-password');
const copyPassword = document.getElementById('copy-password');
const shareLink = document.getElementById('share-link');
const copyLink = document.getElementById('copy-link');
const selfDestructMessage = document.getElementById('self-destruct-message');
const encryptAnother = document.getElementById('encrypt-another');
const decryptAnother = document.getElementById('decrypt-another');
const downloadFileBtn = document.getElementById('download-file-btn');

// Message History
let messages = JSON.parse(localStorage.getItem('messageHistory')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
        if (pinThemeBtn) {
            pinThemeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
    }
    
    // Load message history
    renderMessageHistory();
    
    // Focus PIN input on load
    pinInput.focus();
});

// Theme Toggle
themeToggle.addEventListener('change', toggleTheme);
pinThemeBtn.addEventListener('click', toggleTheme);

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    // Save preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update PIN screen theme button text
    if (pinThemeBtn) {
        pinThemeBtn.innerHTML = isDarkMode 
            ? '<i class="fas fa-sun"></i> Light Mode' 
            : '<i class="fas fa-moon"></i> Dark Mode';
    }
}

// PIN Authentication
pinSubmit.addEventListener('click', authenticate);
pinInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') authenticate();
});

function authenticate() {
    const enteredPin = pinInput.value.trim();
    
    if (enteredPin === SECRET_PIN) {
        // Success - show main app
        pinError.textContent = "";
        pinContainer.style.display = "none";
        appContainer.style.display = "block";
        
        // Update last auth time
        const now = new Date();
        lastAuth.textContent = now.toLocaleString();
        
        // Add fade-in effect
        appContainer.classList.add('fade-in');
        
        // Check for pending file decryption
        checkPendingFileDecryption();
        
        // Log login event
        addToMessageHistory({
            type: 'system',
            content: 'User authenticated successfully',
            timestamp: new Date()
        });
    } else {
        // Error - show message
        pinError.textContent = "Invalid access code. Try again.";
        pinInput.value = "";
        pinInput.focus();
        
        // Log failed attempt
        addToMessageHistory({
            type: 'system',
            content: 'Failed authentication attempt',
            timestamp: new Date()
        });
    }
}

// Logout Functionality
logoutBtn.addEventListener('click', logout);

function logout() {
    // Log logout event
    addToMessageHistory({
        type: 'system',
        content: 'User logged out',
        timestamp: new Date()
    });
    
    // Reset UI
    appContainer.style.display = "none";
    pinContainer.style.display = "flex";
    pinInput.value = "";
    pinInput.focus();
    
    // Reset all tabs
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    tabBtns[0].classList.add('active');
    tabContents[0].classList.add('active');
    
    // Clear sensitive data
    plaintext.value = "";
    ciphertext.value = "";
    encryptedText.value = "";
    decryptedText.value = "";
    resetFileUpload();
    resetFileDecrypt();
}

// Emergency Features
emergencyBtn.addEventListener('click', () => {
    emergencyModal.style.display = "block";
});

closeModal.addEventListener('click', () => {
    emergencyModal.style.display = "none";
});

window.addEventListener('click', (e) => {
    if (e.target === emergencyModal) {
        emergencyModal.style.display = "none";
    }
});

lockSystemBtn.addEventListener('click', () => {
    alert("SYSTEM LOCKED: All functions disabled until supervisor authorization");
    logout();
    emergencyModal.style.display = "none";
    
    addToMessageHistory({
        type: 'emergency',
        content: 'System locked by user',
        timestamp: new Date()
    });
});

wipeDataBtn.addEventListener('click', () => {
    if (confirm("WARNING: This will permanently delete all message history and stored files. Continue?")) {
        messages = [];
        localStorage.removeItem('messageHistory');
        localStorage.removeItem('encryptedFiles');
        renderMessageHistory();
        alert("All sensitive data has been wiped");
        emergencyModal.style.display = "none";
        
        addToMessageHistory({
            type: 'emergency',
            content: 'All sensitive data wiped by user',
            timestamp: new Date()
        });
    }
});

alertTeamBtn.addEventListener('click', () => {
    alert("EMERGENCY ALERT SENT: Response team has been notified");
    emergencyModal.style.display = "none";
    
    addToMessageHistory({
        type: 'emergency',
        content: 'Emergency alert sent to response team',
        timestamp: new Date()
    });
});

// Tab Navigation
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        // Remove active class from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and content
        btn.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// File Vault Tabs
fileVaultTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-filetab');
        
        // Remove active class from all tabs
        fileVaultTabs.forEach(t => t.classList.remove('active'));
        fileTabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and content
        tab.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// Encryption/Decryption Functions for Messages
async function encryptData(text, password) {
    try {
        // Convert the text to an array buffer
        const textEncoder = new TextEncoder();
        const data = textEncoder.encode(text);
        
        // Derive a key from the password
        const pwdEncoder = new TextEncoder();
        const pwdData = pwdEncoder.encode(password);
        const pwdKey = await crypto.subtle.digest('SHA-256', pwdData);
        
        // Generate a random IV (Initialization Vector)
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        // Import the key
        const key = await crypto.subtle.importKey(
            'raw',
            pwdKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
        );
        
        // Encrypt the data
        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            data
        );
        
        // Combine IV and encrypted data
        const encryptedArray = new Uint8Array(iv.length + encryptedBuffer.byteLength);
        encryptedArray.set(iv);
        encryptedArray.set(new Uint8Array(encryptedBuffer), iv.length);
        
        // Convert to base64 for easy storage/transport
        return btoa(String.fromCharCode.apply(null, encryptedArray));
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt: ' + error.message);
    }
}

async function decryptData(encryptedBase64, password) {
    try {
        // Convert the base64 to an array buffer
        const encryptedString = atob(encryptedBase64);
        const encryptedArray = new Uint8Array(encryptedString.length);
        for (let i = 0; i < encryptedString.length; i++) {
            encryptedArray[i] = encryptedString.charCodeAt(i);
        }
        
        // Extract the IV (first 12 bytes)
        const iv = encryptedArray.slice(0, 12);
        const encryptedData = encryptedArray.slice(12);
        
        // Derive a key from the password
        const pwdEncoder = new TextEncoder();
        const pwdData = pwdEncoder.encode(password);
        const pwdKey = await crypto.subtle.digest('SHA-256', pwdData);
        
        // Import the key
        const key = await crypto.subtle.importKey(
            'raw',
            pwdKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );
        
        // Decrypt the data
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            encryptedData
        );
        
        // Convert the array buffer back to a string
        const textDecoder = new TextDecoder();
        return textDecoder.decode(decryptedBuffer);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt: ' + error.message);
    }
}

// Message encryption/decryption handlers
encryptBtn.addEventListener('click', encryptMessage);
decryptBtn.addEventListener('click', decryptMessage);

async function encryptMessage() {
    if (!plaintext.value.trim()) {
        alert("Please enter a message to encrypt");
        return;
    }
    
    encryptLoading.style.display = "block";
    ciphertext.value = "";
    
    try {
        // Generate a random key for this message
        const messageKey = generateRandomKey(16);
        
        // Encrypt the message
        const encrypted = await encryptData(plaintext.value, messageKey);
        
        // Format the final output as "ENCRYPTED_DATA:KEY"
        ciphertext.value = `${encrypted}:${messageKey}`;
        
        // Add to message history
        addToMessageHistory({
            type: 'encrypted',
            content: plaintext.value,
            encrypted: encrypted,
            key: messageKey,
            timestamp: new Date()
        });
    } catch (error) {
        alert("Encryption failed: " + error.message);
    } finally {
        encryptLoading.style.display = "none";
    }
}

async function decryptMessage() {
    if (!encryptedText.value.trim()) {
        alert("Please enter an encrypted message");
        return;
    }
    
    decryptLoading.style.display = "block";
    decryptedText.value = "";
    
    try {
        // Parse the input (format: "ENCRYPTED_DATA:KEY")
        const parts = encryptedText.value.split(':');
        if (parts.length !== 2) {
            throw new Error("Invalid format. Expected ENCRYPTED_DATA:KEY");
        }
        
        const [encrypted, key] = parts;
        
        // Decrypt the message
        const decrypted = await decryptData(encrypted, key);
        decryptedText.value = decrypted;
        
        // Add to message history
        addToMessageHistory({
            type: 'decrypted',
            content: decrypted,
            encrypted: encrypted,
            key: key,
            timestamp: new Date()
        });
    } catch (error) {
        alert("Decryption failed: " + error.message);
        decryptedText.value = "ERROR: " + error.message;
    } finally {
        decryptLoading.style.display = "none";
    }
}

// Clear Functions
clearEncrypt.addEventListener('click', clearEncryptFields);
clearDecrypt.addEventListener('click', clearDecryptFields);

function clearEncryptFields() {
    plaintext.value = "";
    ciphertext.value = "";
}

function clearDecryptFields() {
    encryptedText.value = "";
    decryptedText.value = "";
}

// File Vault Functions
// Generate a random key
function generateRandomKey(length = 16) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let key = "";
    for (let i = 0; i < length; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

// File upload event listeners
fileUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        displayFileInfo(e.target.files[0], fileNameDisplay, fileSizeDisplay);
    }
});

fileDecrypt.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        decryptFileNameDisplay.textContent = e.target.files[0].name;
    }
});

// Handle file drop area
fileDropArea.addEventListener('click', () => fileUpload.click());
decryptDropArea.addEventListener('click', () => fileDecrypt.click());

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, preventDefaults, false);
    decryptDropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, highlight, false);
    decryptDropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, unhighlight, false);
    decryptDropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    e.currentTarget.classList.add('drag-over');
}

function unhighlight(e) {
    e.currentTarget.classList.remove('drag-over');
}

fileDropArea.addEventListener('drop', handleFileDropUpload, false);
decryptDropArea.addEventListener('drop', handleFileDropDecrypt, false);

function handleFileDropUpload(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
        fileUpload.files = files;
        displayFileInfo(files[0], fileNameDisplay, fileSizeDisplay);
    }
}

function handleFileDropDecrypt(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
        fileDecrypt.files = files;
        decryptFileNameDisplay.textContent = files[0].name;
    }
}

function displayFileInfo(file, nameElement, sizeElement) {
    nameElement.textContent = file.name;
    if (sizeElement) {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        sizeElement.textContent = `${sizeInMB} MB`;
    }
}

// Password toggle
togglePassword.addEventListener('click', () => {
    togglePasswordVisibility(filePassword, togglePassword);
});

toggleDecryptPassword.addEventListener('click', () => {
    togglePasswordVisibility(decryptPassword, toggleDecryptPassword);
});

toggleGeneratedPassword.addEventListener('click', () => {
    togglePasswordVisibility(generatedPassword, toggleGeneratedPassword);
});

function togglePasswordVisibility(inputElement, buttonElement) {
    if (inputElement.type === 'password') {
        inputElement.type = 'text';
        buttonElement.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        inputElement.type = 'password';
        buttonElement.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Generate random password
generatePassword.addEventListener('click', () => {
    filePassword.value = generateRandomKey(12);
});

// Show/hide expiry settings based on self-destruct checkbox
selfDestruct.addEventListener('change', () => {
    expirySettings.style.display = selfDestruct.checked ? 'block' : 'none';
});

// Encrypt file
encryptFileBtn.addEventListener('click', async () => {
    if (!fileUpload.files || !fileUpload.files[0]) {
        alert("Please select a file to encrypt");
        return;
    }
    
    const file = fileUpload.files[0];
    const password = filePassword.value.trim() || generateRandomKey(12);
    
    try {
        // Show progress indicator
        encryptProgressContainer.style.display = 'block';
        encryptFileBtn.disabled = true;
        
        // Encrypt the file
        const encryptedBlob = await encryptFile(file, password, updateEncryptProgress);
        
        // Create object URL for download
        const encryptedUrl = URL.createObjectURL(encryptedBlob);
        
        // Store encrypted file info
        const fileId = Math.random().toString(36).substring(2, 15);
        const selfDestructEnabled = selfDestruct.checked;
        const expiry = selfDestructEnabled ? Date.now() + (parseInt(expiryHours.value) * 60 * 60 * 1000) : null;
        
        const fileInfo = {
            id: fileId,
            name: file.name,
            encryptedName: `encrypted_${file.name}`,
            size: encryptedBlob.size,
            password: password,
            selfDestruct: selfDestructEnabled,
            expiry: expiry,
            url: encryptedUrl,
            timestamp: Date.now()
        };
        
        // Save to localStorage
        const files = JSON.parse(localStorage.getItem('encryptedFiles') || '[]');
        files.push(fileInfo);
        localStorage.setItem('encryptedFiles', JSON.stringify(files));
        
        // Create shareable link
        const shareableLink = `${window.location.origin}${window.location.pathname}#file=${fileId},key=${password}`;
        
        // Log activity
        addToMessageHistory({
            type: 'file-upload',
            content: `Encrypted file: ${file.name}`,
            timestamp: new Date()
        });
        
        // Show success UI
        uploadForm.style.display = 'none';
        uploadSuccess.style.display = 'block';
        
        // Populate success elements
        successFilename.textContent = file.name;
        
        if (!filePassword.value.trim()) {
            generatedPasswordContainer.style.display = 'block';
            generatedPassword.value = password;
        } else {
            generatedPasswordContainer.style.display = 'none';
        }
        
        shareLink.value = shareableLink;
        selfDestructMessage.textContent = selfDestructEnabled 
            ? `will self-destruct after download or ${expiryHours.value} hours.` 
            : 'can be downloaded multiple times.';
            
        // Set up download button for encrypted file
        downloadFileBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = encryptedUrl;
            a.download = fileInfo.encryptedName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // If self-destruct is enabled, remove the file after download
            if (selfDestructEnabled) {
                const files = JSON.parse(localStorage.getItem('encryptedFiles') || '[]');
                const updatedFiles = files.filter(f => f.id !== fileId);
                localStorage.setItem('encryptedFiles', JSON.stringify(updatedFiles));
            }
        };
            
    } catch (error) {
        console.error("Encryption error:", error);
        alert("File encryption failed: " + error.message);
    } finally {
        encryptFileBtn.disabled = false;
    }
});

// Reset file upload form
encryptAnother.addEventListener('click', resetFileUpload);

function resetFileUpload() {
    uploadForm.style.display = 'block';
    uploadSuccess.style.display = 'none';
    fileUpload.value = '';
    fileNameDisplay.textContent = 'Click to select file';
    fileSizeDisplay.textContent = '';
    filePassword.value = '';
    encryptProgressContainer.style.display = 'none';
    encryptProgressBar.style.width = '0%';
    encryptProgressText.textContent = '0%';
}

// Copy to clipboard functions
copyPassword.addEventListener('click', () => {
    copyToClipboard(generatedPassword.value, 'Password copied to clipboard!');
});

copyLink.addEventListener('click', () => {
    copyToClipboard(shareLink.value, 'Link copied to clipboard!');
});

function copyToClipboard(text, successMessage) {
    navigator.clipboard.writeText(text)
        .then(() => alert(successMessage))
        .catch(err => alert("Failed to copy: " + err));
}

// Decrypt file
decryptFileBtn.addEventListener('click', async () => {
    if (!fileDecrypt.files || !fileDecrypt.files[0]) {
        alert("Please select a file to decrypt");
        return;
    }
    
    if (!decryptPassword.value.trim()) {
        alert("Please enter the decryption key");
        return;
    }
    
    const file = fileDecrypt.files[0];
    const password = decryptPassword.value.trim();
    
    try {
        // Show progress indicator
        decryptProgressContainer.style.display = 'block';
        decryptFileBtn.disabled = true;
        
        // Decrypt the file
        const decryptedBlob = await decryptFile(file, password, updateDecryptProgress);
        
        // Generate the original filename (remove 'encrypted_' prefix if present)
        let originalFilename = file.name.replace('encrypted_', '');
        
        // Create object URL for download
        const decryptedUrl = URL.createObjectURL(decryptedBlob);
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = decryptedUrl;
        downloadLink.download = originalFilename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(decryptedUrl);
        }, 100);
        
        // Check if this file should be deleted after decryption (self-destruct)
        const files = JSON.parse(localStorage.getItem('encryptedFiles') || '[]');
        const fileIndex = files.findIndex(f => f.password === password);
        
        if (fileIndex !== -1) {
            if (files[fileIndex].selfDestruct) {
                files.splice(fileIndex, 1);
                localStorage.setItem('encryptedFiles', JSON.stringify(files));
                
                alert("Self-destruct activated: This file will no longer be available after this download");
            }
        }
        
        // Log activity
        addToMessageHistory({
            type: 'file-download',
            content: `Decrypted file: ${file.name}`,
            timestamp: new Date()
        });
        
        // Show success UI
        decryptForm.style.display = 'none';
        decryptSuccess.style.display = 'block';
        
    } catch (error) {
        console.error("Decryption error:", error);
        alert("File decryption failed: " + error.message);
    } finally {
        decryptFileBtn.disabled = false;
    }
});

// Reset file decrypt form
decryptAnother.addEventListener('click', resetFileDecrypt);

function resetFileDecrypt() {
    decryptForm.style.display = 'block';
    decryptSuccess.style.display = 'none';
    fileDecrypt.value = '';
    decryptFileNameDisplay.textContent = 'Click to select encrypted file';
    decryptPassword.value = '';
    decryptProgressContainer.style.display = 'none';
    decryptProgressBar.style.width = '0%';
    decryptProgressText.textContent = '0%';
}

// File encryption function
async function encryptFile(file, password, progressCallback) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                if (!event.target?.result) {
                    throw new Error("Failed to read file");
                }
                
                const fileData = new Uint8Array(event.target.result);
                
                // Derive a key from the password
                const pwdEncoder = new TextEncoder();
                const pwdData = pwdEncoder.encode(password);
                const pwdKey = await crypto.subtle.digest('SHA-256', pwdData);
                
                // Generate a random IV
                const iv = crypto.getRandomValues(new Uint8Array(12));
                
                // Import the key
                const key = await crypto.subtle.importKey(
                    'raw',
                    pwdKey,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['encrypt']
                );
                
                // Process file in chunks to avoid memory issues and show progress
                const chunkSize = 1024 * 1024; // 1MB chunks
                const numChunks = Math.ceil(fileData.length / chunkSize);
                const encryptedChunks = [];
                
                // Add a header to identify this as an encrypted file
                const header = new TextEncoder().encode("ENCRYPTED_FILE:");
                encryptedChunks.push(header);
                
                // Add the IV to the beginning
                encryptedChunks.push(iv);
                
                // Process each chunk
                for (let i = 0; i < numChunks; i++) {
                    const start = i * chunkSize;
                    const end = Math.min(start + chunkSize, fileData.length);
                    const chunk = fileData.slice(start, end);
                    
                    // Encrypt the chunk
                    const encryptedChunk = await crypto.subtle.encrypt(
                        { name: 'AES-GCM', iv },
                        key,
                        chunk
                    );
                    
                    encryptedChunks.push(new Uint8Array(encryptedChunk));
                    
                    // Report progress
                    const progress = (i + 1) / numChunks;
                    progressCallback(progress);
                    
                    // Give the UI thread a chance to update
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
                
                // Combine all chunks
                let totalLength = 0;
                encryptedChunks.forEach(chunk => totalLength += chunk.length);
                
                const encryptedData = new Uint8Array(totalLength);
                let offset = 0;
                encryptedChunks.forEach(chunk => {
                    encryptedData.set(chunk, offset);
                    offset += chunk.length;
                });
                
                // Create a blob from the encrypted data
                const encryptedBlob = new Blob([encryptedData], { type: 'application/octet-stream' });
                resolve(encryptedBlob);
                
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error("Error reading file"));
        reader.readAsArrayBuffer(file);
    });
}

// File decryption function
async function decryptFile(file, password, progressCallback) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                if (!event.target?.result) {
                    throw new Error("Failed to read file");
                }
                
                const encryptedData = new Uint8Array(event.target.result);
                
                // Check for header
                const expectedHeader = new TextEncoder().encode("ENCRYPTED_FILE:");
                
                // Check if file has the correct header
                let isValidFile = true;
                for (let i = 0; i < expectedHeader.length; i++) {
                    if (encryptedData[i] !== expectedHeader[i]) {
                        isValidFile = false;
                        break;
                    }
                }
                
                if (!isValidFile) {
                    throw new Error("Invalid file format or not an encrypted file");
                }
                
                // Extract IV (12 bytes after the header)
                const iv = encryptedData.slice(expectedHeader.length, expectedHeader.length + 12);
                
                // Extract the encrypted content
                const encryptedContent = encryptedData.slice(expectedHeader.length + 12);
                
                // Derive a key from the password
                const pwdEncoder = new TextEncoder();
                const pwdData = pwdEncoder.encode(password);
                const pwdKey = await crypto.subtle.digest('SHA-256', pwdData);
                
                // Import the key
                const key = await crypto.subtle.importKey(
                    'raw',
                    pwdKey,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['decrypt']
                );
                
                // Decrypt the data
                const decryptedBuffer = await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv },
                    key,
                    encryptedContent
                );
                
                // Report 100% progress
                progressCallback(1);
                
                // Create a blob from the decrypted data
                const decryptedBlob = new Blob([decryptedBuffer]);
                resolve(decryptedBlob);
                
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error("Error reading file"));
        reader.readAsArrayBuffer(file);
    });
}

// Progress updates
function updateEncryptProgress(progress) {
    const percentage = Math.round(progress * 100);
    encryptProgressBar.style.width = `${percentage}%`;
    encryptProgressText.textContent = `${percentage}%`;
}

function updateDecryptProgress(progress) {
    const percentage = Math.round(progress * 100);
    decryptProgressBar.style.width = `${percentage}%`;
    decryptProgressText.textContent = `${percentage}%`;
}

// Message History Functions
function addToMessageHistory(message) {
    messages.unshift(message);
    if (messages.length > 50) {
        messages = messages.slice(0, 50);
    }
    localStorage.setItem('messageHistory', JSON.stringify(messages));
    renderMessageHistory();
}

function renderMessageHistory() {
    messageHistory.innerHTML = "";
    
    if (messages.length === 0) {
        messageHistory.innerHTML = '<p class="no-messages">No activity logs found</p>';
        return;
    }
    
    messages.forEach((message, index) => {
        const messageElement = document.createElement('div');
        messageElement.className = `history-item ${message.type}`;
        
        let content = "";
        let icon = "";
        
        switch(message.type) {
            case 'encrypted':
                icon = '<i class="fas fa-lock"></i>';
                content = `Encrypted: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`;
                break;
            case 'decrypted':
                icon = '<i class="fas fa-unlock"></i>';
                content = `Decrypted: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`;
                break;
            case 'system':
                icon = '<i class="fas fa-cog"></i>';
                content = message.content;
                break;
            case 'emergency':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                content = message.content;
                break;
            case 'file-upload':
                icon = '<i class="fas fa-file-upload"></i>';
                content = message.content;
                break;
            case 'file-download':
                icon = '<i class="fas fa-file-download"></i>';
                content = message.content;
                break;
        }
        
        const timeString = new Date(message.timestamp).toLocaleString();
        
        messageElement.innerHTML = `
            <div class="message-icon">${icon}</div>
            <div class="message-preview">
                ${content}
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        messageHistory.appendChild(messageElement);
    });
}

// Footer Links
privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert("Privacy Policy: All communications are encrypted and stored securely. Access is restricted to authorized personnel only.");
});

termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert("Terms of Service: This system is for official use only. Unauthorized access is prohibited.");
});

contactLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert("Contact Support: For technical issues, contact your system administrator or IT support at support@kavach.gov.in");
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+E for encrypt when plaintext is focused
    if (e.ctrlKey && e.key === 'e' && document.activeElement === plaintext) {
        e.preventDefault();
        encryptMessage();
    }
    
    // Ctrl+D for decrypt when encrypted text is focused
    if (e.ctrlKey && e.key === 'd' && document.activeElement === encryptedText) {
        e.preventDefault();
        decryptMessage();
    }
    
    // Ctrl+L for logout
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        logout();
    }
    
    // Ctrl+T for theme toggle
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        themeToggle.checked = document.body.classList.contains('dark-mode');
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        if (emergencyModal.style.display === 'block') {
            emergencyModal.style.display = 'none';
        }
    }
});

// Auto-logout after 30 minutes of inactivity
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (appContainer.style.display === 'block') {
            alert("Session expired due to inactivity. Please log in again.");
            logout();
        }
    }, 30 * 60 * 1000); // 30 minutes
}

// Reset timer on any user activity
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer, false);
});

// Initialize timer
resetInactivityTimer();

// Check URL hash for file decryption links
window.addEventListener('load', checkUrlForFileDecryption);
window.addEventListener('hashchange', checkUrlForFileDecryption);

function checkUrlForFileDecryption() {
    const hash = window.location.hash;
    if (hash.startsWith('#file=')) {
        // Format: #file=fileId,key=decryptionKey
        const params = hash.substring(1).split(',');
        if (params.length === 2) {
            const fileIdParam = params[0].split('=');
            const keyParam = params[1].split('=');
            
            if (fileIdParam.length === 2 && keyParam.length === 2) {
                const fileId = fileIdParam[1];
                const key = keyParam[1];
                
                // Check if we're authenticated
                if (appContainer.style.display === 'block') {
                    processSharedFile(fileId, key);
                } else {
                    // Save parameters and process after authentication
                    localStorage.setItem('pendingFileDecryption', JSON.stringify({
                        fileId,
                        key
                    }));
                    
                    alert("Please authenticate to access the shared file");
                }
            }
        }
        
        // Clear the hash to avoid repeated processing
        window.location.hash = '';
    }
}

// Check for pending file decryption after authentication
function checkPendingFileDecryption() {
    const pendingDecryption = localStorage.getItem('pendingFileDecryption');
    if (pendingDecryption) {
        try {
            const { fileId, key } = JSON.parse(pendingDecryption);
            processSharedFile(fileId, key);
        } catch (e) {
            console.error("Error processing pending file decryption:", e);
        }
        
        localStorage.removeItem('pendingFileDecryption');
    }
}

// Process a shared file
function processSharedFile(fileId, key) {
    // Switch to the files tab
    document.querySelector('[data-tab="files"]').click();
    document.querySelector('[data-filetab="download"]').click();
    
    // Look for the file in localStorage
    const files = JSON.parse(localStorage.getItem('encryptedFiles') || '[]');
    const fileInfo = files.find(f => f.id === fileId);
    
    if (fileInfo) {
        // Set decryption key
        decryptPassword.value = key;
        
        // Check if file has expired
        if (fileInfo.expiry && Date.now() > fileInfo.expiry) {
            alert("This file has expired and is no longer available.");
            
            // Remove expired file
            const fileIndex = files.findIndex(f => f.id === fileId);
            if (fileIndex !== -1) {
                files.splice(fileIndex, 1);
                localStorage.setItem('encryptedFiles', JSON.stringify(files));
            }
            
            return;
        }
        
        // Fetch the file content from the stored URL
        fetch(fileInfo.url)
            .then(response => response.blob())
            .then(blob => {
                // Create a File object
                const file = new File([blob], fileInfo.encryptedName, {
                    type: 'application/octet-stream'
                });
                
                // Create a FileList-like object
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileDecrypt.files = dataTransfer.files;
                
                // Update the UI
                decryptFileNameDisplay.textContent = fileInfo.encryptedName;
                
                // Auto-decrypt the file after a short delay
                setTimeout(() => {
                    decryptFileBtn.click();
                }, 500);
            })
            .catch(error => {
                console.error("Error fetching file:", error);
                alert("Failed to load the shared file.");
            });
    } else {
        alert("The shared file was not found. It may have been deleted or expired.");
    }
}