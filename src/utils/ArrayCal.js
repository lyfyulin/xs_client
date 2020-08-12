

// 求和
export const ArraySum = (arr) => {
	let sum = 0;
	for(let i = 0; i < arr.length; i++){
		sum += arr[i];
	}
	return sum;
}
// 最大值
export const ArrayMax = (arr) => {
	let max = arr[0];
	for(let i = 0; i < arr.length; i++)	{
		if(arr[i] > max){
			max = arr[i]
		}
	}
	return max;
}
// 最大值索引
export const ArrayArgMax = (arr) => {
	let max = arr[0];
	let max_index = 0;
	for(let i = 0; i < arr.length; i++)	{
		if(arr[i] > max){
			max = arr[i];
			max_index = i;
		}
	}
	return max_index;
}
// 最小值
export const ArrayMin = (arr) => {
	let min = arr[0];
	for(let i = 0; i < arr.length; i++)	{
		if(arr[i] < min){
			min = arr[i]
		}
	}
	return min;
}
// 数组累计和
export const ArrayAccumulate = (arr) => {
	let result = [];
	let sum = 0;
	for(let i = 0; i < arr.length; i++)
	{
		sum += arr[i];
		result.push(sum);
	}
	return result;
}
// 找出某个数索引
export let ArrayFindValueIndex = (arr, value) => {
	let result = [];
	for(let i = 0; i < arr.length; i++)
	{
		if(arr[i] === value){
			result.push(i);
		}
	}
	return result;
}
// 找出某个数组索引
export const ArrayFindArrayIndex = (arr, array) => {
	let result = [];
	for (let i = 0; i < array.length; i++) {
		let element = array[i];
		result.push(...ArrayFindValueIndex(arr, element));		
	}
	return result;
}


// 角度相关 （线段旋转）
export const ang = {
	dist: function(num1, num2) {
		return Math.sqrt(num1 * num1 + num2 * num2)
	},
	angle2radian: function(angle) {
		return angle * 3.141592653 / 180
	},
	rotate_line: function(line, angle) {
		let [x1, y1] = this.rotate_point([line[0], line[1]], angle)
		let alpha = Math.atan((line[3] - line[1]) / (line[2] - line[0])) + this.angle2radian(angle)
		let length2 = this.dist(line[3] - line[1], line[2] - line[0])
		let line2 = [x1, y1, x1 + Math.cos(alpha) * length2, y1 + Math.sin(alpha) * length2]

		return line2
	},
	rotate_point: function(point, angle){
		let theta = Math.atan(point[1] / point[0]) + this.angle2radian(angle)
		let length = this.dist(point[0], point[1])
		return [Math.cos(theta) * length, Math.sin(theta) * length]
	}
}


export const vector = {
    judge: function(arr) {
        if(arr instanceof Array){
            this.arr = arr;
        }else{
            throw "不是数组！"
        }
    },
    max : function(arr) {
        this.judge(arr)
        return arr instanceof Array?Math.max.apply(null, arr):-1
    },
    argmax: function(arr) {
        this.judge(arr)
        return arr instanceof Array?arr.indexOf(Math.max.apply(null, arr)):-1
    },
    delete: function(arr, index) {
        this.judge(arr)
        return arr.splice(index, 1);
    },
    sum: function(arr) {
        this.judge(arr)
        return eval(arr.join("+"))
	},
	unique: function (arr) {
		let result = []
		for(let i=0; i < arr.length; i++){
			if(result.indexOf(arr[i]) === -1){
				result.push(arr[i])
			}
		}
		return result
	},
	unique_index: function (arr) {
		let result = []
		let result_index = []
		for(let i=0; i < arr.length; i++){
			if(result.indexOf(arr[i]) === -1){
				result.push(arr[i])
				result_index.push(i)
			}
		}
		return result_index
	},
	property_unique: function(arr, prop) {
		let property = arr.map( e => e[prop] )
		let unique_index = this.unique_index(property)
		let result = unique_index.map( e => arr[e] )
		return result
	},
}

export const matrix =  {
    judge: function(arr) {
        if(arr instanceof Array && arr[0] instanceof Array){
            return true;
        }else{
            throw "不是二维数组！"
        }
    },
    max: function(arr) {
        this.judge(arr)
        return Math.max.apply(null,arr.map((e)=>{return Math.max.apply(null,e)}))
    },
    sum: function(arr) {
        this.judge(arr)
        return eval(
            arr.map((e) => {
                return eval(e.join("+"))
            }).join("+")
        )
    },
    size: function(arr) {
        this.judge(arr)
        return eval(arr.map(e => e.length).join("+"))
    },
}

export const getStrCount = (src_str, target_str) => { 
	//src_str 源字符串 target_str 特殊字符
	var count=0
	while(src_str.indexOf(target_str) != -1 ) {
		src_str = src_str.replace(target_str,"")
		count++    
	}
	return count
}