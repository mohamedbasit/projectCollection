
class Broadcaster{

    constructor(eventName){
        this.name = eventName;
        this.listeners=[];
    }

    subscribe(listener){
        this.listeners.push(listener);
    }

    post(event){
        this.listeners.forEach(v=>v.notify(this.name,event));
    }
}

module.exports = Broadcaster;