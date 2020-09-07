export default function (value, type) {
    let monthMap = {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: 'Jun',
        7: 'Jul',
        8: 'Aug',
        9: 'Sep',
        10: 'Oct',
        11: 'Nov',
        12: 'Dec'
    };
    if (!value) {
        return '-'
    }
    let date = new Date(value);
    let year = date.getFullYear().toString();
    let MM = (date.getMonth() + 1).toString();
    let dd = date.getDate().toString();
    let hh = date.getHours().toString();
    let mm = date.getMinutes().toString();
    let ss = date.getSeconds().toString();
    if(hh.length == 1){
        hh = `0${hh}`;
    }
    if(mm.length == 1){
        mm = `0${mm}`;
    }
    if(ss.length == 1){
        ss = `0${ss}`;
    }
    if (!type) {
        return `${year}-${MM}-${dd} ${hh}:${mm}`;
    } else if (type == 'yyyy-MM-dd HH:mm:ss') {
        return `${year}-${MM}-${dd} ${hh}:${mm}:${ss}`;
    } else if (type == 'yyyy-MM-dd') {
        return `${year}-${MM}-${dd}`;
    }
}