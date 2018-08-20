
export default function (value) {
    if (!value){
        return '— —'
    }
    var second = value % 60;
    var min = parseInt(value/60) % 60;
    var hour = parseInt(value/3600) % 24;
    var day = parseInt(value/3600/24);
    return (day?day+'天':'') + (hour?hour+'时':'') + (min?min+'分':'') + (second?second+'秒':'');
}