import { createContext, useState } from "react";

export const TimerContext = createContext({
    isOn: false,
    hours : '',
    minutes : '',
    isBreak: true,
    numbers: [],
    date: {},
    setHours : ()=>{},
    setMinutes : ()=>{},
    setNumbers : ()=>{},
    setDate: ()=>{},
    toggleBreak: ()=>{},
    toggleMain : ()=>{}
})

export default function TimerContextProvider({children}){
    const [isOn,setIsOn] = useState(false)
    const [isBreak, setIsBreak] = useState(true)
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [numbers,setNumbers] = useState(['',''])
    const [date,setDate] = useState({});

    function toggleMain(){
        setIsOn((flag)=>{
            if(flag){
                setIsBreak(true);
            }else setIsBreak(false);
            return !flag
        })
    }
    function toggleBreak(){
        if(isOn){
            setIsBreak((flag)=>{
                if(flag){
                    setDate(new Date())
                } 
                return !flag
            })
        }
    }
    const handleHoursChange = (text) => {
        setHours(text);
    };
    const handleMinutesChange = (text) => {
        setMinutes(text)
    };
    const handleNumberChange = (number,ind) =>{
        setNumbers((pnumbers)=>{
            return pnumbers.map((num,i)=>{
                if(i===ind) {return number;}
                else return num;
            })
        })
    }

    const handleDateChange = (obj) =>{
        setDate(obj)
    }

    const value = {
        isOn: isOn,
        hours : hours,
        minutes : minutes,
        isBreak : isBreak,
        numbers : numbers,
        date : date,
        setHours : handleHoursChange,
        setMinutes : handleMinutesChange,
        setNumbers : handleNumberChange,
        setDate : handleDateChange,
        toggleBreak : toggleBreak,
        toggleMain : toggleMain
    }
    return <TimerContext.Provider value = {value}>{children}</TimerContext.Provider>
}