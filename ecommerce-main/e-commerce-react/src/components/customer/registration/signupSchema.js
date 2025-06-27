import * as yup from "yup";

const signupSchema = yup.object().shape({
    username: yup.string().required("Enter your username"),
    email: yup.string().email("Invalid email format").required("Enter your email"),
    password: yup.string().required("Enter your password"),
});

export default signupSchema;
