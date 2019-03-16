var menu = new Vue({
    delimiters: ['[[', ']]'],
    el: "#menu",
    data: {
        isActive: '1'
    },
    methods: {
        change: function(num){
            this.isActive = num
        }
    }
})