import { Route, Routes } from "react-router-dom";
import Home from "../pages/home/home";

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

export default Routers;