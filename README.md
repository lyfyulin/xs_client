# xs_client

数据接口

1.首页

图表1
当前拥堵路段状态（速度、拥堵指数）          getCurrentLinkState5min
上周同期拥堵路段状态                        getLastWeekMomentLinkState5min         无
去年同期拥堵路段状态                        getLastYearMomentLinkState5min         无

图表2
当前路网状态（5min）——速度                  getCurrentRdnetState5min
今日路网状态                                getLastWeekMomentRdnetState5min         无
上周同期路网状态（5min）——速度               getLastYearMomentRdnetState5min         无

图表3
当前在途车辆数（5min）——大型车、小客车、浙A、非浙A      getCurrentVn5min
上周同期在途车辆数                                     getLastWeekMomentVn5min         无
去年同期在途车辆数                                     getLastWeekMomentVn5min         无

图表4
当前设备识别率                                        getSearchDevQualityDay
上周同比 设备识别率                                   getLastWeekDevQualityDay         无
去年同期 设备识别率                                   getLastYearDevQualityDay         无

图表5
当前路段状态                                          getCurrentLinkState5min
当前路口延误                                          getCurrentNodeDelay5min
检索某路段历史状态                                    getSearchLinksState5min
检索所有路段历史状态                                  getSearchLinkState5min
检索某路口历史状态                                    getSearchNodeDelay5min
检索路口路口历史状态                                  getSearchNodesDelay5min


图表6
通勤热点路段                                         getCurrentTongqinHotRoad
通勤热点路口                                         getCurrentTongqinHotNode

图表7
检索某设备识别率                                          getSearchDevQualityDay
检索某设备传输率                                          getSearchDevQualityDay
检索所有设备设备识别率                                    getSearchDevsQualityDay
检索所有设备设备传输率                                    getSearchDevsQualityDay

图表8
平均出行时长                            检索平均出行时长
平均出行距离                            检索平均出行距离
平均出行次数                            检索平均出行次数
出行时长分布                            检索出行时长
出行距离分布                            检索出行距离
出行次数分布                            检索出行次数

2.路网运行状态
图表1
当前路段状态                            getCurrentLinkState5min
检索某路段状态                          getSearchLinkState5min
路段自由流速度                          getLinkFreeSpeed                无

当前路口状态
检索路口状态


3.在途车辆数
当前在途车辆数
今日在途车辆数
检索在途车辆数

货车点位
工程车点位

检索货车点位
检索工程车点位

4.通勤车
昨日通勤路段
昨日路段车辆数
检索路段通勤车辆数
昨日通勤点位
昨日点位车辆数
检索点位通勤车辆数

5.设备状态
昨日设备传输率
昨日设备识别率
检索设备识别率
设备历史识别率

6.机动车出行
昨日点位发生量/吸引量
检索点位发生量/吸引量
检索点位热门目的地
检索点位热门发生地

7.数据检索
路段状态
路网状态
主干道状态
拥堵路段状态
在途车辆数
通勤车
设备状态
机动车出行

8.事故信息
根据条件检索事故热力图

9.事故统计页面
事故特征统计

10.安全策略
增删改查 事故

11.事故原因
事故原因管理

12.事故防控策略
事故防控策略管理

13.事故治理
事故隐患点（过往隐患点有事故升级，新隐患点无升降，用横线。）
隐患点原因分析排名
隐患点策略
