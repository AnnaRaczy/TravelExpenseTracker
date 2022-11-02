import React, {useState, useEffect} from "react";

const LandingPage = () => {
    const [data, setData] = useState();

    useEffect(() => {
        fetch("/users")
        .then(res => res.json())
        .then(data => setData(data['insertedIds'][0]))
    }, [data]);

    return (
        <div>
            <p>{!data ? "Loading..." : data}</p>
        </div>
    )
}

export {LandingPage}