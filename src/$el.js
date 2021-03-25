class $el {
    /** @param {HTMLElement} $main */
    constructor($main){
        if(!($main instanceof HTMLElement)) throw new Error("incorrect element type: "+$main);
        /** @type {false|HTMLElement} */
        let $attached = false;
        this.is$element = true;
        this.get$el = () => $main;

        /** @returns {HTMLElement} */
        const getHtmlElement = (el)=>{
            if(el instanceof HTMLElement) return el;
            if(el.get$el) return el.get$el();
            throw new Error("incorrect element type");
        }
        /** @param {HTMLElement|$el} $what */
        this.append = ($what) => {
            const $el = getHtmlElement($what); 
            console.log("append",$main,"to",$el);
            $main.appendChild($el);
            return this;
        }
        /** @param {HTMLElement|$el} $what */
        this.appendTo = ($what) => {
            const $el = getHtmlElement($what); 
            $el.appendChild($main);
            $attached = $el;
            return this;
        }
        this.detach = () => {
            if($attached){
                $attached.removeChild($main);
            }
        }
        /** @param {string} className */
        this.addClass = (className) => {
            $main.classList.add(className);
        }
        /** @param {string} className */
        this.removeClass = (className) => {
            $main.classList.remove(className);
        }
        /** 
         * @callback evtcallback
         * @param {Object} event
         */
        /**
         * @param {string} eventNames
         * @param {evtcallback} callback
         */
        this.on=(eventNames,callback)=>{
            let eventsList = eventNames.split(" ");
            eventsList.forEach((eventName)=>{
                $main.addEventListener(eventName,callback);
            });
        }
    }
}

export default $el;