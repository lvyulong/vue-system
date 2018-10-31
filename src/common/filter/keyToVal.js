
export default function (value,obj) {
    if(!value){
        return '';
    }
    return obj[value];
}