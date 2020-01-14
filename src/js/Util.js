/**
 * Created by lenovo on 2017/6/12.
 */
const Util = {
  getNewTime: function (date, mark) {  //时间格式转换
    let datesave = new Date(date);
    if (mark == '年月日') {
      return datesave.getFullYear() + '年' + (datesave.getMonth() + 1) + '月' + datesave.getDate() + '日'
    } else if (mark == '年月') {
      return datesave.getFullYear() + '年' + (datesave.getMonth() + 1) + '月'
    } else if (mark == '月日') {
      return (datesave.getMonth() + 1) + '月' + datesave.getDate() + '日'
    } else if (mark == "当月第一天") {
      return datesave.getFullYear() + '-' + (datesave.getMonth() + 1) + '-1'
    } else {
      return datesave.getFullYear() + '-' + (datesave.getMonth() + 1) + '-' + datesave.getDate()
    }
  },
  HTMLDecode: function (input) {  //解析标签
    let converter = document.createElement("DIV");
    converter.innerHTML = input;
    let output = converter.innerText;
    converter = null;
    return output;
  },
  Title_format: function (str) {  //去除标题里面的乱码
    if(!str){
      return ''
    }
    var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','ldquo':'"','rdquo':'"','mdash':'_','middot':'·','hellip':'......','rsquo':"'",'lsquo':"'"};
    str = str.replace(/&(lt|gt|nbsp|amp|quot|ldquo|rdquo|mdash|middot|hellip|rsquo|lsquo);/ig,function(all,t){ return arrEntities[t]});
    str = str.replace(/%/g, "%25").replace("+", "%2B").replace(" ", "%20").replace("/", "%2F").replace("?", "%3F").replace("#", "%23").replace(/&/g, "%26").replace("=", "%3D")
    return str
  },
  Count_format:function(str){
    if(!str){
      return ''
    }
    var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','ldquo':'"','rdquo':'"','mdash':'_','middot':'·','hellip':'......','rsquo':"'",'lsquo':"'"};
    str = str.replace(/&(lt|gt|nbsp|amp|quot|ldquo|rdquo|mdash|middot|hellip|rsquo|lsquo);/ig,function(all,t){ return arrEntities[t]});
    return str;
  },
  GetPreMonth: function (mydate) {  //前一个月
    let arr = mydate.split('-');
    let year = arr[0]; //获取当前日期的年份
    let month = arr[1]; //获取当前日期的月份
    let day = arr[2]; //获取当前日期的日
    let days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    let year2 = year;
    let month2 = parseInt(month) - 1;
    if (month2 == 0) {
      year2 = parseInt(year2) - 1;
      month2 = 12;
    }
    let day2 = day;
    let days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
      day2 = days2;
    }
    if (month2 < 10) {
      month2 = '0' + month2;
    }
    let t2 = year2 + '/' + month2 + '/' + day2;
    return t2;
  },
  GetNextMonth: function (mydate) {  //后一个月
    let arr = mydate.split('-');
    let year = arr[0]; //获取当前日期的年份
    let month = arr[1]; //获取当前日期的月份
    let day = arr[2]; //获取当前日期的日
    let days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中的月的天数
    let year2 = year;
    let month2 = parseInt(month) + 1;
    if (month2 == 13) {
      year2 = parseInt(year2) + 1;
      month2 = 1;
    }
    let day2 = day;
    let days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
      day2 = days2;
    }
    if (month2 < 10) {
      month2 = '0' + month2;
    }

    let t2 = year2 + '/' + month2 + '/' + day2;
    return t2;
  },
  getUrlValue:function(str){
      // str = str+'&';
      let len = str.length;
      str = location.href.slice(location.href.indexOf(str)+len)
      return str = decodeURI(str.slice(0,( str.indexOf('&'))))

  },
  
  appAndCopy:function(arr,type){ //同意或拒绝oa的时候 审批人
    if(!type) type='userId'
    let str = '';
    for(let i=0;i<arr.length;i++){
            let obj = arr[i]
            str = str + "|" + obj[type]
    }
    return str.slice(1);
  },
  people:function(bool,arr,type){
    let id = '';
   
      if(type==1){
        for (let i = 0; i < arr.length; i++) {
          id = id + "|" + arr[i].receiverId
        }
      }else{
        for (let i = 0; i < arr.length; i++) {
          id = id + "|" + arr[i].auditUserId
        }
      }
    
    return id;
  },
  getIds:function(arr,idName){
      let id = ''
      for(let i =0;i<arr.length;i++){
        id+=arr[i][idName]+'|'
      }
      return id.slice(0,-1)
  },
  deliverIds(arr,idName){
    let idStr = ''

    arr.forEach(item=>{
      if(item.flow&&item.status=='00'){
        idStr+=item[idName]+'|'
      }else if(item.auditers){
        item.auditers.forEach(el=>{
          if(el.status=='00'){
            idStr+=el[idName]+'|'
          }
        })
      }
    })

      return idStr.slice(0,-1)

  },
  approverFormat(arr,numStr){//审批人数据格式化
    let data = {userIdsStr:'',companyIdsStr:''};
    let arrs = numStr.split('|')

    arr.forEach(item => {
      if(item.approvalUserType==3){
        arrs = this.nullVal(arrs,item.auditers.length)
      }
        item.auditers.forEach(el=>{
            data.userIdsStr += el.userId+'|'
            data.companyIdsStr += el.companyId+'|'
        })
    });
    data.numStr = arrs.join('|')
    data.userIdsStr = data.userIdsStr.slice(0,-1).replace(/null/g,'').replace(/\|\|/g,'|')
    data.companyIdsStr = data.companyIdsStr.slice(0,-1).replace(/null/g,'').replace(/\|\|/g,'|')
    return data;
  },
  nullVal(arr,val){
    console.log(arr,val)
    for(let i=0;i<arr.length;i++){
      if(arr[i]=='null'){
        arr[i]=val
        return arr
      }
    }
  
    return arr;
  },
  checkApprovers(arr){
    for (let index = 0; index < arr.length; index++) {
        if(arr[index].auditers.length<1&&arr[index].approvalUserType==3) return true
    }

    return false
  },
  fileFo:function(accessory){
    let obj = {urlStr:"",fileSizeStr:"",fileNameStr:""}
    for(let i=0;i<accessory.length;i++){
        obj.urlStr+=accessory[i].url+'|';
        obj.fileSizeStr+=accessory[i].fileSize+'|'
        obj.fileNameStr+=accessory[i].fileName+"|"  
    }
    obj.urlStr = obj.urlStr.slice(0,-1)
    obj.fileSizeStr = obj.fileSizeStr.slice(0,-1)
    obj.fileNameStr = obj.fileNameStr.slice(0,-1)
    return obj
  },
  isImg:function(str){
      //判断是否是图片 - strFilter必须是小写列举
    var strFilter=".jpeg|.gif|.jpg|.png|.bmp|.pic|"
    if(str.indexOf(".")>-1){
        var p = str.lastIndexOf(".");
        var strPostfix=str.substring(p,str.length) + '|';        
        strPostfix = strPostfix.toLowerCase();
        if(strFilter.indexOf(strPostfix)>-1){
            return true;
        }
    }        
      return false;   
  },
  timeFo:function(timeStr){
    timeStr+=':00';
    timeStr = timeStr.split(/[- : \/]/);
    return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
  },
  accessoryFor:function(data){
    if(!data.accessory||data.accessory.url==null) return false;

     let urlArr = data.accessory.url.split('|')
     let fileSizeArr = data.accessory.fileSize.split('|')
     let fileNameArr = data.accessory.fileName.split('|')
     let obj ={};

      for(let i=0;i<urlArr.length;i++){
        obj.push({
              url:urlArr[i],
              fileSize:fileSizeArr[i],
              fileName:fileNameArr[i]
          })
      }
      return obj
  },
  isAlter(nowData,oldData){
    let data = nowData;
    for(let key in data){
       if(key=='approver_list'||key=='chosed_list'||key=='accessory'){
            if(data[key].length!=oldData[key].length){
                return true
            }
            for(let i=0;i<data[key].length;i++){

                if(key!='accessory'&&data[key][i].auditUserId!=oldData[key][i].auditUserId){
                    return true
                }else if(key=='accessory'&&data[key][i].url!=oldData[key][i].url){
                    return true
                }
            }

        }else if(key!='oldData'&&key!='approver_list'&&key!='chosed_list'&&key!='accessory'){
            if(data[key]!=oldData[key]){
                    return true;
            }
        }
    }
    return false
  },
  getOa(that){
    that.axios.get('/work/wait/list').then(function(res){
        that.$store.state.oaCount = res.data.b.data[0].count
     }).catch(function(error){
        //  that.token = error
     })

    //  that.axios.get('/work/copy/list').then(function(res){
    //     // that.copyCount = res.data.b.data[0].count 
    //  })
  },
  oaAxios:function(that,params,type){
   
      },
      isUpdate(data,oldData){
        for(let key in data){
            if(key=='oldData'||key=='reportTime'||key=='reportTimeStr') continue;

            if(Object.prototype.toString.call(data[key]).indexOf('Array')>-1){
                let arr = data[key]
                let arrs = oldData[key]
                if(arr.length!=arrs.length) return true

                for(let i=0;i<arr.length;i++){
                        if(Object.prototype.toString.call(arr[i]).indexOf('Array')>-1){
                            for(let j = 0;j<arr[i].length;j++){
                                if(arr[i][j]!=arrs[i][j]) return true
                            }
                        }else if(Object.prototype.toString.call(arr[i]).indexOf('Object')>-1){
                            for(let name in arr[i]){
                                if(arr[i][name]!=arrs[i][name]) return true   
                            }
                        }else{
                            if(arr[i]!=arrs[i]) return true
                        }
                }

            }else if(Object.prototype.toString.call(data[key]).indexOf('Object')>-1){
                let obj = data[key]
                let objs = oldData[key]
                for(let name in obj){
                    if(Object.prototype.toString.call(obj[name]).indexOf('Array')>-1){
                        for(let j = 0;j<obj[name].length;j++){
                            if(obj[name][j]!=objs[name][j]) return true
                        }
                    }else if(Object.prototype.toString.call(obj[name]).indexOf('Object')>-1){
                        let o = obj[name]
                        let b = objs[name]
                        for(let k in o){
                            if(o[k]!=b[k]) return true   
                        }
                    }else{
                        if(obj[name]!=objs[name]) return true   
                    }
                }
            }else{

                if(data[key]!=oldData[key]){
                    return true 
                } 
            }

        }
        return false
    },
      clientSide(){
        var u = navigator.userAgent;
          if(u.indexOf('Android') > -1 || u.indexOf('Adr') > -1){ //android终端
              return 0;
          }else if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){ //ios终端
              return 1;
          }else{
              return 2;
          }
      }
}
module.exports = Util
