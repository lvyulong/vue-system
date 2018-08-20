
export default function (value,list,from,to) {
    if (!(value||value ==0)){
        return '';
    }
    if (list&&list.length>0){
        var item = _.findWhere(list, {[from]:value});
        return item&&item[to];
    }
    return value;
}