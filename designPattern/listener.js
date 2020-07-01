

class Listener{
    constructor(listenerName){
        this.listenerName = listenerName;
    }

    notify(eventName, event){
        console.log(this.listenerName,' : ', eventName, ' : ',event);
    }
}

module.exports = Listener;
