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
            state: 'login'
        }
    },
    mounted() {
        this.$root.$on('signInToggle', (modalStatus) => {
            this.activeStatus = modalStatus;
        });
    },
    methods: {
        closeModal(reset) {
            if (reset) {
                this.userName = '';
                this.password = '';
            }
            this.activeStatus = false;
        },
        captureForm: function (credentials) {
            this.localUser.push({userName: credentials.userName, password: credentials.password});
            this.login(this.localUser[0]);
            if (this.valid) {
                this.closeModal(true);
            } else {
                this.password = '';
                this.state = 'register';
            }
        },
        login(credentials, logout = false) {
            api.post(this.state, credentials).then(res => {
                this.localUser.response = res.data;
                localStorage.token = this.localUser.response.token;
                this.valid = true;
                this.$root.$emit('updateButton', 'SIGN OUT');
                this.closeModal(true);
            }).catch(err => {
                this.valid = false;
            });
        },
        registerUser(userInfo) {
            if (userInfo.password === userInfo.confirmPassword) {
                delete userInfo.confirmPassword;
                this.confirmPassword = '';
                this.login(userInfo);
                console.log(this.localUser);
            }
        }
    }
});
