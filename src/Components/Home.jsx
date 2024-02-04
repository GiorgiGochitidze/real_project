import Registration from "./Registration";
import { Link } from "react-router-dom";

const Home = () => {
    return ( 
        <div>
            <Registration />

            <Link to='/Tracker'><p>Go to Location</p></Link>
        </div>
     );
}
 
export default Home;