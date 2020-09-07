<template>
    <div class="page-content">
        <page-mgr :list-api="listApi"
                  :selectOpt.sync="selectOpt"
                  :checked-area-fields="['id','user_name']"
                  :use-expand="true"
                  :custom-expand="true"
                  :operate-width="100"
                  :border="true"
                  ref="pageMgr"
                  :disables="['exportData']"
                  :search-opt="searchOpt"
                  :cols="colData">
            <template v-slot:pageBtns>
                <el-button size="mini" type="primary" @click="approve()">批准</el-button>
                <el-button size="mini" type="danger" @click="refuse()">拒绝</el-button>
            </template>
            <template v-slot:expand="{row,expandCols}">
                <div class="expand-item"
                     v-for="expandItem in expandCols"
                     :key="expandItem.key">
                    <div class="expand-label">{{expandItem.label}}：</div>
                    <div>
                        {{ row[expandItem.key] || '-' }}
                    </div>
                </div>
            </template>
            <template v-slot:customCols="{col,row}">
                <div v-html="findCol(row,col)"></div>
            </template>
            <template v-slot:operateCol="{row}">
                <el-button type="text" @click="approve(row)" :disabled="row.status > 0">批准</el-button>
                <el-button type="text" @click="refuse(row)" :disabled="row.status > 0">拒绝</el-button>
            </template>
        </page-mgr>
        <!--拒绝理由-->
        <el-dialog title="拒绝理由"
                   :visible.sync="refuseModalShow"
                   :show-close="false"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div>
                <el-input rows="5"
                          type="textarea"
                          placeholder="请输入拒绝理由"
                          v-model="reason_reject">
                </el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="refuseModalShow = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="confirmRefuse()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import authApplyApi from 'api/authApplyApi';
    import configStatic from 'config/static';
    import configEnum from 'config/enum';
    import msgConfig from 'config/msg';
    export default {
        data() {
            return {
                listApi: authApplyApi,
                searchOpt: [
                    {key: 'user_name', label: '申请人', desc: '请输入申请人'},
                    {key: 'id', label: '编号', desc: '请输入编号'},
                    {
                        key: 'status',
                        label: '申请状态',
                        option: configStatic.applyStatus
                    },
                ],
                colData: [
                    {label: '编号', key: 'id', check: 0, width: 80, expand: true},
                    {label: '申请人', key: 'user_name', check: 1, width: 150, align: 'left'},
                    {label: '申请人账号', key: 'user_no', check: 0, expand: true},
                    {label: '申请理由', key: 'reason_apply', check: 0, expand: true},
                    {label: '申请客户', key: 'company_name', isArray: true, check: 1, align: 'left'},
                    {label: '审批人', key: 'approve_name', check: 0, width: 150, dynamic: true},
                    {label: '审批时间', key: 'approve_at', check: 0, width: 100, dynamic: true},
                    {label: '申请时间', key: 'created_at', check: 1, width: 100},
                    {
                        label: '状态',
                        key: 'status',
                        check: 1,
                        width: 100,
                        map: [configStatic.applyStatus, 'value', 'label']
                    },
                ],
                selectOpt: {
                    ids: [],
                    isAll: false
                },
                refuseModalShow: false,
                reason_reject: '',
                configStatic: configStatic,
                configEnum: configEnum,
                curRefuseItems: [],
                curRefuseIsAll:false
            }
        },
        methods: {
            approve(item) {
                let data = {
                    status: configEnum['APPLY_APPROVAL'],
                    apply_id: []
                };
                if (item) {
                    data.apply_id.push(item.id);
                } else if (this.selectOpt.isAll) {
                    data.isAll = true;
                } else if (this.selectOpt.ids.length > 0) {
                    data.apply_id = myTool.copyArray(this.selectOpt.ids);
                } else {
                    this.$notify.success({
                        title: '提示',
                        message:msgConfig['noChecked']
                    });
                    return;
                }
                this.$confirm("确认批准吗").then(() => {
                    authApplyApi.approve({
                        data: data
                    }).then(res => {
                        this.$notify.success({
                            title: '提示',
                            message:msgConfig['updateOk']
                        });
                        this.$refs['pageMgr'].updateData(res.data.items);
                    });
                }).catch(() => {
                });
            },

            refuse(item) {
                this.curRefuseItems = [];
                this.curRefuseIsAll = false;
                this.reason_reject = '';
                if (item) {
                    this.curRefuseItems = [item.id];
                } else if (this.selectOpt.isAll) {
                    this.curRefuseIsAll = true;

                } else if (this.selectOpt.ids.length > 0) {
                    this.curRefuseItems = myTool.copyArray(this.selectOpt.ids);
                }

                if (this.curRefuseItems.length > 0 || this.curRefuseIsAll) {
                    this.$confirm("确认拒绝吗").then(() => {
                        setTimeout(() => {
                            this.refuseModalShow = true;
                        }, 200);
                    }).catch(() => {

                    });
                } else {
                    this.$notify.success({
                        title: '提示',
                        message:msgConfig['noChecked']
                    });
                }

            },
            confirmRefuse() {
                let data = {
                    status: configEnum['APPLY_REFUSE'],
                    apply_id: [],
                    reason_reject: this.reason_reject
                };
                if(this.curRefuseIsAll){
                    data.isAll = true;
                }else{
                    data.apply_id = this.curRefuseItems;
                }
                authApplyApi.approve({
                    data: data
                }).then(res => {
                    this.$notify.success({
                        title: '提示',
                        message:msgConfig['updateOk']
                    });
                    this.$refs['pageMgr'].updateData(res.data.items);
                    this.refuseModalShow = false;
                });
            }
        },
        components: {},
        created: function () {
            this.$store.commit('setProp', {
                key: 'nav',
                val: {
                    items: [
                        {title: '申请'}
                    ]
                }
            })
        }
    }
</script>
<style scoped lang="less">
    .expand-item {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        padding-left: 60px;
    }
    .expand-label {
        width: 100px;
    }
</style>