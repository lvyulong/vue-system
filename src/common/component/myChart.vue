<template>
    <div>

    </div>
</template>
<script>
    import echarts from 'echarts';

    export default {
        name: "myChart",
        props: {
            config: {
                type: Object
            }
        },
        data() {
            return {
                myChart: null,
            };
        },
        created: function () {
            this.$nextTick(() => {
                this.myChart = echarts.init(this.$el);
            })
        },
        methods: {
            draw(config) {
                if (config) {
                    this.myChart.setOption(config);
                    // window.onresize = this.myChart.resize;
                } else {
                    this.$toast('图表缺少配置数据')
                }

            },
            // 生成option
            createOption(config) {
                var option = Object.assign({}, this.option);
                option.series[0].data[0].value = config.data.value[0];
                option.radar.indicator = config.data.indicator;
                return option;
            },
            // 雷达分析图
            createRadarCharts(data) {
                var chartsData = data;
                var option = {
                    radar: {
                        indicator: chartsData.indicator,
                        name: {
                            textStyle: {
                                color: '#222'
                            },
                            formatter: function (value, indicator) {
                                // 每行的字数
                                return value;
                            }
                        },
                        nameGap: '30',
                        splitArea: {
                            areaStyle: {
                                color: ['rgba(237, 237, 237, 1)',
                                    'rgba(237, 237, 237, 1)', 'rgba(237, 237, 237, 1)',
                                    'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)'],
                                // shadowColor: 'rgba(0, 0, 0, 0.3)',
                                // shadowBlur: 10
                            }
                        },
                        shape: 'circle',
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(200, 200, 200, 0.5)'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(200, 200, 200, 1)'
                            }
                        }
                    },
                    series: [{
                        name: '',
                        type: 'radar',
                        data: [
                            {
                                value: chartsData.value[0],
                                name: '平均值',
                                label: {
                                    normal: {
                                        show: true,
                                        color: '#6796FE',
                                        formatter: function (params) {
                                            return params.value.toFixed(1);
                                        },
                                        // position: 'inside'
                                    },

                                },
                                itemStyle: {
                                    normal: {
                                        color: '#6796FE'
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        color: '#6796FE',
                                        type: 'solid',
                                        width: 1
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        opacity: 0.6,
                                        color: 'rgba(103,150,254,0.5)'
                                    }
                                }

                            }
                        ]
                    }],
                    animation: false
                };
                this.myChart.setOption(option);
            }
        },
        watch: {
            'config': {
                handler: function (n, o) {
                    if (n && n != o) {
                        this.createRadarCharts(n.data);
                    }
                },
                deep: true
            }
        }


    };
</script>
<style lang="less" scoped>

</style>
