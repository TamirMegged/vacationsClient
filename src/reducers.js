let initialUser = { isLogin: false };

export const vacations = (state = [], action) => {
    switch (action.type) {
        // {type:"LOAD", payload: {id, destination, image, start_date, end_date, description, price, followers}}
        case "LOAD":
            let newState = action.payload.map(vac => {
                const { id, destination, image, start_date, end_date, description, price, followers, isLiked } = vac;
                return ({
                    id,
                    destination,
                    image,
                    start_date,
                    end_date,
                    description,
                    price,
                    followers,
                    isLiked
                })
            });
            return newState;
        default:
            return state;
    }
}

export const user = (state = initialUser, action) => {
    switch (action.type) {
        // {type:"LOGIN", payload: {id, first_name, last_name, username, role}}
        case "LOGIN":
            let newState = {
                isLogin: true,
                id: action.payload.id,
                first_name: action.payload.first_name,
                last_name: action.payload.last_name,
                username: action.payload.username,
                role: action.payload.role
            }
            return newState;
        // {type:"LOGOUT"}
        case "LOGOUT":
            return initialUser;
        default:
            return state;
    }
}