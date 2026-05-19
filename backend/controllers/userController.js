import user_models from "../models/userModels.js";
import validators from "../validators/validators.js";

// OBJECT FUNCTION LITERAL
const user_controllers = {
    insert: async (request, response) => {
        try {
            const { fullname, username, password } = request.body;

            const usernameExist = await validators.usernameExist(username);

            if (usernameExist.length > 0) {
                response.status(409).json({ message: "Username already exist!" });
                return;
            }

            const result = await user_models.addUser(fullname, username, password);

            if (result || result.length > 0) {
                response.status(201).json({ message: "Account created!" });   
                return;
            }
            throw Error(error);
        } 
        catch (error) {
            response.status(500).json({ message: `Error: ${error.message}` });    
        }
    },

    get: async (_request, response) => {
        try {
            const result = await user_models.getUser();

             if (result || result.length > 0) {
                response.status(201).json({ data: result });   
                return;
            }
        } 
        catch (error) {
            response.status(500).json({ message: `Error: ${error.message}` });    
        }
    },

    edit: async (request, response) => {
        try {
            const id = request.params.id;
            const { fullname, username, password } = request.body;

            const result = await user_models.editUser(fullname, username, password, id);

            console.log(result);

            if (result.affectedRows === 1) {
                response.status(201).json({ message: "Update successfully" });
            }
            else {
                response.status(409).json({ message: "User does not exist" });
            }
        } 
        catch (error) {
            response.status(500).json({ message: `Error: ${error.message}` });    
        }
    },

    delete: async (request, response) => {
        try {
            const id = request.params.id;

            const result = await user_models.deleteUser(id);

            console.log(result);

            if (result.affectedRows === 1) {
                response.status(201).json({ message: "Delete successfully" });
            }
            else {
                response.status(409).json({ message: "User does not exist" });
            }
        } 
        catch (error) {
            response.status(500).json({ message: `Error: ${error.message}` });    
        }
    }
};

export default user_controllers;