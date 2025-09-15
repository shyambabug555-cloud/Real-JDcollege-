app.use(express.static("public"));

        // ========== PASSWORD TOGGLE ==========
        document.querySelector('.toggle-password').addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('fa-eye','fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('fa-eye-slash','fa-eye');
            }
        });

        // ========== LOGIN SYSTEM ==========
        document.addEventListener('DOMContentLoaded', function() {
            checkAuth();
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', handleLogin);
            }
        });

        function handleLogin(e) {
            e.preventDefault();
            
            const role = document.getElementById('role').value;
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const remember = document.getElementById('remember').checked;

            if (!role || !username || !password) {
                alert("Please fill all fields");
                return;
            }

            const validCredentials = {
                'hod': { username: 'hod', password: 'hod123' },
                'faculty': { username: 'faculty', password: 'faculty123' },
                'student': { username: 'student', password: 'student123' }
            };

            if (validCredentials[role] && username === validCredentials[role].username && password === validCredentials[role].password) {
                sessionStorage.setItem('userRole', role);

                if (remember) {
                    localStorage.setItem('rememberedUser', JSON.stringify({ role, username }));
                } else {
                    localStorage.removeItem('rememberedUser');
                }

                // Redirect to dashboards
                if (role === 'student') {
                    window.location.href = "student-dashboard.html";
                } else if (role === 'faculty') {
                    window.location.href = "faculty-dashboard.html";
                } else if (role === 'hod') {
                    window.location.href = "hod-dashboard.html";
                }

            } else {
                alert("Invalid credentials!");
            }
        }

        function checkAuth() {
            const rememberedUser = localStorage.getItem('rememberedUser');
            if (rememberedUser) {
                const { role, username } = JSON.parse(rememberedUser);
                document.getElementById('role').value = role;
                document.getElementById('username').value = username;
                document.getElementById('remember').checked = true;
            }
        }

        