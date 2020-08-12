
import { vector, matrix } from "../ArrayCal";

export const node_signal_option = {
    // 配时方案编号
    // "0-东西直左", "1-东西直行+东西左转", "2-东口直左+西口直左", "3-东口直左+东西直行+西口直左", "4-东口直左+东西左转+西口直左", "5-南北直左", "6-南北直行+南北左转", "7-南口直左+北口直左", "8-南口直左+南北直行+北口直左", "9-南口直左+南北左转+北口直左"
    phase_schema_group: [0, 5],
    // 是否定周期
    fix_cycle: false,
    // 定周期时长
    cycle_time: 120,
    // 损失时间
    loss: 6,
    // 黄灯时间
    amber: 3,
    // 东南西北 左转流量
    QL: [476, 348, 944, 260],
    // 东南西北 直行流量
    QT: [1332, 344, 1412, 372],
    // 东南西北 右转流量
    QR: [0, 0, 0, 0],

    // 1-直行T;2-左转L;3-右转R;4-直右TR;5-直左TL;6-直左右TLR;7-调头U;8-左转调头LU;9-直行调头TU;0-左右转LR;-1-出口道
    // 东南西北左转车道数
    LN: [2, 2, 2, 1],
    // 东南西北 直行(直行/直左/直右)车道数
    TN: [3, 2, 3, 3],
    // 东南西北 右转车道数
    RN: [0, 0, 0, 0],

    // 左转饱和流率
    CL: 1632,
    // 直行饱和流率
    CT: 1685,
    // 右转行饱和流率
    CR: 1685
}

export const cal_control_time = (option = node_signal_option) => {

    // 配时参数
    let {phase_schema_group, fix_cycle, cycle_time, loss, amber, QL, QT, QR, LN, TN, RN, CL, CT, CR} = option
    
    // 信号方案
    let schema_group_name = ["0-东西直左", "1-东西直行+东西左转", "2-东口直左+西口直左", "3-东口直左+东西直行+西口直左", "4-东口直左+东西左转+西口直左", 
    "5-南北直左", "6-南北直行+南北左转", "7-南口直左+北口直左", "8-南口直左+南北直行+北口直左", "9-南口直左+南北左转+北口直左"]

    // 车流名称
    let flow_name = ["0-东口直行 ", "1-南口直行 ", "2-西口直行 ", "3-北口直行 ", "4-东口左转 ", "5-南口左转 ", "6-西口左转 ",
    "7-北口左转 ","8-东口右转 ", "9-南口右转 ", "0-西口右转 ", "a-北口右转"]

    // 相位名称
    let schema_name = ["0-东西直左", "1-东西直行", "2-东西左转", "3-东口直左", "4-西口直左", 
    "5-南北直左", "6-南北直行", "7-南北左转", "8-南口直左", "9-北口直左"]
    
    // 相位对应车流
    let schema_flow = [[0, 2, 4, 6], [0, 2], [4, 6], [0, 4], [2, 6], [1, 3, 5, 7], [1, 3], [5, 7], [1, 5], [3, 7]]

    // 相位组合
    let schema_group = [[0], [1, 2], [3, 4], [3, 1, 4], [3, 2, 4], [5], [6, 7], [8, 9], [8, 6, 9], [8, 7, 9]]

    // 相位组合对应车流
    let schema_group_flow = [
        [[0,2,4,6]], [[0,2], [4,6]], [[0,4],[2,6]], [[0,4], [0,2], [2,6]], [[0,4], [4,6], [2,6]],
        [[1,3,5,7]], [[1,3], [5,7]], [[1,5],[3,7]], [[1,5], [1,3], [3,7]], [[1,5], [5,7], [3,7]]
    ]

    // 直行/左转/右转流量比：
    let QCT = QT.map((e,i) => (TN[i] === 0?0:QT[i] / (CT * TN[i])))
    let QCL = QL.map((e,i) => (LN[i] === 0?0:QL[i] / (CL * LN[i])))
    // let QCR = QR.map((e,i) => (QR[i] / (CR * RN[i])))

    let flow_y = [...QCT, ...QCL]

    // 十字路口 10种方案车流 流量比
    let schema_group_key_flow_qc = [
        [[flow_y[0],flow_y[2],flow_y[4],flow_y[6]][vector.argmax([flow_y[0],flow_y[2],flow_y[4],flow_y[6]])]], 
        [[flow_y[0],flow_y[2]][flow_y[0]>flow_y[2]?0:1], [flow_y[4],flow_y[6]][flow_y[4]>flow_y[6]?0:1]],
        [[flow_y[0],flow_y[4]][flow_y[0]>flow_y[4]?0:1], [flow_y[4],flow_y[6]][flow_y[2]>flow_y[6]?0:1]],
        [[flow_y[0],flow_y[6]], [flow_y[2],flow_y[4]]][vector.sum([flow_y[0],flow_y[6]])>vector.sum([flow_y[2],flow_y[4]])?0:1],
        [[flow_y[0],flow_y[6]], [flow_y[2],flow_y[4]]][vector.sum([flow_y[0],flow_y[6]]) > vector.sum([flow_y[2],flow_y[4]])?0:1],
        [[flow_y[1],flow_y[3],flow_y[5],flow_y[7]][vector.argmax([flow_y[1],flow_y[3],flow_y[5],flow_y[7]])]], 
        [[flow_y[1],flow_y[3]][flow_y[1]>flow_y[3]?0:1], [flow_y[5],flow_y[7]][flow_y[5]>flow_y[7]?0:1]],
        [[flow_y[1],flow_y[5]][flow_y[1]>flow_y[5]?0:1], [flow_y[3],flow_y[7]][flow_y[3]>flow_y[7]?0:1]],
        [[flow_y[1],flow_y[7]], [flow_y[3],flow_y[5]]][vector.sum([flow_y[1],flow_y[7]])>vector.sum([flow_y[3],flow_y[5]])?0:1],
        [[flow_y[1],flow_y[7]], [flow_y[3],flow_y[5]]][vector.sum([flow_y[1],flow_y[7]]) > vector.sum([flow_y[3],flow_y[5]])?0:1]
    ]

    // 十字路口 10种方案关键车流 流量比
    let schema_group_key_flow_id = [
        [[0,2,4,6][vector.argmax([flow_y[0],flow_y[2],flow_y[4],flow_y[6]])]], 
        [[0,2][flow_y[0]>flow_y[2]?0:1], [4,6][flow_y[4]>flow_y[6]?0:1]],
        [[0,4][flow_y[0]>flow_y[4]?0:1], [2,6][flow_y[2]>flow_y[6]?0:1]],
        [[0,6], [2,4]][vector.sum([flow_y[0],flow_y[6]])>vector.sum([flow_y[2],flow_y[4]])?0:1],
        [[0,6], [2,4]][vector.sum([flow_y[0],flow_y[6]]) > vector.sum([flow_y[2],flow_y[4]])?0:1],
        [[1,3,5,7][vector.argmax([flow_y[1],flow_y[3],flow_y[5],flow_y[7]])]], 
        [[1,3][flow_y[1]>flow_y[3]?0:1], [5,7][flow_y[5]>flow_y[7]?0:1]],
        [[1,5][flow_y[1]>flow_y[5]?0:1], [3,7][flow_y[3]>flow_y[7]?0:1]],
        [[1,7], [3,5]][vector.sum([flow_y[1],flow_y[7]])>vector.sum([flow_y[3],flow_y[5]])?0:1],
        [[1,7], [3,5]][vector.sum([flow_y[1],flow_y[7]]) > vector.sum([flow_y[3],flow_y[5]])?0:1]
    ]

    // 十字路口 控制方案名称   东西向、南北向
    let phase_schema_group_name = phase_schema_group.map( e => {
        return schema_group_name[e];
    })

    // 十字路口 配时方案 关键车流流量比
    let phase_schema_group_y = phase_schema_group.map( e => {
        return schema_group_key_flow_qc[e];
    })

    // 十字路口 配时方案 车流编号
    let phase_schema_group_flow = phase_schema_group.map( group_id => {
        return schema_group_flow[group_id];
    })

    // 配时方案车流名称
    let phase_schema_group_flow_name = phase_schema_group.map( group_id => {
        return schema_group_flow[group_id].map(schema_id => schema_id.map(flow_id => flow_name[flow_id]));
    })

    // 配时方案相位编号
    let phase_schema_group_schema_id = phase_schema_group.map( group_id => {
        return schema_group[group_id]
    })

    // 配时方案相位名称
    let phase_schema_group_schema_name = phase_schema_group.map( group_id => {
        return schema_group[group_id].map(schema_id => schema_name[schema_id]);
    })

    // 总流量比
    let schema_Y = matrix.sum(phase_schema_group_y)
    
    // 总关键相位数
    let phase_num = matrix.size(phase_schema_group_y)

    // 周期时长
    let plan_cal_cycle = loss * phase_num / (1 - schema_Y)

    // 计算使用周期时长
    let cycle = fix_cycle ? cycle_time : plan_cal_cycle < 80? 80 : plan_cal_cycle

    // 绿信比
    let phase_ratio = phase_schema_group_y.map(group_id => group_id.map(y => y / schema_Y))

    // 有效绿灯时长
    let phase_effective_time = phase_schema_group_y.map(group_id => group_id.map(y => y / schema_Y * (cycle - loss * phase_num)))

    // 关键车流绿灯时长
    let phase_key_flow_time = phase_schema_group_y.map(group_id => group_id.map(y => y / schema_Y * (cycle - loss * phase_num) + loss))


    // 搭接情况   东口直左
    if(phase_schema_group[0] * 1 === 3){
        if(schema_group_key_flow_id[3][0] === 0){
            // console.log("东直+西左")
            let tmp = [phase_key_flow_time[0][0]*(flow_y[4]/flow_y[0]>1?1:flow_y[4]/flow_y[0]), phase_key_flow_time[0][0]*((1-flow_y[4]/flow_y[0])<0?0:(1-flow_y[4]/flow_y[0])), phase_key_flow_time[0][1]];
            phase_key_flow_time = [tmp, phase_key_flow_time[1]]
        }
        if(schema_group_key_flow_id[3][0] === 2){
            // console.log("东左+西直")
            let tmp = [phase_key_flow_time[0][1], phase_key_flow_time[0][0]*((1-flow_y[6]/flow_y[2])<0?0:(1-flow_y[6]/flow_y[2])), phase_key_flow_time[0][0]*(flow_y[6]/flow_y[2]>1?1:flow_y[6]/flow_y[2])];
            phase_key_flow_time = [tmp, phase_key_flow_time[1]]
        }
    }

    // 搭接情况   西口直左
    if(phase_schema_group[0] * 1 === 4){
        if(schema_group_key_flow_id[3][0] === 0){
            // console.log("东直+西左")
            let tmp = [phase_key_flow_time[0][0], phase_key_flow_time[0][1]*((1-flow_y[2]/flow_y[6])<0?0:(1-flow_y[2]/flow_y[6])), phase_key_flow_time[0][1]*(flow_y[2]/flow_y[6]>1?1:flow_y[2]/flow_y[6])];
            phase_key_flow_time = [tmp, phase_key_flow_time[1]]
        }
        if(schema_group_key_flow_id[3][0] === 2){
            // console.log("东左+西直")
            let tmp = [phase_key_flow_time[0][0]*(flow_y[0]/flow_y[4]>1?1:flow_y[0]/flow_y[4]), phase_key_flow_time[0][0]*((1-flow_y[0]/flow_y[4])<0?0:(1-flow_y[0]/flow_y[4])), phase_key_flow_time[0][1]];
            phase_key_flow_time = [tmp, phase_key_flow_time[1]]
        }
    }

    // 搭接情况   南口直左
    if(phase_schema_group[1] * 1 === 8){
        if(schema_group_key_flow_id[8][0] === 1){
            // console.log("南直+北左")
            let tmp = [phase_key_flow_time[1][0]*(flow_y[5]/flow_y[1]>1?1:flow_y[5]/flow_y[1]), phase_key_flow_time[1][0]*((1-flow_y[5]/flow_y[1])<0?0:(1-flow_y[5]/flow_y[1])), phase_key_flow_time[1][1]];
            phase_key_flow_time = [phase_key_flow_time[0], tmp]
        }
        if(schema_group_key_flow_id[8][0] === 3){
            // console.log("南左+北直")
            let tmp = [phase_key_flow_time[1][1], phase_key_flow_time[1][0]*((1-flow_y[7]/flow_y[3])<0?0:(1-flow_y[7]/flow_y[3])), phase_key_flow_time[1][0]*(flow_y[7]/flow_y[3]>1?1:flow_y[7]/flow_y[3])];
            phase_key_flow_time = [phase_key_flow_time[0], tmp]
        }
    }

    // 搭接情况   北口直左
    if(phase_schema_group[1] * 1 === 9){
        if(schema_group_key_flow_id[9][0] === 1){
            // console.log("南直+北左")
            let tmp = [phase_key_flow_time[1][0], phase_key_flow_time[1][1]*((1-flow_y[3]/flow_y[7])<0?0:(1-flow_y[3]/flow_y[7])), phase_key_flow_time[1][1]*(flow_y[3]/flow_y[7]>1?1:flow_y[3]/flow_y[7])];
            phase_key_flow_time = [phase_key_flow_time[0], tmp]
        }
        if(schema_group_key_flow_id[9][0] === 3){
            // console.log("南左+北直")
            let tmp = [phase_key_flow_time[1][0]*(flow_y[1]/flow_y[5]>1?1:flow_y[1]/flow_y[5]), phase_key_flow_time[1][0]*((1-flow_y[1]/flow_y[5])<0?0:(1-flow_y[1]/flow_y[5])), phase_key_flow_time[1][1]];
            phase_key_flow_time = [phase_key_flow_time[0], tmp]
        }
    }

    // 各种配时方案的 流率比
    console.log("各种配时方案的 流率比: ", schema_group_key_flow_qc)
    
    // 周期时长
    // console.log("周期时长: " + cycle)

    // 配时方案名称
    // console.log("控制方案: " + phase_schema_group_name.join(","))

    // 方案车流编号
    // console.log("方案车流编号: " + phase_schema_group_flow)

    // 方案车流名称
    // console.log("方案车流名称: " + phase_schema_group_flow_name)

    // 方案相位编号
    // console.log("方案相位编号: " + phase_schema_group_schema_id)

    // 方案相位名称
    // console.log("方案相位名称: " + phase_schema_group_schema_name)

    // 方案相位时长
    // console.log("方案相位时长: " + phase_key_flow_time)

    return [phase_schema_group_schema_name, phase_key_flow_time]

}

export const optimize_control_time = () => {

    // 各股车流延误 (东直/东左/东口, 南直/南左/南口, 西直/西左/西口, 北直/北左/北口 )
    let delay = [[], [], [], []]


    // 找出延误最大值
    

    // 优化交通组织方案


    // 优化控制时段


    // 优化相位相序
    

    // 优化周期及绿信比



}

