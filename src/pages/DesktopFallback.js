import { GiMeat } from "react-icons/gi";

const DesktopFallback = () => {
    return(
        <div className="loaderwrapper dkfallback">
            <div className="loaderwrapper">
            <GiMeat />
            <h1>BEEFIN'</h1>
            </div>
           
            Unfortunately, there is no desktop version of Beefin yet. Please use your mobile device.
        </div>
    )
}

export default DesktopFallback;