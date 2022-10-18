import React, {useState, useEffect} from "react";

const LandingPage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("/api")
        .then(res => res.json())
        .then(data => setData(data.message))
    }, []);

    return (
        <div>
            <p>{!data ? "Loading..." : data}</p>
        </div>
    )
}

export {LandingPage}