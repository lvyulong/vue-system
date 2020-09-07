export default {
    methods: {
        switchItem(item, prop, queryFields) {
            this.$confirm("确认更改吗?").then(() => {
                let value = item[prop] ? 0 : 1;
                let data = {
                    id: item.id,
                    [prop]: value,
                };
                let params = {};
                if(queryFields && Array.isArray(queryFields) && queryFields.length > 0){
                    let query = this.$route.query;
                    params = myTool.trimObj(query,queryFields);
                }
                this.listApi.update({data: data, params}).then(res => {
                    item[prop] = res.data[prop];
                    this.$notify.success({
                        title: '提示',
                        message:'修改成功'
                    });
                })
            }, () => {
            });
        }
    }
};