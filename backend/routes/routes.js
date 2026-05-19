import database from "../configs/database.js";
import bcrypt from "bcrypt";

const user_models = {
    addUser: async (fullname, username, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const addUserQuery = "INSERT INTO users (fullname, username, password) VALUES (?,?,?)";

        return new Promise((resolve, reject) => {
            database.query(addUserQuery, [fullname, username, hashedPassword], (error, result) => {
                if (error) reject(error);
                else resolve(result); 
            });
        });
    },

    getUser: async () => {
        const getUserQuery = "SELECT * FROM users";
        return new Promise((resolve, reject) => {
            database.query(getUserQuery, (error, result) => {
                if (error) reject(error);
                else resolve (result); 
            });
        });
    },

    editUser: async (fullname, username, password, id) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const editQuery = "UPDATE users SET fullname = ?, username = ?, password = ? WHERE id = ?";
        return new Promise((resolve, reject) => {
            database.query(editQuery, [fullname, username, hashedPassword, id], (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    },

    deleteUser: async (id) => {
        const deleteQuery = "DELETE FROM users WHERE id = ?";
        return new Promise((resolve, reject) => {
            database.query(deleteQuery, [id], (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    }
};

export default user_models;