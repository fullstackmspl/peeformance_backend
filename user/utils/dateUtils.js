const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

const getStudyPointDate  = () => {    
    let date= new Date();
    let day=date.getUTCDate();
    if (day<=5) {  
        date=new Date(date.setDate(1));        
        date=date.setMonth(date.getMonth() - 1)        
    }
    else {
        date=date.setDate(1);        
    }
    return formatDate(date);
}

module.exports = {
    formatDate,
    getStudyPointDate
}