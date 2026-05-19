import database from "../configs/database.js";

const validators = {
    usernameExist: async (username, callback) => {
        const query = "SELECT * FROM users WHERE username = ?";

        return new Promise((resolve, reject) => {
            database.query(query, [username], (error, result) => {
                if (error) reject(error); 
                else resolve(result);
            });
        });
    }
};

export default validators;