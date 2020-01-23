Vue.component('signInModal', {
    template: document.querySelector('#signInModal'),
    data: function () {
        return {
            activeStatus: false,
            completeUser: '',
            userName: '',
            password: '',
            confirmPassword: '',
            email: '',
            localUser: [],
            valid: '',
            state: 'login',
            loginAttempts: 0,
            loggedIn: localStorage.token
        }
    },
    mounted() {
        this.$root.$on('signInToggle', (modalStatus) => {
            this.activeStatus = modalStatus;
        });
        if (this.loggedIn) {
            // check if still valid token
            api.get('register').then(x => {
                if(!x.data.token){
                    this.logout();
                } else {
                    this.localUser = x.data.user;
                    localStorage.user = JSON.stringify(x.data.user);
                }
            }).catch(e => {
                this.loggedIn = false;
                this.logout();
            })
        }
    },
    methods: {
        closeModal() {
            this.userName = '';
            this.email = '';
            this.password = '';
            this.confirmPassword = '';
            this.activeStatus = false;
        },
        captureForm: function (credentials) {
            this.localUser.push({userName: credentials.userName, password: credentials.password});
            this.login(this.localUser[0]);

        },
        logout() {
            if (this.loggedIn) {
                api.delete('login').then(res => {
                    this.updateStatus(false);
                })
            } else {
                this.updateStatus(false);
            }

        },
        login(credentials, logout = false) {
            api.post(this.state, credentials).then(res => {
                localStorage.token = res.data.token;
                localStorage.setItem('user', JSON.stringify(res.data.user));
                this.completeUser = JSON.parse(localStorage.getItem('user'));
                console.log(this.completeUser);
                localStorage.userName = this.completeUser.userName;
                localStorage.email = this.completeUser.emails[0].email;
                localStorage.password = this.password;
                this.valid = true;
                this.$root.$emit('updateButton', 'SIGN OUT');
                this.closeModal();
            }).catch(err => {
                if (typeof err !== 'undefined') {
                    if (this.loginAttempts === 3) {
                        //verifies if login worked.
                        this.valid = false;
                    }
                    this.password = '';
                    this.loginAttempts++;
                }
            });
        },
        registerUser(userInfo) {
            if (userInfo.password === userInfo.confirmPassword) {
                delete userInfo.confirmPassword;
                this.confirmPassword = '';
                this.login(userInfo);
            }
        },
        newAccount() {
            this.valid = false;
            this.loginAttempts = 0;
        },
        updateStatus(token) {
            if (token) {
                localStorage.token = token;
                this.loggedIn = token;
                this.$root.$emit('login', true);
            } else {
                api.delete('login');
                delete localStorage.user;
                delete localStorage.token;
                this.localUser = {};
                this.loggedIn = false;
                this.$root.$emit('login', false);
            }
        }
    }
});
