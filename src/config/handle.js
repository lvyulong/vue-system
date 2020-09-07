
export default {
    // 通过code去取错误信息
    findMsgByCode(errorEnum,lang_type,code){
        var msg;
        // 没有code || errorEnum中没有相应的code，使用code=-1的msg
        var elseMsgItem = _.findWhere(errorEnum,{code:-1});
        if(code){
            var msgItem = _.findWhere(errorEnum,{code:code});
            if(msgItem){
                msg = msgItem[lang_type];
            }else{
                msg = elseMsgItem[lang_type];
            }
        }else{
            msg = elseMsgItem[lang_type];
        }
        return msg;
    },
    // 随机密码生成
    createRandomPwd(length){
        if(length<=3){
            console.error("length 必须大于3")
            return;
        }
        var PWDLENGTH = length || 8;
        var pwdSetArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '!@#$%&*()'];
        var pwdSets = pwdSetArray.join('');
        var PWDINDEX = [];
        for (var i = 0; i < PWDLENGTH; i++) {
            PWDINDEX.push(i);
        }
        // 初始化一个8位随机密码
        var pwd = '';
        for (var i = 0; i < PWDLENGTH; i++) {
            var index = parseInt(Math.random() * pwdSets.length);
            pwd += pwdSets[index];
        }
        pwd = pwd.split('');
        // 随机找三个不同的位置，分别用随机的数字、小写、大写去替换（保证密码中同时包含数字和字母大小写三种类型的字符）
        var indexs = _.sample(PWDINDEX, 3);
        for (var i = 0; i < 3; i++) {
            var pos = parseInt(Math.random() * pwdSetArray[i].length);
            var posWord = pwdSetArray[i][pos];
            pwd[indexs[i]] = posWord;
        }
        pwd = pwd.join('');
        return pwd;
    }
}