Vue.component('signInModal', {
    template: document.querySelector('#signInModal'),
    data: function () {
        return {
            activeStatus: false,
            userName: '',
            password: '',
            confirmPassword: '',
            email: '',
            localUser: [],
            valid: '',
            state: 'login',
            loginAttempts: 0
        }
    },
    mounted() {
        this.$root.$on('signInToggle', (modalStatus) => {
            this.activeStatus = modalStatus;
        });
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
        login(credentials, logout = false) {
            api.post(this.state, credentials).then(res => {
                this.localUser.response = res.data;
                localStorage.token = this.localUser.response.token;
                localStorage.user = res.data.user.userName;
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
        }
    }
});
