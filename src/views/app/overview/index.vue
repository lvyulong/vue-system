<template>
    <div class="page-content">
        总览
    </div>
</template>

<script>
    export default {
        name: "overview",
        data() {
            return {}
        },
        methods: {},
        created (){
            this.$store.commit('setProp', {
                key: 'nav',
                val: {
                    items: [
                        {title: '总览'}
                    ]
                }
            })
        }
    }
</script>
