export default function (value,count) {
    if(!value){
        return '';
    }
    var strLength =  count || 100;
    if(value.length > strLength){
        var str = value.substr(0,strLength);
        str += ' ...';
        return str;
    }else{
        return value;
    }
}