export const createUserValidationsSchema = {
    username: {
        isLength: {
            options: {
                min: 5,
                max: 10
            },
            errorMessage: 'Username must be atleast be 5 to 32 characters'
        },

        notEmpty: {
            errorMessage: 'Username cannot be empty'
        },
        isString: {
            errorMessage: 'Username must be a string'
        },
    },
    displayName: {
        notEmpty:{
            errorMessage: 'Display name cannot be empty'
        }
    }
}