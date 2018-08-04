export default function (value) {
    const gender = {
        1:'男',
        2:'女',
    };
    if (!value){
        return ''
    }else{
        return gender[value]
    }
}