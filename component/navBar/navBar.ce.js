Vue.component('navBar', {
    template: document.querySelector('#navBar'),
    data: function () {
        return {
            logStatus: typeof localStorage.token === 'undefined' ? 'SIGN IN' : 'SIGN OUT',
            userToken: typeof localStorage.token !== 'undefined' ? localStorage.userName : 'NO USER',
        }
    },
    mounted() {
        this.$root.$on('updateButton', (logStatus) => {
            this.logStatus = logStatus;
        });
    },
    methods: {
        signIn() {
            this.$root.$emit('signInToggle', true);
        },
        signOut() {
            delete localStorage.token;
            this.logStatus = 'SIGN IN';
            window.location = '';
        },
        redirect() {
            let credentials = {
                emails: localStorage.email,
                userName: localStorage.userName,
                password: localStorage.password,
                token: localStorage.token
            };
            api.post('login', credentials).then(res => {
                window.location = './userProfile';
            }).catch(err => {
                console.log(err);
            });
        }
    }
});
