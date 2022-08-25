function date_diff(date1, date2 = new Date()){
    let difference = Math.abs(date2 - date1);
    if(difference/1000 < 3){
        return 'A l\'instant';
    }
    if(difference/1000 < 60){
        return 'Il y a '.concat(Math.floor(difference/1000), ' secondes');
    }else if(difference/(1000 * 60) < 60){
        return 'Il y a '.concat(Math.floor(difference/(1000*60)), ' minutes');
    }else if(difference/(1000 * 60 * 60) < 24){
        return 'Il y a '.concat(Math.floor(difference/(1000*60*60)), ' heures');
    }else if(difference/(1000 * 60 * 60 * 24) < 7){
        return 'Il y a '.concat(Math.floor(difference/(1000*60*60*24)), ' jours');
    }else if(difference/(1000 * 60 * 60 * 24 * 7) < 5){
        return 'Il y a '.concat(Math.floor(difference/(1000 * 60 * 60 * 24 * 7)), ' semaines');
    }else{
        return 'Il y a plus de '.concat(Math.floor(difference/(1000 * 60 * 60 * 24 * 30)), ' mois');
    }
}