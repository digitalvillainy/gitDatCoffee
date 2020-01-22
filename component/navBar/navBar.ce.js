Vue.component('navBar', {
   template: document.querySelector('#navBar'),
   data: function () {
      return{
         logStatus: typeof localStorage.token === 'undefined' ? 'SIGN IN': 'SIGN OUT',
         // tokenStatus: typeof localStorage.token !== 'undefined' ? localStorage.token : false
      }
   },
   mounted: function (){
      this.$root.$on('updateButton', (logStatus) => {
         this.logStatus = logStatus;
      });
   },
   methods: {
      signIn(){
         this.$root.$emit('signInToggle', true);
      },
      signOut(){
         delete localStorage.token;
         this.logStatus = 'SIGN IN';
      }
   }
});
